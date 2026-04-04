import { NextRequest, NextResponse } from 'next/server';
import { getAdminAnalytics } from '@/lib/admin/handlers';

/**
 * GET /api/admin/analytics - Get system analytics
 */
export async function GET(req: NextRequest) {
  return getAdminAnalytics(req);
}
