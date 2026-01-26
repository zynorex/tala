import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError } from '@/lib/auth/api-response';
import { uploadToIPFS } from '@/lib/ipfs/ipfs';
import { encryptFile, calculateFileHash } from '@/lib/crypto/encryption';
import { generateEncryptionKey } from '@/lib/crypto/encryption';
import { verifyUnlockBeforeFileAccess } from '@/lib/services/vault-unlock';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (increased from 10MB for PDFs)
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed',
  'image/jpeg',
  'image/png',
  'image/webp',
];

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

interface VaultFile {
  id: string;
  vaultId: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  fileHash: string;
  ipfsHash: string;
  encryptionKeyHash: string;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * POST /api/vaults/[id]/files - Upload a file to vault
 * Handles: Multipart form data, encryption, IPFS upload, database storage
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let fileName = 'unknown';

  try {
    // 1. Authenticate
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    const vaultId = (await params).id;
    if (!vaultId || typeof vaultId !== 'string') {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Invalid vault ID'),
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

    // 3.5 ⏰ VERIFY UNLOCK STATUS - MANDATORY BEFORE FILE ACCESS
    const unlockCheck = await verifyUnlockBeforeFileAccess(
      vaultId,
      payload.userId,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    );

    if (!unlockCheck.allowed) {
      return NextResponse.json(
        apiError('Locked', 423, unlockCheck.reason || 'Vault is locked and cannot be accessed'),
        { status: 423 }
      );
    }

    // 4. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        apiError('Bad Request', 400, 'No file provided in request body'),
        { status: 400 }
      );
    }

    fileName = file.name;

    // 5. Validate file
    if (file.size === 0) {
      return NextResponse.json(
        apiError('Bad Request', 400, 'File is empty'),
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        apiError(
          'Payload Too Large',
          413,
          `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
        ),
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        apiError('Unsupported Media Type', 415, `File type ${file.type} is not allowed`),
        { status: 415 }
      );
    }

    // 6. Read file into buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 7. Generate encryption key for this file
    const encryptionKey = generateEncryptionKey();

    // 8. Encrypt file
    const encryptionResult = encryptFile(fileBuffer, encryptionKey);
    const encrypted = encryptionResult.encryptedData;
    const encryptedBuffer = Buffer.from(
      JSON.stringify({
        iv: encrypted.iv,
        ciphertext: encrypted.ciphertext,
        authTag: encrypted.authTag,
        algorithm: encrypted.algorithm,
      })
    );

    // 9. Calculate hashes
    const fileHash = encryptionResult.fileHash;
    const encryptionKeyHash = require('crypto')
      .createHash('sha256')
      .update(encryptionKey)
      .digest('hex');

    // 10. Upload encrypted file to IPFS
    let ipfsHash: string;
    try {
      const uploadResponse = await uploadToIPFS(
        encryptedBuffer,
        `vault-${vaultId}-${Date.now()}-${fileName}`,
        `File upload for vault ${vaultId}`
      );
      ipfsHash = uploadResponse.ipfsHash;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      return NextResponse.json(
        apiError('Service Unavailable', 503, 'Failed to upload file to IPFS storage'),
        { status: 503 }
      );
    }

    // 11. Store file metadata in database
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId,
        fileName,
        fileSizeBytes: file.size,
        mimeType: file.type,
        fileHash,
        ipfsHash,
        encryptionKeyHash,
        uploadedBy: payload.userId,
      },
    });

    // 12. Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'file_upload',
        description: `Uploaded file: ${fileName} (${(file.size / 1024).toFixed(2)}KB)`,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    // 13. Return success with file metadata
    const duration = Date.now() - startTime;
    return NextResponse.json(
      apiSuccess(
        {
          fileId: vaultFile.id,
          fileName: vaultFile.fileName,
          size: vaultFile.fileSizeBytes,
          mimeType: vaultFile.mimeType,
          uploadedAt: vaultFile.uploadedAt,
          ipfsHash: vaultFile.ipfsHash,
          duration: `${duration}ms`,
        },
        201
      ),
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * GET /api/vaults/[id]/files - List files in vault
 * Returns: Paginated list of files with metadata (no encryption keys)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const vaultId = (await params).id;
    if (!vaultId || typeof vaultId !== 'string') {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Invalid vault ID'),
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

    // 4. Parse pagination params
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    // 5. Get files
    const [files, total] = await Promise.all([
      db.vaultFile.findMany({
        where: { vaultId },
        select: {
          id: true,
          fileName: true,
          fileSizeBytes: true,
          mimeType: true,
          uploadedAt: true,
          uploadedBy: true,
          // Never return encryption keys
        },
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.vaultFile.count({ where: { vaultId } }),
    ]);

    return NextResponse.json(
      apiSuccess(
        {
          files,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('File list error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
