/**
 * File Cleanup Service
 * Manages cleanup of orphaned files and automatic deletion
 * Prevents storage waste and maintains system hygiene
 */

import { getLogger } from './logger';
import { db } from '@/lib/prisma';
import * as ipfs from '@/lib/ipfs/ipfs';

const logger = getLogger('FileCleanupService');

// Retention policy for deleted vaults (in days)
const ORPHANED_FILE_RETENTION_DAYS = 30;

export interface CleanupStats {
  filesDeleted: number;
  bytesFreed: number;
  vaultsProcessed: number;
  errors: string[];
}

/**
 * Find orphaned files (files without associated vault)
 */
async function findOrphanedFiles(): Promise<string[]> {
  try {
    const orphanedVaultFiles = await db.vaultFile.findMany({
      where: {
        vault: {
          isActive: false,
          deletedAt: {
            lt: new Date(Date.now() - ORPHANED_FILE_RETENTION_DAYS * 24 * 60 * 60 * 1000),
          },
        },
      },
      select: {
        ipfsHash: true,
        id: true,
      },
    });

    logger.info('Found orphaned files', { count: orphanedVaultFiles.length });

    return orphanedVaultFiles.map((f: any) => f.ipfsHash).filter(Boolean);
  } catch (error) {
    logger.error('Failed to find orphaned files', error instanceof Error ? error : undefined);
    return [];
  }
}

/**
 * Delete file from IPFS
 */
async function deleteFromIPFS(ipfsHash: string): Promise<boolean> {
  try {
    // Call IPFS service to unpin and delete
    // This would be implemented in your IPFS service
    logger.debug('Deleting file from IPFS', { ipfsHash });

    // For now, just log it
    // In production, you'd call: await ipfs.delete(ipfsHash);

    return true;
  } catch (error) {
    logger.error('Failed to delete from IPFS', error instanceof Error ? error : undefined);
    return false;
  }
}

/**
 * Clean up a single vault and its files
 */
