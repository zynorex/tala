import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError, handleDbError } from '@/lib/auth/api-response';
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
 * GET /api/shares/[token]/files/[fileId]
 * Download a file from a shared vault
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; fileId: string }> }
) {
  try {
    const { token, fileId } = await params;
    const db = await getPrisma();

    // Get share password from header (optional)
    const sharePasswordHeader = req.headers.get('x-share-password');

    // Find the share
    const share = await db.vaultShare.findUnique({
      where: { shareToken: token },
      include: {
        vault: {
          select: {
            id: true,
            name: true,
            isActive: true,
            lockStatus: true,
            unlockTime: true,
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!share) {
      return apiError('Share not found', 404, 'SHARE_NOT_FOUND');
    }

    // Validate share
    if (!share.isActive) {
      return apiError('Share has been revoked', 410, 'SHARE_REVOKED');
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return apiError('Share has expired', 410, 'SHARE_EXPIRED');
    }

    if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
      return apiError('Max access limit reached', 410, 'SHARE_EXHAUSTED');
    }

    if (!share.vault.isActive) {
      return apiError('Vault is no longer available', 410, 'VAULT_INACTIVE');
    }

    // Check permission - only DOWNLOAD and FULL_ACCESS can download
    if (share.permission === 'VIEW_ONLY') {
      return apiError('Download not permitted with VIEW_ONLY access', 403, 'DOWNLOAD_NOT_PERMITTED');
    }

    // Check vault lock status
    if (share.vault.lockStatus === 'LOCKED' || share.vault.lockStatus === 'WAITING') {
      return apiError('Vault is still time-locked', 403, 'VAULT_LOCKED');
    }

    // Verify share password if required
    if (share.sharePassword) {
      if (!sharePasswordHeader) {
        return apiError('Share password required', 401, 'PASSWORD_REQUIRED');
      }

      const hashedInput = crypto
        .createHash('sha256')
        .update(sharePasswordHeader)
        .digest('hex');

      if (hashedInput !== share.sharePassword) {
        return apiError('Invalid share password', 401, 'INVALID_PASSWORD');
      }
    }

    // Get the file
    const file = await db.vaultFile.findFirst({
      where: {
        id: fileId,
        vaultId: share.vault.id,
        isActive: true,
      },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        fileSizeBytes: true,
        ipfsHash: true,
        encryptionIV: true,
        encryptionSalt: true,
        encryptionAuthTag: true,
      },
    });

    if (!file) {
      return apiError('File not found', 404, 'FILE_NOT_FOUND');
    }

    // Log the download
    await db.activityLog.create({
      data: {
        userId: share.vault.user.id,
        vaultId: share.vault.id,
        action: 'SHARED_FILE_DOWNLOADED',
        description: `File "${file.fileName}" downloaded via share link`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    // Return file metadata with IPFS info for client-side decryption
    return apiSuccess({
      file: {
        id: file.id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSizeBytes: file.fileSizeBytes,
        ipfsHash: file.ipfsHash,
        encryptionIV: file.encryptionIV,
        encryptionSalt: file.encryptionSalt,
        encryptionAuthTag: file.encryptionAuthTag,
      },
      // The client will need the vault password (shared separately) to decrypt
      requiresVaultPassword: share.requiresPassword,
    });
  } catch (error) {
    console.error('Error downloading shared file:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
