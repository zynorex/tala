import { NextRequest, NextResponse } from 'next/server';
import { getAdminLogs } from '@/lib/admin/handlers';

/**
 * GET /api/admin/logs - Get activity logs
 */
export async function GET(req: NextRequest) {
  return getAdminLogs(req);
}
