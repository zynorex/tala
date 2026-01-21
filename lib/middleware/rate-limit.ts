import { NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise-Grade Rate Limiting Middleware
 * Supports: Per-IP, per-user, per-endpoint limits
 * Uses: In-memory store (production: Redis/Memcached)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    violations: number;
  };
}

interface RateLimitConfig {
  windowMs: number; // Time window in ms (default: 60s)
  maxRequests: number; // Max requests per window
  maxViolations: number; // Block after N violations
  blockDurationMs: number; // How long to block (default: 15min)
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  maxViolations: 5, // Block after 5 violations
  blockDurationMs: 15 * 60 * 1000, // 15 minutes
};

const store: RateLimitStore = {};

/**
 * Get rate limit key
 * Combines endpoint, user ID (if auth), and IP address
 */
function getKey(req: NextRequest, userId?: string): string {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const method = req.method;
  const path = new URL(req.url).pathname;
  return `${ip}:${method}:${path}${userId ? `:${userId}` : ''}`;
}

/**
 * Get remaining requests for a key
 */
export function getRateLimitStatus(key: string): {
  remaining: number;
  resetTime: Date;
  isBlocked: boolean;
} {
  const entry = store[key];

  if (!entry) {
    return {
      remaining: defaultConfig.maxRequests,
      resetTime: new Date(Date.now() + defaultConfig.windowMs),
      isBlocked: false,
    };
  }

  const now = Date.now();
  const isExpired = now > entry.resetTime;
  const isBlocked = entry.violations >= defaultConfig.maxViolations;

  if (isExpired) {
    return {
      remaining: defaultConfig.maxRequests,
      resetTime: new Date(now + defaultConfig.windowMs),
      isBlocked: false,
    };
  }

  return {
    remaining: Math.max(0, defaultConfig.maxRequests - entry.count),
    resetTime: new Date(entry.resetTime),
    isBlocked,
  };
}

/**
 * Main rate limiting middleware
 */
export async function rateLimit(
  req: NextRequest,
  userId?: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const finalConfig = { ...defaultConfig, ...config };
  const key = getKey(req, userId);
  const now = Date.now();

  // Initialize or retrieve entry
  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 0,
      resetTime: now + finalConfig.windowMs,
      violations: 0,
    };
  }

  const entry = store[key];

  // Check if blocked
  if (entry.violations >= finalConfig.maxViolations) {
    const blockedUntil = new Date(entry.resetTime + finalConfig.blockDurationMs);
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'This IP/user has been temporarily blocked due to rate limit violations',
          retryAfter: blockedUntil.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (blockedUntil.getTime() - now) / 1000
            ).toString(),
            'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': blockedUntil.toISOString(),
          },
        }
      ),
    };
  }

  // Increment request count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > finalConfig.maxRequests) {
    entry.violations++;
    const resetTime = new Date(entry.resetTime);

    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit exceeded: ${finalConfig.maxRequests} requests per ${finalConfig.windowMs / 1000}s`,
          retryAfter: resetTime.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (entry.resetTime - now) / 1000
            ).toString(),
            'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString(),
          },
        }
      ),
    };
  }

  // Request allowed
  const remaining = finalConfig.maxRequests - entry.count;
  const resetTime = new Date(entry.resetTime);

  return {
    allowed: true,
  };
}

/**
 * Middleware-wrapper for Next.js
 * Pass this to your route handlers
 */
export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  userId?: string,
  config?: Partial<RateLimitConfig>
): Promise<NextResponse> {
  const { allowed, response } = await rateLimit(req, userId, config);

  if (!allowed && response) {
    return response;
  }

  return handler(req);
}

/**
 * Endpoint-specific rate limits
 */
export const rateLimitConfigs = {
  auth: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 auth requests per minute
  },
  upload: {
    windowMs: 60 * 1000,
    maxRequests: 5, // 5 uploads per minute
  },
  download: {
    windowMs: 60 * 1000,
    maxRequests: 30, // 30 downloads per minute
  },
  default: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
};

/**
 * Cleanup old entries (run periodically)
 */
export function cleanupRateLimitStore(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const key in store) {
    if (
      store[key].resetTime + defaultConfig.blockDurationMs < now &&
      store[key].violations === 0
    ) {
      delete store[key];
      cleaned++;
    }
  }

  return cleaned;
}

// Run cleanup every 30 minutes
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimitStore, 30 * 60 * 1000);
}

/**
 * Get all active rate limits (for debugging/admin)
 */
export function getActiveRateLimits(): Array<{
  key: string;
  count: number;
  resetTime: string;
  violations: number;
  remaining: number;
}> {
  const now = Date.now();
  return Object.entries(store)
    .filter(([_, entry]) => entry.resetTime > now || entry.violations > 0)
    .map(([key, entry]) => ({
      key,
      count: entry.count,
      resetTime: new Date(entry.resetTime).toISOString(),
      violations: entry.violations,
      remaining: Math.max(0, defaultConfig.maxRequests - entry.count),
    }));
}

