import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, handleDbError, httpErrors } from '@/lib/auth/api-response';
import { uploadToIPFS } from '@/lib/ipfs/ipfs';
import { encryptFile, calculateFileHash } from '@/lib/crypto/encryption';
import { deriveVaultKeyFromPassword } from '@/lib/vault/vaultEncryption';
import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * POST /api/vaults/upload
 * Upload and encrypt file to vault
 * 
 * Form data:
 * - vaultId: UUID of target vault
 * - file: File to upload
 * - encryptionPassword: Password for encryption
 */
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const vaultId = formData.get('vaultId') as string;
    const file = formData.get('file') as File;
    const encryptionPassword = formData.get('encryptionPassword') as string;

    // Validate inputs
    if (!vaultId || !file || !encryptionPassword) {
      return NextResponse.json({
        error: 'Missing required fields: vaultId, file, encryptionPassword',
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }, { status: 413 });
    }

    const db = await getPrisma();

    // Verify vault ownership
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { userId: true, id: true, name: true },
    });

    if (!vault) {
      return NextResponse.json({
        error: 'Vault not found',
      }, { status: 404 });
    }

    if (vault.userId !== payload.userId) {
      return NextResponse.json(httpErrors.unauthorized, { status: 403 });
    }

    // Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = calculateFileHash(fileBuffer);

    // Derive encryption key from password
    const vaultKey = deriveVaultKeyFromPassword(encryptionPassword);
    
    // Encrypt file
    const encryptedData = encryptFile(fileBuffer, vaultKey.key);

    // Upload to IPFS
    const ipfsResult = await uploadToIPFS(
      Buffer.from(JSON.stringify(encryptedData)),
      file.name,
      `File from vault: ${vault.name}`
    );

    // Store file reference in database
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId,
        fileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        ipfsHash: ipfsResult.ipfsHash,
        fileHash,
        encryptionKeyHash: '', // Would be hash of encryption key if needed
        uploadedBy: payload.userId,
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: payload.userId,
        },
      },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        fileSizeBytes: true,
        ipfsHash: true,
        uploadedAt: true,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'FILE_UPLOADED',
        details: `Uploaded file: ${file.name} (${file.size} bytes)`,
      },
    });

    return NextResponse.json(
      apiSuccess({
        file: vaultFile,
        ipfsHash: ipfsResult.ipfsHash,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
