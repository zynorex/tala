/**
 * Environment Configuration Validator
 * PHASE 1: Validate all required environment variables are set
 */

import { getLogger } from "@/lib/utils/logger";

const logger = getLogger("EnvValidator");

interface EnvironmentConfig {
  database: {
    name: string;
    required: boolean;
    value: string | undefined;
    validated: boolean;
    message: string;
  };
  nextAuth: {
    name: string;
    required: boolean;
    value: string | undefined;
    validated: boolean;
    message: string;
  };
  blockchain: {
    name: string;
    required: boolean;
    value: string | undefined;
    validated: boolean;
    message: string;
  };
  ipfs: {
    name: string;
    required: boolean;
    value: string | undefined;
    validated: boolean;
    message: string;
  };
}

interface ValidationResult {
  valid: boolean;
  timestamp: string;
  critical: {
    found: number;
    missing: string[];
  };
  required: {
    found: number;
    missing: string[];
  };
  optional: {
    found: number;
    missing: string[];
  };
  configurations: {
    database: EnvironmentConfig["database"][];
    authentication: EnvironmentConfig["nextAuth"][];
    blockchain: EnvironmentConfig["blockchain"][];
    ipfs: EnvironmentConfig["ipfs"][];
  };
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): ValidationResult {
  logger.info("Starting environment validation...");

  const result: ValidationResult = {
    valid: true,
    timestamp: new Date().toISOString(),
    critical: {
      found: 0,
      missing: [],
    },
    required: {
      found: 0,
      missing: [],
    },
    optional: {
      found: 0,
      missing: [],
    },
    configurations: {
      database: [],
      authentication: [],
      blockchain: [],
      ipfs: [],
    },
  };

  // ==================== CRITICAL VARIABLES ====================
  // These must be set for the application to function

  const criticalVars = [
    {
      name: "DATABASE_URL",
      category: "database" as const,
      description: "PostgreSQL connection string",
      pattern: /^postgresql:\/\//i,
    },
    {
      name: "NEXTAUTH_SECRET",
      category: "authentication" as const,
      description: "NextAuth.js secret for session encryption",
      pattern: /.{32,}/,
    },
    {
      name: "NEXTAUTH_URL",
      category: "authentication" as const,
      description: "NextAuth callback URL",
      pattern: /^https?:\/\//i,
    },
    {
      name: "NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS",
      category: "blockchain" as const,
      description: "NilVault contract address on Polygon Amoy",
      pattern: /^0x[a-fA-F0-9]{40}$/,
    },
  ];

  logger.info(`Checking ${criticalVars.length} critical variables...`);

  criticalVars.forEach((varConfig) => {
    const value = process.env[varConfig.name];
    const exists = !!value;

    if (exists) {
      result.critical.found++;
      logger.debug(`✓ ${varConfig.name} is set`);
    } else {
      result.critical.missing.push(varConfig.name);
      result.valid = false;
      logger.error(`✗ ${varConfig.name} is MISSING`);
    }

    const config = {
      name: varConfig.name,
      required: true,
      value: exists ? "[SET]" : "[MISSING]",
      validated: exists && (varConfig.pattern?.test(value) ?? true),
      message: exists
        ? `✓ Configured`
        : `✗ Missing - Required: ${varConfig.description}`,
    };

    result.configurations[varConfig.category].push(config);
  });

  // ==================== REQUIRED VARIABLES ====================
  // These should be set for full functionality

  const requiredVars = [
    {
      name: "PINATA_JWT",
      category: "ipfs" as const,
      description: "Pinata API JWT token for IPFS",
    },
    {
      name: "PINATA_GATEWAY",
      category: "ipfs" as const,
      description: "Pinata gateway URL",
    },
    {
      name: "POLYGON_AMOY_RPC",
      category: "blockchain" as const,
      description: "Polygon Amoy RPC endpoint",
    },
    {
      name: "WALLET_PRIVATE_KEY",
      category: "blockchain" as const,
      description: "Private key for blockchain transactions (dev only)",
    },
  ];

  logger.info(`Checking ${requiredVars.length} required variables...`);

  requiredVars.forEach((varConfig) => {
    const value = process.env[varConfig.name];
    const exists = !!value;

    if (exists) {
      result.required.found++;
      logger.debug(`✓ ${varConfig.name} is set`);
    } else {
      result.required.missing.push(varConfig.name);
      logger.warn(`⚠ ${varConfig.name} is not set - ${varConfig.description}`);
    }

    const config = {
      name: varConfig.name,
      required: true,
      value: exists ? "[SET]" : "[MISSING]",
      validated: exists,
      message: exists
        ? `✓ Configured`
        : `⚠ Missing - Recommended: ${varConfig.description}`,
    };

    result.configurations[varConfig.category].push(config);
  });

  // ==================== OPTIONAL VARIABLES ====================
  // These are nice to have but not required

  const optionalVars = [
    {
      name: "NEXT_PUBLIC_LOG_LEVEL",
      category: "database" as const,
      description: "Logging level (debug, info, warn, error)",
      default: "info",
    },
    {
      name: "NODE_ENV",
      category: "database" as const,
      description: "Node environment (development, production, test)",
      default: process.env.NODE_ENV || "development",
    },
    {
      name: "NEXT_PUBLIC_APP_URL",
      category: "authentication" as const,
      description: "Application base URL",
      default: "http://localhost:3000",
    },
  ];

  logger.info(`Checking ${optionalVars.length} optional variables...`);

  optionalVars.forEach((varConfig) => {
    const value = process.env[varConfig.name] ?? varConfig.default;
    const exists = !!value;

    if (exists) {
      result.optional.found++;
      logger.debug(`✓ ${varConfig.name} is set`);
    } else {
      logger.debug(`○ ${varConfig.name} not set (will use default)`);
    }
  });

  // ==================== VALIDATION SUMMARY ====================

  const summary = {
    critical: `${result.critical.found}/4 critical variables found`,
    required: `${result.required.found}/4 required variables found`,
    optional: `${result.optional.found}/3 optional variables found`,
  };

  logger.info("Environment validation complete", {
    valid: result.valid,
    critical: summary.critical,
    required: summary.required,
  });

  return result;
}

