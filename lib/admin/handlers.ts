import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { apiSuccess, apiError, handleDbError, apiPaginated } from '@/lib/auth/api-response';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * Verify admin access
 */
async function verifyAdmin(userId: string): Promise<boolean> {
  const db = await getPrisma();
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === 'admin';
}

/**
 * GET /api/admin/users - List all users with pagination
 * Admin only
 */
export async function getAdminUsers(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdmin(payload.userId);
    if (!isAdmin) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Admin access required'),
        { status: 403 }
      );
    }

    const db = await getPrisma();

    // Parse pagination
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
    const skip = (page - 1) * limit;

    // Get users with stats
    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          walletAddress: true,
          createdAt: true,
          _count: {
            select: { vaults: true, activityLogs: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.user.count(),
    ]);

    return NextResponse.json(
      apiPaginated(
        users.map((u: any) => ({
          ...u,
          vaultCount: u._count.vaults,
          activityCount: u._count.activityLogs,
        })),
        total,
        page,
        limit,
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * GET /api/admin/vaults - List all vaults
 * Admin only
 */
export async function getAdminVaults(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdmin(payload.userId);
    if (!isAdmin) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Admin access required'),
        { status: 403 }
      );
    }

    const db = await getPrisma();

    // Parse pagination and filters
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
    const skip = (page - 1) * limit;
    const userId = url.searchParams.get('userId');
    const isActive = url.searchParams.get('isActive');

    const [vaults, total] = await Promise.all([
      db.vault.findMany({
        skip,
        take: limit,
        where: {
          ...(userId && { userId }),
          ...(isActive && { isActive: isActive === 'true' }),
        },
        include: {
          user: { select: { id: true, email: true, displayName: true } },
          _count: { select: { activityLogs: true, files: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.vault.count({
        where: {
          ...(userId && { userId }),
          ...(isActive && { isActive: isActive === 'true' }),
        },
      }),
    ]);

    return NextResponse.json(
      apiPaginated(
        vaults.map((v: any) => ({
          ...v,
          activityCount: v._count.activityLogs,
          fileCount: v._count.files,
        })),
        total,
        page,
        limit,
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin vaults list error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * GET /api/admin/analytics - Get system analytics
 * Admin only
 */
export async function getAdminAnalytics(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdmin(payload.userId);
    if (!isAdmin) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Admin access required'),
        { status: 403 }
      );
    }

    const db = await getPrisma();

    // Get time range (default: last 30 days)
    const url = new URL(req.url);
    const days = Math.min(365, parseInt(url.searchParams.get('days') || '30'));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Collect analytics
    const [totalUsers, totalVaults, totalFiles, recentActivity] = await Promise.all([
      db.user.count(),
      db.vault.count(),
      db.vaultFile.count(),
      db.activityLog.findMany({
        where: { createdAt: { gte: since } },
        select: { action: true },
      }),
    ]);

    // Group activities by action
    const activityByType: Record<string, number> = {};
    recentActivity.forEach((log: any) => {
      activityByType[log.action] = (activityByType[log.action] || 0) + 1;
    });

    // Calculate growth
    const userGrowth = await db.user.count({
      where: { createdAt: { gte: since } },
    });

    const vaultGrowth = await db.vault.count({
      where: { createdAt: { gte: since } },
    });

    return NextResponse.json(
      apiSuccess(
        {
          summary: {
            totalUsers,
            totalVaults,
            totalFiles,
            activeUsers: await db.activityLog.findMany({
              where: { createdAt: { gte: since } },
              distinct: ['userId'],
            }).then((logs: any) => new Set(logs.map((l: any) => l.userId)).size),
          },
          growth: {
            newUsers: userGrowth,
            newVaults: vaultGrowth,
            period: `Last ${days} days`,
          },
          activity: {
            totalRequests: recentActivity.length,
            byType: activityByType,
          },
        },
        200
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id] - Delete user (admin only)
 */
export async function deleteAdminUser(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdmin(payload.userId);
    if (!isAdmin) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Admin access required'),
        { status: 403 }
      );
    }

    const userId = (await params).id;
    if (!userId) {
      return NextResponse.json(
        apiError('Bad Request', 400, 'User ID required'),
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === payload.userId) {
      return NextResponse.json(
        apiError('Bad Request', 400, 'Cannot delete your own account'),
        { status: 400 }
      );
    }

    const db = await getPrisma();

    // Soft delete: deactivate account
    const user = await db.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    // Log admin action
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        action: 'admin_delete_user',
        description: `Admin deleted user: ${user.email}`,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json(
      apiSuccess({ userId, deletedAt: new Date() }, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin user deletion error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

/**
 * GET /api/admin/logs - Get activity logs
 * Admin only
 */
export async function getAdminLogs(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json(
        apiError('Unauthorized', 401, 'Invalid or missing JWT token'),
        { status: 401 }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdmin(payload.userId);
    if (!isAdmin) {
      return NextResponse.json(
        apiError('Forbidden', 403, 'Admin access required'),
        { status: 403 }
      );
    }

    const db = await getPrisma();

    // Parse filters
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '100'));
    const skip = (page - 1) * limit;
    const userId = url.searchParams.get('userId');
    const action = url.searchParams.get('action');

    const [logs, total] = await Promise.all([
      db.activityLog.findMany({
        where: {
          ...(userId && { userId }),
          ...(action && { action }),
        },
        include: {
          user: { select: { email: true, displayName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.activityLog.count({
        where: {
          ...(userId && { userId }),
          ...(action && { action }),
        },
      }),
    ]);

    return NextResponse.json(
      apiPaginated(logs, total, page, limit, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}

