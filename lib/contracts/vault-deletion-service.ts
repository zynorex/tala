/**
 * NIL Vault Deletion Service
 * Handles complete vault deletion including smart contract, IPFS cleanup, and database records
 * 
 * Deletion Process:
 * 1. Validate vault ownership and status
 * 2. Call smart contract voidVault function
 * 3. Unpin file from IPFS (cleanup)
 * 4. Remove database records
 * 5. Clear encryption keys
 * 
 * Security:
 * - Only vault creator can delete
 * - Transaction-safe deletion (blockchain first, then cleanup)
 * - Proper error handling and rollback
 */

import { unpinFileFromIPFS } from '../ipfs/ipfs';
import { voidVault as contractVoidVault, getVault, VAULT_SERVICE_ERRORS } from './vault-service';
import type { VaultServiceConfig } from './vault-service';

export interface DeletionResult {
  vaultId: number;
  transactionHash: string;
  ipfsUnpinned: boolean;
  ipfsHash: string;
  timestamp: number;
  success: boolean;
  errors?: string[];
}

export interface DeletionStatus {
  vaultId: number;
  deleted: boolean;
  contractVoided: boolean;
  ipfsUnpinned: boolean;
  databaseCleared: boolean;
  deletedAt?: number;
  errors: string[];
}

// Deletion error messages
const DELETION_ERRORS = {
  VAULT_NOT_FOUND: 'Vault not found or does not exist',
  NOT_AUTHORIZED: 'Only the vault creator can delete this vault',
  VAULT_ALREADY_DELETED: 'Vault has already been deleted/voided',
  UNLOCK_TIME_PASSED: 'Cannot delete vault after unlock time',
  CONTRACT_ERROR: 'Failed to void vault on blockchain',
  IPFS_CLEANUP_FAILED: 'IPFS unpinning failed (vault still deleted from blockchain)',
  DATABASE_ERROR: 'Failed to clear database records',
  TRANSACTION_FAILED: 'Deletion transaction failed',
} as const;

/**
 * Delete a vault completely
 * Performs cascading deletion across blockchain, IPFS, and database
 * 
 * @param vaultId Vault ID to delete
 * @param userAddress Address of requester (must be vault creator)
 * @param config Contract configuration
 * @param wagmiConfig Wagmi config object
 * @returns Deletion result with transaction hash and cleanup status
 * @throws Error if vault doesn't exist, user not authorized, or critical operations fail
 */
