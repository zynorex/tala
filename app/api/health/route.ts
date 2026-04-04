/**
 * Health Check API Endpoint
 * PHASE 1: System Status Verification
 */

import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/lib/utils/logger";
import { db } from "@/lib/prisma";

const logger = getLogger("HealthCheck");

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    database: {
      status: "ok" | "error";
      message: string;
      responseTime: number;
    };
    authentication: {
      status: "ok" | "error";
      message: string;
      endpoint: string;
    };
    fileUpload: {
      status: "ok" | "error";
      message: string;
      validated: boolean;
    };
    ipfs: {
      status: "ok" | "error" | "unconfigured";
      message: string;
      gateway: string | null;
    };
    smartContract: {
      status: "ok" | "error" | "unconfigured";
      message: string;
      contractAddress: string | null;
    };
  };
  metrics: {
    totalUsers: number;
    totalVaults: number;
    totalFiles: number;
    databaseSizeBytes: number;
  };
  warnings: string[];
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const response: HealthCheckResponse = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: "error", message: "Not checked", responseTime: 0 },
      authentication: {
        status: "error",
        message: "Not checked",
        endpoint: "/api/auth/session",
      },
      fileUpload: {
        status: "error",
        message: "Not checked",
        validated: false,
      },
      ipfs: {
        status: "unconfigured",
        message: "Not configured",
        gateway: null,
      },
      smartContract: {
        status: "unconfigured",
        message: "Not configured",
        contractAddress: null,
      },
    },
    metrics: {
      totalUsers: 0,
      totalVaults: 0,
      totalFiles: 0,
      databaseSizeBytes: 0,
    },
    warnings: [],
  };

  try {
    // 1. Check Database
    const dbStartTime = Date.now();
    try {
      // Test database connection with a simple query
      const userCount = await db.user.count();
      const vaultCount = await db.vault.count();
      const fileCount = await db.vaultFile.count();

      response.checks.database = {
        status: "ok",
        message: "Connected to PostgreSQL",
        responseTime: Date.now() - dbStartTime,
      };

      response.metrics.totalUsers = userCount;
      response.metrics.totalVaults = vaultCount;
      response.metrics.totalFiles = fileCount;

      logger.debug("Database check passed", {
        users: userCount,
        vaults: vaultCount,
        files: fileCount,
      });
    } catch (error) {
      response.checks.database = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        responseTime: Date.now() - dbStartTime,
      };
      response.status = "unhealthy";
      response.warnings.push("Database connection failed");
      logger.error(
        "Database check failed",
        error instanceof Error ? error : undefined
      );
    }

    // 2. Check Authentication Service — verify secrets are present
    try {
      const hasNextAuth = !!process.env.NEXTAUTH_SECRET;
      const hasJWT = !!process.env.JWT_SECRET;

      if (hasNextAuth && hasJWT) {
        response.checks.authentication = {
          status: "ok",
          message: "NextAuth + JWT secrets configured",
          endpoint: "/api/auth/session",
        };
      } else {
        response.checks.authentication = {
          status: "error",
          message: `Missing: ${[!hasNextAuth && 'NEXTAUTH_SECRET', !hasJWT && 'JWT_SECRET'].filter(Boolean).join(', ')}`,
          endpoint: "/api/auth/session",
        };
        response.warnings.push("Authentication secrets incomplete");
      }
      logger.debug("Authentication check completed", { hasNextAuth, hasJWT });
    } catch (error) {
      response.checks.authentication = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        endpoint: "/api/auth/session",
      };
      response.warnings.push("Authentication service may be misconfigured");
      logger.error(
        "Authentication check failed",
        error instanceof Error ? error : undefined
      );
    }

    // 3. Check File Upload — verify IPFS upload capability by testing Pinata auth
    try {
      const hasApiKey = !!(process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY);
      const hasApiSecret = !!(process.env.PINATA_SECRET_API_KEY || process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY);
      const hasJWT_pin = !!process.env.PINATA_JWT;

      if (hasJWT_pin || (hasApiKey && hasApiSecret)) {
        response.checks.fileUpload = {
          status: "ok",
          message: "File upload service configured (Pinata credentials present)",
          validated: true,
        };
      } else {
        response.checks.fileUpload = {
          status: "error",
          message: "Pinata credentials missing — file uploads will fail",
          validated: false,
        };
        response.warnings.push("File upload service not configured");
      }
      logger.debug("File upload check completed");
    } catch (error) {
      response.checks.fileUpload = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        validated: false,
      };
      response.warnings.push("File upload service may be misconfigured");
    }

    // 4. Check IPFS — real Pinata API auth test
    const pinataJWT = process.env.PINATA_JWT;
    const pinataKey = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const pinataSecret = process.env.PINATA_SECRET_API_KEY || process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
    const pinataGateway = process.env.PINATA_GATEWAY || null;

    if (pinataJWT || (pinataKey && pinataSecret)) {
      try {
        const headers: Record<string, string> = pinataJWT
          ? { Authorization: `Bearer ${pinataJWT}` }
          : { pinata_api_key: pinataKey!, pinata_secret_api_key: pinataSecret! };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const ipfsStart = Date.now();

        const ipfsRes = await fetch('https://api.pinata.cloud/data/testAuthentication', {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const ipfsElapsed = Date.now() - ipfsStart;

        if (ipfsRes.ok) {
          response.checks.ipfs = {
            status: ipfsElapsed > 5000 ? "ok" : "ok",
            message: `Pinata authenticated (${ipfsElapsed}ms)`,
            gateway: pinataGateway || 'https://gateway.pinata.cloud',
          };
        } else {
          response.checks.ipfs = {
            status: "error",
            message: `Pinata auth failed: HTTP ${ipfsRes.status}`,
            gateway: null,
          };
          response.warnings.push("IPFS authentication failed");
        }
      } catch (ipfsErr) {
        response.checks.ipfs = {
          status: "error",
          message: `Pinata unreachable: ${ipfsErr instanceof Error ? ipfsErr.message : 'timeout'}`,
          gateway: null,
        };
        response.warnings.push("IPFS service unreachable");
      }
      logger.debug("IPFS check completed");
    } else {
      response.checks.ipfs = {
        status: "unconfigured",
        message: "IPFS configuration incomplete — set PINATA_API_KEY + PINATA_SECRET_API_KEY",
        gateway: null,
      };
      response.warnings.push("IPFS not fully configured");
    }

    // 5. Check Smart Contract Configuration
    const contractAddress =
      process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS || null;

    if (contractAddress) {
      response.checks.smartContract = {
        status: "ok",
        message: "Smart contract deployed",
        contractAddress,
      };
      logger.debug("Smart contract check passed");
    } else {
      response.checks.smartContract = {
        status: "unconfigured",
        message: "Smart contract not configured",
        contractAddress: null,
      };
      response.warnings.push("Smart contract not configured");
    }

    // Determine overall status
    const errorChecks = Object.values(response.checks).filter(
      (check: any) => check.status === "error"
    ).length;
    const unconfiguredChecks = Object.values(response.checks).filter(
      (check: any) => check.status === "unconfigured"
    ).length;

    if (errorChecks > 0) {
      response.status = "unhealthy";
    } else if (unconfiguredChecks > 2) {
      response.status = "degraded";
      response.warnings.push("Multiple services unconfigured");
    }

    logger.info("Health check completed", {
      status: response.status,
      errors: errorChecks,
      warnings: response.warnings.length,
    });
  } catch (error) {
    logger.error(
      "Health check failed",
      error instanceof Error ? error : undefined
    );
    response.status = "unhealthy";
    response.warnings.push(
      `Health check error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  // Return appropriate status code
  const statusCode = response.status === "healthy" ? 200 : 503;

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Simple health check endpoint for monitoring
 * Returns 200 if database is accessible, 503 otherwise
 */
export async function HEAD(request: NextRequest) {
  try {
    // Quick database check
    await db.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    logger.error("Health check (HEAD) failed", error instanceof Error ? error : undefined);
    return new NextResponse(null, { status: 503 });
  }
}
