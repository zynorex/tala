import { NextRequest } from 'next/server';
import { verifyRequest, generateToken } from '@/lib/auth/jwt';
import { apiSuccess, httpErrors } from '@/lib/auth/api-response';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, walletAddress } = body;

    if (!email && !walletAddress) {
      return httpErrors.badRequest('Email or wallet address required');
    }

    const db = await getPrisma();

    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(walletAddress ? [{ walletAddress }] : []),
        ],
      },
    });

    if (!user) {
      return httpErrors.notFound('User');
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email || undefined, user.walletAddress || undefined);

    return apiSuccess({
      token,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return httpErrors.serverError('Failed to login');
  }
}

/**
 * GET /api/auth/me
 * Get authenticated user info from token
 */
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    return apiSuccess({
      userId: payload.userId,
      email: payload.email,
      walletAddress: payload.walletAddress,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return httpErrors.serverError();
  }
}
