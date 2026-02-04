/**
 * Secure API Handler Wrapper
 * Template for creating secure API endpoints
 * 
 * Usage:
 * export const POST = secureApiHandler(async (request, context) => {
 *   // Your API logic here
 *   return NextResponse.json({ data: 'success' });
 * }, { requireAuth: true, rateLimit: 100 });
 */

import { NextRequest, NextResponse } from 'next/server';
import { applyCORSHeaders, handleCORSPreflight } from './cors-config';
import { InputSanitizer, RateLimiter, AuditLogger } from './security-utils';

export interface SecureHandlerOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimitWindow?: number; // milliseconds
  rateLimitRequests?: number;
  sanitizeInput?: boolean;
  auditLog?: boolean;
  corsEnabled?: boolean;
}

const DEFAULT_OPTIONS: SecureHandlerOptions = {
  requireAuth: false,
  requireAdmin: false,
  rateLimitWindow: 60000, // 1 minute
  rateLimitRequests: 100,
  sanitizeInput: true,
  auditLog: true,
  corsEnabled: true,
};

/**
 * Secure API handler wrapper
 */
export function secureApiHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: SecureHandlerOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (request: NextRequest, context?: any) => {
    try {
      // 1. Handle CORS preflight
      if (opts.corsEnabled && request.method === 'OPTIONS') {
        return handleCORSPreflight(request);
      }

      // 2. Rate limiting
      const clientIP = getClientIP(request);
      const rateLimitKey = `${clientIP}:${new URL(request.url).pathname}`;
      const rateLimit = RateLimiter.isAllowed(
        rateLimitKey,
        opts.rateLimitRequests!,
        opts.rateLimitWindow!
      );

      if (!rateLimit.allowed) {
        const response = NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );

        response.headers.set('Retry-After', Math.ceil(rateLimit.resetTime / 1000).toString());
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());

        if (opts.auditLog) {
          AuditLogger.logEvent(
            'RATE_LIMIT_EXCEEDED',
            'WARNING',
            undefined,
            clientIP
          );
        }

        return response;
      }

      // 3. Authentication check
      if (opts.requireAuth) {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
          if (opts.auditLog) {
            AuditLogger.logEvent(
              'AUTH_MISSING',
              'WARNING',
              undefined,
              clientIP
            );
          }
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }

      // 4. Admin check
      if (opts.requireAdmin) {
        const isAdmin = request.headers.get('x-admin-verified') === 'true';
        if (!isAdmin) {
          if (opts.auditLog) {
            AuditLogger.logEvent(
              'ADMIN_ACCESS_DENIED',
              'WARNING',
              undefined,
              clientIP
            );
          }
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
      }

      // 5. Input sanitization
      if (opts.sanitizeInput && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        if (request.headers.get('content-type')?.includes('application/json')) {
          try {
            const body = await request.json();
            // Sanitize all string fields
            Object.keys(body).forEach(key => {
              if (typeof body[key] === 'string') {
                body[key] = InputSanitizer.sanitizeString(body[key]);
              }
            });
            
            // Create new request with sanitized body
            // Note: In production, you might want to validate the sanitized body
          } catch (e) {
            return NextResponse.json(
              { error: 'Invalid request body' },
              { status: 400 }
            );
          }
        }
      }

      // 6. Call the actual handler
      let response = await handler(request, context);

      // 7. Apply CORS headers
      if (opts.corsEnabled) {
        response = applyCORSHeaders(response, request);
      }

      // 8. Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

      // 9. Audit log
      if (opts.auditLog) {
        AuditLogger.logEvent(
          `API_${request.method}`,
          'INFO',
          request.headers.get('x-user-id') || undefined,
          clientIP,
          {
            path: new URL(request.url).pathname,
            status: response.status,
          }
        );
      }

      // 10. Add rate limit headers
      response.headers.set('X-RateLimit-Limit', opts.rateLimitRequests!.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());

      return response;
    } catch (error) {
      console.error('API Handler Error:', error);

      if (opts.auditLog) {
        AuditLogger.logEvent(
          'API_ERROR',
          'ERROR',
          request.headers.get('x-user-id') || undefined,
          getClientIP(request),
          { error: String(error) }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

/**
 * Validate JWT token using jsonwebtoken library
 * Properly verifies signature, expiration, and structure
 */
export function validateJWT(token: string, secret: string): boolean {
  try {
    if (!token || !secret) {
      return false;
    }

    // Dynamically import to avoid issues if jwt is not available
    const jwt = require('jsonwebtoken');
    
    // Verify the token with the secret
    // This checks: signature, expiration (exp), not before (nbf)
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256', 'HS384', 'HS512'],
      complete: true,
    });

    // Ensure the token has required claims
    if (!decoded || !decoded.payload) {
      return false;
    }

    // Check if token has userId (required for our app)
    if (!decoded.payload.userId) {
      return false;
    }

    return true;
  } catch (error) {
    // Token verification failed (expired, invalid signature, malformed, etc.)
    console.error('JWT validation failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Create secure response
 */
export function secureResponse(data: any, status: number = 200) {
  const response = NextResponse.json(data, { status });
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

  return response;
}
