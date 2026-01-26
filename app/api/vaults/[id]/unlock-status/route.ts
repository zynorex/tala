/**
 * Vault Unlock Verification API Endpoint
 * GET /api/vaults/[id]/unlock-status
 * 
 * Returns:
 * - Current unlock status (LOCKED, WAITING, UNLOCKED, VOIDED, EXPIRED)
 * - Time remaining until unlock
 * - Eligibility for file access
 * - Countdown data for UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest } from '@/lib/auth/jwt';
import { httpErrors } from '@/lib/auth/api-response';
import {
  checkVaultUnlockEligibility,
  getVaultUnlockStatus,
  recordUnlockAttempt,
  logUnlockActivity,
} from '@/lib/services/vault-unlock';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('VaultUnlockAPI');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication using JWT (consistent with other vault endpoints)
    const payload = verifyRequest(request);
    if (!payload) {
      return httpErrors.unauthorized();
    }

    const { id: vaultId } = await params;

    // Get IP address for logging
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';

    logger.info('Vault unlock status check', {
      vaultId,
      userId: payload.userId,
      ipAddress,
    });

    // Check unlock eligibility
    const unlockStatus = await getVaultUnlockStatus({
      vaultId,
      userId: payload.userId,
    });

    // Handle vault not found or unauthorized
    if (unlockStatus.status === 'ERROR' || !unlockStatus.vault) {
      return NextResponse.json(
        { error: 'Vault not found or unauthorized' },
        { status: 404 }
      );
    }

    // Record the check
    if (unlockStatus.status === 'UNLOCKED') {
      await recordUnlockAttempt(vaultId, payload.userId, 'SUCCESS');
      await logUnlockActivity(
        vaultId,
        payload.userId,
        'VAULT_STATUS_CHECK',
        `Vault status check - Status: ${unlockStatus.status}`,
        ipAddress,
        userAgent
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        canUnlock: unlockStatus.canUnlock,
        status: unlockStatus.status,
        unlockTime: unlockStatus.unlockTime,
        timeRemaining: unlockStatus.timeRemaining,
        message: unlockStatus.message,
        vault: unlockStatus.vault,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Vault unlock status check failed', error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: 'Failed to check unlock status' },
      { status: 500 }
    );
  }
}
