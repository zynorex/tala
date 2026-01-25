/**
 * TALA Vault Unlock Service - Enterprise Grade
 * Handles vault time-lock verification, state transitions, and unlock workflows
 * 
 * State Machine:
 * LOCKED → WAITING → UNLOCKED → DECRYPTED
 * ├── Can void anytime (if allowed)
 * └── EXPIRED (if demo vault expires)
 */

import { db } from '@/lib/prisma';
import { getLogger } from '@/lib/utils/logger';
import {
  ValidationError,
  AuthenticationError,
} from '@/lib/utils/error-handler';

const logger = getLogger('VaultUnlockService');

export interface UnlockVaultCheckInput {
  vaultId: string;
  userId: string;
}

export interface UnlockVaultResult {
  canUnlock: boolean;
  status: 'LOCKED' | 'WAITING' | 'UNLOCKED' | 'EXPIRED' | 'VOIDED' | 'ERROR';
  unlockTime: Date | null;
  timeRemaining: number; // seconds
  message: string;
  vault: {
    id: string;
    name: string;
    unlockTime: Date | null;
    lockStatus: string;
    isDemo: boolean;
  };
}

/**
 * Vault Lock Status Enum
 */
export const VAULT_STATUS = {
  LOCKED: 'LOCKED',      // Before unlock time
  WAITING: 'WAITING',    // Within 24 hours before unlock
  UNLOCKED: 'UNLOCKED',  // After unlock time
  EXPIRED: 'EXPIRED',    // Demo vault past expiry
  VOIDED: 'VOIDED',      // Manually deleted
  ERROR: 'ERROR',        // Error retrieving status
} as const;

/**
 * Check if vault can be unlocked based on current time
 * This is the PRIMARY security check - DO NOT BYPASS
 */
export async function checkVaultUnlockEligibility(
  input: UnlockVaultCheckInput
): Promise<UnlockVaultResult> {
  try {
    logger.info('Checking vault unlock eligibility', {
      vaultId: input.vaultId,
      userId: input.userId,
    });

    // Fetch vault with strict validation
    const vault = await db.vault.findUnique({
      where: { id: input.vaultId },
      include: {
        files: {
          where: { isActive: true },
        },
      },
    });

    // Vault must exist
    if (!vault) {
      logger.warn('Vault not found', { vaultId: input.vaultId });
      return {
        canUnlock: false,
        status: 'ERROR',
        unlockTime: null,
        timeRemaining: 0,
        message: 'Vault not found',
        vault: {
          id: input.vaultId,
          name: 'Unknown',
          unlockTime: null,
          lockStatus: 'ERROR',
          isDemo: false,
        },
      };
    }

    // User must have access
    if (vault.userId !== input.userId) {
      logger.warn('Unauthorized vault access attempt', {
        vaultId: input.vaultId,
        userId: input.userId,
        vaultOwner: vault.userId,
      });
      return {
        canUnlock: false,
        status: 'ERROR',
        unlockTime: vault.unlockTime,
        timeRemaining: 0,
        message: 'Unauthorized access to vault',
        vault: {
          id: vault.id,
          name: vault.name,
          unlockTime: vault.unlockTime,
          lockStatus: vault.lockStatus,
          isDemo: vault.isDemo,
        },
      };
    }

    // Check if vault is voided
    if (vault.lockStatus === VAULT_STATUS.VOIDED || vault.voidedAt) {
      logger.info('Vault is voided', { vaultId: input.vaultId });
      return {
        canUnlock: false,
        status: 'VOIDED',
        unlockTime: vault.unlockTime,
        timeRemaining: 0,
        message: 'This vault has been deleted and cannot be accessed',
        vault: {
          id: vault.id,
          name: vault.name,
          unlockTime: vault.unlockTime,
          lockStatus: vault.lockStatus,
          isDemo: vault.isDemo,
        },
      };
    }

    // Check if demo vault has expired
    if (vault.isDemo && vault.demoExpiresAt) {
      const now = new Date();
      if (now > vault.demoExpiresAt) {
        logger.info('Demo vault expired', { vaultId: input.vaultId });
        // Update status to EXPIRED
        await db.vault.update({
          where: { id: input.vaultId },
          data: { lockStatus: VAULT_STATUS.EXPIRED },
        });
        return {
          canUnlock: false,
          status: 'EXPIRED',
          unlockTime: vault.unlockTime,
          timeRemaining: 0,
          message: 'Demo vault has expired',
          vault: {
            id: vault.id,
            name: vault.name,
            unlockTime: vault.unlockTime,
            lockStatus: 'EXPIRED',
            isDemo: vault.isDemo,
          },
        };
      }
    }

    // Get current time
    const now = new Date();

    // If unlock time not set, default to now (vault is unlocked immediately)
    const unlockTime = vault.unlockTime || now;

    // Calculate time remaining
    const timeRemaining = Math.max(
      0,
      Math.floor((unlockTime.getTime() - now.getTime()) / 1000)
    );

    let status: typeof VAULT_STATUS[keyof typeof VAULT_STATUS];
    let canUnlock: boolean;
    let message: string;

    // Determine lock status based on time
    if (timeRemaining > 0) {
      if (timeRemaining <= 86400) {
        // Within 24 hours
        status = VAULT_STATUS.WAITING;
        canUnlock = false;
        const hours = Math.ceil(timeRemaining / 3600);
        message = `Vault will unlock in ${hours} hour${hours === 1 ? '' : 's'}`;
      } else {
        // More than 24 hours away
        status = VAULT_STATUS.LOCKED;
        canUnlock = false;
        const days = Math.ceil(timeRemaining / 86400);
        message = `Vault is locked. Will unlock in ${days} day${days === 1 ? '' : 's'}`;
      }
    } else {
      // Unlock time has passed
      status = VAULT_STATUS.UNLOCKED;
      canUnlock = true;
      message = 'Vault is now unlocked! You can access your files.';

      // Update vault status in database
      if (vault.lockStatus !== VAULT_STATUS.UNLOCKED) {
        await db.vault.update({
          where: { id: input.vaultId },
          data: {
            lockStatus: VAULT_STATUS.UNLOCKED,
            updatedAt: now,
          },
        });
      }
    }

    logger.info('Vault unlock eligibility checked', {
      vaultId: input.vaultId,
      canUnlock,
      status,
      timeRemaining,
    });

    return {
      canUnlock,
      status,
      unlockTime,
      timeRemaining,
      message,
      vault: {
        id: vault.id,
        name: vault.name,
        unlockTime: vault.unlockTime,
        lockStatus: status,
        isDemo: vault.isDemo,
      },
    };
  } catch (error) {
    logger.error('Vault unlock check failed', error instanceof Error ? error : undefined);
    return {
      canUnlock: false,
      status: 'ERROR',
      unlockTime: null,
      timeRemaining: 0,
      message: 'Error checking vault unlock status. Please try again.',
      vault: {
        id: input.vaultId,
        name: 'Unknown',
        unlockTime: null,
        lockStatus: 'ERROR',
        isDemo: false,
      },
    };
  }
}

