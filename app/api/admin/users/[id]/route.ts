import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminUser } from '@/lib/admin/handlers';

/**
 * DELETE /api/admin/users/[id] - Delete user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return deleteAdminUser(req, { params });
}
