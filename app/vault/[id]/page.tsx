'use client';

import { useAccount } from 'wagmi';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Download, Unlock, AlertCircle, Loader, Copy, CheckCircle, Shield } from 'lucide-react';
import { useVaultContract } from '@/app/hooks/useVaultContract';
import { useCountdown } from '@/app/hooks/useCountdown';
import { useToast } from '@/app/hooks/useToast';
import { downloadFromIPFS } from '@/lib/ipfs/ipfs';
import { decrypt } from '@/lib/crypto/encryption';

interface VaultDetails {
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

export default function VaultDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vaultId = params.id as string;
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  const { unlockVault, isUnlockPending } = useVaultContract();

  const [vault, setVault] = useState<VaultDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const timeRemaining = useCountdown(vault?.unlockTime || 0);

  // Load vault (simulated - in production, fetch from contract)
  useEffect(() => {
    if (!vaultId) {
      setIsLoading(false);
      return;
    }

    // Simulate loading vault data
    setTimeout(() => {
      setVault({
        id: Number(vaultId),
        creator: address || '',
        ipfsHash: 'Qm...',
        encryptedKeyHash: '0x...',
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7), // 7 days
        createdAt: BigInt(Math.floor(Date.now() / 1000)),
        voided: false,
        description: 'Example vault description',
        fileSize: BigInt(1024 * 1024 * 5), // 5MB
      });
      setIsLoading(false);
    }, 500);
  }, [vaultId, address]);

  const handleUnlock = async () => {
    if (!vault) return;

    try {
      await unlockVault(vault.id);
      toast('Vault unlocked successfully!', 'success');
    } catch (error) {
      toast('Failed to unlock vault', 'error');
    }
  };

  const handleDownload = async () => {
    if (!vault || !decryptionKey) {
      toast('Please provide decryption key', 'error');
      return;
    }

    setIsDownloading(true);

    try {
      toast('Downloading from IPFS...', 'info');

      // Download encrypted file
      const { data } = await downloadFromIPFS(vault.ipfsHash);

      toast('Decrypting file...', 'info');

      // Decrypt file
      const keyBuffer = Buffer.from(decryptionKey, 'hex');
      const encryptedData = JSON.parse(data.toString());
      const decrypted = decrypt(encryptedData, keyBuffer);

      // Download decrypted file
      const blob = new Blob([Buffer.from(decrypted)], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vault-${vault.id}-content`;
      a.click();
      URL.revokeObjectURL(url);

      toast('File downloaded and decrypted successfully!', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Failed to download vault', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard', 'success');
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: bigint) => {
    const num = Number(bytes);
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return Math.round((num / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal text-center">
            <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" />
            <h2 className="text-3xl font-black text-black mb-2">Wallet Not Connected</h2>
            <p className="text-gray-800 font-medium">
              Please connect your wallet to access this vault.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-12 bg-cream shadow-brutal text-center">
            <Loader className="w-8 h-8 text-black mx-auto mb-4 animate-spin" />
            <p className="font-black text-black">Loading vault details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-black text-heirlock-yellow font-black border-3 border-black shadow-brutal hover:translate-y-[-2px] transition-all duration-200">
              ← Back to Dashboard
            </button>
          </Link>

          <div className="border-4 border-black p-8 bg-red-50 shadow-brutal text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-black mb-2">Vault Not Found</h2>
            <p className="text-gray-800 font-medium">
              The vault you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-black text-heirlock-yellow font-black border-3 border-black shadow-brutal hover:translate-y-[-2px] transition-all duration-200">
            ← Back to Dashboard
          </button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-black text-black">Vault #{vault.id}</h1>
            <span
              className={`px-4 py-2 font-black text-sm border-3 border-black ${
                vault.voided
                  ? 'bg-gray-400 text-black'
                  : timeRemaining.isUnlocked
                    ? 'bg-green-400 text-black'
                    : 'bg-yellow-300 text-black'
              }`}
            >
              {vault.voided ? 'VOIDED' : timeRemaining.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>
          <p className="text-xl text-gray-800 font-medium">{vault.description}</p>
        </div>

        {/* Vault Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-4 border-black p-6 bg-heirlock-blue shadow-brutal">
            <p className="text-xs font-black text-black uppercase mb-2">File Size</p>
            <p className="text-3xl font-black text-black">{formatFileSize(vault.fileSize)}</p>
          </div>

          <div className="border-4 border-black p-6 bg-heirlock-pink shadow-brutal">
            <p className="text-xs font-black text-black uppercase mb-2">Created</p>
            <p className="text-sm text-gray-800 font-medium">{formatDate(vault.createdAt)}</p>
          </div>
        </div>

        {/* Countdown or Status */}
        {!vault.voided && !timeRemaining.isUnlocked ? (
          <div className="border-4 border-black p-8 bg-heirlock-yellow shadow-brutal">
            <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Time Until Unlock
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-4xl font-black text-black">{timeRemaining.days}</p>
                <p className="text-xs font-black text-black uppercase mt-2">Days</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-black">{timeRemaining.hours}</p>
                <p className="text-xs font-black text-black uppercase mt-2">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-black">{timeRemaining.minutes}</p>
                <p className="text-xs font-black text-black uppercase mt-2">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-black">{timeRemaining.seconds}</p>
                <p className="text-xs font-black text-black uppercase mt-2">Seconds</p>
              </div>
            </div>
            <p className="text-sm text-gray-800 font-medium mt-6">
              Unlock Date: {formatDate(vault.unlockTime)}
            </p>
          </div>
        ) : timeRemaining.isUnlocked ? (
          <div className="border-4 border-black p-8 bg-heirlock-green shadow-brutal">
            <div className="flex items-center gap-3 mb-4">
              <Unlock className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-black text-black">Vault Unlocked!</h3>
            </div>
            <p className="text-gray-800 font-medium">
              This vault is now accessible. You can unlock the smart contract and download your content.
            </p>
          </div>
        ) : null}

        {/* Security Info */}
        <div className="border-4 border-black p-6 bg-white shadow-brutal">
          <h3 className="font-black text-black text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Information
          </h3>
          <div className="space-y-3 text-sm text-gray-800 font-medium">
            <p>
              <strong>IPFS Hash:</strong>
              <code className="block mt-1 p-2 bg-gray-50 border-2 border-black font-mono text-xs break-all">
                {vault.ipfsHash}
              </code>
            </p>
            <p>
              <strong>Encrypted Key Hash (on-chain):</strong>
              <code className="block mt-1 p-2 bg-gray-50 border-2 border-black font-mono text-xs break-all">
                {vault.encryptedKeyHash}
              </code>
            </p>
            <p className="text-xs text-gray-700 italic mt-4">
              Your encryption key is stored locally and never transmitted to our servers. This ensures
              complete privacy and security of your data.
            </p>
          </div>
        </div>

        {/* Decrypt Key Input */}
        {timeRemaining.isUnlocked && !vault.voided && (
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-black">Access Content</h3>

            <div className="border-4 border-black p-6 bg-white shadow-brutal space-y-4">
              <div>
                <label className="font-black text-black text-sm uppercase block mb-2">
                  Encryption Key (Hex Format) *
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={decryptionKey}
                    onChange={(e) => setDecryptionKey(e.target.value)}
                    placeholder="Paste your encryption key here"
                    className="w-full px-4 py-3 border-3 border-black bg-cream font-mono text-xs text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-black text-black underline"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-gray-700 font-medium mt-2">
                  Paste the encryption key you saved when creating this vault
                </p>
              </div>

              <button
                onClick={handleDownload}
                disabled={!decryptionKey || isDownloading}
                className={`w-full px-6 py-4 font-black border-4 border-black shadow-brutal flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
                  !decryptionKey || isDownloading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-black text-heirlock-yellow hover:translate-y-[-3px] hover:shadow-lg'
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Downloading & Decrypting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download & Decrypt</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-4 border-black p-4 bg-heirlock-yellow shadow-brutal">
              <p className="text-sm text-gray-800 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Your file will be decrypted in your browser. We never have access to your encryption key
                  or decrypted content.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Unlock Button for Creator */}
        {timeRemaining.isUnlocked && !vault.voided && address?.toLowerCase() === vault.creator.toLowerCase() && (
          <button
            onClick={handleUnlock}
            disabled={isUnlockPending}
            className={`w-full px-8 py-4 font-black border-4 border-black shadow-brutal flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
              isUnlockPending ? 'bg-gray-400 text-gray-600' : 'bg-green-400 text-black hover:translate-y-[-3px] hover:shadow-lg'
            }`}
          >
            {isUnlockPending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Unlocking on Blockchain...</span>
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5" />
                <span>Unlock on Smart Contract</span>
              </>
            )}
          </button>
        )}

        {/* Voided Notice */}
        {vault.voided && (
          <div className="border-4 border-black p-6 bg-gray-300 shadow-brutal">
            <p className="font-black text-black text-lg flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              This vault has been voided and is no longer accessible.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