/**
 * Get vault unlock status with detailed information
 */
export async function getVaultUnlockStatus(
  input: UnlockVaultCheckInput
): Promise<UnlockVaultResult> {
  return checkVaultUnlockEligibility(input);
}

/**
 * Record unlock attempt in audit trail
 */
export async function recordUnlockAttempt(
  vaultId: string,
  userId: string,
  status: 'SUCCESS' | 'FAILED' | 'LOCKED',
  failureReason?: string
): Promise<void> {
  try {
    await db.unlockEvent.create({
      data: {
        vaultId,
        userId,
        status,
        failureReason: failureReason || null,
        timeVerified: new Date(),
      },
    });

    logger.info('Unlock attempt recorded', {
      vaultId,
      userId,
      status,
    });
  } catch (error) {
    logger.error('Failed to record unlock attempt', error instanceof Error ? error : undefined);
  }
}

/**
 * Log unlock activity
 */
export async function logUnlockActivity(
  vaultId: string,
  userId: string,
  action: string,
  description: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        vaultId,
        userId,
        action,
        description,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error) {
    logger.error('Failed to log unlock activity', error instanceof Error ? error : undefined);
  }
}

/**
 * Verify unlock eligibility before file download
 * This MUST be called before any file access
 */
export async function verifyUnlockBeforeFileAccess(
  vaultId: string,
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ allowed: boolean; reason: string }> {
  try {
    // Check unlock eligibility
    const result = await checkVaultUnlockEligibility({
      vaultId,
      userId,
    });

    if (!result.canUnlock) {
      // Record failed attempt
      await recordUnlockAttempt(vaultId, userId, 'FAILED', result.message);
      await logUnlockActivity(
        vaultId,
        userId,
        'UNLOCK_ATTEMPT_FAILED',
        `Attempt to access locked vault: ${result.message}`,
        ipAddress,
        userAgent
      );

      return {
        allowed: false,
        reason: result.message,
      };
    }

    // Record successful attempt
    await recordUnlockAttempt(vaultId, userId, 'SUCCESS');
    await logUnlockActivity(
      vaultId,
      userId,
      'VAULT_UNLOCKED',
      'Vault successfully unlocked for file access',
      ipAddress,
      userAgent
    );

    return {
      allowed: true,
      reason: 'Access granted',
    };
  } catch (error) {
    logger.error('Unlock verification failed', error instanceof Error ? error : undefined);
    return {
      allowed: false,
      reason: 'Error verifying unlock status',
    };
  }
}

/**
 * Get comprehensive vault unlock information
 */
export async function getVaultUnlockInfo(
  vaultId: string,
  userId: string
): Promise<{
  vault: any;
  unlockStatus: UnlockVaultResult;
  recentUnlockEvents: any[];
} | null> {
  try {
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      include: {
        files: {
          where: { isActive: true },
        },
        unlockEvents: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!vault || vault.userId !== userId) {
      return null;
    }

    const unlockStatus = await checkVaultUnlockEligibility({
      vaultId,
      userId,
    });

    return {
      vault,
      unlockStatus,
      recentUnlockEvents: vault.unlockEvents,
    };
  } catch (error) {
    logger.error('Failed to get vault unlock info', error instanceof Error ? error : undefined);
    return null;
  }
}
