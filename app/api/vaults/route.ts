import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { createVaultSchema } from '@/lib/auth/schemas';
import { apiSuccess, apiError, handleValidationError, handleDbError, httpErrors } from '@/lib/auth/api-response';
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
 * POST /api/vaults
 * Create a new vault
 */
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const body = await req.json();
    const validation = createVaultSchema.safeParse({
      userId: payload.userId,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    const { name, description, password, unlockTime, isDemo } = validation.data;
    const db = await getPrisma();

    // For demo vaults, check if user already has one
    if (isDemo) {
      const existingDemo = await db.vault.findFirst({
        where: { userId: payload.userId, isDemo: true, isActive: true },
      });
      if (existingDemo) {
        console.log(`[DEMO] User ${payload.userId} already has demo vault: ${existingDemo.id}`);
        return apiError('You already have a demo vault. Delete it first to create a new one.', 409);
      }
    }

    // Derive encryption key from password (used for files)
    const vaultKey = deriveVaultKeyFromPassword(password);

    // Calculate demo expiry if demo mode
    const demoExpiresAt = isDemo ? new Date(Date.now() + 2 * 60 * 1000) : null; // 2 minutes for demo

    console.log(`[VAULT] Creating ${isDemo ? 'DEMO' : 'regular'} vault for user: ${payload.userId}`);
    console.log(`[VAULT] Name: ${name}, UnlockTime: ${unlockTime}, IsDemo: ${isDemo}`);

    // Store vault with metadata (actual file encryption happens on file upload)
    const vault = await db.vault.create({
      data: {
        userId: payload.userId,
        name,
        description: description || '',
        encryptedData: '{}',
        keyHash: vaultKey.keyHash,
        fileHash: '',  // Will be set when file is uploaded
        fileName: '',  // Will be set when file is uploaded
        fileSize: 0,   // Will be set when file is uploaded
        isActive: true,
        isDemo: isDemo || false,
        demoExpiresAt: demoExpiresAt,
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
        vaultId: vault.id,
        action: isDemo ? 'DEMO_VAULT_CREATED' : 'VAULT_CREATED',
        description: isDemo 
          ? `Created demo vault: ${name} (auto-unlocks in 2 minutes)`
          : `Created vault: ${name}`,
      },
    });

    console.log(`[VAULT] Successfully created vault: ${vault.id}`);

    return apiSuccess({
      ...vault,
      isDemo: isDemo || false,
      demoExpiresAt: demoExpiresAt,
      message: isDemo 
        ? 'Demo vault created! It will auto-unlock in 2 minutes.'
        : 'Vault created successfully!',
    }, 201);
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * GET /api/vaults
 * List all vaults for authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const db = await getPrisma();

    // Get pagination params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Get total count
    const total = await db.vault.count({
      where: { userId: payload.userId, isActive: true },
    });

    // Get vaults
    const vaults = await db.vault.findMany({
      where: { userId: payload.userId, isActive: true },
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    return NextResponse.json(
      apiSuccess({
        data: vaults,
        pagination: {
          total,
          page,
          pageSize,
          pages: Math.ceil(total / pageSize),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
