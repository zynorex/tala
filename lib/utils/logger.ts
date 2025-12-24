/**
 * Enterprise-Grade Logging Service
 * Provides structured logging with levels, timestamps, and context
 * 
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - Structured logging with context
 * - Performance metrics
 * - Error tracking
 * - Request correlation IDs
 */

import { pino } from 'pino';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Creates a logger instance with configured transport
 */
function createLogger() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const pinoLogger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    transport: !isProduction ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    } : undefined,
  });

  return pinoLogger;
}

const pinoInstance = createLogger();

/**
 * Enterprise Logger Class
 * Provides typed logging methods with context and error tracking
 */
export class Logger {
  private context: LogContext = {};
  private startTime: Record<string, number> = {};

  constructor(private module: string) {
    this.context = { module };
  }

  /**
   * Set additional context for all subsequent logs
   */
  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  /**
   * Add a single context item
   */
  addContext(key: string, value: any) {
    this.context[key] = value;
  }

  /**
   * Debug level logging
   */
  debug(message: string, extra?: LogContext) {
    pinoInstance.debug({ ...this.context, ...extra }, message);
  }

  /**
   * Info level logging
   */
  info(message: string, extra?: LogContext) {
    pinoInstance.info({ ...this.context, ...extra }, message);
  }

  /**
   * Warning level logging
   */
  warn(message: string, extra?: LogContext) {
    pinoInstance.warn({ ...this.context, ...extra }, message);
  }

  /**
   * Error level logging with full error details
   */
  error(message: string, extra?: LogContext | Error) {
    const errorContext = extra instanceof Error
      ? {
          error: extra.message,
          stack: extra.stack,
          name: extra.name,
        }
      : extra;

    pinoInstance.error({ ...this.context, ...errorContext }, message);
  }

  /**
   * Start timing a named operation
   */
  startTimer(operationName: string) {
    this.startTime[operationName] = Date.now();
    this.debug(`Started: ${operationName}`);
  }

  /**
   * End timing and log duration
   */
  endTimer(operationName: string, extra?: LogContext) {
    if (!this.startTime[operationName]) {
      this.warn(`Timer "${operationName}" was not started`);
      return;
    }

    const duration = Date.now() - this.startTime[operationName];
    delete this.startTime[operationName];

    this.info(`Completed: ${operationName}`, {
      ...extra,
      durationMs: duration,
    });
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const child = new Logger(this.module);
    child.setContext({ ...this.context, ...context });
    return child;
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger('TALA');

/**
 * Create a logger for a specific module
 */
export function getLogger(moduleName: string): Logger {
  return new Logger(moduleName);
}

/**
 * Development-friendly console-based logger
 */
export const consoleLogger = {
  debug: (msg: string, data?: any) => console.debug(`[DEBUG] ${msg}`, data),
  info: (msg: string, data?: any) => console.info(`[INFO] ${msg}`, data),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
  error: (msg: string, data?: any) => console.error(`[ERROR] ${msg}`, data),
};
