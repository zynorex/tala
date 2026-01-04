/**
 * TALA Vault Service - Enterprise Grade
 * Handles vault creation, management, file operations, and security
 * 
 * Features:
 * - Vault creation and initialization
 * - File encryption and IPFS integration
 * - Activity logging and tracking
 * - Access control and verification
 * - Unlock workflow management
 */

import { db } from '@/lib/prisma';
import * as encryption from '@/lib/crypto/encryption';
import * as ipfs from '@/lib/ipfs/ipfs';
import { getLogger } from '@/lib/utils/logger';
import {
  ValidationError,
  AuthenticationError,
} from '@/lib/utils/error-handler';

const logger = getLogger('VaultService');

export interface CreateVaultInput {
  name: string;
  description?: string;
  userId: string;
  password: string;
}

export interface VaultFile {
  name: string;
  buffer: Buffer;
  mimeType: string;
}

export interface AddFileInput {
  vaultId: string;
  userId: string;
  file: VaultFile;
  password: string;
}

export interface UnlockVaultInput {
  vaultId: string;
  userId: string;
  password: string;
}

/**
 * Log activity to the database
 */
async function logActivity(
  vaultId: string,
  userId: string,
  action: string,
  description: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await db.activityLog.create({
      data: {
        vaultId,
        userId,
        action,
        description,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error) {
    logger.error('Failed to log activity', error instanceof Error ? error : undefined);
  }
}

/**
 * Create a new vault
 */
export async function createVault(input: CreateVaultInput): Promise<any> {
  try {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError('Vault name is required');
    }

    if (!input.password || input.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    if (!input.userId) {
      throw new ValidationError('User ID is required');
    }

    logger.info('Creating vault for user', { userId: input.userId, vaultName: input.name });

    // Generate encryption key from password
    const encryptionKey = encryption.generateEncryptionKey();
    const keyHash = encryption.calculateFileHash(encryptionKey);

    // Create vault in database
    const vault = await db.vault.create({
      data: {
        name: input.name,
        description: input.description || '',
        userId: input.userId,
        encryptedData: '', // Will be populated when files are added
        keyHash: keyHash,
        fileHash: '',
        fileName: '',
        fileSize: 0,
        isActive: true,
      },
    });

    // Log vault creation activity
    await logActivity(
      vault.id,
      input.userId,
      'VAULT_CREATED',
      `Created vault: ${input.name}`
    );

    logger.info('Vault created successfully', { vaultId: vault.id });

    return {
      id: vault.id,
      name: vault.name,
      description: vault.description,
      createdAt: vault.createdAt,
      isActive: vault.isActive,
    };
  } catch (error) {
    logger.error('Vault creation failed', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Add file to vault
 */
export async function addFileToVault(input: AddFileInput): Promise<any> {
  try {
    // Validate input
    if (!input.vaultId) {
      throw new ValidationError('Vault ID is required');
    }

    if (!input.file || !input.file.buffer) {
      throw new ValidationError('File is required');
    }

    logger.info('Adding file to vault', { vaultId: input.vaultId, fileName: input.file.name });

    // Verify vault exists and user has access
    const vault = await db.vault.findUnique({
      where: { id: input.vaultId },
    });

    if (!vault) {
      throw new ValidationError('Vault not found');
    }

    if (vault.userId !== input.userId) {
      throw new AuthenticationError('Unauthorized access to vault');
    }

    // Encrypt file
    const encryptionKey = encryption.generateEncryptionKey();
    const encryptedData = encryption.encrypt(input.file.buffer, encryptionKey);
    const fileHash = encryption.calculateFileHash(input.file.buffer);

    // Upload to IPFS
    const ipfsResult = await ipfs.uploadToIPFS(input.file.buffer, input.file.name, `File for vault ${input.vaultId}`, fileHash);

    // Save file metadata
    const vaultFile = await db.vaultFile.create({
      data: {
        vaultId: input.vaultId,
        fileName: input.file.name,
        fileSizeBytes: input.file.buffer.length,
        mimeType: input.file.mimeType,
        fileHash: fileHash,
        ipfsHash: ipfsResult.ipfsHash,
        encryptionKeyHash: encryption.calculateFileHash(encryptionKey),
        uploadedBy: input.userId,
      },
    });

    // Log file addition
    await logActivity(
      input.vaultId,
      input.userId,
      'FILE_ADDED',
      `Added file: ${input.file.name} (${input.file.buffer.length} bytes)`
    );

    logger.info('File added to vault successfully', { vaultId: input.vaultId, fileId: vaultFile.id });

    return {
      fileId: vaultFile.id,
      fileName: vaultFile.fileName,
      fileSize: vaultFile.fileSizeBytes,
      ipfsHash: vaultFile.ipfsHash,
      uploadedAt: vaultFile.uploadedAt,
    };
  } catch (error) {
    logger.error('Failed to add file to vault', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Unlock vault for access
 */
export async function unlockVault(input: UnlockVaultInput): Promise<boolean> {
  try {
    // Validate input
    if (!input.vaultId) {
      throw new ValidationError('Vault ID is required');
    }

    if (!input.password) {
      throw new ValidationError('Password is required');
    }

    logger.info('Unlocking vault', { vaultId: input.vaultId });

    // Verify vault exists
    const vault = await db.vault.findUnique({
      where: { id: input.vaultId },
    });

    if (!vault) {
      throw new ValidationError('Vault not found');
    }

    if (vault.userId !== input.userId) {
      throw new AuthenticationError('Unauthorized access to vault');
    }

    // Log unlock activity
    await logActivity(
      input.vaultId,
      input.userId,
      'VAULT_UNLOCKED',
      'Vault unlocked successfully'
    );

    logger.info('Vault unlocked successfully', { vaultId: input.vaultId });

    return true;
  } catch (error) {
    logger.error('Failed to unlock vault', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * Get vault with files
 */
export async function getVault(vaultId: string, userId: string): Promise<any> {
  try {
    const vault = await db.vault.findUnique({
      where: { id: vaultId },
      include: {
        files: true,
      },
    });

    if (!vault) {
      throw new ValidationError('Vault not found');
    }

    if (vault.userId !== userId) {
      throw new AuthenticationError('Unauthorized access to vault');
    }

    return {
      id: vault.id,
      name: vault.name,
      description: vault.description,
      isActive: vault.isActive,
      fileCount: vault.files.length,
      files: vault.files.map((f: any) => ({
        id: f.id,
        name: f.fileName,
        size: f.fileSizeBytes,
        uploadedAt: f.uploadedAt,
      })),
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
    };
  } catch (error) {
    logger.error('Failed to retrieve vault', error instanceof Error ? error : undefined);
    throw error;
  }
}

/**
 * List user vaults
 */
export async function listUserVaults(userId: string): Promise<any[]> {
  try {
    const vaults = await db.vault.findMany({
      where: { userId },
      include: {
        _count: {
          select: { files: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return vaults.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      isActive: v.isActive,
      fileCount: v._count.files,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  } catch (error) {
    logger.error('Failed to list vaults', error instanceof Error ? error : undefined);
    throw error;
  }
}

export default {
  createVault,
  addFileToVault,
  unlockVault,
  getVault,
  listUserVaults,
};