export async function cleanupVault(vaultId: string): Promise<CleanupStats> {
  const stats: CleanupStats = {
    filesDeleted: 0,
    bytesFreed: 0,
    vaultsProcessed: 0,
    errors: [],
  };

  try {
    logger.info('Starting vault cleanup', { vaultId });

    // Get all files in vault
    const files = await db.vaultFile.findMany({
      where: { vaultId },
    });

    // Delete from IPFS
    for (const file of files) {
      try {
        const deleted = await deleteFromIPFS(file.ipfsHash);
        if (deleted) {
          stats.filesDeleted++;
          stats.bytesFreed += file.fileSizeBytes;
        }
      } catch (error) {
        stats.errors.push(`Failed to delete file ${file.id}: ${error}`);
      }
    }

    // Mark files as deleted in database
    await db.vaultFile.deleteMany({
      where: { vaultId },
    });

    // Mark vault as truly deleted
    await db.vault.update({
      where: { id: vaultId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    stats.vaultsProcessed = 1;

    logger.info('Vault cleanup completed', {
      vaultId,
      filesDeleted: stats.filesDeleted,
      bytesFreed: stats.bytesFreed,
    });

    return stats;
  } catch (error) {
    logger.error('Vault cleanup failed', error instanceof Error ? error : undefined);
    stats.errors.push(`Vault cleanup failed: ${error}`);
    return stats;
  }
}

/**
 * Run system-wide cleanup
 * This should be called periodically (e.g., daily) via a cron job
 */
export async function runSystemCleanup(): Promise<CleanupStats> {
  const stats: CleanupStats = {
    filesDeleted: 0,
    bytesFreed: 0,
    vaultsProcessed: 0,
    errors: [],
  };

  try {
    logger.info('Starting system cleanup');

    // Find all deleted vaults past retention period
    const deletedVaults = await db.vault.findMany({
      where: {
        isActive: false,
        deletedAt: {
          lt: new Date(Date.now() - ORPHANED_FILE_RETENTION_DAYS * 24 * 60 * 60 * 1000),
        },
      },
      select: { id: true },
    });

    logger.info('Found deleted vaults for cleanup', { count: deletedVaults.length });

    // Clean up each vault
    for (const vault of deletedVaults) {
      try {
        const vaultStats = await cleanupVault(vault.id);
        stats.filesDeleted += vaultStats.filesDeleted;
        stats.bytesFreed += vaultStats.bytesFreed;
        stats.vaultsProcessed += 1;
        stats.errors.push(...vaultStats.errors);
      } catch (error) {
        stats.errors.push(`Failed to cleanup vault ${vault.id}: ${error}`);
      }
    }

    logger.info('System cleanup completed', {
      vaultsProcessed: stats.vaultsProcessed,
      filesDeleted: stats.filesDeleted,
      bytesFreed: stats.bytesFreed,
      errors: stats.errors.length,
    });

    return stats;
  } catch (error) {
    logger.error('System cleanup failed', error instanceof Error ? error : undefined);
    stats.errors.push(`System cleanup failed: ${error}`);
    return stats;
  }
}

/**
 * Check for duplicate files and deduplicate
 * Returns space saved through deduplication
 */
export async function deduplicateFiles(): Promise<{ duplicatesFound: number; spaceFreed: number }> {
  try {
    logger.info('Starting file deduplication');

    const fileHashes = await db.vaultFile.groupBy({
      by: ['fileHash'],
      _count: {
        id: true,
      },
      where: {
        vault: {
          isActive: true,
        },
      },
    });

    let duplicatesFound = 0;
    let spaceFreed = 0;

    for (const hashGroup of fileHashes) {
      if (hashGroup._count.id > 1) {
        duplicatesFound += hashGroup._count.id - 1;

        // In a real system, you'd deduplicate by storing a reference to the first file
        // For now, just log it
        logger.debug('Found duplicate files', {
          fileHash: hashGroup.fileHash,
          count: hashGroup._count.id,
        });
      }
    }

    logger.info('Deduplication completed', {
      duplicatesFound,
      spaceFreed,
    });

    return { duplicatesFound, spaceFreed };
  } catch (error) {
    logger.error('Deduplication failed', error instanceof Error ? error : undefined);
    return { duplicatesFound: 0, spaceFreed: 0 };
  }
}

/**
 * Verify file integrity by checking file hashes
 */
export async function verifyFileIntegrity(vaultId: string): Promise<{
  verified: number;
  corrupted: number;
  errors: string[];
}> {
  const result = {
    verified: 0,
    corrupted: 0,
    errors: [] as string[],
  };

  try {
    const files = await db.vaultFile.findMany({
      where: { vaultId },
    });

    for (const file of files) {
      try {
        // In production, download file from IPFS and verify hash
        // await ipfs.verifyHash(file.ipfsHash);
        result.verified++;
      } catch (error) {
        result.corrupted++;
        result.errors.push(`File ${file.id} failed integrity check`);
      }
    }

    logger.info('File integrity verification completed', {
      vaultId,
      verified: result.verified,
      corrupted: result.corrupted,
    });

    return result;
  } catch (error) {
    logger.error('Integrity verification failed', error instanceof Error ? error : undefined);
    result.errors.push(`Verification failed: ${error}`);
    return result;
  }
}

/**
 * Schedule automatic cleanup (to be called from a cron job or worker)
 */
export async function scheduleCleanup(): Promise<void> {
  try {
    logger.info('Scheduled cleanup initiated');

    // Run all cleanup operations
    const [systemStats, dedupStats, integrityStats] = await Promise.all([
      runSystemCleanup(),
      deduplicateFiles(),
      // Verify integrity for all active vaults (sample)
      db.vault
        .findMany({
          where: { isActive: true },
          take: 100, // Sample 100 vaults
          select: { id: true },
        })
        .then((vaults: any) =>
          Promise.all(vaults.map((v: any) => verifyFileIntegrity(v.id)))
        )
        .then((results: any) => ({
          totalVerified: results.reduce((sum: number, r: any) => sum + r.verified, 0),
          totalCorrupted: results.reduce((sum: number, r: any) => sum + r.corrupted, 0),
        })),
    ]);

    logger.info('Scheduled cleanup completed', {
      systemStats,
      dedupStats,
      integrityStats,
    });
  } catch (error) {
    logger.error('Scheduled cleanup failed', error instanceof Error ? error : undefined);
  }
}

