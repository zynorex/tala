import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { downloadFromIPFS } from '@/lib/ipfs/ipfs';
import { verifyUnlockBeforeFileAccess } from '@/lib/services/vault-unlock';
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
 * Decrypt file using AES-256-GCM
 */
function decryptFileData(
  encryptedHex: string,
  password: string,
  iv: string,
  salt: string,
  authTag: string
): Buffer {
  const ALGORITHM = 'aes-256-gcm';
  const KEY_LENGTH = 32;
  const PBKDF2_ITERATIONS = 100000;

  // Derive key from password using stored salt
  const saltBuffer = Buffer.from(salt, 'hex');
  const key = crypto.pbkdf2Sync(password, saltBuffer, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');

  // Convert hex strings to buffers
  const encryptedBuffer = Buffer.from(encryptedHex, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');

  // Decrypt
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  try {
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: Invalid password or corrupted file');
  }
}

/**
 * POST /api/vaults/[id]/files/[fileId]/download
 * Download and decrypt a file from vault
 * 
 * Request body:
 * {
 *   password: "encryption password"
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const payload = verifyRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vaultId, fileId } = await params;
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const db = await getPrisma();

    // Get vault and verify ownership
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { userId: true },
    });

    if (!vault) {
      return NextResponse.json({ error: 'Vault not found' }, { status: 404 });
    }

    if (vault.userId !== payload.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // ⏰ CRITICAL: Verify vault is unlocked before allowing file download
    const unlockCheck = await verifyUnlockBeforeFileAccess(
      vaultId,
      payload.userId,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    );

    if (!unlockCheck.allowed) {
      return NextResponse.json(
        { 
          error: unlockCheck.reason || 'Vault is locked and cannot be accessed',
          unlockTime: unlockCheck.unlockTime,
          remainingTime: unlockCheck.remainingTime,
        }, 
        { status: 423 } // 423 Locked
      );
    }

    // Get file
    const file = await db.vaultFile.findUnique({
      where: {
        id: fileId,
        vaultId,
      },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (!file.isActive || file.deletedAt) {
      return NextResponse.json({ error: 'File has been deleted' }, { status: 410 });
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'FILE_DOWNLOADED',
        description: `Downloaded file: ${file.fileName}`,
      },
    });

    // Determine download mode from query parameter
    const mode = request.nextUrl.searchParams.get('mode');

    // ─── Server-side decryption mode ────────────────────────────────────
    if (mode === 'server') {
      // Verify the file has encryption metadata
      if (!file.encryptionIV || !file.encryptionSalt || !file.encryptionAuthTag) {
        return NextResponse.json(
          { error: 'File encryption metadata is missing — cannot decrypt server-side' },
          { status: 422 }
        );
      }

      // Verify password matches stored hash
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (file.encryptionKeyHash && passwordHash !== file.encryptionKeyHash) {
        return NextResponse.json({ error: 'Invalid decryption password' }, { status: 403 });
      }

      // Download encrypted file from IPFS
      let encryptedData: Buffer;
      try {
        encryptedData = await downloadFromIPFS(file.ipfsHash);
      } catch (ipfsError) {
        console.error('IPFS download failed:', ipfsError);
        return NextResponse.json(
          { error: 'Failed to retrieve file from storage' },
          { status: 502 }
        );
      }

      // Decrypt the file
      let decryptedData: Buffer;
      try {
        decryptedData = decryptFileData(
          encryptedData.toString('hex'),
          password,
          file.encryptionIV,
          file.encryptionSalt,
          file.encryptionAuthTag
        );
      } catch (decryptError) {
        console.error('Decryption failed:', decryptError);
        return NextResponse.json(
          { error: 'Decryption failed — invalid password or corrupted file' },
          { status: 422 }
        );
      }

      // Return the decrypted binary with proper headers
      const safeFileName = file.fileName.replace(/[^\w.\-]/g, '_');
      return new NextResponse(decryptedData, {
        status: 200,
        headers: {
          'Content-Type': file.mimeType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${safeFileName}"`,
          'Content-Length': String(decryptedData.length),
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      });
    }

    // ─── Default: return metadata for client-side decryption ────────────
    return NextResponse.json(
      {
        success: true,
        file: {
          id: file.id,
          fileName: file.fileName,
          mimeType: file.mimeType,
          fileSize: file.fileSizeBytes,
          ipfsHash: file.ipfsHash,
          encryption: {
            iv: file.encryptionIV,
            salt: file.encryptionSalt,
            authTag: file.encryptionAuthTag,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Download failed' },
      { status: 500 }
    );
  }
}

