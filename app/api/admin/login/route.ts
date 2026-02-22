import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Track failed attempts per IP for basic brute-force protection
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const record = failedAttempts.get(ip);
  if (!record) return false;

  // Reset if lockout period has passed
  if (Date.now() - record.lastAttempt > LOCKOUT_DURATION_MS) {
    failedAttempts.delete(ip);
    return false;
  }

  return record.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const record = failedAttempts.get(ip);
  if (record) {
    record.count++;
    record.lastAttempt = Date.now();
  } else {
    failedAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    crypto.timingSafeEqual(
      Buffer.from(a.padEnd(Math.max(a.length, b.length), '\0')),
      Buffer.from(b.padEnd(Math.max(a.length, b.length), '\0'))
    );
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { message: 'Too many failed attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json(
        { message: 'Admin ID and password are required' },
        { status: 400 }
      );
    }

    // Get credentials from environment (required — no fallbacks)
    const envAdminId = process.env.ADMIN_ID;
    const envPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!envAdminId || !envPassword) {
      return NextResponse.json(
        { message: 'Admin authentication is not configured' },
        { status: 503 }
      );
    }

    if (!jwtSecret) {
      return NextResponse.json(
        { message: 'Server authentication configuration error' },
        { status: 503 }
      );
    }

    // Timing-safe credential comparison
    const idMatch = safeCompare(adminId, envAdminId);
    const passwordMatch = safeCompare(password, envPassword);

    if (!idMatch || !passwordMatch) {
      recordFailedAttempt(clientIP);
      return NextResponse.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Credentials valid — clear failed attempts and issue JWT
    clearFailedAttempts(clientIP);

    const token = jwt.sign(
      {
        sub: adminId,
        role: 'admin',
        type: 'admin_session',
        iat: Math.floor(Date.now() / 1000),
      },
      jwtSecret,
      {
        expiresIn: '4h',
        algorithm: 'HS256',
        issuer: 'tala-admin',
      }
    );

    return NextResponse.json({
      token,
      name: adminId,
      expiresIn: '4h',
      message: 'Authentication successful',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
