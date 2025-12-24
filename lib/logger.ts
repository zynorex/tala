/**
 * TALA Logger Module - Enterprise Grade
 * Centralized logging with correlation IDs, activity tracking, and structured logging
 * 
 * Features:
 * - Correlation ID tracking across requests
 * - Activity logging to database
 * - Structured logging with metadata
 * - Request tracing
 * - Performance metrics
 */

import { PrismaClient } from './generated/prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogMetadata {
  userId?: string;
  vaultId?: string;
  correlationId: string;
  timestamp: Date;
  duration?: number;
  statusCode?: number;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  metadata: LogMetadata;
}

// Request-scoped correlation ID
let currentCorrelationId: string | null = null;

/**
 * Generate or retrieve correlation ID for request tracking
 */
export function getCorrelationId(): string {
  if (!currentCorrelationId) {
    currentCorrelationId = generateCorrelationId();
  }
  return currentCorrelationId;
}

/**
 * Set correlation ID for request
 */
export function setCorrelationId(id: string): void {
  currentCorrelationId = id;
}

/**
 * Generate a unique correlation ID
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log with context and correlation ID
 */
export function log(
  level: LogLevel,
  message: string,
  metadata?: Partial<LogMetadata>
): LogEntry {
  const correlationId = getCorrelationId();
  const timestamp = new Date();

  const logMetadata: LogMetadata = {
    correlationId,
    timestamp,
    ...metadata,
  };

  const entry: LogEntry = {
    level,
    message,
    metadata: logMetadata,
  };

  // Console output with formatting
  const timestamp_str = timestamp.toISOString();
  const prefix = `[${timestamp_str}] [${level}] [${correlationId}]`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(`${prefix} ${message}`, metadata);
      break;
    case LogLevel.INFO:
      console.info(`${prefix} ${message}`, metadata);
      break;
    case LogLevel.WARN:
      console.warn(`${prefix} ${message}`, metadata);
      break;
    case LogLevel.ERROR:
      console.error(`${prefix} ${message}`, metadata);
      break;
    case LogLevel.CRITICAL:
      console.error(`${prefix} ⚠️  CRITICAL: ${message}`, metadata);
      break;
  }

  return entry;
}

/**
 * Log activity to database
 */
export async function logActivity(
  vaultId: string,
  userId: string,
  action: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const correlationId = getCorrelationId();

    await prisma.activityLog.create({
      data: {
        vaultId,
        userId,
        action,
        details: details || {},
        correlationId,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    log(LogLevel.ERROR, 'Failed to log activity', {
      vaultId,
      userId,
      action,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Debug level logging
 */
export function debug(message: string, metadata?: Partial<LogMetadata>): LogEntry {
  return log(LogLevel.DEBUG, message, metadata);
}

/**
 * Info level logging
 */
export function info(message: string, metadata?: Partial<LogMetadata>): LogEntry {
  return log(LogLevel.INFO, message, metadata);
}

/**
 * Warning level logging
 */
export function warn(message: string, metadata?: Partial<LogMetadata>): LogEntry {
  return log(LogLevel.WARN, message, metadata);
}

/**
 * Error level logging
 */
export function error(message: string, metadata?: Partial<LogMetadata>): LogEntry {
  return log(LogLevel.ERROR, message, metadata);
}

/**
 * Critical level logging
 */
export function critical(message: string, metadata?: Partial<LogMetadata>): LogEntry {
  return log(LogLevel.CRITICAL, message, metadata);
}

/**
 * Start request timer for performance tracking
 */
export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

/**
 * Log API request
 */
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  metadata?: Partial<LogMetadata>
): void {
  log(LogLevel.INFO, `${method} ${path}`, {
    statusCode,
    duration,
    ...metadata,
  });
}

/**
 * Clean up logger resources
 */
export async function cleanup(): Promise<void> {
  await prisma.$disconnect();
}

export default {
  getCorrelationId,
  setCorrelationId,
  log,
  logActivity,
  debug,
  info,
  warn,
  error,
  critical,
  startTimer,
  logRequest,
  cleanup,
  LogLevel,
};
