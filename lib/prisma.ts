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
    
    // Return a mock client for build-time or when DB is not configured
    return {
      user: { findUnique: async () => null, findMany: async () => [], create: async () => ({}) },
      vault: { findMany: async () => [], create: async () => ({}), findUnique: async () => null, update: async () => ({}) },
      vaultFile: { findMany: async () => [], create: async () => ({}), delete: async () => ({}) },
      encryptionMetadata: { create: async () => ({}), findUnique: async () => null },
      activityLog: { create: async () => ({}), findMany: async () => [] },
    } as any;
  }

  // Reuse existing connection in development
  if (globalForPrisma.prisma) {
    logger.debug('Reusing existing Prisma connection');
    return globalForPrisma.prisma;
  }

  logger.info('Creating new Prisma database client');
  
  const client = new PrismaClient({
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
