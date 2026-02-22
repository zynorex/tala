import { NextRequest } from 'next/server';
import { verifyRequest, generateToken } from '@/lib/auth/jwt';
import { apiSuccess, httpErrors } from '@/lib/auth/api-response';
import crypto from 'crypto';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * Verify an Ethereum wallet signature (EIP-191 personal_sign)
 * Returns the recovered address if valid, null otherwise
 */
async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    // Dynamic import viem for signature recovery (server-side only)
    const { verifyMessage } = await import('viem');
    const { createPublicClient, http } = await import('viem');
    const { polygonAmoy } = await import('viem/chains');

    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(),
    });

    const isValid = await client.verifyMessage({
      address: expectedAddress as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    return isValid;
  } catch (error) {
    return false;
  }
}

/**
 * POST /api/auth/login
 * Login user with wallet signature verification
 * 
 * Required body:
 * - walletAddress: string — Ethereum address
 * - signature: string — Signed message (EIP-191)
 * - message: string — The original message that was signed
 * - nonce: string — One-time nonce to prevent replay attacks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, signature, message, nonce } = body;

    // Wallet-based authentication requires signature verification
    if (!walletAddress) {
      return httpErrors.badRequest('Wallet address is required');
    }

    if (!signature || !message) {
      return httpErrors.badRequest(
        'Wallet signature and signed message are required for authentication'
      );
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return httpErrors.badRequest('Invalid wallet address format');
    }

    // Validate nonce is present and recent (prevents replay attacks)
    if (!nonce || typeof nonce !== 'string' || nonce.length < 8) {
      return httpErrors.badRequest('Valid nonce is required');
    }

    // Verify the signed message contains the expected nonce
    if (!message.includes(nonce)) {
      return httpErrors.badRequest('Message does not contain the expected nonce');
    }

    // Verify the wallet signature cryptographically
    const isValidSignature = await verifyWalletSignature(
      message,
      signature,
      walletAddress
    );

    if (!isValidSignature) {
      return httpErrors.unauthorized('Invalid wallet signature — authentication denied');
    }

    const db = await getPrisma();

    // Find or create user by wallet address
    let user = await db.user.findFirst({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      // Auto-register new wallet users
      user = await db.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          authMethods: ['wallet'],
          role: 'user',
        },
      });
    }

    if (!user.isActive || user.isBlocked) {
      return httpErrors.unauthorized('Account is disabled or blocked');
    }

    // Generate JWT token (only after successful signature verification)
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
    return httpErrors.serverError('Authentication failed');
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
    return httpErrors.serverError();
  }
}
