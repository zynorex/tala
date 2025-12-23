import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, handleDbError, httpErrors } from '@/lib/auth/api-response';
import crypto from 'crypto';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * Encrypt file using AES-256-GCM
 */
function encryptFileData(fileBuffer: Buffer, password: string) {
  // Constants
  const ALGORITHM = 'aes-256-gcm';
  const KEY_LENGTH = 32;
  const IV_LENGTH = 16;
  const PBKDF2_ITERATIONS = 100000;

  // Generate salt and IV
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');

  // Encrypt
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Calculate file hash
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    authTag: authTag.toString('hex'),
    fileHash,
  };
}

/**
 * Upload file to simulated IPFS (in production, use Pinata)
 */
async function simulateIPFSUpload(fileBuffer: Buffer, fileName: string) {
  // In production, integrate with Pinata or Infura
  // For now, return a mock IPFS hash
  const hash = crypto
    .createHash('sha256')
    .update(fileBuffer)
    .digest('hex')
    .slice(0, 46); // Simulate IPFS hash format

  return {
    ipfsHash: `Qm${hash}`,
    size: fileBuffer.length,
    name: fileName,
  };
}

/**
 * POST /api/vaults/[id]/files
 * Upload and encrypt file to vault
 * 
 * Form data:
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
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'Required: vaultId, file, encryptionPassword',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          details: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 413 }
      );
    }

    if (encryptionPassword.length < 8) {
      return NextResponse.json(
        {
          error: 'Password too weak',
          details: 'Password must be at least 8 characters',
        },
        { status: 400 }
      );
    }

    const db = await getPrisma();

    // Verify vault ownership
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { userId: true, id: true, name: true },
    });

    if (!vault) {
      return NextResponse.json(
        { error: 'Vault not found' },
        { status: 404 }
      );
    }

    if (vault.userId !== payload.userId) {
      return NextResponse.json(httpErrors.unauthorized, { status: 403 });
    }

    // Read file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Encrypt file
    const encryptionResult = encryptFileData(fileBuffer, encryptionPassword);

    // Upload to IPFS (simulated)
    const ipfsResult = await simulateIPFSUpload(fileBuffer, file.name);

    // Store file reference in database
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSizeBytes: file.size,
        ipfsHash: ipfsResult.ipfsHash,
        fileHash: encryptionResult.fileHash,
        encryptedIV: encryptionResult.iv,
        encryptedAuthTag: encryptionResult.authTag,
        encryptedSalt: encryptionResult.salt,
        uploadedBy: payload.userId,
        isActive: true,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'FILE_UPLOADED',
        description: `Uploaded file: ${file.name} (${Math.round(file.size / 1024)}KB)`,
      },
    });

    // Store encrypted file data client-side ready format
    // In production, this would be stored in IPFS
    // For testing, we'll return it so client can store it
    const encryptedBase64 = Buffer.from(encryptionResult.encrypted, 'hex').toString('base64');

    return NextResponse.json(apiSuccess({
      file: {
        id: vaultFile.id,
        fileName: vaultFile.fileName,
        fileSize: vaultFile.fileSizeBytes,
        mimeType: vaultFile.mimeType,
        uploadedAt: vaultFile.uploadedAt,
        ipfsHash: vaultFile.ipfsHash,
        fileHash: vaultFile.fileHash,
        encryptedData: encryptedBase64, // For client-side storage in testing
      },
    }), { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Upload failed', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
