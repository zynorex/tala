import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError } from '@/lib/auth/api-response';
import { downloadFromIPFS, unpinFileFromIPFS } from '@/lib/ipfs/ipfs';
import { decrypt, deriveKey } from '@/lib/crypto/encryption';
import crypto from 'crypto';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * GET /api/vaults/[id]/files/[fileId]/download - Download and decrypt file
 * Returns: Decrypted file as response blob
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  const startTime = Date.now();

  try {
    // 1. Authenticate
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    const { id: vaultId, fileId } = await params;
    if (!vaultId || !fileId || typeof vaultId !== 'string' || typeof fileId !== 'string') {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Invalid vault or file ID'),
        { status: 400 }
      );
    }

    // 2. Get database connection
    const db = await getPrisma();

    // 3. Verify vault exists and user owns it
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      include: { user: { select: { id: true } } },
    });

    if (!vault) {
      return NextResponse.json(
        apiError('Not Found', 404, `Vault ${vaultId} does not exist`),
        { status: 404 }
      );
    }

    if (vault.user.id !== payload.userId) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'You do not have permission to access this vault'),
        { status: 403 }
      );
    }

    // 4. Get file metadata
    const vaultFile = await db.vaultFile.findUnique({
      where: { id: fileId },
    });

    if (!vaultFile) {
      return NextResponse.json(
        apiError('Not Found', 404, `File ${fileId} does not exist`),
        { status: 404 }
      );
    }

    if (vaultFile.vaultId !== vaultId) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'File does not belong to this vault'),
        { status: 403 }
      );
    }

    // 5. Validate decryption password
    const password = req.headers.get('x-vault-password') ||
      new URL(req.url).searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Vault password required for file decryption. Provide via X-Vault-Password header.'),
        { status: 400 }
      );
    }

    // Verify password matches stored hash
    const providedKeyHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (providedKeyHash !== vaultFile.encryptionKeyHash) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Invalid vault password'),
        { status: 403 }
      );
    }

    // 6. Verify encryption metadata exists in database
    if (!vaultFile.encryptionIV || !vaultFile.encryptionSalt || !vaultFile.encryptionAuthTag) {
      return NextResponse.json(
        apiError('Internal Server Error', 500, 'Missing encryption metadata for this file. File may have been uploaded with an older version.'),
        { status: 500 }
      );
    }

    // 7. Download encrypted ciphertext from IPFS
    let encryptedCiphertext: Buffer;
    try {
      const response = await downloadFromIPFS(vaultFile.ipfsHash);
      encryptedCiphertext = Buffer.isBuffer(response.data)
        ? response.data
        : Buffer.from(response.data);
    } catch (error) {
      return NextResponse.json(
        apiError('Service Unavailable', 503, 'Failed to download file from IPFS'),
        { status: 503 }
      );
    }

    // 8. Reconstruct EncryptedData object from IPFS ciphertext + DB metadata
    const encryptedDataObj = {
      ciphertext: encryptedCiphertext.toString('hex'),
      iv: vaultFile.encryptionIV,
      authTag: vaultFile.encryptionAuthTag,
      salt: vaultFile.encryptionSalt,
      version: '2.0',
      timestamp: Date.now(),
      algorithm: 'aes-256-gcm',
    };

    // 9. Derive encryption key from password + stored salt using PBKDF2
    let decryptedBuffer: Buffer;
    try {
      const salt = Buffer.from(vaultFile.encryptionSalt, 'hex');
      const encryptionKey = deriveKey(password, salt);
      const decrypted = decrypt(encryptedDataObj, encryptionKey);
      decryptedBuffer = decrypted.data;
    } catch (error) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Decryption failed — incorrect password or corrupted data'),
        { status: 403 }
      );
    }

    // 10. Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'file_download',
        description: `Downloaded file: ${vaultFile.fileName}`,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    // 11. Return decrypted file as response
    const duration = Date.now() - startTime;
    return new NextResponse(decryptedBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': vaultFile.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${vaultFile.fileName}"`,
        'Content-Length': decryptedBuffer.length.toString(),
        'X-Download-Duration': duration.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * DELETE /api/vaults/[id]/files/[fileId] - Delete file
 * Soft delete: marks as inactive, keeps audit trail
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    // 1. Authenticate
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    const { id: vaultId, fileId } = await params;
    if (!vaultId || !fileId || typeof vaultId !== 'string' || typeof fileId !== 'string') {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Invalid vault or file ID'),
        { status: 400 }
      );
    }

    // 2. Get database connection
    const db = await getPrisma();

    // 3. Verify vault exists and user owns it
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      include: { user: { select: { id: true } } },
    });

    if (!vault) {
      return NextResponse.json(
        apiError('Not Found', 404, `Vault ${vaultId} does not exist`),
        { status: 404 }
      );
    }

    if (vault.user.id !== payload.userId) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'You do not have permission to access this vault'),
        { status: 403 }
      );
    }

    // 4. Get file
    const vaultFile = await db.vaultFile.findUnique({
      where: { id: fileId },
    });

    if (!vaultFile) {
      return NextResponse.json(
        apiError('Not Found', 404, `File ${fileId} does not exist`),
        { status: 404 }
      );
    }

    if (vaultFile.vaultId !== vaultId) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'File does not belong to this vault'),
        { status: 403 }
      );
    }

    // 5. Soft delete: mark as inactive instead of hard delete
    await db.vaultFile.update({
      where: { id: fileId },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: payload.userId,
      },
    });

    // 6. Unpin file from IPFS to clean up storage
    const unpinSuccess = await unpinFileFromIPFS(vaultFile.ipfsHash).catch(err => {
      console.error(`Failed to unpin file from IPFS: ${err}`);
      return false;
    });

    // 7. Log activity with unpin status
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'file_delete',
        description: `Deleted file: ${vaultFile.fileName}${unpinSuccess ? ' (unpinned from IPFS)' : ' (IPFS unpin failed)'}`,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json(
      apiSuccess(
        { fileId, deletedAt: new Date(), ipfsUnpinned: unpinSuccess },
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
