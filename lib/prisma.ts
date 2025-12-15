import { PrismaClient } from './generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Only instantiate if DATABASE_URL is provided
export const prisma = (() => {
  if (!process.env.DATABASE_URL) {
    // During build without DB connection, create a dummy client
    if (process.env.NODE_ENV === 'production' || !process.env.DATABASE_URL) {
      // Return a proxy that won't be called during build
      return {
        user: { findUnique: async () => null },
        vault: { findMany: async () => [], create: async () => ({}), findUnique: async () => null, update: async () => ({}), },
        activityLog: { create: async () => ({}) },
      } as any;
    }
  }

  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = new (PrismaClient as any)();
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
})();