/**
 * Display validation results in console format
 */
export function displayValidationResults(result: ValidationResult): void {
  console.log("\n" + "=".repeat(70));
  console.log("ENVIRONMENT CONFIGURATION VALIDATOR");
  console.log("=".repeat(70) + "\n");

  // Critical variables
  console.log("🔴 CRITICAL VARIABLES (Required for functionality):");
  console.log("-".repeat(70));
  if (result.critical.found === 4) {
    console.log("✅ All 4 critical variables are configured\n");
  } else {
    console.log(
      `⚠️  ${result.critical.found}/4 critical variables found - MISSING:\n`
    );
    result.critical.missing.forEach((varName) => {
      console.log(`  • ${varName} (Required)`);
    });
    console.log("\n✅ Action Required: Set missing critical variables\n");
  }

  // Required variables
  console.log("🟡 REQUIRED VARIABLES (For full functionality):");
  console.log("-".repeat(70));
  if (result.required.found === 4) {
    console.log("✅ All 4 required variables are configured\n");
  } else {
    console.log(
      `⚠️  ${result.required.found}/4 required variables found - MISSING:\n`
    );
    result.required.missing.forEach((varName) => {
      console.log(`  • ${varName} (Recommended)`);
    });
    console.log("\n💡 Tip: These variables enable IPFS and blockchain features\n");
  }

  // Database configuration
  console.log("💾 DATABASE CONFIGURATION:");
  console.log("-".repeat(70));
  result.configurations.database.forEach((config) => {
    console.log(`  ${config.message}`);
    console.log(`    Variable: ${config.name}`);
    console.log(`    Status: ${config.value}\n`);
  });

  // Authentication configuration
  console.log("🔐 AUTHENTICATION CONFIGURATION:");
  console.log("-".repeat(70));
  result.configurations.authentication.forEach((config) => {
    console.log(`  ${config.message}`);
    console.log(`    Variable: ${config.name}`);
    console.log(`    Status: ${config.value}\n`);
  });

  // Blockchain configuration
  console.log("⛓️ BLOCKCHAIN CONFIGURATION:");
  console.log("-".repeat(70));
  result.configurations.blockchain.forEach((config) => {
    console.log(`  ${config.message}`);
    console.log(`    Variable: ${config.name}`);
    console.log(`    Status: ${config.value}\n`);
  });

  // IPFS configuration
  console.log("📁 IPFS CONFIGURATION:");
  console.log("-".repeat(70));
  result.configurations.ipfs.forEach((config) => {
    console.log(`  ${config.message}`);
    console.log(`    Variable: ${config.name}`);
    console.log(`    Status: ${config.value}\n`);
  });

  // Overall status
  console.log("=".repeat(70));
  if (result.valid) {
    console.log("✅ All critical variables are configured - Ready to start");
  } else {
    console.log(
      "⚠️  Some critical variables are missing - Cannot start application"
    );
  }
  console.log("=".repeat(70) + "\n");
}

/**
 * Main validation runner
 */
export async function runValidation(): Promise<boolean> {
  const result = validateEnvironment();
  displayValidationResults(result);

  // Return success if critical variables are all set
  return result.valid;
}

// Run if called directly
if (require.main === module) {
  runValidation()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      logger.error("Validation error", error);
      process.exit(1);
    });
}

export type { ValidationResult, EnvironmentConfig };
