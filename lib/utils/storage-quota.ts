/**
 * Storage Quota Management Service
 * Tracks user storage usage and enforces quotas
 * Prevents excessive storage consumption and enables billing
 */

import { getLogger } from './logger';
import { db } from '@/lib/prisma';

const logger = getLogger('StorageQuotaService');

// Default storage quotas per plan (in bytes)
export const STORAGE_QUOTAS = {
  free: 100 * 1024 * 1024, // 100MB
  pro: 10 * 1024 * 1024 * 1024, // 10GB
  enterprise: 1024 * 1024 * 1024 * 1024, // 1TB
};

// Daily bandwidth limits per plan (in bytes)
export const BANDWIDTH_QUOTAS = {
  free: 500 * 1024 * 1024, // 500MB/day
  pro: 100 * 1024 * 1024 * 1024, // 100GB/day
  enterprise: Infinity, // Unlimited
};

export interface StorageMetrics {
  totalUsed: number;
  quota: number;
  percentageUsed: number;
  remaining: number;
  overQuota: boolean;
}

export interface BandwidthMetrics {
  usedToday: number;
  dailyQuota: number;
  percentageUsed: number;
  remaining: number;
  overQuota: boolean;
  resetTime: Date; // When the daily quota resets
}

/**
 * Get user's current storage usage
 */
export async function getUserStorageUsage(userId: string): Promise<number> {
  try {
    const vaults = await db.vault.findMany({
      where: { userId, isActive: true },
      select: { fileSize: true },
    });

    const total = vaults.reduce((sum: number, vault: any) => sum + (vault.fileSize || 0), 0);
    logger.debug('Calculated storage usage', { userId, totalBytes: total });

    return total;
  } catch (error) {
    logger.error('Failed to calculate storage usage', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Get user's storage metrics
 */
export async function getStorageMetrics(userId: string, plan: string = 'free'): Promise<StorageMetrics> {
  const quota = STORAGE_QUOTAS[plan as keyof typeof STORAGE_QUOTAS] || STORAGE_QUOTAS.free;
  const totalUsed = await getUserStorageUsage(userId);

  const percentageUsed = (totalUsed / quota) * 100;
  const remaining = quota - totalUsed;
  const overQuota = totalUsed > quota;

  logger.debug('Storage metrics', { userId, totalUsed, quota, percentageUsed, overQuota });

  return {
    totalUsed,
    quota,
    percentageUsed: Math.min(percentageUsed, 100),
    remaining: Math.max(remaining, 0),
    overQuota,
  };
}

/**
 * Check if user can upload a file of given size
 */
export async function canUserUpload(
  userId: string,
  fileSizeBytes: number,
  plan: string = 'free'
): Promise<{ allowed: boolean; reason?: string }> {
  const metrics = await getStorageMetrics(userId, plan);

  if (metrics.overQuota) {
    return {
      allowed: false,
      reason: `Storage quota exceeded. Current usage: ${(metrics.totalUsed / 1024 / 1024).toFixed(2)}MB / ${(metrics.quota / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (metrics.totalUsed + fileSizeBytes > metrics.quota) {
    return {
      allowed: false,
      reason: `File would exceed storage quota. File size: ${(fileSizeBytes / 1024 / 1024).toFixed(2)}MB, Remaining: ${(metrics.remaining / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  logger.info('Upload allowed', { userId, fileSizeBytes });
  return { allowed: true };
}

/**
 * Record bandwidth usage for a user
 */
export async function recordBandwidthUsage(userId: string, bytes: number): Promise<void> {
  try {
    // Get or create today's bandwidth record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's existing bandwidth record
    const existing = await db.activityLog.findFirst({
      where: {
        userId,
        action: 'bandwidth_usage',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: { id: true, description: true },
    });

    let updatedCount = 0;
    if (existing) {
      const previousBytes = parseInt(existing.description || '0', 10) || 0;
      await db.activityLog.update({
        where: { id: existing.id },
        data: { description: `${previousBytes + bytes}` },
      });
      updatedCount = 1;
    }

    const updated = { count: updatedCount };

    // If no record was updated, create a new one
    if (updated.count === 0) {
      await db.activityLog.create({
        data: {
          userId,
          vaultId: '', // Bandwidth is not tied to specific vault
          action: 'bandwidth_usage',
          description: `${bytes}`,
          ipAddress: null,
          userAgent: null,
        },
      });
    }

    logger.debug('Bandwidth usage recorded', { userId, bytes });
  } catch (error) {
    logger.error('Failed to record bandwidth usage', error instanceof Error ? error : undefined);
    // Don't throw - bandwidth tracking shouldn't fail uploads
  }
}

/**
 * Get user's bandwidth metrics
 */
export async function getBandwidthMetrics(userId: string, plan: string = 'free'): Promise<BandwidthMetrics> {
  const dailyQuota = BANDWIDTH_QUOTAS[plan as keyof typeof BANDWIDTH_QUOTAS] || BANDWIDTH_QUOTAS.free;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const logs = await db.activityLog.findMany({
      where: {
        userId,
        action: 'bandwidth_usage',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        description: true,
      },
    });

    const usedToday = logs.reduce((sum: number, log: any) => {
      const bytes = parseInt(log.description || '0', 10);
      return sum + (isNaN(bytes) ? 0 : bytes);
    }, 0);

    const percentageUsed = dailyQuota === Infinity ? 0 : (usedToday / dailyQuota) * 100;
    const remaining = dailyQuota === Infinity ? Infinity : dailyQuota - usedToday;

    return {
      usedToday,
      dailyQuota,
      percentageUsed: Math.min(percentageUsed, 100),
      remaining: Math.max(remaining, 0),
      overQuota: usedToday > dailyQuota,
      resetTime: tomorrow,
    };
  } catch (error) {
    logger.error('Failed to get bandwidth metrics', error instanceof Error ? error : undefined);

    return {
      usedToday: 0,
      dailyQuota,
      percentageUsed: 0,
      remaining: dailyQuota,
      overQuota: false,
      resetTime: tomorrow,
    };
  }
}

/**
 * Get detailed quota information for user dashboard
 */
export async function getQuotaInfo(userId: string, plan: string = 'free') {
  const [storageMetrics, bandwidthMetrics] = await Promise.all([
    getStorageMetrics(userId, plan),
    getBandwidthMetrics(userId, plan),
  ]);

  return {
    storage: storageMetrics,
    bandwidth: bandwidthMetrics,
    plan,
    limits: {
      storage: STORAGE_QUOTAS[plan as keyof typeof STORAGE_QUOTAS] || STORAGE_QUOTAS.free,
      bandwidth: BANDWIDTH_QUOTAS[plan as keyof typeof BANDWIDTH_QUOTAS] || BANDWIDTH_QUOTAS.free,
    },
  };
}

/**
 * Format bytes for display
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes === Infinity) return 'Unlimited';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

