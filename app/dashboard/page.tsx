'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Unlock, Trash2, Eye, Plus, Loader, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useVaultContract } from '@/app/hooks/useVaultContract';
import { useCountdown } from '@/app/hooks/useCountdown';
import { useToast } from '@/app/hooks/useToast';

interface VaultWithMetadata {
  id: number;
  creator: string;
  ipfsHash: string;
  encryptedKeyHash: string;
  unlockTime: bigint;
  createdAt: bigint;
  voided: boolean;
  description: string;
  fileSize: bigint;
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const { userVaults, vaultCount, error, isLoading: isVaultsLoading, refetchUserVaults } = useVaultContract();
  const [vaultsData, setVaultsData] = useState<VaultWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load vaults when userVaults changes
  useEffect(() => {
    if (userVaults && userVaults.length > 0) {
      // In a real implementation, you'd fetch full vault data
      // For now, we'll show vault IDs and basic info
      setVaultsData(
        userVaults.map((id) => ({
          id: Number(id),
          creator: address || '',
          ipfsHash: '',
          encryptedKeyHash: '0x' as any,
          unlockTime: 0n,
          createdAt: 0n,
          voided: false,
          description: 'Loading...',
          fileSize: 0n,
        }))
      );
    }
  }, [userVaults, address]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal text-center">
            <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" />
            <h2 className="text-3xl font-black text-black mb-2">Wallet Not Connected</h2>
            <p className="text-gray-800 font-medium mb-6">
              Please connect your wallet to view and manage your vaults.
            </p>
            <p className="text-sm text-gray-700 font-medium">
              Click the "Connect Wallet" button in the top right to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-black">YOUR VAULTS</h1>
          <p className="text-xl text-gray-800 font-medium">
            Manage your time-locked vaults and encrypted content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-4 border-black p-6 bg-heirlock-pink shadow-brutal">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-black uppercase mb-2">Total Vaults</p>
                <p className="text-4xl font-black text-black">{vaultCount || 0}</p>
              </div>
              <Lock className="w-12 h-12 text-black opacity-20" />
            </div>
          </div>

          <div className="border-4 border-black p-6 bg-heirlock-blue shadow-brutal">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-black uppercase mb-2">Wallet Address</p>
                <code className="text-sm font-mono text-black break-all">{address?.slice(0, 10)}...{address?.slice(-8)}</code>
              </div>
              <CheckCircle className="w-12 h-12 text-black opacity-20" />
            </div>
          </div>
        </div>

        {/* Create New Vault Button */}
        <Link href="/create-vault">
          <button className="w-full px-8 py-6 bg-black text-heirlock-yellow font-black border-4 border-black shadow-brutal hover:translate-y-[-3px] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 text-xl">
            <Plus className="w-6 h-6" />
            <span>Create New Vault</span>
          </button>
        </Link>

        {/* Vaults List */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-black uppercase">Vault List</h2>

          {isVaultsLoading || isLoading ? (
            <div className="border-4 border-black p-12 bg-cream shadow-brutal text-center">
              <Loader className="w-8 h-8 text-black mx-auto mb-4 animate-spin" />
              <p className="font-black text-black">Loading vaults...</p>
            </div>
          ) : error ? (
            <div className="border-4 border-black p-6 bg-red-50 shadow-brutal">
              <p className="text-sm text-red-700 font-black flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          ) : vaultCount === 0 ? (
            <div className="border-4 border-black p-12 bg-heirlock-green shadow-brutal text-center space-y-6">
              <Lock className="w-12 h-12 text-black mx-auto" />
              <div>
                <h3 className="text-2xl font-black text-black mb-2">No Vaults Yet</h3>
                <p className="text-gray-800 font-medium mb-6">
                  Create your first vault to start storing encrypted content securely
                </p>
              </div>
              <Link href="/create-vault">
                <button className="px-8 py-4 bg-black text-heirlock-green font-black border-4 border-black shadow-brutal hover:translate-y-[-2px] transition-all duration-200">
                  Create First Vault
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {vaultsData.map((vault) => (
                <VaultCard key={vault.id} vault={vault} />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal space-y-4">
          <h3 className="text-2xl font-black text-black uppercase">About Your Vaults</h3>
          <ul className="space-y-3 text-sm text-gray-800 font-medium">
            <li className="flex items-start gap-3">
              <span className="text-black font-black mt-1">→</span>
              <span>Each vault is encrypted with AES-256-GCM - military-grade security</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-black mt-1">→</span>
              <span>Only you have the decryption key. We can't access your data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-black mt-1">→</span>
              <span>Vaults are stored on IPFS for decentralized availability</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-black font-black mt-1">→</span>
              <span>Time-locks are enforced by smart contract on Polygon blockchain</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

/**
 * Individual Vault Card Component
 */
function VaultCard({ vault }: { vault: VaultWithMetadata }) {
  const { canUnlock, refetchCanUnlock, refetchTimeToUnlock, voidVault, isVoidPending } = useVaultContract();
  const timeRemaining = useCountdown(vault.unlockTime);
  const { toast } = useToast();

  const handleVoid = async () => {
    if (!confirm('Are you sure you want to void this vault? This action cannot be undone.')) {
      return;
    }

    try {
      await voidVault(vault.id);
      toast('Vault voided successfully', 'success');
    } catch (error) {
      toast('Failed to void vault', 'error');
    }
  };

  const formatFileSize = (bytes: bigint) => {
    const num = Number(bytes);
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return Math.round((num / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      className={`border-4 border-black p-6 shadow-brutal hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200 ${
        vault.voided ? 'bg-gray-200' : timeRemaining.isUnlocked ? 'bg-heirlock-green' : 'bg-white'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-black text-black mb-2">Vault #{vault.id}</h3>
            <p className="text-gray-800 font-medium">{vault.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {vault.voided ? (
              <span className="px-3 py-1 bg-gray-400 text-black font-black text-xs border-2 border-black">
                VOIDED
              </span>
            ) : timeRemaining.isUnlocked ? (
              <span className="px-3 py-1 bg-green-400 text-black font-black text-xs border-2 border-black flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                UNLOCKED
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-300 text-black font-black text-xs border-2 border-black flex items-center gap-1">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-black text-black uppercase mb-1">File Size</p>
            <p className="font-mono text-sm text-gray-800">{formatFileSize(vault.fileSize)}</p>
          </div>

          {!vault.voided && !timeRemaining.isUnlocked && (
            <>
              <div>
                <p className="text-xs font-black text-black uppercase mb-1">Days</p>
                <p className="text-2xl font-black text-black">{timeRemaining.days}</p>
              </div>

              <div>
                <p className="text-xs font-black text-black uppercase mb-1">Hours</p>
                <p className="text-2xl font-black text-black">{timeRemaining.hours}</p>
              </div>

              <div>
                <p className="text-xs font-black text-black uppercase mb-1">Minutes</p>
                <p className="text-2xl font-black text-black">{timeRemaining.minutes}</p>
              </div>
            </>
          )}

          {timeRemaining.isUnlocked && (
            <div className="col-span-2 md:col-span-3">
              <p className="text-xs font-black text-black uppercase mb-1">Status</p>
              <p className="font-black text-green-600 text-sm">Ready to unlock and access content</p>
            </div>
          )}
        </div>

        {/* IPFS Hash */}
        <div className="border-t-3 border-black pt-4">
          <p className="text-xs font-black text-black uppercase mb-2">IPFS Hash</p>
          <code className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-2 border-2 border-black block">
            {vault.ipfsHash || 'Loading...'}
          </code>
        </div>

        {/* Actions */}
        <div className="border-t-3 border-black pt-4 flex gap-3">
          <Link href={`/vault/${vault.id}`} className="flex-1">
            <button className="w-full px-4 py-3 bg-black text-heirlock-yellow font-black border-3 border-black shadow-brutal hover:translate-y-[-2px] transition-all duration-200 flex items-center justify-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </Link>

          {!vault.voided && (
            <button
              onClick={handleVoid}
              disabled={isVoidPending}
              className="px-4 py-3 bg-red-500 text-white font-black border-3 border-red-600 shadow-brutal hover:translate-y-[-2px] transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVoidPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
