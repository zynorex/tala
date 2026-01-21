/**
 * Enterprise-Grade API Error Handler
 * Standardized error handling, logging, and response formatting
 * 
 * Features:
 * - Typed error responses
 * - Request correlation IDs
 * - Automatic error logging
 * - User-friendly error messages
 * - Stack traces in development
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('APIErrorHandler');

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId: string;
    timestamp: string;
    details?: Record<string, any>;
  };
  status: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  status: number;
}

/**
 * Typed API response wrapper
 */
export function apiResponse<T>(
  data: T,
  status: number = 200
): SuccessResponse<T> {
  return {
    success: true,
    data,
    status,
  };
}

/**
 * Enterprise-grade error handler for API routes
 * Handles errors with logging, correlation IDs, and user-friendly messages
 */
export async function apiErrorHandler(
  error: unknown,
  request: NextRequest,
  context?: Record<string, any>
): Promise<NextResponse<ErrorResponse>> {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: Record<string, any> | undefined;

  // Parse error
  if (error instanceof Error) {
    // Handle custom errors with error codes
    if ('code' in error && typeof (error as any).code === 'string') {
      errorCode = (error as any).code;
      
      // Map error codes to HTTP status codes
      const statusMap: Record<string, number> = {
        'INVALID_ADDRESS': 400,
        'INVALID_PARAMS': 400,
        'INSUFFICIENT_BALANCE': 402,
        'NOT_FOUND': 404,
        'UNAUTHORIZED': 401,
        'FORBIDDEN': 403,
        'NETWORK_ERROR': 503,
        'TRANSACTION_FAILED': 500,
      };
      
      statusCode = statusMap[errorCode] || 500;
    }
    
    message = error.message;
    
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      details = {
        stack: error.stack,
        ...context,
      };
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  // Log the error
  logger.error(`API Error [${requestId}]`, {
    statusCode,
    errorCode,
    message,
    path: request.nextUrl.pathname,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    error: error instanceof Error ? error : new Error(String(error)),
    context,
  });

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      requestId,
      timestamp,
      details,
    },
    status: statusCode,
  };

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Async wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = args[0] as NextRequest;
      return apiErrorHandler(error, request);
    }
  }) as T;
}

/**
 * Validation error for API routes
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
    (this as any).code = 'INVALID_PARAMS';
  }
}

/**
 * Not found error for API routes
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    (this as any).code = 'NOT_FOUND';
  }
}

/**
 * Unauthorized error for API routes
 */
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    (this as any).code = 'UNAUTHORIZED';
  }
}

/**
 * Forbidden error for API routes
 */
export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    (this as any).code = 'FORBIDDEN';
  }
}

