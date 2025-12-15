import { NextRequest, NextResponse } from 'next/server';

/**
 * Enterprise-Grade Request Logging
 * Logs: Method, URL, status, duration, user, IP, errors
 * Storage: Database (ActivityLog table)
 */

interface RequestLogEntry {
  id: string;
  method: string;
  path: string;
  query?: string;
  status: number;
  duration: number;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  referer?: string;
  error?: string;
  errorStack?: string;
  requestSize?: number;
  responseSize?: number;
  timestamp: Date;
}

interface RequestLogConfig {
  logToDatabase: boolean;
  logToConsole: boolean;
  ignorePatterns: string[]; // Paths to ignore (e.g., /health, /metrics)
  ignoreErrors: string[]; // Error types to skip logging
  maxErrorStackLength: number;
}

const defaultConfig: RequestLogConfig = {
  logToDatabase: true,
  logToConsole: true,
  ignorePatterns: ['/health', '/metrics', '/favicon.ico', '/_next'],
  ignoreErrors: [],
  maxErrorStackLength: 500,
};

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { prisma: prismaInstance } = await import('@/lib/prisma');
    prisma = prismaInstance;
  }
  return prisma;
}

/**
 * Check if path should be logged
 */
function shouldLog(path: string, config: RequestLogConfig): boolean {
  return !config.ignorePatterns.some(pattern => path.startsWith(pattern));
}

/**
 * Extract user ID from request (from JWT token or session)
 */
function extractUserId(req: NextRequest): string | undefined {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    const token = authHeader.substring(7);
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decoded.userId;
  } catch {
    return undefined;
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = req.headers.get('x-real-ip');
  if (xRealIP) {
    return xRealIP;
  }

  return 'unknown';
}

/**
 * Get request size in bytes
 */
function getRequestSize(req: NextRequest): number {
  const contentLength = req.headers.get('content-length');
  if (contentLength) {
    return parseInt(contentLength, 10);
  }

  // Estimate based on URL
  return new URL(req.url).toString().length;
}

/**
 * Format log message for console output
 */
function formatConsoleLog(entry: RequestLogEntry): string {
  const statusEmoji =
    entry.status >= 500
      ? '❌'
      : entry.status >= 400
        ? '⚠️'
        : entry.status >= 300
          ? '↩️'
          : '✅';

  return (
    `${statusEmoji} [${entry.timestamp.toISOString()}] ` +
    `${entry.method} ${entry.path} ${entry.status} ` +
    `${entry.duration}ms` +
    (entry.userId ? ` (user: ${entry.userId})` : '') +
    (entry.error ? ` - ERROR: ${entry.error}` : '')
  );
}

/**
 * Log request to database
 */
async function logToDB(entry: RequestLogEntry): Promise<void> {
  try {
    const db = await getPrisma();

    // Create a generic request log entry
    // If user is authenticated, also create an ActivityLog entry
    if (entry.userId) {
      // Extract vault ID from path if applicable
      const vaultMatch = entry.path.match(/\/api\/vaults\/([a-z0-9]+)/);
      const vaultId = vaultMatch ? vaultMatch[1] : null;

      await db.activityLog.create({
        data: {
          userId: entry.userId,
          vaultId,
          action: `api_${entry.method.toLowerCase()}`,
          description: `${entry.method} ${entry.path} - ${entry.status}`,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent || 'unknown',
        },
      });
    }
  } catch (error) {
    console.error('Failed to log request to database:', error);
  }
}

/**
 * Main logging middleware wrapper
 */
