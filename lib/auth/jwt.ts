import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

/**
 * JWT secret must be set via environment variable.
 * The application will throw at startup if JWT_SECRET is missing,
 * preventing accidental use of a hardcoded/default secret.
 */
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'Set a strong, unique secret (min 32 chars) before starting the application.'
    );
  }
  if (secret.length < 32) {
    console.warn(
      '[SECURITY WARNING] JWT_SECRET is shorter than 32 characters. ' +
      'Use a strong, unique secret (min 32 chars) in production.'
    );
  }
  return secret;
}

const JWT_SECRET = getJWTSecret();
const JWT_EXPIRY = '7d';

export interface JWTPayload {
  userId: string;
  email?: string;
  walletAddress?: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string, email?: string, walletAddress?: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    walletAddress,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify request has valid JWT token
 */
export function verifyRequest(req: NextRequest): JWTPayload | null {
  const token = getTokenFromHeader(req);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

