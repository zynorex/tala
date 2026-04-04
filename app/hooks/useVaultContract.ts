'use client';

import { useCallback, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TALA_VAULT_ABI, TALA_VAULT_CONFIG, VAULT_ERRORS } from '@/lib/contracts/tala-vault';

interface Vault {
  creator: `0x${string}`;
  ipfsHash: string;
  encryptedKeyHash: `0x${string}`;
  unlockTime: bigint;
  createdAt: bigint;
  voided: boolean;
  description: string;
  fileSize: bigint;
}

/**
 * Hook for interacting with TALA Vault smart contract
 * Handles reading and writing vault data
 */
export function useVaultContract() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read: Get single vault
  const {
    data: vaultData,
    isLoading: isVaultLoading,
    refetch: refetchVault,
  } = useReadContract({
    address: TALA_VAULT_CONFIG.contractAddress,
    abi: TALA_VAULT_ABI,
    functionName: 'getVault',
    query: {
      enabled: false, // Manual refetch only
    },
  });

  // Read: Get user's vaults
  const {
    data: userVaults,
    isLoading: isVaultsLoading,
    refetch: refetchUserVaults,
  } = useReadContract({
    address: TALA_VAULT_CONFIG.contractAddress,
    abi: TALA_VAULT_ABI,
    functionName: 'getUserVaults',
    args: [address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Read: Get vault count
  const {
    data: vaultCount,
    refetch: refetchVaultCount,
  } = useReadContract({
    address: TALA_VAULT_CONFIG.contractAddress,
    abi: TALA_VAULT_ABI,
    functionName: 'getUserVaultCount',
    args: [address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Read: Check if vault can be unlocked
  const {
    data: canUnlock,
    refetch: refetchCanUnlock,
  } = useReadContract({
    address: TALA_VAULT_CONFIG.contractAddress,
    abi: TALA_VAULT_ABI,
    functionName: 'canUnlock',
    query: {
      enabled: false,
    },
  });

  // Read: Get time to unlock
  const {
    data: timeToUnlock,
    refetch: refetchTimeToUnlock,
  } = useReadContract({
    address: TALA_VAULT_CONFIG.contractAddress,
    abi: TALA_VAULT_ABI,
    functionName: 'getTimeToUnlock',
    query: {
      enabled: false,
    },
  });

  // Write: Create vault
  const {
    writeContract: writeCreateVault,
    isPending: isCreatePending,
    data: createTxHash,
  } = useWriteContract();

  // Write: Unlock vault
  const {
    writeContract: writeUnlockVault,
    isPending: isUnlockPending,
    data: unlockTxHash,
  } = useWriteContract();

  // Write: Void vault
  const {
    writeContract: writeVoidVault,
    isPending: isVoidPending,
    data: voidTxHash,
  } = useWriteContract();

  // Transaction receipts
  const { isLoading: isCreateConfirming } = useWaitForTransactionReceipt({
    hash: createTxHash,
  });

  const { isLoading: isUnlockConfirming } = useWaitForTransactionReceipt({
    hash: unlockTxHash,
  });

  const { isLoading: isVoidConfirming } = useWaitForTransactionReceipt({
    hash: voidTxHash,
  });

  // Create vault wrapper
  const createVault = useCallback(
    async (
      ipfsHash: string,
      encryptedKeyHash: `0x${string}`,
      unlockTime: number,
      description: string,
      fileSize: number
    ) => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        // Validate inputs
        if (!ipfsHash || ipfsHash.length < 44) {
          throw new Error(VAULT_ERRORS.InvalidIPFSHash);
        }

        if (unlockTime <= Date.now() / 1000) {
          throw new Error(VAULT_ERRORS.InvalidUnlockTime);
        }

        if (fileSize <= 0 || fileSize > TALA_VAULT_CONFIG.MAX_FILE_SIZE) {
          throw new Error(VAULT_ERRORS.InvalidFileSize);
        }

        writeCreateVault(
          {
            address: TALA_VAULT_CONFIG.contractAddress,
            abi: TALA_VAULT_ABI,
            functionName: 'createVault',
            args: [ipfsHash, encryptedKeyHash, BigInt(unlockTime), description, BigInt(fileSize)],
          },
          {
            onSuccess: () => {
              setIsLoading(false);
            },
            onError: (err: any) => {
              setError(err.message || 'Failed to create vault');
              setIsLoading(false);
            },
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    },
    [isConnected, address, writeCreateVault]
  );

  // Unlock vault wrapper
  const unlockVault = useCallback(
    async (vaultId: number) => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        writeUnlockVault(
          {
            address: TALA_VAULT_CONFIG.contractAddress,
            abi: TALA_VAULT_ABI,
            functionName: 'unlockVault',
            args: [BigInt(vaultId)],
          },
          {
            onSuccess: () => {
              setIsLoading(false);
            },
            onError: (err: any) => {
              setError(err.message || 'Failed to unlock vault');
              setIsLoading(false);
            },
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    },
    [isConnected, address, writeUnlockVault]
  );

  // Void vault wrapper
  const voidVault = useCallback(
    async (vaultId: number) => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isConnected || !address) {
          throw new Error('Wallet not connected');
        }

        writeVoidVault(
          {
            address: TALA_VAULT_CONFIG.contractAddress,
            abi: TALA_VAULT_ABI,
            functionName: 'voidVault',
            args: [BigInt(vaultId)],
          },
          {
            onSuccess: () => {
              setIsLoading(false);
            },
            onError: (err: any) => {
              setError(err.message || 'Failed to void vault');
              setIsLoading(false);
            },
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    },
    [isConnected, address, writeVoidVault]
  );

  return {
    // State
    isLoading,
    error,
    isConnected,
    address,

    // Data
    vaultData,
    userVaults: (userVaults as bigint[]) || [],
    vaultCount: vaultCount ? Number(vaultCount) : 0,
    canUnlock: canUnlock || false,
    timeToUnlock: timeToUnlock ? Number(timeToUnlock) : 0,

    // Actions
    createVault,
    unlockVault,
    voidVault,

    // Transaction states
    isCreatePending: isCreatePending || isCreateConfirming,
    isUnlockPending: isUnlockPending || isUnlockConfirming,
    isVoidPending: isVoidPending || isVoidConfirming,

    // Refetch functions
    refetchVault,
    refetchUserVaults,
    refetchVaultCount,
    refetchCanUnlock,
    refetchTimeToUnlock,
  };
}
