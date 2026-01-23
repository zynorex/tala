import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError, httpErrors } from '@/lib/auth/api-response';
import { deriveVaultKeyFromPassword } from '@/lib/vault/vaultEncryption';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * POST /api/vaults/demo
 * Create a demo vault for user education
 */
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const db = await getPrisma();

    // Check if user already has a demo vault
    const existingDemo = await db.vault.findFirst({
      where: {
        userId: payload.userId,
        isDemo: true,
      },
    });

    if (existingDemo) {
      return apiSuccess(
        { message: 'You already have a demo vault', vault: existingDemo },
        200
      );
    }

    // Create demo vault (empty - user will add files like a real vault)
    const demoPassword = 'DEMO_VAULT_' + Date.now();
    const vaultKey = deriveVaultKeyFromPassword(demoPassword);

    const demoVault = await db.vault.create({
      data: {
        userId: payload.userId,
        name: '⏱️ Demo Vault (expires in 10 minutes)',
        description:
          'This is your demo vault! Upload files, download the encryption key, and experience the full T.A.L.A. workflow. This vault will automatically expire and delete in 10 minutes.',
        encryptedData: '{}',
        keyHash: vaultKey.keyHash,
        fileHash: '',
        fileName: '',
        fileSize: 0,
        isActive: true,
        isDemo: true,
        demoExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        isActive: true,
        isDemo: true,
        demoExpiresAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: demoVault.id,
        action: 'DEMO_VAULT_CREATED',
        description: 'Created demo vault - will expire in 10 minutes',
      },
    });

    return apiSuccess(
      {
        message: 'Demo vault created! You have 10 minutes to explore. Upload files, download the key, and experience T.A.L.A. Try it out!',
        vault: demoVault,
        expiresAt: demoVault.demoExpiresAt,
      },
      201
    );
  } catch (error) {
    console.error('Error creating demo vault:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * DELETE /api/vaults/demo
 * Delete the demo vault
 */
export async function DELETE(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const db = await getPrisma();

    const demoVault = await db.vault.findFirst({
      where: {
        userId: payload.userId,
        isDemo: true,
      },
    });

    if (!demoVault) {
      return apiError('No demo vault found', 404);
    }

    // Delete all files in demo vault
    await db.vaultFile.deleteMany({
      where: {
        vaultId: demoVault.id,
      },
    });

    // Delete the vault
    await db.vault.delete({
      where: {
        id: demoVault.id,
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: demoVault.id,
        action: 'DEMO_VAULT_DELETED',
        description: 'Deleted demo vault',
      },
    });

    return apiSuccess({ message: 'Demo vault deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting demo vault:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
