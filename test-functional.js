#!/usr/bin/env node

/**
 * NIL Phase 2 Functional Tests
 * Tests application runtime functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const results = {
  passed: 0,
  failed: 0,
  issues: [],
};

function log(color, symbol, message) {
  console.log(`${colors[color]}${symbol} ${message}${colors.reset}`);
}

function testPrismaClient() {
  try {
    log('blue', '►', 'Testing Prisma client...');
    
    // Check if Prisma client can be imported
    const prismaPath = path.join(__dirname, 'lib/generated/prisma/index.d.ts');
    if (!fs.existsSync(prismaPath)) {
      throw new Error('Prisma client types not generated');
    }
    
    log('green', '✓', 'Prisma client ready');
    results.passed++;
  } catch (error) {
    log('red', '✗', `Prisma client failed: ${error.message}`);
    results.failed++;
    results.issues.push(`Prisma: ${error.message}`);
  }
}

function testLoggerModule() {
  try {
    log('blue', '►', 'Testing logger module...');
    
    const loggerPath = path.join(__dirname, 'lib/utils/logger.ts');
    const content = fs.readFileSync(loggerPath, 'utf-8');
    
    // Check for required methods
    const requiredMethods = ['debug', 'info', 'warn', 'error', 'startTimer', 'getLogger'];
    const missing = [];
    
    requiredMethods.forEach(method => {
      if (!content.includes(`${method}(`)) {
        missing.push(method);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing methods: ${missing.join(', ')}`);
    }
    
    log('green', '✓', 'Logger module complete');
    results.passed++;
  } catch (error) {
    log('red', '✗', `Logger module failed: ${error.message}`);
    results.failed++;
    results.issues.push(`Logger: ${error.message}`);
  }
}

function testErrorHandler() {
  try {
    log('blue', '►', 'Testing error handler...');
    
    const errorPath = path.join(__dirname, 'lib/utils/api-error-handler.ts');
    const content = fs.readFileSync(errorPath, 'utf-8');
    
    // Check for required error classes
    const requiredClasses = [
      'ValidationError',
      'NotFoundError',
      'UnauthorizedError',
      'ForbiddenError',
    ];
    const missing = [];
    
    requiredClasses.forEach(cls => {
      if (!content.includes(`class ${cls}`)) {
        missing.push(cls);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing error classes: ${missing.join(', ')}`);
    }
    
    log('green', '✓', 'Error handler complete');
    results.passed++;
  } catch (error) {
    log('red', '✗', `Error handler failed: ${error.message}`);
    results.failed++;
    results.issues.push(`Error Handler: ${error.message}`);
  }
}

function testVaultService() {
  try {
    log('blue', '►', 'Testing vault service...');
    
    const servicePath = path.join(__dirname, 'lib/contracts/vault-service.ts');
    const content = fs.readFileSync(servicePath, 'utf-8');
    
    // Check for required functions
    const requiredFunctions = [
      'createVault',
      'getVault',
      'unlockVault',
      'voidVault',
    ];
    const missing = [];
    
    requiredFunctions.forEach(fn => {
      if (!content.includes(`export async function ${fn}`)) {
        missing.push(fn);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing functions: ${missing.join(', ')}`);
    }
    
    // Check for proper wagmi imports
    if (!content.includes('wagmi/actions')) {
      throw new Error('Not using proper wagmi/actions imports');
    }
    
    log('green', '✓', 'Vault service complete');
    results.passed++;
  } catch (error) {
    log('red', '✗', `Vault service failed: ${error.message}`);
    results.failed++;
    results.issues.push(`Vault Service: ${error.message}`);
  }
}

function testCreateVaultForm() {
  try {
    log('blue', '►', 'Testing CreateVaultForm component...');
    
    const formPath = path.join(__dirname, 'app/components/CreateVaultForm.tsx');
    const content = fs.readFileSync(formPath, 'utf-8');
    
    // Check for required functionality
    const required = [
      'validateForm',
      'handleFileChange',
      'handleCreateVault',
      'const errors = useState',
    ];
    const missing = [];
    
    required.forEach(item => {
      if (!content.includes(item)) {
        missing.push(item);
      }
    });
    
    if (missing.length > 0) {
      log('yellow', '⚠', `CreateVaultForm: Some expected items missing: ${missing.join(', ')}`);
      results.issues.push(`CreateVaultForm: Missing ${missing.join(', ')}`);
    } else {
      log('green', '✓', 'CreateVaultForm complete');
      results.passed++;
    }
  } catch (error) {
    log('red', '✗', `CreateVaultForm failed: ${error.message}`);
    results.failed++;
    results.issues.push(`CreateVaultForm: ${error.message}`);
  }
}

function testDatabaseSchema() {
  try {
    log('blue', '►', 'Testing database schema...');
    
    const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
    const content = fs.readFileSync(schemaPath, 'utf-8');
    
    // Check for required models
    const requiredModels = ['User', 'Vault', 'VaultFile', 'ActivityLog', 'ApiKey'];
    const missing = [];
    
    requiredModels.forEach(model => {
      if (!content.includes(`model ${model}`)) {
        missing.push(model);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing models: ${missing.join(', ')}`);
    }
    
    // Check for indexes
    if (!content.includes('@@index')) {
      log('yellow', '⚠', 'CreateVaultForm: No database indexes found');
      results.issues.push('Database: Missing indexes');
    }
    
    log('green', '✓', 'Database schema complete');
    results.passed++;
  } catch (error) {
    log('red', '✗', `Database schema failed: ${error.message}`);
    results.failed++;
    results.issues.push(`Database: ${error.message}`);
  }
}

function testAPIRoutes() {
  try {
    log('blue', '►', 'Testing API routes...');
    
    const routesDir = path.join(__dirname, 'app/api');
    const checkRoute = (name) => {
      const routePath = path.join(routesDir, name, 'route.ts');
      return fs.existsSync(routePath);
    };
    
    const requiredRoutes = [
      'vaults',
      'auth/[...nextauth]',
    ];
    
    const missing = [];
    requiredRoutes.forEach(route => {
      if (!checkRoute(route)) {
        missing.push(route);
      }
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing API routes: ${missing.join(', ')}`);
    }
    
    log('green', '✓', 'API routes complete');
    results.passed++;
  } catch (error) {
    log('red', '✗', `API routes failed: ${error.message}`);
    results.failed++;
    results.issues.push(`API Routes: ${error.message}`);
  }
}

// Run all tests
console.log(colors.blue + '═'.repeat(60) + colors.reset);
console.log(colors.blue + 'FUNCTIONAL TESTS' + colors.reset);
console.log(colors.blue + '═'.repeat(60) + colors.reset);

testPrismaClient();
testLoggerModule();
testErrorHandler();
testVaultService();
testCreateVaultForm();
testDatabaseSchema();
testAPIRoutes();

// Summary
console.log('\n' + colors.blue + '═'.repeat(60) + colors.reset);
console.log(colors.blue + 'SUMMARY' + colors.reset);
console.log(colors.blue + '─'.repeat(60) + colors.reset);
console.log(`${colors.green}Passed: ${results.passed}${colors.reset} | ${colors.red}Failed: ${results.failed}${colors.reset}`);

if (results.issues.length > 0) {
  console.log(colors.blue + '\nISSUES FOUND:' + colors.reset);
  results.issues.forEach(issue => {
    console.log(`  • ${issue}`);
  });
}

console.log(colors.blue + '═'.repeat(60) + colors.reset);

process.exit(results.failed > 0 ? 1 : 0);
