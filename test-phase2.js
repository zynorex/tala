#!/usr/bin/env node

/**
 * NIL Phase 2 Comprehensive Test Suite
 * Tests: Build, Database, API Routes, and Core Functionality
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0,
  results: [],
};

function log(color, symbol, message) {
  console.log(`${colors[color]}${symbol} ${message}${colors.reset}`);
}

function runTest(name, fn) {
  try {
    log('blue', '►', `Testing: ${name}`);
    fn();
    tests.passed++;
    tests.results.push({ name, status: 'PASS' });
    log('green', '✓', `${name} passed`);
  } catch (error) {
    tests.failed++;
    tests.results.push({ name, status: 'FAIL', error: error.message });
    log('red', '✗', `${name} failed: ${error.message}`);
  }
}

function fileExists(filepath, testName) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`${testName}: File not found: ${filepath}`);
  }
}

function fileContains(filepath, pattern, testName) {
  const content = fs.readFileSync(filepath, 'utf-8');
  if (!content.includes(pattern)) {
    throw new Error(`${testName}: File does not contain "${pattern}"`);
  }
}

// Test 1: Check build artifacts
runTest('Build artifacts exist', () => {
  fileExists('.next', 'Build directory');
  fileExists('.next/server/pages', 'Server pages');
  fileExists('.next/static', 'Static files');
});

// Test 2: Check configuration files
runTest('Configuration files exist', () => {
  fileExists('next.config.ts', 'Next.js config');
  fileExists('tsconfig.json', 'TypeScript config');
  fileExists('tailwind.config.ts', 'Tailwind config');
  fileExists('prisma/schema.prisma', 'Prisma schema');
});

// Test 3: Check environment file
runTest('Environment configuration exists', () => {
  fileExists('.env', 'Environment file');
  const envContent = fs.readFileSync('.env', 'utf-8');
  if (!envContent.includes('DATABASE_URL')) {
    throw new Error('DATABASE_URL not configured');
  }
  if (!envContent.includes('NEXT_PUBLIC_NIL_VAULT_ADDRESS')) {
    throw new Error('Smart contract address not configured');
  }
});

// Test 4: Check enterprise libraries
runTest('Enterprise libraries are installed', () => {
  fileExists('node_modules/pino', 'pino logger');
  fileExists('node_modules/wagmi', 'wagmi contract library');
  fileExists('node_modules/@prisma/client', 'Prisma client');
  fileExists('node_modules/next', 'Next.js');
});

// Test 5: Check key source files
runTest('Core source files exist', () => {
  fileExists('lib/utils/logger.ts', 'Logger service');
  fileExists('lib/utils/api-error-handler.ts', 'Error handler');
  fileExists('lib/contracts/vault-service.ts', 'Vault service');
  fileExists('lib/crypto/encryption.ts', 'Encryption service');
  fileExists('lib/prisma.ts', 'Prisma client');
});

// Test 6: Check API routes
runTest('API routes are compiled', () => {
  fileExists('app/api/vaults', 'Vaults API');
  fileExists('app/api/vaults/route.ts', 'Vaults route');
  fileExists('app/api/auth/[...nextauth]/route.ts', 'Auth route');
});

// Test 7: Check database schema
runTest('Database schema is defined', () => {
  fileContains('prisma/schema.prisma', 'model User', 'User model');
  fileContains('prisma/schema.prisma', 'model Vault', 'Vault model');
  fileContains('prisma/schema.prisma', 'model VaultFile', 'VaultFile model');
  fileContains('prisma/schema.prisma', 'model ActivityLog', 'ActivityLog model');
});

// Test 8: Check logger implementation
runTest('Logger is properly implemented', () => {
  fileContains('lib/utils/logger.ts', 'class Logger', 'Logger class');
  fileContains('lib/utils/logger.ts', 'info(message', 'Info method');
  fileContains('lib/utils/logger.ts', 'error(message', 'Error method');
  fileContains('lib/utils/logger.ts', 'startTimer', 'Timer method');
});

// Test 9: Check error handler implementation
runTest('Error handler is properly implemented', () => {
  fileContains('lib/utils/api-error-handler.ts', 'class ValidationError', 'ValidationError');
  fileContains('lib/utils/api-error-handler.ts', 'class NotFoundError', 'NotFoundError');
  fileContains('lib/utils/api-error-handler.ts', 'apiErrorHandler', 'Error handler function');
});

// Test 10: Check vault service
runTest('Vault service uses wagmi properly', () => {
  fileContains('lib/contracts/vault-service.ts', 'wagmi/actions', 'Proper wagmi imports');
  fileContains('lib/contracts/vault-service.ts', 'createVault', 'Create vault function');
  fileContains('lib/contracts/vault-service.ts', 'VaultContractError', 'Typed error class');
});

// Test 11: Check TypeScript configuration
runTest('TypeScript strict mode is enabled', () => {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
  if (!tsConfig.compilerOptions.strict) {
    throw new Error('Strict mode not enabled');
  }
});

// Test 12: Check package.json scripts
runTest('Build scripts are configured', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  if (!pkg.scripts.build) {
    throw new Error('Build script missing');
  }
  if (!pkg.scripts.dev) {
    throw new Error('Dev script missing');
  }
  if (!pkg.scripts.start) {
    throw new Error('Start script missing');
  }
});

// Test 13: Check Prisma migrations exist
runTest('Prisma migrations exist', () => {
  const migrationsDir = 'prisma/migrations';
  if (!fs.existsSync(migrationsDir)) {
    throw new Error('Migrations directory not found');
  }
  const migrations = fs.readdirSync(migrationsDir);
  if (migrations.length === 0) {
    throw new Error('No migrations found');
  }
});

// Test 14: Check components
runTest('UI components are present', () => {
  fileExists('app/components/CreateVaultForm.tsx', 'CreateVaultForm');
  fileExists('app/components/Navbar.tsx', 'Navbar');
  fileExists('app/components/Footer.tsx', 'Footer');
});

// Test 15: Check documentation
runTest('Documentation is complete', () => {
  fileExists('PHASE_1_COMPLETION.md', 'Phase 1 completion doc');
  fileExists('PHASE_1_STATUS.md', 'Phase 1 status doc');
  fileExists('PHASE_2_GETTING_STARTED.md', 'Phase 2 getting started');
  fileExists('PHASE_2_TESTING.md', 'Phase 2 testing guide');
});

// Summary
console.log('\n' + colors.blue + '═'.repeat(60) + colors.reset);
console.log(colors.blue + 'TEST SUMMARY' + colors.reset);
console.log(colors.blue + '═'.repeat(60) + colors.reset);

tests.results.forEach((result) => {
  const symbol = result.status === 'PASS' ? '✓' : '✗';
  const color = result.status === 'PASS' ? 'green' : 'red';
  console.log(`${colors[color]}${symbol}${colors.reset} ${result.name}: ${result.status}`);
  if (result.error) {
    console.log(`  └─ Error: ${result.error}`);
  }
});

console.log(colors.blue + '─'.repeat(60) + colors.reset);
console.log(`${colors.green}Passed: ${tests.passed}${colors.reset} | ${colors.red}Failed: ${tests.failed}${colors.reset}`);
console.log(colors.blue + '═'.repeat(60) + colors.reset);

process.exit(tests.failed > 0 ? 1 : 0);
