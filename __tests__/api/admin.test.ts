/**
 * Admin API Tests
 * Tests for /api/admin/* endpoints
 */

import { NextRequest } from 'next/server';
import {
  getAdminUsers,
  getAdminVaults,
  getAdminAnalytics,
  deleteAdminUser,
  getAdminLogs,
} from '@/lib/admin/handlers';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    vault: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    vaultFile: {
      count: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

// Mock JWT verification
jest.mock('@/lib/auth/jwt', () => ({
  verifyRequest: jest.fn().mockReturnValue({ userId: 'admin123' }),
}));

describe('Admin API', () => {
  describe('GET /api/admin/users - List users', () => {
    it('should list users with pagination for admin', async () => {
      const { prisma } = require('@/lib/prisma');
      const { verifyRequest } = require('@/lib/auth/jwt');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });
      prisma.user.findMany.mockResolvedValue([
        {
          id: 'user1',
          email: 'user1@test.com',
          displayName: 'User One',
          _count: { vaults: 5, activityLogs: 20 },
        },
      ]);
      prisma.user.count.mockResolvedValue(1);

      const req = {
        url: 'http://localhost/api/admin/users?page=1&limit=50',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminUsers(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('pagination');
    });

    it('should reject non-admin users', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'user123', role: 'user' });

      const req = {
        url: 'http://localhost/api/admin/users',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminUsers(req);
      expect(response.status).toBe(403);
    });

    it('should reject unauthorized requests', async () => {
      const { verifyRequest } = require('@/lib/auth/jwt');
      verifyRequest.mockReturnValueOnce(null);

      const req = {
        url: 'http://localhost/api/admin/users',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminUsers(req);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/vaults - List vaults', () => {
    it('should list vaults with filters', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });
      prisma.vault.findMany.mockResolvedValue([
        {
          id: 'vault1',
          name: 'My Vault',
          user: { email: 'user@test.com', displayName: 'User' },
          _count: { activityLogs: 10, files: 5 },
        },
      ]);
      prisma.vault.count.mockResolvedValue(1);

      const req = {
        url: 'http://localhost/api/admin/vaults?page=1&limit=50&isActive=true',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminVaults(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('pagination');
    });
  });

  describe('GET /api/admin/analytics - System analytics', () => {
    it('should retrieve 30-day analytics', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });
      prisma.user.count.mockResolvedValue(50);
      prisma.vault.count.mockResolvedValue(25);
      prisma.vaultFile.count.mockResolvedValue(100);
      prisma.activityLog.findMany.mockResolvedValue([]);
      prisma.activityLog.groupBy.mockResolvedValue([
        { action: 'file_upload', _count: 50 },
        { action: 'vault_create', _count: 10 },
      ]);

      const req = {
        url: 'http://localhost/api/admin/analytics?days=30',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminAnalytics(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('period');
      expect(data.data).toHaveProperty('users');
      expect(data.data).toHaveProperty('activity');
    });
  });

  describe('DELETE /api/admin/users/[id] - Delete user', () => {
    it('should soft delete user', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });
      prisma.user.update.mockResolvedValue({
        id: 'user123',
        email: 'user@test.com',
        deletedAt: new Date(),
      });

      const req = {
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await deleteAdminUser(req, {
        params: Promise.resolve({ id: 'user123' }),
      });

      expect(response.status).toBe(200);
    });

    it('should prevent self-deletion', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });

      const req = {
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await deleteAdminUser(req, {
        params: Promise.resolve({ id: 'admin123' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/admin/logs - Activity logs', () => {
    it('should retrieve filtered activity logs', async () => {
      const { prisma } = require('@/lib/prisma');

      prisma.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'admin' });
      prisma.activityLog.findMany.mockResolvedValue([
        {
          id: 'log1',
          userId: 'user1',
          action: 'file_upload',
          description: 'Uploaded file.pdf',
          createdAt: new Date(),
        },
      ]);
      prisma.activityLog.count.mockResolvedValue(1);

      const req = {
        url: 'http://localhost/api/admin/logs?page=1&limit=100&action=file_upload',
        headers: new Map(),
      } as unknown as NextRequest;

      const response = await getAdminLogs(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toHaveProperty('pagination');
    });
  });
});
