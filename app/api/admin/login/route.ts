import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { adminId, password } = await req.json();

    // Get credentials from environment
    const envAdminId = process.env.ADMIN_ID || '';
    const envPassword = process.env.ADMIN_PASSWORD || '';

    // Verify credentials
    if (adminId !== envAdminId || password !== envPassword) {
      return NextResponse.json(
        { message: 'Invalid admin ID or password' },
        { status: 401 }
      );
    }

    // Return mock token (in production, use proper JWT)
    const token = Buffer.from(`${adminId}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      token,
      name: adminId,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
