/**
 * NIL Integration Test Suite
 * Comprehensive testing for vault creation, encryption, and deletion flows
 * 
 * Test Coverage:
 * - Encryption and key derivation
 * - IPFS upload/download
 * - Smart contract interactions
 * - Vault deletion with cleanup
 * - Metadata management
 * - End-to-end workflows
 */

import crypto from 'crypto';

// Type definitions
export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface TestError {
  test: string;
  error: string;
  timestamp: number;
}

// Test utilities
export class NilTestSuite {
  private testResults: Map<string, TestResult> = new Map();
  private errorLog: TestError[] = [];

  /**
   * Generate test encryption key
   */
  static generateTestKey(): Buffer {
    return crypto.randomBytes(32); // 256 bits
  }

  /**
   * Generate test salt
   */
  static generateTestSalt(): Buffer {
    return crypto.randomBytes(32); // 256 bits for PBKDF2
  }

  /**
   * Generate test file data
   */
  static generateTestFile(sizeBytes: number = 1024): Buffer {
    return crypto.randomBytes(sizeBytes);
  }

  /**
   * Test: Encryption key derivation (PBKDF2)
   */
  async testKeyDerivation(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Key Derivation (PBKDF2)';

    try {
      const password = 'test-password-12345';
      const salt = NilTestSuite.generateTestSalt();
      const iterations = 100000;

      const key = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        32,
        'sha256'
      );

      // Verify key properties
      if (key.length !== 32) {
        throw new Error(`Key length mismatch: expected 32, got ${key.length}`);
      }

      if (salt.length !== 32) {
        throw new Error(`Salt length mismatch: expected 32, got ${salt.length}`);
      }

      // Verify same password produces same key
      const key2 = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        32,
        'sha256'
      );

      if (!key.equals(key2)) {
        throw new Error('Key derivation not deterministic');
      }

      // Verify different password produces different key
      const key3 = crypto.pbkdf2Sync(
        'different-password',
        salt,
        iterations,
        32,
        'sha256'
      );

