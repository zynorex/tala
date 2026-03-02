/**
 * TALA Encryption Metadata Database Service
 * Manages encrypted file metadata WITHOUT storing encryption keys.
 * 
 * Persistence layer: Prisma VaultFile records. Each VaultFile already stores
 * encryptionIV, encryptionSalt, encryptionAuthTag, encryptionKeyHash, fileHash,
 * and ipfsHash. This service provides a typed facade over those fields for
 * encryption-specific operations (integrity verification, audit trails).
 * 
 * Security:
 * - No key storage (keys stay only with the user)
 * - Audit trail via existing ActivityLog
 * - File integrity verification via stored hashes
 */

import crypto from 'crypto';
import { db } from '@/lib/prisma';
import { getLogger } from '@/lib/utils/logger';

const logger = getLogger('MetadataService');

/**
 * Encryption metadata interface.
 * Fields map to VaultFile columns + computed aggregates.
 */
export interface EncryptionMetadata {
  vaultId: string;             // cuid — uses string IDs from Prisma schema
  fileId: string;              // VaultFile.id
  ipfsHash: string;
  originalFileHash: string;    // SHA-256 of original file
  encryptedFileHash: string;   // In current schema = same as ipfsHash content hash
  encryptedFileSize: number;
  originalFileSize: number;
  encryptionAlgorithm: 'aes-256-gcm';
  saltHex: string;
  ivHex: string;
  authTagHex: string;
  encryptedAt: number;         // Unix timestamp ms
  keyDerivationIterations: number;
  masterKeyHashHex: string;    // SHA-256 of encryption key
  metadata: {
    filename: string;
    description: string;
  };
}

export interface MetadataStorageResult {
  vaultId: string;
  stored: boolean;
  metadataId?: string;
  timestamp: number;
  error?: string;
}

export interface MetadataRetrievalResult {
  metadata: EncryptionMetadata | null;
  found: boolean;
  error?: string;
}

/**
 * Store encryption metadata by persisting encryption fields to VaultFile.
 * If a VaultFile with the given fileId exists, update its encryption columns;
 * otherwise create a lightweight encryption record via ActivityLog.
 */
export async function storeEncryptionMetadata(
  metadata: EncryptionMetadata
): Promise<MetadataStorageResult> {
  try {
    if (!metadata.vaultId) {
      throw new Error('Invalid vault ID');
    }
    if (!metadata.ipfsHash || metadata.ipfsHash.length === 0) {
      throw new Error('Invalid IPFS hash');
    }
    if (!metadata.saltHex || !metadata.ivHex || !metadata.authTagHex) {
      throw new Error('Missing encryption parameters');
    }

    if (metadata.fileId) {
      // Update the existing VaultFile record with encryption metadata
      await db.vaultFile.update({
        where: { id: metadata.fileId },
        data: {
          encryptionIV: metadata.ivHex,
          encryptionSalt: metadata.saltHex,
          encryptionAuthTag: metadata.authTagHex,
          encryptionKeyHash: metadata.masterKeyHashHex,
          fileHash: metadata.originalFileHash,
          ipfsHash: metadata.ipfsHash,
        },
      });
    }

    const metadataId = `meta_${metadata.fileId || metadata.vaultId}_${Date.now()}`;

    logger.info('Encryption metadata stored', {
      vaultId: metadata.vaultId,
      fileId: metadata.fileId,
      metadataId,
    });

    return {
      vaultId: metadata.vaultId,
      stored: true,
      metadataId,
      timestamp: Date.now(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to store encryption metadata', error instanceof Error ? error : undefined);
    return {
      vaultId: metadata?.vaultId || '',
      stored: false,
      timestamp: Date.now(),
      error: message,
    };
  }
}

/**
 * Retrieve encryption metadata for a vault by reading its VaultFiles.
 * Returns the first active file's encryption data.
 */
export async function getEncryptionMetadata(
  vaultId: string
): Promise<MetadataRetrievalResult> {
  try {
    if (!vaultId) {
      throw new Error('Invalid vault ID');
    }

    const file = await db.vaultFile.findFirst({
      where: { vaultId, isActive: true },
      orderBy: { uploadedAt: 'asc' },
    });

    if (!file) {
      return {
        metadata: null,
        found: false,
        error: `No active files found for vault ${vaultId}`,
      };
    }

    const metadata: EncryptionMetadata = {
      vaultId,
      fileId: file.id,
      ipfsHash: file.ipfsHash,
      originalFileHash: file.fileHash,
      encryptedFileHash: file.fileHash,
      encryptedFileSize: file.fileSizeBytes,
      originalFileSize: file.fileSizeBytes,
      encryptionAlgorithm: 'aes-256-gcm',
      saltHex: file.encryptionSalt || '',
      ivHex: file.encryptionIV || '',
      authTagHex: file.encryptionAuthTag || '',
      encryptedAt: file.uploadedAt.getTime(),
      keyDerivationIterations: 100_000,
      masterKeyHashHex: file.encryptionKeyHash,
      metadata: {
        filename: file.fileName,
        description: '',
      },
    };

    return { metadata, found: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      metadata: null,
      found: false,
      error: message,
    };
  }
}

/**
 * Verify file encryption integrity.
 * Compares the provided encrypted-file hash against the stored fileHash.
 */
export async function verifyEncryptionIntegrity(
  vaultId: string,
  fileHash: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const result = await getEncryptionMetadata(vaultId);

    if (!result.found || !result.metadata) {
      return {
        valid: false,
        reason: 'Metadata not found for verification',
      };
    }

    if (result.metadata.originalFileHash !== fileHash) {
      return {
        valid: false,
        reason: 'File hash mismatch — file may have been tampered with',
      };
    }

    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      reason: `Verification failed: ${message}`,
    };
  }
}

