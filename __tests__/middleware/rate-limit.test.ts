/**
 * Rate Limiting Middleware Tests
 */

import { rateLimit, getRateLimitStatus, getActiveRateLimits } from '@/lib/middleware/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    getActiveRateLimits().clear();
  });

  describe('rateLimit', () => {
    it('should allow requests within limit', async () => {
      const clientIp = '192.168.1.1';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/vaults/123' },
      } as unknown as NextRequest;

      const handler = async () => new NextResponse('OK', { status: 200 });

      for (let i = 0; i < 5; i++) {
        const result = await rateLimit(req, handler, 'default');
        expect(result.status).not.toBe(429);
      }
    });

    it('should block requests exceeding limit', async () => {
      const clientIp = '192.168.1.2';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/vaults/123' },
      } as unknown as NextRequest;

      const handler = async () => new NextResponse('OK', { status: 200 });

      // Make requests beyond default limit (100 per minute)
      for (let i = 0; i < 101; i++) {
        await rateLimit(req, handler, 'default');
      }

      // The 101st request should be blocked after violation threshold
      const result = await rateLimit(req, handler, 'default');
      expect(result.status).toBe(429);
    });

    it('should apply auth-specific rate limits', async () => {
      const clientIp = '192.168.1.3';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/auth/register' },
      } as unknown as NextRequest;

      const handler = async () => new NextResponse('OK', { status: 200 });

      // Auth endpoints have 10 req/min limit
      for (let i = 0; i < 10; i++) {
        const result = await rateLimit(req, handler, 'auth');
        expect(result.status).not.toBe(429);
      }

      // 11th request should trigger rate limit
      const result = await rateLimit(req, handler, 'auth');
      expect(result.status).toBe(429);
    });

    it('should apply upload-specific rate limits', async () => {
      const clientIp = '192.168.1.4';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/vaults/123/files' },
      } as unknown as NextRequest;

      const handler = async () => new NextResponse('OK', { status: 200 });

      // Upload endpoints have 5 req/min limit
      for (let i = 0; i < 5; i++) {
        const result = await rateLimit(req, handler, 'upload');
        expect(result.status).not.toBe(429);
      }

      // 6th request should trigger rate limit
      const result = await rateLimit(req, handler, 'upload');
      expect(result.status).toBe(429);
    });

    it('should return Retry-After header', async () => {
      const clientIp = '192.168.1.5';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/auth/register' },
      } as unknown as NextRequest;

      const handler = async () => new NextResponse('OK', { status: 200 });

      // Exceed auth limit
      for (let i = 0; i < 10; i++) {
        await rateLimit(req, handler, 'auth');
      }

      const result = await rateLimit(req, handler, 'auth');
      expect(result.headers.get('Retry-After')).toBeTruthy();
      expect(parseInt(result.headers.get('Retry-After') || '0')).toBeGreaterThan(0);
    });

    it('should separate limits by IP and endpoint', async () => {
      const handler = async () => new NextResponse('OK', { status: 200 });

      const req1 = {
        headers: new Map([['x-forwarded-for', '192.168.1.10']]),
        nextUrl: { pathname: '/api/vaults/123' },
      } as unknown as NextRequest;

      const req2 = {
        headers: new Map([['x-forwarded-for', '192.168.1.11']]),
        nextUrl: { pathname: '/api/vaults/123' },
      } as unknown as NextRequest;

      // Both should be independent
      for (let i = 0; i < 10; i++) {
        const result1 = await rateLimit(req1, handler, 'default');
        const result2 = await rateLimit(req2, handler, 'default');
        expect(result1.status).not.toBe(429);
        expect(result2.status).not.toBe(429);
      }
    });
  });

  describe('getRateLimitStatus', () => {
    it('should return remaining requests', async () => {
      const clientIp = '192.168.1.20';
      const req = {
        headers: new Map([['x-forwarded-for', clientIp]]),
        nextUrl: { pathname: '/api/auth/register' },
      } as unknown as NextRequest;

      const status = getRateLimitStatus(req, 'auth');
      expect(status.limit).toBe(10);
      expect(status.remaining).toBeLessThanOrEqual(10);
      expect(status.reset).toBeTruthy();
    });
  });

  describe('getActiveRateLimits', () => {
    it('should return active rate limits', async () => {
      const limits = getActiveRateLimits();
      expect(limits).toBeInstanceOf(Map);
    });
  });
});
