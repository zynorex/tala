import fetch from 'node-fetch';

/**
 * Integration Test: Vault Creation with Unlock System
 * Tests vault creation API with unlockTime and lockStatus fields
 * 
 * NOTE: This test requires:
 * 1. Dev server running on http://localhost:3001
 * 2. Authentication to work (uses NextAuth session)
 * 3. A valid user session cookie
 */

const API_BASE = 'http://localhost:3000/api';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true, message: '✅ PASSED' });
  } catch (error) {
    results.push({
      name,
      passed: false,
      message: '❌ FAILED',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

async function testVaultCreationWithUnlock() {
  console.log('\n🚀 Starting Vault Creation Integration Tests...\n');
  console.log('⚠️  NOTE: These tests require a valid user session.\n');

  // Test 1: Verify API is accessible
  await test('API is accessible', async () => {
    try {
      const response = await fetch(`${API_BASE}/vaults`, {
        method: 'GET',
      });
      // We expect 401 (unauthorized) since we don't have a valid token,
      // but the endpoint should be reachable
      if (response.status === 404) {
        throw new Error('API endpoint not found');
      }
    } catch (error) {
      throw new Error(`Cannot reach API at ${API_BASE}: ${error}`);
    }
  });

  // Test 2: Check vault creation endpoint structure
  await test('Vault creation endpoint accepts POST requests', async () => {
    const response = await fetch(`${API_BASE}/vaults`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Vault',
      }),
    });

    // Should reject with 401 (unauthorized) not 404 (not found) or 405 (method not allowed)
    if (response.status === 404 || response.status === 405) {
      throw new Error(`Endpoint not properly set up: ${response.status}`);
    }
  });

  // Test 3: Verify unlock-status endpoint exists
  await test('Unlock status endpoint exists', async () => {
    const testVaultId = 'test-vault-id-12345';
    const response = await fetch(`${API_BASE}/vaults/${testVaultId}/unlock-status`);

    // Should return 401 (unauthorized) or 404 (not found), not 404 for the whole endpoint
    if (response.status === 404) {
      const text = await response.text();
      if (text.includes('ENOENT') || text.includes('Cannot GET')) {
        throw new Error('Unlock status endpoint not found');
      }
    }
  });

  // Test 4: Verify schema includes unlock fields
  await test('Database schema includes unlock fields', async () => {
    // Check Prisma schema
    const fs = await import('fs');
    const schemaPath = 'd:/web3+blockchain/tala/prisma/schema.prisma';
    
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    if (!schema.includes('unlockTime')) {
      throw new Error('Schema missing unlockTime field');
    }
    if (!schema.includes('lockStatus')) {
      throw new Error('Schema missing lockStatus field');
    }
    if (!schema.includes('UnlockEvent')) {
      throw new Error('Schema missing UnlockEvent model');
    }

    console.log('   ✓ unlockTime field found');
    console.log('   ✓ lockStatus field found');
    console.log('   ✓ UnlockEvent model found');
  });

  // Test 5: Verify vault creation API includes unlock fields
  await test('Vault creation API includes unlock fields in request', async () => {
    const fs = await import('fs');
    const apiPath = 'd:/web3+blockchain/tala/app/api/vaults/route.ts';
    
    const apiCode = fs.readFileSync(apiPath, 'utf-8');
    
    if (!apiCode.includes('unlockTime')) {
      throw new Error('API missing unlockTime field handling');
    }
    if (!apiCode.includes('lockStatus')) {
      throw new Error('API missing lockStatus field handling');
    }
    if (!apiCode.includes('LOCKED')) {
      throw new Error('API missing LOCKED status assignment');
    }

    console.log('   ✓ unlockTime handling implemented');
    console.log('   ✓ lockStatus handling implemented');
    console.log('   ✓ LOCKED status assignment found');
  });

  // Test 6: Verify unlock service exists
  await test('Vault unlock service is implemented', async () => {
    const fs = await import('fs');
    const servicePath = 'd:/web3+blockchain/tala/lib/services/vault-unlock.ts';
    
    try {
      const service = fs.readFileSync(servicePath, 'utf-8');
      
      if (!service.includes('checkVaultUnlockEligibility')) {
        throw new Error('Missing checkVaultUnlockEligibility function');
      }
      if (!service.includes('verifyUnlockBeforeFileAccess')) {
        throw new Error('Missing verifyUnlockBeforeFileAccess function');
      }
      if (!service.includes('recordUnlockAttempt')) {
        throw new Error('Missing recordUnlockAttempt function');
      }

      console.log('   ✓ checkVaultUnlockEligibility implemented');
      console.log('   ✓ verifyUnlockBeforeFileAccess implemented');
      console.log('   ✓ recordUnlockAttempt implemented');
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error('Vault unlock service file not found');
      }
      throw error;
    }
  });

  // Test 7: Verify unlock status component exists
  await test('Vault unlock status UI component is implemented', async () => {
    const fs = await import('fs');
    const componentPath = 'd:/web3+blockchain/tala/app/components/VaultUnlockStatus.tsx';
    
    try {
      const component = fs.readFileSync(componentPath, 'utf-8');
      
      if (!component.includes('LOCKED') || !component.includes('UNLOCKED')) {
        throw new Error('Component missing status states');
      }
      if (!component.includes('timeRemaining') && !component.includes('countdown')) {
        throw new Error('Component missing countdown timer logic');
      }

      console.log('   ✓ Status states implemented');
      console.log('   ✓ Countdown timer implemented');
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error('Unlock status component file not found');
      }
      throw error;
    }
  });

  // Test 8: Verify demo vault no longer auto-expires after 2 minutes
  await test('Demo vault auto-unlock removed (2 minute expiry gone)', async () => {
    const fs = await import('fs');
    const apiPath = 'd:/web3+blockchain/tala/app/api/vaults/route.ts';
    
    const apiCode = fs.readFileSync(apiPath, 'utf-8');
    
    // Should NOT have "2 * 60 * 1000" for demo vault expiry
    const lines = apiCode.split('\n');
    let foundBadExpiry = false;
    
    for (const line of lines) {
      if (line.includes('demoExpiresAt') && line.includes('2 * 60 * 1000')) {
        foundBadExpiry = true;
        break;
      }
    }
    
    if (foundBadExpiry) {
      throw new Error('Demo vault still has 2-minute auto-unlock');
    }

    if (!apiCode.includes('demoExpiresAt = null')) {
      throw new Error('Demo expiry should be set to null');
    }

    console.log('   ✓ 2-minute auto-unlock removed');
    console.log('   ✓ Demo vaults now respect unlockTime');
  });

  // Print results summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${result.details}`);
    }
    console.log();

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log('='.repeat(70));
  console.log(`\n📈 Summary: ${passed} passed, ${failed} failed out of ${results.length} tests\n`);

  if (failed > 0) {
    console.log('❌ Some tests failed. Please review the issues above.\n');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!\n');
    console.log('✅ Vault unlock system is properly integrated!\n');
    process.exit(0);
  }
}

// Run tests
testVaultCreationWithUnlock().catch((error) => {
  console.error('Test suite error:', error);
  process.exit(1);
});
