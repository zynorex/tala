import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { updateVaultSchema, deleteVaultSchema } from '@/lib/auth/schemas';
import { apiSuccess, apiError, handleValidationError, handleDbError, httpErrors } from '@/lib/auth/api-response';
import { unpinFileFromIPFS } from '@/lib/ipfs/ipfs';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * GET /api/vaults/[id]
 * Get vault details
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

    const { id } = await params;
    const db = await getPrisma();

    const vault = await db.vault.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        keyHash: true,
        fileHash: true,
        isActive: true,
        isDemo: true,
        demoExpiresAt: true,
        unlockTime: true,
        lockStatus: true,
        createdAt: true,
        updatedAt: true,
        files: {
          select: {
            id: true,
            fileName: true,
            mimeType: true,
            fileSizeBytes: true,
            ipfsHash: true,
            uploadedAt: true,
            isActive: true,
            deletedAt: true,
          },
          orderBy: { uploadedAt: 'desc' },
        },
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    if (!vault) {
      return httpErrors.notFound('Vault');
    }

    // Verify ownership
    if (vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    return apiSuccess(vault);
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * PUT /api/vaults/[id]
 * Update vault metadata
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id } = await params;
    const body = await req.json();

    const validation = updateVaultSchema.safeParse({
      userId: payload.userId,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    const db = await getPrisma();

    // Verify ownership
    const vault = await db.vault.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!vault) {
      return httpErrors.notFound('Vault');
    }

    if (vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Update vault
    const { name, description } = validation.data;

    const updated = await db.vault.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: id,
        action: 'VAULT_UPDATED',
        description: `Updated vault metadata`,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * DELETE /api/vaults/[id]
 * Soft delete vault
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id } = await params;
    const body = await req.json();

    const validation = deleteVaultSchema.safeParse({
      userId: payload.userId,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    const db = await getPrisma();

    // Verify ownership
    const vault = await db.vault.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!vault) {
      return httpErrors.notFound('Vault');
    }

    if (vault.userId !== payload.userId) {
      return httpErrors.forbidden();
    }

    // Soft delete vault
    const deleted = await db.vault.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        userId: true,
        name: true,
        isActive: true,
      },
    });

    // Clean up IPFS files (unpin from Pinata)
    // Get all files for this vault before deletion
    const filesToDelete = await db.vaultFile.findMany({
      where: { vaultId: id },
      select: { ipfsHash: true, id: true },
    });

    // Unpin files from IPFS in parallel
    const unpinPromises = filesToDelete.map((file: { ipfsHash: string; id: string }) =>
      unpinFileFromIPFS(file.ipfsHash).catch(err => {
        console.error(`Failed to unpin file ${file.id}:`, err);
        return false;
      })
    );

    const unpinResults = await Promise.all(unpinPromises);
    const successCount = unpinResults.filter(r => r).length;

    // Log activity with cleanup details
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: id,
        action: 'VAULT_DELETED',
        description: `Deleted vault: ${deleted.name} (unpinned ${successCount}/${filesToDelete.length} files from IPFS)`,
      },
    });

    return apiSuccess({
      ...deleted,
      filesDeleted: filesToDelete.length,
      filesUnpinned: successCount,
    });
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
