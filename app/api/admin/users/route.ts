import { NextRequest, NextResponse } from 'next/server';
import { getAdminUsers } from '@/lib/admin/handlers';

/**
 * GET /api/admin/users - List all users
 */
export async function GET(req: NextRequest) {
  return getAdminUsers(req);
}
