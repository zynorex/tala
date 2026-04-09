/**
 * Status API — Enterprise-Grade System Status
 * Performs real health checks against database, IPFS, blockchain RPC, and auth.
 * Every metric comes from a live probe — no fabricated data.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceCheck {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  description: string;
  responseTime: number;
  lastCheckedAt: string;
}

interface StatusResponse {
  timestamp: string;
  overallStatus: 'operational' | 'degraded' | 'offline';
  services: ServiceCheck[];
  metrics: {
    totalUsers: number;
    totalVaults: number;
    totalFiles: number;
  };
  warnings: string[];
}

// ─── Probe helpers ────────────────────────────────────────────────────────────

async function probeDatabase(): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    await db.user.count();
    return {
      name: 'Database',
      status: 'operational',
      description: 'PostgreSQL via Prisma Accelerate',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  } catch {
    return {
      name: 'Database',
      status: 'offline',
      description: 'PostgreSQL connection failed',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

async function probeIPFS(): Promise<ServiceCheck> {
  const start = Date.now();
  const pinataJWT = process.env.PINATA_JWT;
  const pinataKey = process.env.PINATA_API_KEY;
  const pinataSecret = process.env.PINATA_SECRET_API_KEY;

  if (!pinataJWT && !(pinataKey && pinataSecret)) {
    return {
      name: 'IPFS Storage',
      status: 'offline',
      description: 'Pinata credentials not configured',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  try {
    const headers: Record<string, string> = pinataJWT
      ? { Authorization: `Bearer ${pinataJWT}` }
      : { pinata_api_key: pinataKey!, pinata_secret_api_key: pinataSecret! };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const elapsed = Date.now() - start;

    if (res.ok) {
      return {
        name: 'IPFS Storage',
        status: elapsed > 5000 ? 'degraded' : 'operational',
        description: 'Pinata IPFS gateway authenticated',
        responseTime: elapsed,
        lastCheckedAt: new Date().toISOString(),
      };
    }

    return {
      name: 'IPFS Storage',
      status: 'degraded',
      description: `Pinata returned HTTP ${res.status}`,
      responseTime: elapsed,
      lastCheckedAt: new Date().toISOString(),
    };
  } catch {
    return {
      name: 'IPFS Storage',
      status: 'offline',
      description: 'Pinata API unreachable',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

async function probeBlockchain(): Promise<ServiceCheck> {
  const start = Date.now();
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || process.env.POLYGON_RPC_URL;

  if (!rpcUrl) {
    return {
      name: 'Blockchain RPC',
      status: 'offline',
      description: 'RPC URL not configured',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const elapsed = Date.now() - start;

    if (res.ok) {
      const body = await res.json();
      if (body.result) {
        return {
          name: 'Blockchain RPC',
          status: elapsed > 3000 ? 'degraded' : 'operational',
          description: `Latest block: ${parseInt(body.result, 16)}`,
          responseTime: elapsed,
          lastCheckedAt: new Date().toISOString(),
        };
      }
    }

    return {
      name: 'Blockchain RPC',
      status: 'degraded',
      description: `RPC returned HTTP ${res.status}`,
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  } catch {
    return {
      name: 'Blockchain RPC',
      status: 'offline',
      description: 'Blockchain RPC node unreachable',
      responseTime: Date.now() - start,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

function probeAuth(): ServiceCheck {
  const start = Date.now();
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  const hasJWT = !!process.env.JWT_SECRET;

  return {
    name: 'Authentication',
    status: hasSecret && hasJWT ? 'operational' : 'degraded',
    description: hasSecret && hasJWT
      ? 'NextAuth + JWT configured'
      : 'Missing auth secrets — check NEXTAUTH_SECRET / JWT_SECRET',
    responseTime: Date.now() - start,
    lastCheckedAt: new Date().toISOString(),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const now = new Date();

    // Run probes in parallel for minimal latency
    const [dbCheck, ipfsCheck, blockchainCheck] = await Promise.all([
      probeDatabase(),
      probeIPFS(),
      probeBlockchain(),
    ]);
    const authCheck = probeAuth();

    const services: ServiceCheck[] = [dbCheck, ipfsCheck, blockchainCheck, authCheck];

    // Gather real metrics (only if DB is up)
    let metrics = { totalUsers: 0, totalVaults: 0, totalFiles: 0 };
    if (dbCheck.status === 'operational') {
      try {
        const [totalUsers, totalVaults, totalFiles] = await Promise.all([
          db.user.count(),
          db.vault.count(),
          db.vaultFile.count(),
        ]);
        metrics = { totalUsers, totalVaults, totalFiles };
      } catch {
        // metrics stay at 0 — already flagged by dbCheck
      }
    }

    // Determine overall status
    const warnings: string[] = [];
    services.forEach((s) => {
      if (s.status === 'offline') warnings.push(`${s.name} is offline`);
      else if (s.status === 'degraded') warnings.push(`${s.name} is degraded`);
    });

    const overallStatus: StatusResponse['overallStatus'] = services.some(
      (s) => s.status === 'offline',
    )
      ? 'offline'
      : services.some((s) => s.status === 'degraded')
        ? 'degraded'
        : 'operational';

    const response: StatusResponse = {
      timestamp: now.toISOString(),
      overallStatus,
      services,
      metrics,
      warnings,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: 'Status check failed',
        details: error instanceof Error ? error.message : 'Unknown',
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
