import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, apiError, handleDbError } from '@/lib/auth/api-response';
import { z } from 'zod';
import crypto from 'crypto';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

// Schema for accessing share with optional password
const accessShareSchema = z.object({
  sharePassword: z.string().optional(),
});

/**
 * GET /api/shares/[token]
 * Access a shared vault by share token (public endpoint)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = await getPrisma();

    // Find the share by token
    const share = await db.vaultShare.findUnique({
      where: { shareToken: token },
      include: {
        vault: {
          select: {
            id: true,
            name: true,
            description: true,
            keyHash: true,
            fileHash: true,
            isActive: true,
            lockStatus: true,
            unlockTime: true,
            createdAt: true,
            files: {
              where: { isActive: true },
              select: {
                id: true,
                fileName: true,
                mimeType: true,
                fileSizeBytes: true,
                ipfsHash: true,
                uploadedAt: true,
              },
              orderBy: { uploadedAt: 'desc' },
            },
            user: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        sharedWithUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!share) {
      return apiError('Share not found or link is invalid', 404, 'SHARE_NOT_FOUND');
    }

    // Check if share is active
    if (!share.isActive) {
      return apiError('This share link has been revoked', 410, 'SHARE_REVOKED');
    }

    // Check if share has expired
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return apiError('This share link has expired', 410, 'SHARE_EXPIRED');
    }

    // Check if max access count reached
    if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
      return apiError('This share link has reached its maximum access limit', 410, 'SHARE_EXHAUSTED');
    }

    // Check if vault is still active
    if (!share.vault.isActive) {
      return apiError('The shared vault is no longer available', 410, 'VAULT_INACTIVE');
    }

    // Check vault lock status
    const isLocked = share.vault.lockStatus === 'LOCKED' || share.vault.lockStatus === 'WAITING';
    let unlockTimeRemaining = null;
    
    if (share.vault.unlockTime) {
      const unlockDate = new Date(share.vault.unlockTime);
      const now = new Date();
      if (unlockDate > now) {
        unlockTimeRemaining = Math.ceil((unlockDate.getTime() - now.getTime()) / 1000);
      }
    }

    // Prepare response based on permission level
    const response: any = {
      shareId: share.id,
      permission: share.permission,
      requiresPassword: share.requiresPassword,
      hasSharePassword: !!share.sharePassword,
      vault: {
        id: share.vault.id,
        name: share.vault.name,
        description: share.vault.description,
        keyHash: share.vault.keyHash, // For password verification on client
        isLocked,
        lockStatus: share.vault.lockStatus,
        unlockTime: share.vault.unlockTime,
        unlockTimeRemaining,
        createdAt: share.vault.createdAt,
        owner: {
          name: share.vault.user.displayName || share.vault.user.name || 'Anonymous',
        },
        fileCount: share.vault.files.length,
        totalSize: share.vault.files.reduce((sum: number, f: any) => sum + f.fileSizeBytes, 0),
      },
      expiresAt: share.expiresAt,
      accessCount: share.accessCount,
      maxAccessCount: share.maxAccessCount,
    };

    // Only include file list if permission allows and vault is unlocked
    if (!isLocked && (share.permission === 'DOWNLOAD' || share.permission === 'FULL_ACCESS')) {
      response.vault.files = share.vault.files;
    } else if (!isLocked && share.permission === 'VIEW_ONLY') {
      // VIEW_ONLY can see file metadata but not download
      response.vault.files = share.vault.files.map((f: any) => ({
        id: f.id,
        fileName: f.fileName,
        mimeType: f.mimeType,
        fileSizeBytes: f.fileSizeBytes,
        uploadedAt: f.uploadedAt,
        // No ipfsHash for VIEW_ONLY
      }));
    }

    // Update access count and last accessed
    await db.vaultShare.update({
      where: { id: share.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    });

    // Log access activity
    await db.activityLog.create({
      data: {
        userId: share.vault.user.id,
        vaultId: share.vault.id,
        action: 'SHARED_VAULT_ACCESSED',
        description: `Vault "${share.vault.name}" accessed via share link (${share.permission})`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return apiSuccess(response);
  } catch (error) {
    console.error('Error accessing shared vault:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * POST /api/shares/[token]
 * Verify share password and get file access (for protected shares)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = await getPrisma();

    // Parse request body
    const body = await req.json();
    const validationResult = accessShareSchema.safeParse(body);

    if (!validationResult.success) {
      return apiError('Invalid request body', 400, 'VALIDATION_ERROR');
    }

    const { sharePassword } = validationResult.data;

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
            files: {
              where: { isActive: true },
              select: {
                id: true,
                fileName: true,
                mimeType: true,
                fileSizeBytes: true,
                ipfsHash: true,
                encryptionIV: true,
                encryptionSalt: true,
                encryptionAuthTag: true,
                uploadedAt: true,
              },
              orderBy: { uploadedAt: 'desc' },
            },
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

    // Validate share is still valid
    if (!share.isActive) {
      return apiError('This share has been revoked', 410, 'SHARE_REVOKED');
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return apiError('This share has expired', 410, 'SHARE_EXPIRED');
    }

    if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
      return apiError('Max access limit reached', 410, 'SHARE_EXHAUSTED');
    }

    if (!share.vault.isActive) {
      return apiError('Vault is no longer available', 410, 'VAULT_INACTIVE');
    }

    // Check vault lock status
    const isLocked = share.vault.lockStatus === 'LOCKED' || share.vault.lockStatus === 'WAITING';
    if (isLocked) {
      return apiError('Vault is still time-locked', 403, 'VAULT_LOCKED');
    }

    // Verify share password if required
    if (share.sharePassword) {
      if (!sharePassword) {
        return apiError('Share password is required', 401, 'PASSWORD_REQUIRED');
      }

      const hashedInput = crypto
        .createHash('sha256')
        .update(sharePassword)
        .digest('hex');

      if (hashedInput !== share.sharePassword) {
        return apiError('Invalid share password', 401, 'INVALID_PASSWORD');
      }
    }

    // Return file details based on permission
    let files = share.vault.files;
    
    if (share.permission === 'VIEW_ONLY') {
      // Strip sensitive data for VIEW_ONLY
      files = files.map((f: any) => ({
        id: f.id,
        fileName: f.fileName,
        mimeType: f.mimeType,
        fileSizeBytes: f.fileSizeBytes,
        uploadedAt: f.uploadedAt,
      }));
    }

    // For DOWNLOAD and FULL_ACCESS, include encryption metadata
    // The actual decryption happens client-side with the vault password

    // Log successful password verification
    await db.activityLog.create({
      data: {
        userId: share.vault.user.id,
        vaultId: share.vault.id,
        action: 'SHARED_VAULT_AUTHENTICATED',
        description: `Share password verified for vault "${share.vault.name}"`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return apiSuccess({
      authenticated: true,
      permission: share.permission,
      files,
    });
  } catch (error) {
    console.error('Error verifying share access:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
