import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError, httpErrors } from '@/lib/auth/api-response';
import { z } from 'zod';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

// Schema for updating a share
const updateShareSchema = z.object({
  permission: z.enum(['VIEW_ONLY', 'DOWNLOAD', 'FULL_ACCESS']).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  maxAccessCount: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/vaults/[id]/shares/[shareId]
 * Get details of a specific share
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; shareId: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId, shareId } = await params;
    const db = await getPrisma();

    // Get share with vault ownership verification
    const share = await db.vaultShare.findUnique({
      where: { id: shareId },
      include: {
        vault: {
          select: { id: true, userId: true, name: true },
        },
        sharedWithUser: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    if (!share) {
      return httpErrors.notFound('Share');
    }

    if (share.vault.id !== vaultId) {
      return apiError('Share does not belong to this vault', 400, 'INVALID_SHARE');
    }

    if (share.vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Calculate status
    const now = new Date();
    let status: 'active' | 'expired' | 'exhausted' | 'revoked' = 'active';
    
    if (!share.isActive) {
      status = 'revoked';
    } else if (share.expiresAt && new Date(share.expiresAt) < now) {
      status = 'expired';
    } else if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
      status = 'exhausted';
    }

    return apiSuccess({
      id: share.id,
      shareToken: share.shareToken,
      permission: share.permission,
      requiresPassword: share.requiresPassword,
      hasSharePassword: !!share.sharePassword,
      expiresAt: share.expiresAt,
      maxAccessCount: share.maxAccessCount,
      accessCount: share.accessCount,
      inviteEmail: share.inviteEmail,
      inviteSent: share.inviteSent,
      isActive: share.isActive,
      revokedAt: share.revokedAt,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
      lastAccessedAt: share.lastAccessedAt,
      status,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/shared/${share.shareToken}`,
      sharedWithUser: share.sharedWithUser,
      vaultName: share.vault.name,
    });
  } catch (error) {
    console.error('Error fetching share:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * PUT /api/vaults/[id]/shares/[shareId]
 * Update a share's settings
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; shareId: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId, shareId } = await params;
    const db = await getPrisma();

    // Verify share exists and user owns the vault
    const existingShare = await db.vaultShare.findUnique({
      where: { id: shareId },
      include: {
        vault: {
          select: { id: true, userId: true, name: true },
        },
      },
    });

    if (!existingShare) {
      return httpErrors.notFound('Share');
    }

    if (existingShare.vault.id !== vaultId) {
      return apiError('Share does not belong to this vault', 400, 'INVALID_SHARE');
    }

    if (existingShare.vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = updateShareSchema.safeParse(body);

    if (!validationResult.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validationResult.error.errors
      );
    }

    const updateData: any = {};
    const { permission, expiresAt, maxAccessCount, isActive } = validationResult.data;

    if (permission !== undefined) updateData.permission = permission;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (maxAccessCount !== undefined) updateData.maxAccessCount = maxAccessCount;
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      if (!isActive) {
        updateData.revokedAt = new Date();
        updateData.revokedBy = payload.userId;
      }
    }

    const updatedShare = await db.vaultShare.update({
      where: { id: shareId },
      data: updateData,
      select: {
        id: true,
        shareToken: true,
        permission: true,
        requiresPassword: true,
        expiresAt: true,
        maxAccessCount: true,
        accessCount: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'VAULT_SHARE_UPDATED',
        description: `Updated share settings for vault "${existingShare.vault.name}"`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return apiSuccess({
      message: 'Share updated successfully',
      share: {
        ...updatedShare,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/shared/${updatedShare.shareToken}`,
      },
    });
  } catch (error) {
    console.error('Error updating share:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * DELETE /api/vaults/[id]/shares/[shareId]
 * Revoke/delete a share
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; shareId: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId, shareId } = await params;
    const db = await getPrisma();

    // Verify share exists and user owns the vault
    const existingShare = await db.vaultShare.findUnique({
      where: { id: shareId },
      include: {
        vault: {
          select: { id: true, userId: true, name: true },
        },
      },
    });

    if (!existingShare) {
      return httpErrors.notFound('Share');
    }

    if (existingShare.vault.id !== vaultId) {
      return apiError('Share does not belong to this vault', 400, 'INVALID_SHARE');
    }

    if (existingShare.vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Soft delete by marking as inactive
    await db.vaultShare.update({
      where: { id: shareId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedBy: payload.userId,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'VAULT_SHARE_REVOKED',
        description: `Revoked share link for vault "${existingShare.vault.name}"`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return apiSuccess({
      message: 'Share revoked successfully',
      shareId,
    });
  } catch (error) {
    console.error('Error revoking share:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
