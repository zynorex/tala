import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError, httpErrors } from '@/lib/auth/api-response';
import { deriveVaultKeyFromPassword } from '@/lib/vault/vaultEncryption';

// Configure route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
 * Create a demo vault with user-provided details
 */
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/vaults/demo - handling request');
    console.log('Content-Type:', req.headers.get('content-type'));
    console.log('Content-Length:', req.headers.get('content-length'));
    console.log('Authorization:', req.headers.get('authorization') ? 'present' : 'missing');
    
    // Verify auth first
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    console.log('Auth verified for user:', payload.userId);

    // Read body as text first
    const bodyText = await req.text();
    console.log('Raw body text:', bodyText);
    console.log('Body length:', bodyText.length);
    
    if (!bodyText || bodyText.length === 0) {
      console.error('Body is empty!');
      return apiError('Request body is empty', 400);
    }
    
    let body;
    try {
      body = JSON.parse(bodyText);
      console.log('Parsed body successfully:', body);
    } catch (parseError) {
      console.error('Failed to parse JSON body:', parseError);
      return apiError('Invalid JSON in request body', 400);
    }

    const db = await getPrisma();
    
    const { name, description, password, unlockTime } = body;

    // Validate required fields
    if (!name || !password || !unlockTime) {
      console.error('Missing required fields:', { name, description, password, unlockTime });
      return apiError('Missing required fields: name, password, unlockTime', 400);
    }

    // Create demo vault with user's specifications
    const vaultKey = deriveVaultKeyFromPassword(password);

    const demoVault = await db.vault.create({
      data: {
        userId: payload.userId,
        name: name,
        description: description || '',
        encryptedData: '{}',
        keyHash: vaultKey.keyHash,
        fileHash: '',
        fileName: '',
        fileSize: 0,
        isActive: true,
        isDemo: true,
        demoExpiresAt: new Date(unlockTime * 1000), // Convert from timestamp
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
            vaultFiles: true,
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
        description: `Created demo vault "${name}" - will auto-unlock in ${Math.round((unlockTime * 1000 - Date.now()) / 60000)} minutes`,
      },
    });

    return apiSuccess(
      {
        message: 'Demo vault created! Upload your file and download the encryption key. The vault will auto-unlock after the specified time.',
        data: {
          id: demoVault.id,
          name: demoVault.name,
          description: demoVault.description,
          isDemo: demoVault.isDemo,
          demoExpiresAt: demoVault.demoExpiresAt,
          createdAt: demoVault.createdAt,
          fileCount: demoVault._count.vaultFiles,
        },
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

    // Log activity BEFORE deleting vault
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        vaultId: demoVault.id,
        action: 'DEMO_VAULT_DELETED',
        description: 'Deleted demo vault',
      },
    });

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

    return apiSuccess({ message: 'Demo vault deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting demo vault:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
