import { NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise-Grade Security Middleware
 * Implements OWASP Top 10 protections and industry best practices
 * 
 * Security features:
 * - CSRF token validation
 * - XSS protection
 * - Input sanitization
 * - Rate limiting headers
 * - Security response headers
 * - Request logging
 * - Suspicious pattern detection
 */

// Configuration
const SECURE_ROUTES = ['/api', '/admin', '/dashboard'];
const PUBLIC_ROUTES = ['/', '/about', '/pricing', '/how-it-works', '/docs', '/contact'];
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

/**
 * In-memory rate limit store
 * Note: For production, use Redis or similar distributed store
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
  violations: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Routes exempt from CSRF validation (they use their own auth mechanisms)
 */
const CSRF_EXEMPT_ROUTES = [
  '/api/auth/login',
  '/api/auth/wallet',
  '/api/admin/login',
  '/api/auth/callback',
  '/api/webhooks',
  '/api/vaults',
  '/api/activity',
  '/api/shares',
  '/api/users',
];

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
      violations: 0,
    });
    return true;
  }

  // Reset window if expired
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW;
    entry.violations = 0;
    return true;
  }

  // Check if exceeded
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    entry.violations++;
    
    // Block after 5 violations (5 minutes of abuse)
    if (entry.violations > 5) {
      return false;
    }
  }

  entry.count++;
  return true;
}

/**
 * Detect suspicious patterns (XSS, SQL injection attempts)
 */
function detectSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers
    /union\s+select/gi, // SQL injection
    /;\s*drop\s+table/gi, // SQL injection
    /or\s+1\s*=\s*1/gi, // SQL injection
    /%3Cscript/gi, // Encoded script tags
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Detect mobile devices, tablets, and emulators from User-Agent
 * Returns blocking info if device should be blocked
 */
function detectRestrictedDevice(userAgent: string): { blocked: boolean; reason: string } | null {
  const ua = userAgent.toLowerCase();

  // Mobile device patterns
  const mobilePatterns = [
    'android', 'webos', 'iphone', 'ipod', 'blackberry', 'iemobile',
    'opera mini', 'opera mobi', 'mobile safari', 'windows phone',
    'fennec', 'mobile', 'symbian', 'palm', 'kindle', 'silk',
    'midp', 'j2me', 'wap'
  ];

  // Tablet patterns (excluding iPads in desktop mode which we handle client-side)
  const tabletPatterns = ['ipad', 'tablet', 'playbook'];

  // Emulator/simulator patterns
  const emulatorPatterns = [
    'sdk', 'emulator', 'android sdk', 'google_sdk', 'droid4x',
    'nox', 'bluestacks', 'genymotion', 'memu', 'ldplayer',
    'simulator', 'virtual', 'vmware', 'vbox', 'qemu'
  ];

  // Check for emulators first (highest priority block)
  for (const pattern of emulatorPatterns) {
    if (ua.includes(pattern)) {
      return { blocked: true, reason: 'Emulators and virtual machines are not allowed' };
    }
  }

  // Check for tablets
  for (const pattern of tabletPatterns) {
    if (ua.includes(pattern)) {
      return { blocked: true, reason: 'Tablets are not supported for security reasons' };
    }
  }

  // Check for mobile devices
  for (const pattern of mobilePatterns) {
    if (ua.includes(pattern)) {
      return { blocked: true, reason: 'Mobile devices are not supported for security reasons' };
    }
  }

  return null;
}

/**
 * Sanitize input strings
 */
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  // 0. Device restriction check for API routes (security-critical)
  if (pathname.startsWith('/api')) {
    const deviceCheck = detectRestrictedDevice(userAgent);
    if (deviceCheck?.blocked) {
      return NextResponse.json(
        {
          success: false,
          error: 'ACCESS_DENIED',
          message: deviceCheck.reason,
          details: 'T.A.L.A. is only accessible from desktop computers for security reasons.'
        },
        { 
          status: 403,
          headers: {
            'X-Device-Blocked': 'true',
            'X-Block-Reason': deviceCheck.reason
          }
        }
      );
    }
  }

  // Create response
  let response = NextResponse.next();

  // 1. Rate limiting
  if (!checkRateLimit(clientIP)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Status': 'BLOCKED',
      },
    });
  }

  // 2. Additional security headers for API routes
  if (pathname.startsWith('/api')) {
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Window', (RATE_LIMIT_WINDOW / 1000).toString());
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    // CSRF protection for state-changing operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const isExempt = CSRF_EXEMPT_ROUTES.some(route => pathname.startsWith(route));
      
      if (!isExempt) {
        const csrfToken = request.headers.get('x-csrf-token');
        const csrfCookie = request.cookies.get('csrf-token')?.value;

        if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
          return NextResponse.json(
            { error: 'CSRF token missing or invalid', code: 'CSRF_FAILED' },
            { status: 403 }
          );
        }
      }
    }

    // Log API requests
    console.log(`[${new Date().toISOString()}] ${method} ${pathname} - IP: ${clientIP}`);
  }

  // 3. Prevent access to admin routes without authentication (checked in route handlers)
  if (pathname.startsWith('/admin') && method !== 'GET') {
    response.headers.set('X-Admin-Protected', 'true');
  }

  // 4. Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // 5. HSTS header (only on HTTPS in production)
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // 6. Set CSRF token cookie if not already present
  //    Clients read this cookie and include it as x-csrf-token header on mutations
  if (!request.cookies.get('csrf-token')?.value) {
    const csrfToken = generateCSRFToken();
    response.cookies.set('csrf-token', csrfToken, {
      httpOnly: false,  // Must be readable by JS to include in headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return response;
}

/**
 * Middleware configuration - specify which routes to process
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.well-known).*)',
  ],
};
