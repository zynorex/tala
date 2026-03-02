/**
 * Enterprise-Grade Prisma Database Client
 * Singleton pattern with connection pooling and error handling
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

