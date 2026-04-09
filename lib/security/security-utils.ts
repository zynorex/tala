/**
 * Enterprise-Grade Security Utilities
 * Implements OWASP-recommended security practices
 * 
 * Reference: OWASP Top 10 (2021)
 * - A01: Broken Access Control
 * - A02: Cryptographic Failures
 * - A03: Injection
 * - A04: Insecure Design
 * - A05: Security Misconfiguration
 * - A06: Vulnerable and Outdated Components
 * - A07: Identification and Authentication Failures
 * - A08: Software and Data Integrity Failures
 * - A09: Logging and Monitoring Failures
 * - A10: Server-Side Request Forgery (SSRF)
 */

import crypto from 'crypto';

/**
 * CSRF Token Management
 */
export class CSRFTokenManager {
  private static tokenMap = new Map<string, { token: string; createdAt: number }>();
  private static readonly TOKEN_EXPIRY_MS = 3600000; // 1 hour

  /**
   * Generate a new CSRF token
   */
  static generateToken(sessionId: string): string {
    // Clean up expired tokens
    this.cleanupExpiredTokens();

    const token = crypto.randomBytes(32).toString('hex');
    this.tokenMap.set(sessionId, {
      token,
      createdAt: Date.now(),
    });

    return token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(sessionId: string, token: string): boolean {
    const entry = this.tokenMap.get(sessionId);

    if (!entry) {
      return false;
    }

    // Check expiration
    if (Date.now() - entry.createdAt > this.TOKEN_EXPIRY_MS) {
      this.tokenMap.delete(sessionId);
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(entry.token),
      Buffer.from(token)
    );
  }

  /**
   * Clean up expired tokens
   */
  private static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [key, entry] of this.tokenMap.entries()) {
      if (now - entry.createdAt > this.TOKEN_EXPIRY_MS) {
        this.tokenMap.delete(key);
      }
    }
  }

  /**
   * Remove token (after logout)
   */
  static removeToken(sessionId: string): void {
    this.tokenMap.delete(sessionId);
  }
}

/**
 * Input Validation and Sanitization
 */
export class InputSanitizer {
  /**
   * Sanitize string input
   */
  static sanitizeString(input: string, options?: { maxLength?: number; allowHTML?: boolean }): string {
    const { maxLength = 1000, allowHTML = false } = options || {};

    if (typeof input !== 'string') {
      return '';
    }

    let sanitized = input.trim().substring(0, maxLength);

    if (!allowHTML) {
      // Remove HTML/XML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
      
      // Remove JavaScript protocol
      sanitized = sanitized.replace(/javascript:/gi, '');
      
      // Remove event handlers
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    return sanitized;
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    const sanitized = email.toLowerCase().trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }

    return sanitized;
  }

  /**
   * Sanitize URL
   */
  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }

      return parsed.toString();
    } catch {
      throw new Error('Invalid URL');
    }
  }

  /**
   * Detect SQL injection patterns
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
      /(-{2}|\/\*|\*\/|;)/g, // SQL comments and statement terminators
      /(\bOR\b.*?=|1\s*=\s*1)/gi, // OR 1=1 pattern
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect XSS patterns
   */
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}

/**
 * Encryption Utilities (OWASP A02: Cryptographic Failures)
 */
export class EncryptionUtils {
  /**
   * Hash password with bcrypt-like approach using PBKDF2
   * Note: For production, use bcrypt or argon2
   */
  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const useSalt = salt || crypto.randomBytes(16).toString('hex');
    
    const hash = crypto
      .pbkdf2Sync(password, useSalt, 100000, 64, 'sha256')
      .toString('hex');

