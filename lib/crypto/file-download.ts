/**
 * Crypto utilities for file decryption
 * Note: Move crypto operations to API routes to avoid Turbopack issues
 * This file serves as a documentation reference
 * 
 * For server-side decryption, use the API route:
 * POST /api/vaults/[id]/files/[fileId]/download
 */

export interface DecryptionMetadata {
  iv: string;
  authTag: string;
  salt: string;
  fileHash: string;
}

export const ENCRYPTION_CONFIG = {
  ALGORITHM: 'aes-256-gcm',
  KEY_LENGTH: 32, // 256 bits
  PBKDF2_ITERATIONS: 100000,
  PBKDF2_DIGEST: 'sha256',
  IV_LENGTH: 16,
  AUTH_TAG_LENGTH: 16,
  SALT_LENGTH: 16,
};


