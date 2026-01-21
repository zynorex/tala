/**
 * Enterprise-Grade CORS Configuration
 * Implements secure cross-origin resource sharing policies
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Configuration Interface
 */
export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders?: string[];
  credentials: boolean;
  maxAge: number;
  optionsSuccessStatus: number;
}

/**
 * Environment-specific CORS configurations
 */
const CORS_CONFIGS: Record<string, CORSConfig> = {
  development: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'X-RateLimit-*'],
    credentials: true,
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200,
  },
  staging: {
    allowedOrigins: [
      'https://staging.tala.ai',
      'https://staging-app.tala.ai',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'X-RateLimit-*'],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200,
  },
  production: {
    allowedOrigins: [
      'https://tala.ai',
      'https://www.tala.ai',
      'https://app.tala.ai',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'X-RateLimit-*'],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200,
  },
};

/**
 * Get CORS configuration for current environment
 */
export function getCORSConfig(): CORSConfig {
  const env = process.env.NODE_ENV || 'development';
  return CORS_CONFIGS[env] || CORS_CONFIGS.development;
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | undefined, config: CORSConfig): boolean {
  if (!origin) return false;

  // Check exact match
  if (config.allowedOrigins.includes(origin)) {
    return true;
  }

  // Check wildcard patterns
  return config.allowedOrigins.some(allowedOrigin => {
    if (allowedOrigin.includes('*')) {
      const regex = new RegExp(
        '^' + allowedOrigin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'
      );
      return regex.test(origin);
    }
    return false;
  });
}

/**
 * Apply CORS headers to response
 */
export function applyCORSHeaders(
  response: NextResponse,
  request: NextRequest,
  config?: CORSConfig
): NextResponse {
  const corsConfig = config || getCORSConfig();
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  if (origin && isOriginAllowed(origin, corsConfig)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (origin) {
    // Log unauthorized CORS attempt
    console.warn(`[CORS] Unauthorized origin: ${origin}`);
  }

  response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));

  if (corsConfig.exposedHeaders) {
    response.headers.set('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
  }

  if (corsConfig.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());

  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCORSPreflight(
  request: NextRequest,
  config?: CORSConfig
): NextResponse {
  const corsConfig = config || getCORSConfig();
  const origin = request.headers.get('origin');

  const response = new NextResponse(null, {
    status: 200,
  });

  if (origin && isOriginAllowed(origin, corsConfig)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
  response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());

  if (corsConfig.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * CORS middleware for API routes
 */
export async function corsMiddleware(request: NextRequest, config?: CORSConfig) {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return handleCORSPreflight(request, config);
  }

  // Continue with request
  return null;
}
