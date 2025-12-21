import { NextRequest, NextResponse } from 'next/server';
import { apiSuccess, httpErrors, handleDbError } from '@/lib/auth/api-response';
import { generateToken } from '@/lib/auth/jwt';
import { verifyMessage } from 'ethers';
import { z } from 'zod';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

const walletAuthSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/, 'Invalid signature format'),
  message: z.string().min(1, 'Message is required'),
});

/**
 * POST /api/auth/wallet
 * Authenticate user via wallet signature
 * 
 * Request body:
 * {
 *   address: "0x...",
 *   signature: "0x...",
 *   message: "TALA Vault - Sign to authenticate"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validation = walletAuthSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Invalid request',
        details: validation.error.errors,
      }, { status: 400 });
    }

    const { address, signature, message } = validation.data;
    const db = await getPrisma();

    // Verify signature
    let recoveredAddress: string;
    try {
      recoveredAddress = verifyMessage(message, signature);
    } catch (error) {
      console.error('Signature verification failed:', error);
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    // Normalize addresses for comparison
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      console.warn(`Signature mismatch: recovered ${recoveredAddress}, provided ${address}`);
      return NextResponse.json(httpErrors.unauthorized, { status: 401 });
    }

    // Find or create user
    const existingUser = await db.user.findFirst({
      where: {
        accounts: {
          some: {
            providerAccountId: address.toLowerCase(),
            provider: 'wallet',
          },
        },
      },
    });

    let user = existingUser;

    if (!user) {
      // Create new user with wallet account
      user = await db.user.create({
        data: {
          displayName: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
          image: null,
          accounts: {
            create: {
              provider: 'wallet',
              providerAccountId: address.toLowerCase(),
              type: 'oauth',
            },
          },
        },
      });

      // Log activity
      await db.activityLog.create({
        data: {
          userId: user.id,
          action: 'USER_CREATED_WALLET',
          details: `New user registered with wallet ${address}`,
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, undefined, address.toLowerCase());

    // Log successful authentication
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'AUTH_WALLET_LOGIN',
        details: `Wallet authentication successful from ${address}`,
      },
    });

    return NextResponse.json(
      apiSuccess({
        token,
        user: {
          id: user.id,
          displayName: user.displayName,
          image: user.image,
          walletAddress: address.toLowerCase(),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json(handleDbError(error), { status: 500 });
  }
}
