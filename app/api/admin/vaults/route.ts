import { NextRequest, NextResponse } from 'next/server';
import { getAdminVaults } from '@/lib/admin/handlers';

/**
 * GET /api/admin/vaults - List all vaults
 */
export async function GET(req: NextRequest) {
  return getAdminVaults(req);
}