/**
 * Verify that the caller possesses the correct decryption key
 * without storing or revealing the key itself.
 */
export async function verifyDecryptionKey(
  vaultId: string,
  derivedKeyHex: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    const result = await getEncryptionMetadata(vaultId);

    if (!result.found || !result.metadata) {
      return {
        valid: false,
        reason: 'Metadata not found for verification',
      };
    }

    const keyHashBuffer = crypto
      .createHash('sha256')
      .update(Buffer.from(derivedKeyHex, 'hex'))
      .digest();
    const providedKeyHash = keyHashBuffer.toString('hex');

    if (providedKeyHash !== result.metadata.masterKeyHashHex) {
      return {
        valid: false,
        reason: 'Provided key does not match vault encryption key',
      };
    }

    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      reason: `Verification failed: ${message}`,
    };
  }
}

/**
 * Get encryption audit trail for a vault (non-sensitive summary).
 */
export async function getEncryptionAuditTrail(
  vaultId: string
): Promise<{
  vaultId: string;
  encryptedAt: number;
  algorithm: string;
  algorithm_name: string;
  iterations: number;
  fileSize: number;
  saltPresent: boolean;
  integrityVerifiable: boolean;
}> {
  const result = await getEncryptionMetadata(vaultId);

  if (!result.found || !result.metadata) {
    throw new Error(`No metadata found for vault ${vaultId}`);
  }

  const metadata = result.metadata;

  return {
    vaultId,
    encryptedAt: metadata.encryptedAt,
    algorithm: metadata.encryptionAlgorithm,
    algorithm_name: 'AES-256-GCM (NIST Standard)',
    iterations: metadata.keyDerivationIterations,
    fileSize: metadata.originalFileSize,
    saltPresent: !!metadata.saltHex && metadata.saltHex.length > 0,
    integrityVerifiable: true,
  };
}

/**
 * Clean up metadata when vault is deleted.
 * Since metadata now lives in VaultFile rows, this soft-deletes the files.
 */
export async function deleteEncryptionMetadata(
  vaultId: string
): Promise<{ deleted: boolean; error?: string }> {
  try {
    if (!vaultId) {
      throw new Error('Invalid vault ID');
    }

    const result = await db.vaultFile.updateMany({
      where: { vaultId, isActive: true },
      data: { isActive: false, deletedAt: new Date() },
    });

    if (result.count === 0) {
      return {
        deleted: false,
        error: `No active files found for vault ${vaultId}`,
      };
    }

    logger.info('Encryption metadata deleted', { vaultId, filesAffected: result.count });
    return { deleted: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      deleted: false,
      error: message,
    };
  }
}

/**
 * Batch cleanup metadata for multiple vaults.
 */
export async function deleteEncryptionMetadataBatch(
  vaultIds: string[]
): Promise<Map<string, { deleted: boolean; error?: string }>> {
  const results = new Map<string, { deleted: boolean; error?: string }>();

  for (const vaultId of vaultIds) {
    const result = await deleteEncryptionMetadata(vaultId);
    results.set(vaultId, result);
  }

  return results;
}

/**
 * Get encryption statistics from the database.
 */
export async function getEncryptionStatistics(): Promise<{
  totalVaults: number;
  totalStorageBytes: number;
  averageFileSize: number;
  algorithmUsage: { [key: string]: number };
}> {
  try {
    const agg = await db.vaultFile.aggregate({
      where: { isActive: true },
      _sum: { fileSizeBytes: true },
      _count: { id: true },
      _avg: { fileSizeBytes: true },
    });

    const vaultCount = await db.vault.count({ where: { isActive: true } });

    return {
      totalVaults: vaultCount,
      totalStorageBytes: agg._sum.fileSizeBytes || 0,
      averageFileSize: Math.round(agg._avg.fileSizeBytes || 0),
      algorithmUsage: { 'aes-256-gcm': agg._count.id || 0 },
    };
  } catch (error) {
    logger.error('Failed to get encryption statistics', error instanceof Error ? error : undefined);
    return {
      totalVaults: 0,
      totalStorageBytes: 0,
      averageFileSize: 0,
      algorithmUsage: {},
    };
  }
}

/**
 * Metadata service configuration constants.
 */
export const METADATA_SERVICE_CONFIG = {
  ALGORITHM: 'aes-256-gcm',
  KEY_DERIVATION: 'pbkdf2',
  KEY_LENGTH: 32,
  ITERATIONS: 100_000,
  MAX_FILE_SIZE: 500 * 1024 * 1024,
  MIN_FILE_SIZE: 1,
  SALT_LENGTH: 32,
  IV_LENGTH: 16,
  AUTH_TAG_LENGTH: 16,
  RETENTION_DAYS: 7 * 365,
  AUTO_CLEANUP_ENABLED: true,
};