    return { hash, salt: useSalt };
  }

  /**
   * Verify password
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt);
    
    return crypto.timingSafeEqual(
      Buffer.from(computedHash),
      Buffer.from(hash)
    );
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt sensitive data (AES-256-GCM)
   */
  static encryptData(data: string, encryptionKey: string): { encrypted: string; iv: string; authTag: string } {
    const key = crypto
      .createHash('sha256')
      .update(String(encryptionKey))
      .digest();

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypt sensitive data
   */
  static decryptData(
    encrypted: string,
    encryptionKey: string,
    iv: string,
    authTag: string
  ): string {
    const key = crypto
      .createHash('sha256')
      .update(String(encryptionKey))
      .digest();

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

/**
 * Rate Limiting Utilities
 */
export class RateLimiter {
  private static stores = new Map<string, Map<string, { count: number; resetTime: number }>>();

  /**
   * Check if request is allowed
   */
  static isAllowed(
    key: string,
    limit: number = 100,
    windowMs: number = 60000
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const store = this.getOrCreateStore(key);
    const now = Date.now();
    const entry = store.get(key) || { count: 0, resetTime: now + windowMs };

    // Reset window if expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }

    const allowed = entry.count < limit;
    entry.count++;

    store.set(key, entry);

    return {
      allowed,
      remaining: Math.max(0, limit - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Get or create rate limit store
   */
  private static getOrCreateStore(
    name: string
  ): Map<string, { count: number; resetTime: number }> {
    if (!this.stores.has(name)) {
      this.stores.set(name, new Map());
    }
    return this.stores.get(name)!;
  }

  /**
   * Reset rate limit for key
   */
  static reset(key: string, storeName: string = 'default'): void {
    const store = this.getOrCreateStore(storeName);
    store.delete(key);
  }
}

/**
 * Security Headers Builder
 */
export class SecurityHeadersBuilder {
  private headers: Record<string, string> = {};

  /**
   * Add CSP header
   */
  addCSP(directives: Record<string, string | string[]>): this {
    const cspValue = Object.entries(directives)
      .map(([key, value]) => {
        const values = Array.isArray(value) ? value.join(' ') : value;
        return `${key} ${values}`;
      })
      .join('; ');

    this.headers['Content-Security-Policy'] = cspValue;
    return this;
  }

  /**
   * Add CORS headers
   */
  addCORS(origin: string | string[], methods: string[] = ['GET', 'POST', 'PUT', 'DELETE']): this {
    const allowedOrigins = Array.isArray(origin) ? origin.join(', ') : origin;
    
    this.headers['Access-Control-Allow-Origin'] = allowedOrigins;
    this.headers['Access-Control-Allow-Methods'] = methods.join(', ');
    this.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token';
    this.headers['Access-Control-Allow-Credentials'] = 'true';
    this.headers['Access-Control-Max-Age'] = '3600';
    
    return this;
  }

  /**
   * Add HSTS header
   */
  addHSTS(maxAge: number = 31536000, includeSubDomains: boolean = true): this {
    let hsts = `max-age=${maxAge}`;
    if (includeSubDomains) hsts += '; includeSubDomains';
    hsts += '; preload';
    
    this.headers['Strict-Transport-Security'] = hsts;
    return this;
  }

  /**
   * Add clickjacking protection
   */
  addClickjackingProtection(mode: 'DENY' | 'SAMEORIGIN' = 'SAMEORIGIN'): this {
    this.headers['X-Frame-Options'] = mode;
    return this;
  }

  /**
   * Add MIME type protection
   */
  addMIMEProtection(): this {
    this.headers['X-Content-Type-Options'] = 'nosniff';
    return this;
  }

  /**
   * Get all headers
   */
  getHeaders(): Record<string, string> {
    return { ...this.headers };
  }
}

/**
 * Audit Logging
 */
export class AuditLogger {
  private static logs: Array<{
    timestamp: string;
    level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    action: string;
    user?: string;
    ip?: string;
    details?: Record<string, unknown>;
  }> = [];

  /**
   * Log security event
   */
  static logEvent(
    action: string,
    level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'INFO',
    user?: string,
    ip?: string,
    details?: Record<string, unknown>
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      action,
      user,
      ip,
      details,
    };

    this.logs.push(logEntry);

    // Also log to console in production
    if (process.env.NODE_ENV === 'production') {
      console.log(
        `[${level}] ${action}${user ? ` - User: ${user}` : ''}${ip ? ` - IP: ${ip}` : ''}`
      );
    }
  }

  /**
   * Get audit logs
   */
  static getLogs(
    filter?: { level?: string; action?: string; hours?: number }
  ): typeof AuditLogger.logs {
    if (!filter) return [...this.logs];

    const cutoffTime = filter.hours
      ? new Date(Date.now() - filter.hours * 3600000).toISOString()
      : null;

    return this.logs.filter(log => {
      if (filter.level && log.level !== filter.level) return false;
      if (filter.action && !log.action.includes(filter.action)) return false;
      if (cutoffTime && log.timestamp < cutoffTime) return false;
      return true;
    });
  }

  /**
   * Clear old logs
   */
  static clearOldLogs(olderThanHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - olderThanHours * 3600000).toISOString();
    this.logs = this.logs.filter(log => log.timestamp >= cutoffTime);
  }
}
