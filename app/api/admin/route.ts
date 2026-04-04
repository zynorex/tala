import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUsers,
  getAdminVaults,
  getAdminAnalytics,
  getAdminLogs,
} from '@/lib/admin/handlers';

/**
 * GET /api/admin - Route dispatcher for admin endpoints
 * Supports: /api/admin/users, /api/admin/vaults, /api/admin/analytics, /api/admin/logs
 */
export async function GET(req: NextRequest) {
  const path = new URL(req.url).pathname;

  if (path === '/api/admin/users') {
    return getAdminUsers(req);
  }

  if (path === '/api/admin/vaults') {
    return getAdminVaults(req);
  }

  if (path === '/api/admin/analytics') {
    return getAdminAnalytics(req);
  }

  if (path === '/api/admin/logs') {
    return getAdminLogs(req);
  }

  return NextResponse.json(
    { error: 'Not Found', message: 'Admin endpoint not found' },
    { status: 404 }
  );
}
