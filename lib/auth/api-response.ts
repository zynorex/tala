import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
  timestamp: string;
}

/**
 * Return successful API response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Return error API response
 */
export function apiError(
  error: string,
  status: number = 400,
  details?: string
): NextResponse {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Return paginated response
 */
export function apiPaginated<T>(
  data: T[],
  total: number,
  page: number = 1,
  pageSize: number = 20,
  status: number = 200
): NextResponse {
  const pages = Math.ceil(total / pageSize);

  return NextResponse.json<PaginatedResponse<T>>(
    {
      success: true,
      data,
      pagination: {
        total,
        page,
        pageSize,
        pages,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Handle validation errors
 */
export function handleValidationError(error: any): NextResponse {
  if (error.errors) {
    const messages = error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return apiError(`Validation error: ${messages}`, 400);
  }
  return apiError('Validation failed', 400);
}

/**
 * Handle database errors
 */
export function handleDbError(error: any): NextResponse {
  console.error('Database error:', error);

  if (error.code === 'P2002') {
    return apiError('This record already exists', 409);
  }
  if (error.code === 'P2025') {
    return apiError('Record not found', 404);
  }

  return apiError('Database error occurred', 500);
}

/**
 * Common HTTP error responses
 */
export const httpErrors = {
  badRequest: (msg: string = 'Bad request') => apiError(msg, 400),
  unauthorized: () => apiError('Unauthorized: Missing or invalid token', 401),
  forbidden: () => apiError('Forbidden: You do not have access', 403),
  notFound: (resource: string = 'Resource') => apiError(`${resource} not found`, 404),
  conflict: (msg: string = 'Conflict') => apiError(msg, 409),
  payloadTooLarge: () => apiError('File size exceeds maximum limit', 413),
  serverError: (msg: string = 'Internal server error') => apiError(msg, 500),
};
