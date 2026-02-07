import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError, httpErrors } from '@/lib/auth/api-response';
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

// Schema for creating a share
const createShareSchema = z.object({
  permission: z.enum(['VIEW_ONLY', 'DOWNLOAD', 'FULL_ACCESS']).default('VIEW_ONLY'),
  expiresAt: z.string().datetime().optional().nullable(),
  maxAccessCount: z.number().int().positive().optional().nullable(),
  requiresPassword: z.boolean().default(true),
  sharePassword: z.string().min(4).optional().nullable(), // Optional additional share password
  inviteEmail: z.string().email().optional().nullable(),
  sharedWithUserId: z.string().cuid().optional().nullable(),
});

/**
 * GET /api/vaults/[id]/shares
 * List all shares for a vault
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId } = await params;
    const db = await getPrisma();

    // Verify vault exists and user owns it
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { id: true, userId: true, name: true },
    });

    if (!vault) {
      return httpErrors.notFound('Vault');
    }

    if (vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Get all shares for this vault
    const shares = await db.vaultShare.findMany({
      where: { 
        vaultId,
        isActive: true,
      },
      select: {
        id: true,
        shareToken: true,
        permission: true,
        requiresPassword: true,
        expiresAt: true,
        maxAccessCount: true,
        accessCount: true,
        inviteEmail: true,
        inviteSent: true,
        isActive: true,
        createdAt: true,
        lastAccessedAt: true,
        sharedWithUser: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Process shares to add status information
    const processedShares = shares.map((share: any) => {
      const now = new Date();
      let status: 'active' | 'expired' | 'exhausted' = 'active';
      
      if (share.expiresAt && new Date(share.expiresAt) < now) {
        status = 'expired';
      } else if (share.maxAccessCount && share.accessCount >= share.maxAccessCount) {
        status = 'exhausted';
      }

      return {
        ...share,
        status,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/shared/${share.shareToken}`,
      };
    });

    return apiSuccess({
      vaultId,
      vaultName: vault.name,
      shares: processedShares,
      totalShares: processedShares.length,
      activeShares: processedShares.filter((s: any) => s.status === 'active').length,
    });
  } catch (error) {
    console.error('Error fetching vault shares:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * POST /api/vaults/[id]/shares
 * Create a new share for a vault
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId } = await params;
    const db = await getPrisma();

    // Verify vault exists and user owns it
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      select: { 
        id: true, 
        userId: true, 
        name: true,
        isActive: true,
        lockStatus: true,
      },
    });

    if (!vault) {
      return httpErrors.notFound('Vault');
    }

    if (vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Check if vault is active
    if (!vault.isActive) {
      return apiError('Cannot share an inactive vault', 400, 'VAULT_INACTIVE');
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createShareSchema.safeParse(body);

    if (!validationResult.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validationResult.error.errors
      );
    }

    const {
      permission,
      expiresAt,
      maxAccessCount,
      requiresPassword,
      sharePassword,
      inviteEmail,
      sharedWithUserId,
    } = validationResult.data;

    // Generate unique share token
    const shareToken = crypto.randomBytes(32).toString('hex');

    // Hash share password if provided
    let hashedSharePassword: string | null = null;
    if (sharePassword) {
      hashedSharePassword = crypto
        .createHash('sha256')
        .update(sharePassword)
        .digest('hex');
    }

    // Create the share
    const share = await db.vaultShare.create({
      data: {
        vaultId,
        sharedWithUserId,
        shareToken,
        permission,
        requiresPassword,
        sharePassword: hashedSharePassword,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxAccessCount,
        inviteEmail,
        inviteSent: false,
        createdBy: payload.userId,
      },
      select: {
        id: true,
        shareToken: true,
        permission: true,
        requiresPassword: true,
        expiresAt: true,
        maxAccessCount: true,
        accessCount: true,
        inviteEmail: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId,
        action: 'VAULT_SHARED',
        description: `Created share link for vault "${vault.name}" with ${permission} permission`,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/shared/${share.shareToken}`;

    return apiSuccess({
      message: 'Share created successfully',
      share: {
        ...share,
        shareUrl,
        status: 'active',
      },
    }, 201);
  } catch (error) {
    console.error('Error creating vault share:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