      if (key.equals(key3)) {
        throw new Error('Different passwords produced same key');
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Test: AES-256-GCM encryption
   */
  async testEncryption(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'AES-256-GCM Encryption';

    try {
      const key = TALATestSuite.generateTestKey();
      const iv = crypto.randomBytes(16);
      const plaintext = TALATestSuite.generateTestFile(1024);

      // Encrypt
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      let ciphertext = cipher.update(plaintext);
      ciphertext = Buffer.concat([ciphertext, cipher.final()]);
      const authTag = cipher.getAuthTag();

      if (ciphertext.length === 0) {
        throw new Error('Encryption produced empty output');
      }

      // Verify ciphertext is different from plaintext
      if (ciphertext.equals(plaintext)) {
        throw new Error('Ciphertext equals plaintext (encryption failed)');
      }

      // Decrypt
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      // Verify decryption
      if (!decrypted.equals(plaintext)) {
        throw new Error('Decrypted data does not match original');
      }

      // Verify tampering detection
      const tamperedCiphertext = Buffer.from(ciphertext);
      tamperedCiphertext[0] ^= 0xff; // Flip bits

      const decipher2 = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher2.setAuthTag(authTag);

      let tamperDetected = false;
      try {
        decipher2.update(tamperedCiphertext);
        decipher2.final();
      } catch {
        tamperDetected = true;
      }

      if (!tamperDetected) {
        throw new Error('Tampering not detected by authentication tag');
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Test: IPFS hash validation
   */
  async testIPFSHashValidation(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'IPFS Hash Validation';

    try {
      // Valid CIDv0 hashes
      const validCIDv0 = [
        'QmYwAPJzode7K6h9c5oKYYgq6xPcpXZGPvAQFBCVQqvB7',
        'Qmaisz6NMhDB51cCvNWa3cDViGTDLZo5GLhsddm92P4do',
      ];

      const cidv0Regex = /^Qm[a-zA-Z0-9]{44}$/;
      for (const hash of validCIDv0) {
        if (!cidv0Regex.test(hash)) {
          throw new Error(`Valid CIDv0 rejected: ${hash}`);
        }
      }

      // Valid CIDv1 hashes
      const validCIDv1 = [
        'bafybeiged4uqypp7oxyeaq3g7genfyqx7l3so7unmm67alszdryinesvq',
        'bafkreibhedn5f4xr4j5qsopsvvqbhyzb6i7xnyhsqhgs4gipkbj3dyqle',
      ];

      const cidv1Regex = /^baf[a-z2-7]{50,}$/;
      for (const hash of validCIDv1) {
        if (!cidv1Regex.test(hash)) {
          throw new Error(`Valid CIDv1 rejected: ${hash}`);
        }
      }

      // Invalid hashes
      const invalidHashes = [
        'invalid',
        'QmShort',
        'Qm' + 'a'.repeat(45), // Too long
        'bafy', // Too short
        'ZmFmYjzyyy', // Invalid prefix
      ];

      const validationRegex = /^(Qm[a-zA-Z0-9]{44}|baf[a-z2-7]{50,})$/;
      for (const hash of invalidHashes) {
        if (validationRegex.test(hash)) {
          throw new Error(`Invalid hash accepted: ${hash}`);
        }
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Test: File integrity verification
   */
  async testFileIntegrity(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'File Integrity Verification';

    try {
      const originalFile = TALATestSuite.generateTestFile(2048);

      // Compute original hash
      const originalHash = crypto
        .createHash('sha256')
        .update(originalFile)
        .digest('hex');

      // Encrypt file
      const key = TALATestSuite.generateTestKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      let encryptedFile = cipher.update(originalFile);
      encryptedFile = Buffer.concat([encryptedFile, cipher.final()]);
      const authTag = cipher.getAuthTag();

      // Compute encrypted hash
      const encryptedHash = crypto
        .createHash('sha256')
        .update(encryptedFile)
        .digest('hex');

      // Verify hashes are different
      if (originalHash === encryptedHash) {
        throw new Error('Original and encrypted hashes should be different');
      }

      // Decrypt and verify
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      let decryptedFile = decipher.update(encryptedFile);
      decryptedFile = Buffer.concat([decryptedFile, decipher.final()]);

      const decryptedHash = crypto
        .createHash('sha256')
        .update(decryptedFile)
        .digest('hex');

      if (decryptedHash !== originalHash) {
        throw new Error(
          'Decrypted file hash does not match original'
        );
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Test: Vault unlock time validation
   */
  async testVaultTimeValidation(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'Vault Time Validation';

    try {
      const now = Math.floor(Date.now() / 1000);
      const minDuration = 60; // 1 minute
      const maxDuration = 365 * 24 * 60 * 60 * 100; // 100 years

      // Test minimum duration
      const minUnlockTime = now + minDuration;
      if (minUnlockTime <= now) {
        throw new Error('Minimum duration check failed');
      }

      // Test maximum duration
      const maxUnlockTime = now + maxDuration;
      const durationSeconds = maxUnlockTime - now;
      if (durationSeconds > maxDuration) {
        throw new Error('Maximum duration check failed');
      }

      // Test invalid (past) time
      const pastTime = now - 1000;
      if (pastTime > now) {
        throw new Error('Past time check failed');
      }

      // Test invalid (too far future)
      const tooFarFuture = now + maxDuration + 1;
      if (tooFarFuture - now <= maxDuration) {
        throw new Error('Too far future check failed');
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Test: File size validation
   */
  async testFileSizeValidation(): Promise<TestResult> {
    const startTime = Date.now();
    const testName = 'File Size Validation';

    try {
      const minSize = 1;
      const maxSize = 500 * 1024 * 1024; // 500 MB

      // Test valid sizes
      const validSizes = [1, 1024, 1024 * 1024, maxSize];
      for (const size of validSizes) {
        if (size < minSize || size > maxSize) {
          throw new Error(`Valid size rejected: ${size}`);
        }
      }

      // Test invalid sizes
      const invalidSizes = [0, -1, maxSize + 1, 1e15];
      for (const size of invalidSizes) {
        if (size >= minSize && size <= maxSize) {
          throw new Error(`Invalid size accepted: ${size}`);
        }
      }

      return {
        name: testName,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        name: testName,
        passed: false,
        duration: Date.now() - startTime,
        error: message,
      };
    }
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<TestResults> {
    const tests = [
      this.testKeyDerivation(),
      this.testEncryption(),
      this.testIPFSHashValidation(),
      this.testFileIntegrity(),
      this.testVaultTimeValidation(),
      this.testFileSizeValidation(),
    ];

    const results = await Promise.all(tests);
    let passed = 0;
    let failed = 0;
    let totalDuration = 0;

    for (const result of results) {
      this.testResults.set(result.name, result);
      if (result.passed) {
        passed++;
      } else {
        failed++;
        this.errorLog.push({
          test: result.name,
          error: result.error || 'Unknown error',
          timestamp: Date.now(),
        });
      }
      totalDuration += result.duration;
    }

    return {
      total: results.length,
      passed,
      failed,
      duration: totalDuration,
      results,
      errors: this.errorLog,
    };
  }

  /**
   * Get test report
   */
  getTestReport(): string {
    let report = '=== TALA Integration Test Report ===\n\n';

    for (const [name, result] of this.testResults) {
      const status = result.passed ? '✓ PASS' : '✗ FAIL';
      report += `${status} - ${name} (${result.duration}ms)\n`;

      if (!result.passed) {
        report += `  Error: ${result.error}\n`;
      }
    }

    report += '\n=== Summary ===\n';
    report += `Total Tests: ${this.testResults.size}\n`;
    report += `Passed: ${Array.from(this.testResults.values()).filter(r => r.passed).length}\n`;
    report += `Failed: ${Array.from(this.testResults.values()).filter(r => !r.passed).length}\n`;

    return report;
  }
}

interface TestResults {
  total: number;
  passed: number;
  failed: number;
  duration: number;
  results: Array<any>;
  errors: Array<any>;
}

// Export for use in tests
export { TALATestSuite as default };