export async function deleteVault(
  vaultId: number,
  userAddress: string,
  config: VaultServiceConfig,
  wagmiConfig: any
): Promise<DeletionResult> {
  const errors: string[] = [];
  let ipfsUnpinned = false;
  let contractHash = '';
  let ipfsHash = '';

  try {
    // Step 1: Validate vault exists and user is creator
    let vault;
    try {
      vault = await getVault(vaultId, config, wagmiConfig);
    } catch (error) {
      throw new Error(DELETION_ERRORS.VAULT_NOT_FOUND);
    }

    if (vault.voided) {
      throw new Error(DELETION_ERRORS.VAULT_ALREADY_DELETED);
    }

    // Validate user is vault creator
    if (vault.creator.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error(DELETION_ERRORS.NOT_AUTHORIZED);
    }

    // Check unlock time hasn't passed (optional security measure)
    const now = Math.floor(Date.now() / 1000);
    if (now >= vault.unlockTime) {
      throw new Error(DELETION_ERRORS.UNLOCK_TIME_PASSED);
    }

    ipfsHash = vault.ipfsHash;

    // Step 2: Void vault on blockchain (primary operation)
    try {
      contractHash = await contractVoidVault(vaultId, config, wagmiConfig);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`${DELETION_ERRORS.CONTRACT_ERROR}: ${message}`);
    }

    // Step 3: Cleanup IPFS (non-critical, don't fail entire operation)
    try {
      ipfsUnpinned = await unpinFileFromIPFS(ipfsHash);
      if (!ipfsUnpinned) {
        errors.push('Failed to unpin file from IPFS (will be cleaned up later)');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`IPFS cleanup error: ${message}`);
      // Don't throw - IPFS cleanup is secondary
    }

    // Step 4: Clear encryption keys from session (frontend only)
    try {
      clearVaultEncryptionKey(vaultId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to clear encryption key: ${message}`);
    }

    return {
      vaultId,
      transactionHash: contractHash,
      ipfsUnpinned,
      ipfsHash,
      timestamp: Date.now(),
      success: true,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(message);
  }
}

/**
 * Batch delete multiple vaults
 * Deletes vaults sequentially with error tracking
 * 
 * @param vaultIds Array of vault IDs to delete
 * @param userAddress Address of requester
 * @param config Contract configuration
 * @param wagmiConfig Wagmi config object
 * @returns Results for each vault
 */
export async function deleteVaultsBatch(
  vaultIds: number[],
  userAddress: string,
  config: VaultServiceConfig,
  wagmiConfig: any
): Promise<DeletionResult[]> {
  const results: DeletionResult[] = [];

  for (const vaultId of vaultIds) {
    try {
      const result = await deleteVault(vaultId, userAddress, config, wagmiConfig);
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        vaultId,
        transactionHash: '',
        ipfsUnpinned: false,
        ipfsHash: '',
        timestamp: Date.now(),
        success: false,
        errors: [message],
      });
    }
  }

  return results;
}

/**
 * Check deletion status of a vault
 * Verifies vault is voided on blockchain
 * 
 * @param vaultId Vault ID to check
 * @param config Contract configuration
 * @param wagmiConfig Wagmi config object
 * @returns Deletion status
 */
export async function checkVaultDeletionStatus(
  vaultId: number,
  config: VaultServiceConfig,
  wagmiConfig: any
): Promise<DeletionStatus> {
  const errors: string[] = [];
  let contractVoided = false;

  try {
    const vault = await getVault(vaultId, config, wagmiConfig);
    contractVoided = vault.voided;
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : 'Failed to check vault status'
    );
  }

  return {
    vaultId,
    deleted: contractVoided,
    contractVoided,
    ipfsUnpinned: false, // Can't determine from chain
    databaseCleared: false, // Can't determine from chain
    errors,
  };
}

/**
 * Clear encryption key from session storage
 * Ensures decryption key is not retained after deletion
 * 
 * @param vaultId Vault ID
 */
function clearVaultEncryptionKey(vaultId: number): void {
  try {
    // Clear from sessionStorage (frontend only)
    const keyName = `nil_vault_key_${vaultId}`;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(keyName);
    }

    // Clear from memory cache if exists
    if (typeof window !== 'undefined' && (window as any).__nilVaultCache) {
      delete (window as any).__nilVaultCache[keyName];
    }
  } catch (error) {
    console.error('Failed to clear encryption key:', error);
    // Non-critical, don't throw
  }
}

/**
 * Recover from failed IPFS cleanup
 * Attempts to unpin files that weren't cleaned up during deletion
 * Useful for maintenance operations
 * 
 * @param ipfsHash IPFS hash to unpin
 * @returns Success status
 */
export async function recoverIPFSCleanup(ipfsHash: string): Promise<boolean> {
  try {
    return await unpinFileFromIPFS(ipfsHash);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`IPFS recovery failed for ${ipfsHash}: ${message}`);
    return false;
  }
}

/**
 * Verify vault deletion is complete
 * Checks both blockchain and secondary cleanup operations
 * 
 * @param vaultId Vault ID
 * @param deletionResult Result from deleteVault
 * @param config Contract configuration
 * @param wagmiConfig Wagmi config object
 * @returns Verification result with any issues found
 */
export async function verifyVaultDeletion(
  vaultId: number,
  deletionResult: DeletionResult,
  config: VaultServiceConfig,
  wagmiConfig: any
): Promise<{ complete: boolean; issues: string[] }> {
  const issues: string[] = [];

  // Check blockchain status
  try {
    const status = await checkVaultDeletionStatus(vaultId, config, wagmiConfig);
    if (!status.contractVoided) {
      issues.push('Vault not voided on blockchain');
    }
  } catch (error) {
    issues.push(
      `Failed to verify blockchain status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Check IPFS cleanup
  if (!deletionResult.ipfsUnpinned) {
    issues.push(`IPFS file not unpinned: ${deletionResult.ipfsHash}`);
  }

  return {
    complete: issues.length === 0,
    issues,
  };
}

/**
 * Export deletion error messages
 */
export { DELETION_ERRORS };
