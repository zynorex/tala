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

    // Create demo vault
    const demoPassword = 'DEMO_VAULT_' + Date.now();
    const vaultKey = deriveVaultKeyFromPassword(demoPassword);

    const demoVault = await db.vault.create({
      data: {
        userId: payload.userId,
        name: '📚 Demo Vault - Explore T.A.L.A.',
        description:
          'This is a demonstration vault showing how T.A.L.A. works. Explore the features, download sample files, and understand the encryption flow. You can delete this vault anytime to start fresh.',
        encryptedData: '{}',
        keyHash: vaultKey.keyHash,
        fileHash: '',
        fileName: '',
        fileSize: 0,
        isActive: true,
        isDemo: true,
        demoExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        isActive: true,
        isDemo: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            files: true,
          },
        },
      },
    });

    // Create demo files
    const demoFiles = [
      {
        name: 'TALA_Getting_Started_Guide.pdf',
        description: 'Learn how to use T.A.L.A. in 5 minutes',
        mimeType: 'application/pdf',
        fileSizeBytes: 2500000,
      },
      {
        name: 'Security_Best_Practices.txt',
        description: 'Industry-standard security recommendations',
        mimeType: 'text/plain',
        fileSizeBytes: 15000,
      },
      {
        name: 'Encryption_Whitepaper.pdf',
        description: 'Technical deep-dive into our encryption standards',
        mimeType: 'application/pdf',
        fileSizeBytes: 3200000,
      },
    ];

    for (const file of demoFiles) {
      await db.file.create({
        data: {
          vaultId: demoVault.id,
          fileName: file.name,
          description: file.description,
          mimeType: file.mimeType,
          fileSizeBytes: file.fileSizeBytes,
          ipfsHash: 'QmDemoHash_' + Math.random().toString(36).substring(7),
          encryptedFileData: '{}',
          isEncrypted: true,
          uploadedAt: new Date(),
        },
      });
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: demoVault.id,
        action: 'DEMO_VAULT_CREATED',
        description: 'Created demo vault for learning',
      },
    });

    return apiSuccess(
      {
        message: 'Demo vault created successfully! Explore the features and understand how T.A.L.A. works.',
        vault: demoVault,
        totalFiles: demoFiles.length,
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
    await db.file.deleteMany({
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
