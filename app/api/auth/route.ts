import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { createUserSchema, updateUserSchema } from '@/lib/auth/schemas';
import { apiSuccess, apiError, handleValidationError, httpErrors } from '@/lib/auth/api-response';
import { rateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * POST /api/auth/register
 * Create a new user account
 */
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting (auth endpoints: 10 requests/min)
    const { allowed, response: rateLimitResponse } = await rateLimit(
      req,
      undefined,
      rateLimitConfigs.auth
    );

    if (!allowed && rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await req.json();

    // Validate request
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const { email, walletAddress, username, displayName } = validation.data;

    const db = await getPrisma();

    // Check if user exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(walletAddress ? [{ walletAddress }] : []),
        ],
      },
    });

    if (existingUser) {
      return apiError('User already exists', 409);
    }

    // Create new user
    const user = await db.user.create({
      data: {
        email,
        walletAddress,
        username,
        displayName,
      },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        username: true,
        displayName: true,
        createdAt: true,
      },
    });

    return apiSuccess(user, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return httpErrors.serverError('Failed to register user');
  }
}

/**
 * GET /api/auth/user
 * Get authenticated user profile
 */
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const db = await getPrisma();

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            vaults: { where: { isActive: true } },
            activityLogs: true,
          },
        },
      },
    });

    if (!user) {
      return httpErrors.notFound('User');
    }

    return apiSuccess(user);
  } catch (error) {
    console.error('Get user error:', error);
    return httpErrors.serverError();
  }
}

/**
 * PUT /api/auth/user
 * Update authenticated user profile
 */
export async function PUT(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const body = await req.json();
    const validation = updateUserSchema.safeParse({
      userId: payload.userId,
      ...body,
    });

    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const { displayName, bio, avatarUrl } = validation.data;

    const db = await getPrisma();

    const user = await db.user.update({
      where: { id: payload.userId },
      data: {
        ...(displayName && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        updatedAt: true,
      },
    });

    return apiSuccess(user);
  } catch (error) {
    console.error('Update user error:', error);
    return httpErrors.serverError();
  }
}
