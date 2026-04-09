/**
 * Enterprise-Grade Prisma Database Client
 * Singleton pattern with connection pooling, retry logic, and error handling
 */

import { PrismaClient } from './generated/prisma/client';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('PrismaClient');
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create Prisma client with enterprise features
export const db = (() => {
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    logger.warn('DATABASE_URL not configured, using mock client for build-time');
    
    // Comprehensive mock matching every model in prisma/schema.prisma
    const noop = async () => ({});
    const noopNull = async () => null;
    const noopArr = async () => [];
    const noopCount = async () => 0;
    const noopDeleteMany = async () => ({ count: 0 });
    const noopUpdateMany = async () => ({ count: 0 });
    const noopAggregate = async () => ({ _sum: {}, _count: {}, _avg: {}, _min: {}, _max: {} });
    const noopGroupBy = async () => [];

    const mockModel = () => ({
      findUnique: noopNull,
      findFirst: noopNull,
      findMany: noopArr,
      create: noop,
      update: noop,
      delete: noop,
      deleteMany: noopDeleteMany,
      updateMany: noopUpdateMany,
      count: noopCount,
      aggregate: noopAggregate,
      groupBy: noopGroupBy,
      upsert: noop,
    });

    return {
      user: mockModel(),
      account: mockModel(),
      session: mockModel(),
      verificationToken: mockModel(),
      vault: mockModel(),
      vaultFile: mockModel(),
      vaultShare: mockModel(),
      activityLog: mockModel(),
      apiKey: mockModel(),
      unlockEvent: mockModel(),
      encryptionMetadata: mockModel(),
      payment: mockModel(),
      subscription: mockModel(),
      $queryRaw: noopArr,
      $queryRawUnsafe: noopArr,
      $executeRaw: noopCount,
      $connect: noop,
      $disconnect: noop,
    } as any;
  }

  // Reuse existing connection in development
  if (globalForPrisma.prisma) {
    logger.debug('Reusing existing Prisma connection');
    return globalForPrisma.prisma;
  }

  logger.info('Creating new Prisma database client');
  
  const client = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });

  // Store reference in development to prevent multiple connections
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();

// Alias for compatibility
export const prisma = db;

// ─── Prisma Accelerate Retry Utility ──────────────────────────────────────────

/** Transient Prisma Accelerate error codes that are safe to retry */
const RETRYABLE_CODES = new Set([
  'P6000', // Generic server error / query timeout
  'P6004', // Query timeout exceeded (explicit)
  'P6008', // Connection pool timeout
  'P6009', // Response size limit exceeded (intermittent)
  'P1001', // Can't reach database server
  'P1002', // Database server timed out
  'P1008', // Operations timed out
  'P1017', // Server has closed the connection
  'P2024', // Timed out fetching a new connection from the pool
]);

interface RetryOptions {
  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms before first retry (default: 500) */
  baseDelayMs?: number;
  /** Maximum delay cap in ms (default: 8000) */
  maxDelayMs?: number;
  /** Label for log messages */
  label?: string;
}

/**
 * Execute a Prisma operation with automatic retry on transient Accelerate errors.
 *
 * Uses exponential back-off with jitter:
 *   delay = min(baseDelay × 2^attempt + jitter, maxDelay)
 *
 * @example
 *   const vault = await withRetry(() => db.vault.findUnique({ where: { id } }), { label: 'getVault' });
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 500, maxDelayMs = 8000, label = 'query' } = opts;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      const code: string | undefined = error?.code;
      const isRetryable = code && RETRYABLE_CODES.has(code);

      if (!isRetryable || attempt === maxRetries) {
        // Non-retryable error or exhausted retries → propagate
        if (attempt > 0) {
          logger.error(`[${label}] Failed after ${attempt + 1} attempts`, error instanceof Error ? error : undefined);
        }
        throw error;
      }

      // Exponential back-off with jitter
      const jitter = Math.random() * baseDelayMs * 0.5;
      const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + jitter, maxDelayMs);

      logger.warn(`[${label}] Transient error ${code}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`, {
        code,
        attempt: attempt + 1,
        delay: Math.round(delay),
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but satisfy TS
  throw lastError;
}

