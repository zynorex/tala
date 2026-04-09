import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { generateToken } from '@/lib/auth/jwt';
import { db } from '@/lib/prisma';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('GenerateToken');

export async function POST(req: Request) {
  try {
    console.log('Generate token endpoint called');
    
    // Get the current session
    const session = await getServerSession(authOptions);
    console.log('Session retrieved:', !!session, session?.user?.email);

    if (!session || !session.user?.email) {
      console.log('No valid session found');
      logger.warn('No valid session found');
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Looking up user with email:', session.user.email);
    
    // Get or create user for Google auth
    let user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log('Creating new user from Google auth');
      logger.info('Creating new user from Google auth', { email: session.user.email });
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
          role: 'user',
        },
      });
      console.log('User created:', user.id);
    } else {
      console.log('User found:', user.id);
    }

    // Generate JWT token
    const token = generateToken(
      user.id,
      user.email || undefined,
      user.walletAddress || undefined
    );

    console.log('Token generated successfully');
    logger.info('Token generated', { userId: user.id, email: user.email });

    return Response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Failed to generate token:', error);
    logger.error('Failed to generate token', error instanceof Error ? error : undefined);
    return Response.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
