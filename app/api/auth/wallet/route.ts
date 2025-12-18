import { NextRequest } from 'next/server';
import { apiSuccess, httpErrors } from '@/lib/auth/api-response';

/**
 * POST /api/auth/wallet
 * Authenticate user via wallet signature
 * Temporarily disabled - will enable after build fix
 */
export async function POST(req: NextRequest) {
  try {
    return apiSuccess({
      message: "Wallet auth endpoint - will be enabled after configuration",
      data: null,
    });
  } catch (error) {
    console.error('Wallet auth error:', error);
    return httpErrors.serverError('Wallet authentication failed');
  }
}
