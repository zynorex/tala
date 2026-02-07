'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, Unlock, FileText, Download, Eye, AlertCircle, Clock,
  User, Calendar, Shield, Loader2, RefreshCw, Key, CheckCircle,
  Copy, Check, ExternalLink, X
} from 'lucide-react';

// ============ TYPES ============

interface SharedVaultData {
  shareId: string;
  permission: 'VIEW_ONLY' | 'DOWNLOAD' | 'FULL_ACCESS';
  requiresPassword: boolean;
  hasSharePassword: boolean;
  vault: {
    id: string;
    name: string;
    description: string | null;
    keyHash: string;
    isLocked: boolean;
    lockStatus: string;
    unlockTime: string | null;
    unlockTimeRemaining: number | null;
    createdAt: string;
    owner: { name: string };
    fileCount: number;
    totalSize: number;
    files?: SharedFile[];
  };
  expiresAt: string | null;
  accessCount: number;
  maxAccessCount: number | null;
}

interface SharedFile {
  id: string;
  fileName: string;
  mimeType: string | null;
  fileSizeBytes: number;
  ipfsHash?: string;
  uploadedAt: string;
}

// ============ HELPER FUNCTIONS ============

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function formatTimeRemaining(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getFileIcon(mimeType: string | null): string {
  if (!mimeType) return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return '📦';
  return '📄';
}

// ============ MAIN COMPONENT ============

export default function SharedVaultPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [data, setData] = useState<SharedVaultData | null>(null);
  
  // Password states
  const [sharePassword, setSharePassword] = useState('');
  const [vaultPassword, setVaultPassword] = useState('');
  const [showSharePasswordInput, setShowSharePasswordInput] = useState(false);
  const [showVaultPasswordInput, setShowVaultPasswordInput] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // File download state
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [decryptedUrls, setDecryptedUrls] = useState<Record<string, string>>({});

  // Fetch shared vault data
  const fetchSharedVault = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      const response = await fetch(`/api/shares/${token}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Failed to load shared vault');
        setErrorCode(result.code || null);
        return;
      }

      setData(result.data);
      
      // Check if share password is needed
      if (result.data.hasSharePassword) {
        setShowSharePasswordInput(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchSharedVault();
    }
  }, [token, fetchSharedVault]);

  // Countdown timer for locked vaults
  const [countdown, setCountdown] = useState<number | null>(null);
  
  useEffect(() => {
    if (data?.vault.unlockTimeRemaining && data.vault.unlockTimeRemaining > 0) {
      setCountdown(data.vault.unlockTimeRemaining);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            fetchSharedVault(); // Refresh when unlocked
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [data?.vault.unlockTimeRemaining, fetchSharedVault]);

  // Verify share password
  const verifySharePassword = useCallback(async () => {
    setAuthenticating(true);
    setAuthError(null);

    try {
      const response = await fetch(`/api/shares/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sharePassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAuthError(result.message || 'Invalid password');
        return;
      }

      setAuthenticated(true);
      setShowSharePasswordInput(false);
      
      // Update files if returned
      if (result.data.files && data) {
        setData({ ...data, vault: { ...data.vault, files: result.data.files } });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setAuthError('Failed to verify password');
    } finally {
      setAuthenticating(false);
    }
  }, [token, sharePassword, data]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="border-4 border-black bg-white p-8 text-center" style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="font-bold">Loading shared vault...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="border-4 border-black bg-white p-8 max-w-md w-full" style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
          <div className="text-center">
            <div className="inline-flex p-4 bg-red-100 border-2 border-black mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-black text-xl mb-2">
              {errorCode === 'SHARE_EXPIRED' && 'Link Expired'}
              {errorCode === 'SHARE_REVOKED' && 'Link Revoked'}
              {errorCode === 'SHARE_EXHAUSTED' && 'Access Limit Reached'}
              {errorCode === 'SHARE_NOT_FOUND' && 'Invalid Link'}
              {errorCode === 'VAULT_INACTIVE' && 'Vault Unavailable'}
              {!errorCode && 'Error'}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 border-4 border-black bg-heirlock-blue font-black hover:brightness-95 transition-all"
              style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { vault, permission, hasSharePassword, expiresAt, accessCount, maxAccessCount } = data;
  const isVaultLocked = vault.isLocked;
  const canDownload = permission === 'DOWNLOAD' || permission === 'FULL_ACCESS';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold hover:underline mb-4">
            ← Back to T.A.L.A.
          </Link>
        </div>

        {/* Main Card */}
        <div className="border-4 border-black bg-white" style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
          {/* Vault Header */}
          <div className={`p-6 border-b-4 border-black ${isVaultLocked ? 'bg-heirlock-yellow' : 'bg-heirlock-green'}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border-2 border-black">
                {isVaultLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h1 className="font-black text-2xl mb-1">{vault.name}</h1>
                {vault.description && (
                  <p className="text-gray-700 text-sm">{vault.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Shared by {vault.owner.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(vault.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Lock Warning */}
          {isVaultLocked && countdown !== null && (
            <div className="p-4 bg-heirlock-yellow/50 border-b-4 border-black">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-black text-sm">Vault is Time-Locked</p>
                  <p className="text-xs text-gray-700">
                    Unlocks in: <span className="font-mono font-bold">{formatTimeRemaining(countdown)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Share Password Gate */}
          {hasSharePassword && !authenticated && showSharePasswordInput && (
            <div className="p-6 border-b-4 border-black bg-gray-50">
              <div className="flex items-start gap-3 mb-4">
                <Key className="w-5 h-5 mt-0.5" />
                <div>
                  <h2 className="font-black text-sm">Share Password Required</h2>
                  <p className="text-xs text-gray-600">
                    This share link requires a password to access.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="password"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifySharePassword()}
                  placeholder="Enter share password"
                  className="flex-1 p-2 border-2 border-black font-mono text-sm"
                  autoFocus
                />
                <button
                  onClick={verifySharePassword}
                  disabled={authenticating || !sharePassword}
                  className="px-4 py-2 border-2 border-black bg-heirlock-green font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {authenticating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Verify
                </button>
              </div>
              
              {authError && (
                <p className="text-red-600 text-xs mt-2 font-bold">{authError}</p>
              )}
            </div>
          )}

          {/* Permission Badge & Info */}
          <div className="p-4 border-b-2 border-black bg-gray-50">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 border-2 border-black font-bold text-xs flex items-center gap-1 ${
                permission === 'VIEW_ONLY' ? 'bg-gray-200' :
                permission === 'DOWNLOAD' ? 'bg-heirlock-blue' :
                'bg-heirlock-green'
              }`}>
                {permission === 'VIEW_ONLY' && <Eye className="w-3 h-3" />}
                {permission === 'DOWNLOAD' && <Download className="w-3 h-3" />}
                {permission === 'FULL_ACCESS' && <Shield className="w-3 h-3" />}
                {permission.replace('_', ' ')}
              </span>
              
              <span className="text-xs text-gray-500">
                {vault.fileCount} file{vault.fileCount !== 1 ? 's' : ''} • {formatFileSize(vault.totalSize)}
              </span>
              
              {maxAccessCount && (
                <span className="text-xs text-gray-500">
                  Views: {accessCount}/{maxAccessCount}
                </span>
              )}
              
              {expiresAt && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires: {new Date(expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Files List */}
          {(!hasSharePassword || authenticated) && !isVaultLocked && (
            <div className="divide-y-2 divide-black">
              {vault.files && vault.files.length > 0 ? (
                vault.files.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    canDownload={canDownload}
                    token={token}
                    sharePassword={sharePassword}
                    vaultPassword={vaultPassword}
                    onDownloadStart={() => setDownloadingFile(file.id)}
                    onDownloadEnd={() => setDownloadingFile(null)}
                    isDownloading={downloadingFile === file.id}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No files in this vault</p>
                </div>
              )}
            </div>
          )}

          {/* Locked Vault Message */}
          {isVaultLocked && (
            <div className="p-8 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-black text-lg mb-2">Vault is Locked</h3>
              <p className="text-gray-600 text-sm">
                Files will be accessible once the time-lock expires.
              </p>
            </div>
          )}

          {/* Download Instructions */}
          {canDownload && !isVaultLocked && (!hasSharePassword || authenticated) && vault.files && vault.files.length > 0 && (
            <div className="p-4 bg-heirlock-pink/30 border-t-4 border-black">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Vault Password Required for Download</p>
                  <p className="text-gray-700">
                    To download and decrypt files, you&apos;ll need the vault password, which should be shared separately by the vault owner.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Shared via <Link href="/" className="font-bold hover:underline">T.A.L.A.</Link> - Time-locked Asset Legacy Archive
        </div>
      </div>
    </div>
  );
}

// ============ FILE ITEM COMPONENT ============

interface FileItemProps {
  file: SharedFile;
  canDownload: boolean;
  token: string;
  sharePassword: string;
  vaultPassword: string;
  onDownloadStart: () => void;
  onDownloadEnd: () => void;
  isDownloading: boolean;
}

function FileItem({
  file,
  canDownload,
  token,
  sharePassword,
  vaultPassword,
  onDownloadStart,
  onDownloadEnd,
  isDownloading,
}: FileItemProps) {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!password) {
      setShowPasswordPrompt(true);
      return;
    }

    onDownloadStart();
    setError(null);

    try {
      // Get file metadata
      const response = await fetch(`/api/shares/${token}/files/${file.id}`, {
        headers: sharePassword ? { 'x-share-password': sharePassword } : {},
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get file');
      }

      const fileData = result.data.file;

      // Fetch encrypted file from IPFS
      const ipfsResponse = await fetch(
        `https://gateway.pinata.cloud/ipfs/${fileData.ipfsHash}`
      );

      if (!ipfsResponse.ok) {
        throw new Error('Failed to fetch file from IPFS');
      }

      const encryptedData = await ipfsResponse.arrayBuffer();

      // Decrypt the file (simplified - actual impl should use crypto library)
      // This would need the actual decryption logic from the app
      const decryptedBlob = await decryptFile(
        encryptedData,
        password,
        fileData.encryptionSalt,
        fileData.encryptionIV,
        fileData.encryptionAuthTag
      );

      // Download the file
      const url = URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowPasswordPrompt(false);
      setPassword('');
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      onDownloadEnd();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <div className="text-2xl">{getFileIcon(file.mimeType)}</div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{file.fileName}</p>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.fileSizeBytes)} • {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Download Button */}
        {canDownload && file.ipfsHash && (
          <button
            onClick={() => setShowPasswordPrompt(true)}
            disabled={isDownloading}
            className="p-2 border-2 border-black bg-heirlock-blue hover:brightness-95 transition-all disabled:opacity-50"
            title="Download"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Password Prompt (inline) */}
      {showPasswordPrompt && (
        <div className="mt-3 p-3 bg-gray-50 border-2 border-black">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold">Enter vault password to decrypt</p>
            <button onClick={() => setShowPasswordPrompt(false)} className="p-1 hover:bg-gray-200">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              placeholder="Vault password"
              className="flex-1 p-2 border-2 border-black font-mono text-xs"
              autoFocus
            />
            <button
              onClick={handleDownload}
              disabled={!password || isDownloading}
              className="px-3 py-2 border-2 border-black bg-heirlock-green font-bold text-xs disabled:opacity-50"
            >
              {isDownloading ? 'Decrypting...' : 'Download'}
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}

// ============ PLACEHOLDER DECRYPT FUNCTION ============
// This should be replaced with actual decryption logic from the existing crypto module

async function decryptFile(
  encryptedData: ArrayBuffer,
  password: string,
  salt: string,
  iv: string,
  authTag: string
): Promise<Blob> {
  // Import the actual crypto utilities
  const { decryptWithPassword } = await import('@/lib/crypto/encryption');
  
  // Convert ArrayBuffer to base64
  const base64 = btoa(
    Array.from(new Uint8Array(encryptedData))
      .map(b => String.fromCharCode(b))
      .join('')
  );
  
  try {
    const decrypted = await decryptWithPassword(base64, password, {
      iv,
      salt,
      authTag,
    });
    
    // decrypted is already a Blob or ArrayBuffer
    if (decrypted instanceof Blob) {
      return decrypted;
    }
    return new Blob([decrypted]);
  } catch (err) {
    throw new Error('Decryption failed. Check the vault password.');
  }
}