export async function withRequestLog(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: Partial<RequestLogConfig> = {}
): Promise<NextResponse> {
  const finalConfig = { ...defaultConfig, ...config };
  const startTime = Date.now();

  const path = new URL(req.url).pathname;
  const query = new URL(req.url).search;

  // Skip logging for certain paths
  if (!shouldLog(path, finalConfig)) {
    return handler(req);
  }

  const userId = extractUserId(req);
  const ipAddress = getClientIP(req);
  const requestSize = getRequestSize(req);

  try {
    // Execute handler
    const response = await handler(req);
    const duration = Date.now() - startTime;

    // Create log entry
    const logEntry: RequestLogEntry = {
      id: crypto.randomUUID(),
      method: req.method,
      path,
      query: query || undefined,
      status: response.status,
      duration,
      userId,
      ipAddress,
      userAgent: req.headers.get('user-agent') || undefined,
      referer: req.headers.get('referer') || undefined,
      requestSize,
      responseSize: parseInt(response.headers.get('content-length') || '0', 10),
      timestamp: new Date(),
    };

    // Log to console
    if (finalConfig.logToConsole) {
      console.log(formatConsoleLog(logEntry));
    }

    // Log to database
    if (finalConfig.logToDatabase) {
      await logToDB(logEntry);
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack =
      error instanceof Error
        ? error.stack?.substring(0, finalConfig.maxErrorStackLength)
        : undefined;

    // Create error log entry
    const logEntry: RequestLogEntry = {
      id: crypto.randomUUID(),
      method: req.method,
      path,
      query: query || undefined,
      status: 500,
      duration,
      userId,
      ipAddress,
      userAgent: req.headers.get('user-agent') || undefined,
      referer: req.headers.get('referer') || undefined,
      requestSize,
      error: errorMessage,
      errorStack,
      timestamp: new Date(),
    };

    // Log error to console
    if (finalConfig.logToConsole) {
      console.error(formatConsoleLog(logEntry));
      if (errorStack) {
        console.error(errorStack);
      }
    }

    // Log error to database
    if (finalConfig.logToDatabase) {
      await logToDB(logEntry);
    }

    // Re-throw error
    throw error;
  }
}

/**
 * Get request logs (for debugging/admin)
 */
export async function getRequestLogs(
  filter: {
    userId?: string;
    status?: number;
    method?: string;
    path?: string;
    since?: Date;
    limit?: number;
  } = {}
): Promise<RequestLogEntry[]> {
  try {
    const db = await getPrisma();

    const logs = await db.activityLog.findMany({
      where: {
        ...(filter.userId && { userId: filter.userId }),
        ...(filter.since && { createdAt: { gte: filter.since } }),
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 100,
    });

    return logs as unknown as RequestLogEntry[];
  } catch (error) {
    console.error('Failed to retrieve request logs:', error);
    return [];
  }
}

/**
 * Get error logs
 */
export async function getErrorLogs(
  filter: {
    since?: Date;
    userId?: string;
    limit?: number;
  } = {}
): Promise<RequestLogEntry[]> {
  try {
    const db = await getPrisma();

    // Filter ActivityLog for error actions
    const logs = await db.activityLog.findMany({
      where: {
        action: { contains: 'error' },
        ...(filter.userId && { userId: filter.userId }),
        ...(filter.since && { createdAt: { gte: filter.since } }),
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 100,
    });

    return logs as unknown as RequestLogEntry[];
  } catch (error) {
    console.error('Failed to retrieve error logs:', error);
    return [];
  }
}

/**
 * Get request statistics
 */
export async function getRequestStats(since: Date = new Date(Date.now() - 24 * 60 * 60 * 1000)) {
  try {
    const db = await getPrisma();

    const logs = await db.activityLog.findMany({
      where: {
        createdAt: { gte: since },
      },
    });

    const byMethod: Record<string, number> = {};
    const byStatus: Record<number, number> = {};
    const byUserId: Record<string, number> = {};

    logs.forEach((log: any) => {
      byUserId[log.userId] = (byUserId[log.userId] || 0) + 1;
    });

    return {
      totalRequests: logs.length,
      byUserId,
      since,
      timeRange: `${since.toISOString()} to ${new Date().toISOString()}`,
    };
  } catch (error) {
    console.error('Failed to get request stats:', error);
    return null;
  }
}
