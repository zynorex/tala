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
 * Delete file from IPFS by unpinning via Pinata.
 * Uses the `unpinFileFromIPFS` helper which calls DELETE /pinning/unpin/:hash.
 */
async function deleteFromIPFS(ipfsHash: string): Promise<boolean> {
  try {
    if (!ipfsHash || ipfsHash.length === 0) {
      logger.warn('Skipping IPFS deletion — empty hash');
      return false;
    }

    logger.debug('Unpinning file from IPFS via Pinata', { ipfsHash });
    const ok = await ipfs.unpinFileFromIPFS(ipfsHash);

    if (ok) {
      logger.info('IPFS file unpinned successfully', { ipfsHash });
    } else {
      logger.warn('IPFS unpin returned false — file may already be unpinned', { ipfsHash });
    }

    return ok;
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
        const dupeCount = hashGroup._count.id - 1;
        duplicatesFound += dupeCount;

        logger.debug('Found duplicate files', {
          fileHash: hashGroup.fileHash,
          count: hashGroup._count.id,
        });

        // Keep the oldest file (canonical), unpin duplicates from IPFS
        const dupes = await db.vaultFile.findMany({
          where: {
            fileHash: hashGroup.fileHash,
            vault: { isActive: true },
          },
          orderBy: { uploadedAt: 'asc' },
          select: { id: true, ipfsHash: true, fileSizeBytes: true },
        });

        // Skip the first (canonical) — process the rest
        for (let i = 1; i < dupes.length; i++) {
          const dupe = dupes[i];
          // Point the duplicate DB record's ipfsHash to the canonical copy
          await db.vaultFile.update({
            where: { id: dupe.id },
            data: { ipfsHash: dupes[0].ipfsHash },
          });

          // Unpin the duplicate from IPFS if it differs from canonical
          if (dupe.ipfsHash !== dupes[0].ipfsHash) {
            await deleteFromIPFS(dupe.ipfsHash);
            spaceFreed += dupe.fileSizeBytes;
          }
        }
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
        // Check the file is still available on IPFS
        const info = await ipfs.getIPFSFileInfo(file.ipfsHash);

        if (!info.available) {
          result.corrupted++;
          result.errors.push(`File ${file.id} (${file.ipfsHash}) is not available on IPFS`);
          continue;
        }

        // If stored size is available, compare it
        if (info.size > 0 && file.fileSizeBytes > 0) {
          // Encrypted size may differ from original, but a zero-size response is a red flag
          if (info.size === 0) {
            result.corrupted++;
            result.errors.push(`File ${file.id} IPFS content is 0 bytes`);
            continue;
          }
        }

        result.verified++;
      } catch (error) {
        result.corrupted++;
        result.errors.push(`File ${file.id} integrity check error: ${error instanceof Error ? error.message : error}`);
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

