import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, handleDbError, httpErrors } from '@/lib/auth/api-response';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * GET /api/activity
 * Get user activity logs
 */
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const db = await getPrisma();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const vaultId = url.searchParams.get('vaultId');
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {
      userId: payload.userId,
    };

    if (vaultId) {
      where.vaultId = vaultId;
    }

    // Get total count
    const total = await db.activityLog.count({ where });

    // Get activities
    const activities = await db.activityLog.findMany({
      where,
      select: {
        id: true,
        action: true,
        description: true,
        vaultId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    return NextResponse.json(
      apiSuccess({
        data: activities,
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
    console.error('Get activity error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
