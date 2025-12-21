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
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    const body = await req.json();
    const validation = createVaultSchema.safeParse({
      userId: payload.userId,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(handleValidationError(validation.error), { status: 400 });
    }

    const { name, description, password } = validation.data;
    const db = await getPrisma();

    // Derive encryption key from password (used for files)
    const key = deriveVaultKeyFromPassword(password);

    // Store vault with metadata (actual file encryption happens on file upload)
    const vault = await db.vault.create({
      data: {
        userId: payload.userId,
        name,
        description: description || '',
        encryptedData: '{}', // Metadata stored in name/description
        passwordHash: '', // Will be stored if needed
        isActive: true,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        isActive: true,
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
        vaultId: vault.id,
        action: 'VAULT_CREATED',
        description: `Created vault: ${name}`,
      },
    });

    return NextResponse.json(apiSuccess(vault), { status: 201 });
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
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
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
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            files: true,
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
