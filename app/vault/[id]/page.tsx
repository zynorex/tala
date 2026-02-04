'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { 
  Lock, Download, Share2, Trash2, Edit2, Shield, Clock, FileText, 
  ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Copy, MoreVertical,
  Calendar, HardDrive, Activity, FileIcon, Zap, ExternalLink, RefreshCw,
  User, Key, Hash, BarChart3, Lock as LockIcon
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useFileDownload, VaultLockedError } from '@/app/hooks/useFileDownload';
import { PasswordPromptModal } from '@/app/components/PasswordPromptModal';
import { VaultUnlockStatusComponent } from '@/app/components/VaultUnlockStatus';

interface VaultData {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  fileHash?: string;
  keyHash?: string;
  unlockTime?: string;
  lockStatus?: string;
  isActive: boolean;
  isDemo?: boolean;
  demoExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  files: VaultFile[];
}

interface VaultFile {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string | null;
  ipfsHash: string;
  fileHash?: string;
  uploadedAt: string;
  isActive?: boolean;
  deletedAt?: string | null;
}

interface ActivityLogEntry {
  id: string;
  userId: string;
  action: string;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function VaultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  
  const [vault, setVault] = useState<VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showFileHash, setShowFileHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'activity'>('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFileForDownload, setSelectedFileForDownload] = useState<VaultFile | null>(null);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedUntilTime, setLockedUntilTime] = useState<string | null>(null);
  const { downloadAndDecryptFile, isDownloading, progress } = useFileDownload();

  // Resolve params
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Load vault data from API
  useEffect(() => {
    if (!isConnected || !id || !address) return;

    const fetchVault = async () => {
      try {
        setIsLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          toast('Please sign in to view vault details', 'error');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/vaults/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to load vault: ${response.status}`);
        }

        const data = await response.json();
        // Handle API response structure
        const vaultData = data.data || data;
        setVault(vaultData);
        setEditedName(vaultData.name);
        setEditedDescription(vaultData.description || '');
      } catch (error) {
        console.error('Error loading vault:', error);
        toast(
          error instanceof Error ? error.message : 'Failed to load vault details',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVault();
  }, [isConnected, id, address, toast]);

  // Disconnect/permission check
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-6">Please connect your wallet to view vault details</p>
            <Link 
              href="/dashboard" 
              className="inline-block px-6 py-3 bg-black text-white font-black border-3 border-black hover:opacity-90"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="border-4 border-black p-6 bg-gray-100 h-32"></div>
                <div className="border-4 border-black p-6 bg-gray-100 h-48"></div>
              </div>
              <div className="space-y-6">
                <div className="border-4 border-black p-6 bg-gray-100 h-32"></div>
                <div className="border-4 border-black p-6 bg-gray-100 h-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 404 state
  if (!vault) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Vault Not Found</h1>
            <p className="text-sm mb-6">The vault you're looking for doesn't exist or you don't have access to it.</p>
            <Link 
              href="/dashboard" 
              className="inline-block px-6 py-3 bg-black text-white font-black border-3 border-black hover:opacity-90"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast(`${label} copied!`, 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUpdateVault = async () => {
    if (!editedName.trim()) {
      toast('Vault name cannot be empty', 'error');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast('Please sign in to update vault', 'error');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/vaults/${vault?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedName.trim(),
          description: editedDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vault');
      }

      const updated = await response.json();
      setVault(updated);
      setIsEditing(false);
      toast('Vault updated successfully', 'success');
    } catch (error) {
      console.error('Error updating vault:', error);
      toast('Failed to update vault', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteVault = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast('Please type DELETE to confirm', 'error');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast('Please sign in to delete vault', 'error');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/vaults/${vault?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete vault');
      }

      toast('Vault deleted successfully', 'success');
      setTimeout(() => window.location.href = '/dashboard', 1000);
    } catch (error) {
      console.error('Error deleting vault:', error);
      toast('Failed to delete vault', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadFile = async (file: VaultFile) => {
    setSelectedFileForDownload(file);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (password: string) => {
    console.log('[VaultPage] handlePasswordSubmit called', {
      hasSelectedFile: !!selectedFileForDownload,
      fileId: selectedFileForDownload?.id,
      fileName: selectedFileForDownload?.fileName,
    });
    
    if (!selectedFileForDownload) {
      toast('No file selected', 'error');
      return;
    }

    try {
      setDownloadingFileId(selectedFileForDownload.id);
      setShowPasswordModal(false);

      console.log('[VaultPage] Calling downloadAndDecryptFile...');
      await downloadAndDecryptFile({
        vaultId: vault.id,
        fileId: selectedFileForDownload.id,
        fileName: selectedFileForDownload.fileName,
        password,
      });

      console.log('[VaultPage] Download completed successfully');
      toast(`File "${selectedFileForDownload.fileName}" downloaded successfully!`, 'success');
    } catch (error) {
      console.error('[VaultPage] Error downloading file:', error);
      
      // Handle vault locked error with nice modal
      if (error instanceof VaultLockedError) {
        // Format the unlock time nicely
        let formattedTime = 'the scheduled time';
        if (error.unlockTime) {
          try {
            const unlockDate = new Date(error.unlockTime);
            formattedTime = unlockDate.toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          } catch (e) {
            console.error('Failed to parse unlock time:', e);
          }
        }
        setLockedUntilTime(formattedTime);
        setShowLockedModal(true);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      toast(errorMessage, 'error');
    } finally {
      setDownloadingFileId(null);
      setSelectedFileForDownload(null);
    }
  };

  const handleDeleteFile = async (file: VaultFile) => {
    if (!confirm(`Delete file "${file.fileName}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingFileId(file.id);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast('Please sign in to delete file', 'error');
        setDeletingFileId(null);
        return;
      }

      const response = await fetch(`/api/vaults/${vault?.id}/files/${file.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Update vault data
      setVault(prev => prev ? {
        ...prev,
        files: prev.files.map(f => f.id === file.id ? { ...f, deletedAt: new Date().toISOString() } : f)
      } : null);

      toast('File deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast('Failed to delete file', 'error');
    } finally {
      setDeletingFileId(null);
    }
  };

  // Safe access to files with fallback to empty array
  const activeFiles = vault?.files?.filter(f => f.isActive && !f.deletedAt) || [];
  const deletedFiles = vault?.files?.filter(f => !f.isActive || f.deletedAt) || [];

  // Show not found state
  if (!vault && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Vault Not Found</h1>
            <p className="text-sm mb-6">The vault you're looking for doesn't exist or you don't have access to it.</p>
            <Link 
              href="/dashboard" 
              className="inline-block px-6 py-3 bg-black text-white font-black border-3 border-black hover:opacity-90"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-black font-black hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-100 border-2 border-black rounded transition-all"
              title="Refresh vault data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 border-2 border-black rounded transition-all"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Vault Info Card */}
            <div className="border-4 border-black p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-black text-gray-600 block mb-2">VAULT NAME</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full p-3 border-3 border-black font-black text-lg"
                          placeholder="Vault name"
                          disabled={isUpdating}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-600 block mb-2">DESCRIPTION</label>
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="w-full p-3 border-3 border-black font-mono text-sm resize-none"
                          rows={3}
                          placeholder="Optional description"
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateVault}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                          {isUpdating ? 'Updating...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedName(vault.name);
                            setEditedDescription(vault.description || '');
                          }}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-gray-200 text-black border-2 border-black font-black text-xs hover:bg-gray-300 disabled:opacity-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-4xl font-black mb-2 break-words">{vault.name}</h1>
                      {vault.description && (
                        <p className="text-sm text-gray-700 mb-3">{vault.description}</p>
                      )}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-black text-heirlock-blue underline flex items-center gap-1 hover:opacity-70 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Vault Info
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="border-4 border-heirlock-green bg-heirlock-green text-black p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-xs font-black">ACTIVE VAULT</p>
                  <p className="text-sm font-mono font-black">{activeFiles.length} file{activeFiles.length !== 1 ? 's' : ''} stored</p>
                </div>
              </div>
            </div>

            {/* ⏰ VAULT UNLOCK STATUS - RIGID STATE CHECK */}
            <VaultUnlockStatusComponent 
              vaultId={vault.id}
              onUnlockEligibilityChange={(canUnlock, status) => {
                // You can use this callback to enable/disable file downloads
              }}
            />

            {/* Tab Navigation */}
            <div className="border-4 border-black bg-white flex gap-0">
              {(['overview', 'files', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 font-black text-xs border-r-4 border-black last:border-r-0 transition-all uppercase ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'files' && '📁 Files'}
                  {tab === 'activity' && '📝 Activity'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-4 border-black p-4 bg-white">
                    <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      CREATED
                    </p>
                    <p className="font-mono text-sm">{formatDate(vault.createdAt)}</p>
                  </div>

                  <div className="border-4 border-black p-4 bg-white">
                    <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      LAST UPDATED
                    </p>
                    <p className="font-mono text-sm">{formatDate(vault.updatedAt)}</p>
                  </div>

                  <div className="border-4 border-black p-4 bg-white">
                    <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      TOTAL SIZE
                    </p>
                    <p className="font-mono text-sm">{formatFileSize(vault.files.reduce((sum, f) => sum + f.fileSizeBytes, 0))}</p>
                  </div>

                  <div className="border-4 border-black p-4 bg-white">
                    <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      FILE COUNT
                    </p>
                    <p className="font-mono text-sm">{activeFiles.length} active {deletedFiles.length > 0 && `+ ${deletedFiles.length} deleted`}</p>
                  </div>
                </div>

                {/* Security Info */}
                <div className="border-4 border-heirlock-blue bg-blue-50 p-6">
                  <p className="text-xs font-black text-heirlock-blue mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    ENCRYPTION & SECURITY
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">AES-256-GCM Encryption</p>
                        <p className="text-xs text-gray-600">Files encrypted end-to-end</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">IPFS Distributed Storage</p>
                        <p className="text-xs text-gray-600">Decentralized file storage</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">SHA-256 Integrity Verification</p>
                        <p className="text-xs text-gray-600">Files verified against file hash</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                {activeFiles.length === 0 ? (
                  <div className="border-4 border-dashed border-gray-300 p-8 text-center bg-gray-50">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-black text-gray-600">No files in this vault</p>
                    <p className="text-sm text-gray-500 mt-2">Upload files to get started</p>
                  </div>
                ) : (
                  activeFiles.map((file) => (
                    <div key={file.id} className="border-4 border-black p-4 bg-white hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileIcon className="w-5 h-5 flex-shrink-0" />
                            <h3 className="font-black truncate">{file.fileName}</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <p className="font-black text-gray-600">Size</p>
                              <p className="font-mono">{formatFileSize(file.fileSizeBytes)}</p>
                            </div>
                            <div>
                              <p className="font-black text-gray-600">Type</p>
                              <p className="font-mono">{file.mimeType || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="font-black text-gray-600">Uploaded</p>
                              <p className="font-mono">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-black text-gray-600">Status</p>
                              <p className="font-mono text-heirlock-green font-black">Active</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleDownloadFile(file)}
                            disabled={downloadingFileId === file.id}
                            className="p-2 hover:bg-heirlock-green hover:text-white border-2 border-black transition-all disabled:opacity-50"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file)}
                            disabled={deletingFileId === file.id}
                            className="p-2 hover:bg-red-500 hover:text-white border-2 border-black transition-all disabled:opacity-50"
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* File Hash */}
                      {showFileHash === file.id && (
                        <div className="mt-3 pt-3 border-t-2 border-gray-200">
                          <p className="text-xs font-black text-gray-600 mb-2">FILE HASH</p>
                          <div className="flex gap-2">
                            <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-gray-300">
                              {file.fileHash}
                            </code>
                            <button
                              onClick={() => copyToClipboard(file.fileHash, `Hash: ${file.fileName}`)}
                              className={`px-2 py-1 font-black border-2 border-black text-xs transition-all flex-shrink-0 ${
                                copied === `Hash: ${file.fileName}`
                                  ? 'bg-heirlock-green text-white border-heirlock-green'
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                            >
                              {copied === `Hash: ${file.fileName}` ? '✓' : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Deleted Files */}
                {deletedFiles.length > 0 && (
                  <details className="border-4 border-gray-300 p-4 bg-gray-50">
                    <summary className="font-black cursor-pointer text-gray-600 hover:text-black">
                      📁 Deleted Files ({deletedFiles.length})
                    </summary>
                    <div className="mt-4 space-y-3">
                      {deletedFiles.map((file) => (
                        <div key={file.id} className="border-2 border-gray-300 p-3 bg-white opacity-60">
                          <div className="flex items-center gap-2">
                            <FileIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm truncate">{file.fileName}</span>
                            <span className="text-xs font-black text-gray-500 ml-auto">Deleted {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="border-4 border-black p-6 bg-white">
                {vault.activityLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 font-black">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {vault.activityLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="border-l-4 border-heirlock-blue pl-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black uppercase">{log.action}</p>
                          <p className="text-xs text-gray-500 font-mono">{formatDate(log.createdAt)}</p>
                        </div>
                        {log.description && (
                          <p className="text-xs text-gray-700 mt-1">{log.description}</p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-gray-500 mt-1">IP: {log.ipAddress}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Security & Stats */}
          <div className="space-y-6">
            {/* Vault ID Card */}
            <div className="border-4 border-black p-4 bg-white">
              <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                VAULT ID
              </p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-black">
                  {vault.id.substring(0, 16)}...
                </code>
                <button
                  onClick={() => copyToClipboard(vault.id, 'Vault ID')}
                  className={`px-2 py-2 font-black border-2 border-black text-xs transition-all flex-shrink-0 ${
                    copied === 'Vault ID'
                      ? 'bg-heirlock-green text-white border-heirlock-green'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {copied === 'Vault ID' ? '✓' : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Key Hash Card */}
            {vault.keyHash && (
            <div className="border-4 border-black p-4 bg-white">
              <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                KEY HASH
              </p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-black">
                  {vault.keyHash.substring(0, 16)}...
                </code>
                <button
                  onClick={() => copyToClipboard(vault.keyHash, 'Key Hash')}
                  className={`px-2 py-2 font-black border-2 border-black text-xs transition-all flex-shrink-0 ${
                    copied === 'Key Hash'
                      ? 'bg-heirlock-green text-white border-heirlock-green'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {copied === 'Key Hash' ? '✓' : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            )}

            {/* File Hash Card */}
            {vault.fileHash && (
            <div className="border-4 border-black p-4 bg-white">
              <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                FILE HASH
              </p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-black">
                  {vault.fileHash.substring(0, 16)}...
                </code>
                <button
                  onClick={() => copyToClipboard(vault.fileHash, 'File Hash')}
                  className={`px-2 py-2 font-black border-2 border-black text-xs transition-all flex-shrink-0 ${
                    copied === 'File Hash'
                      ? 'bg-heirlock-green text-white border-heirlock-green'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {copied === 'File Hash' ? '✓' : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            )}

            {/* Owner Info */}
            <div className="border-4 border-heirlock-blue bg-blue-50 p-4">
              <p className="text-xs font-black text-black mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                OWNER
              </p>
              <div className="font-mono text-xs break-all text-black font-black">{vault.userId}</div>
            </div>

            {/* Stats Card */}
            <div className="border-4 border-black p-4 bg-white">
              <p className="text-xs font-black text-gray-600 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                STATISTICS
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-black">Total Files:</span>
                  <span className="font-mono">{vault.files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-black">Active:</span>
                  <span className="font-mono text-heirlock-green">{activeFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-black">Deleted:</span>
                  <span className="font-mono text-red-600">{deletedFiles.length}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-2 mt-2 flex justify-between">
                  <span className="font-black">Total Size:</span>
                  <span className="font-mono">{formatFileSize(vault.files.filter(f => !f.deletedAt && f.isActive).reduce((sum, f) => sum + f.fileSizeBytes, 0))}</span>
                </div>
              </div>
            </div>

            {/* Settings Menu */}
            {showSettings && (
              <div className="border-4 border-red-500 bg-red-50 p-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border-4 border-red-500 bg-red-500 text-white p-3 font-black text-xs hover:opacity-90 flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Vault
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="border-4 border-black bg-white p-8 max-w-sm w-full animate-bounce-in">
              <h2 className="text-2xl font-black mb-4 text-red-600">⚠️ Delete Vault?</h2>
              <p className="text-sm mb-4 text-gray-700">
                This will permanently delete the vault and all associated files. <span className="font-black">This cannot be undone</span>.
              </p>
              <p className="text-xs font-black text-gray-600 mb-4">
                Type <span className="bg-black text-white px-2 py-1">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-3 border-black font-black mb-6 text-center text-sm uppercase"
                placeholder="Type DELETE"
                disabled={isUpdating}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={isUpdating}
                  className="flex-1 border-4 border-black bg-gray-200 p-3 font-black text-xs hover:bg-gray-300 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVault}
                  disabled={deleteConfirmText !== 'DELETE' || isUpdating}
                  className="flex-1 border-4 border-red-600 bg-red-600 text-white p-3 font-black text-xs hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isUpdating ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Prompt Modal */}
        <PasswordPromptModal
          isOpen={showPasswordModal}
          fileName={selectedFileForDownload?.fileName || ''}
          onConfirm={handlePasswordSubmit}
          onCancel={() => {
            setShowPasswordModal(false);
            setSelectedFileForDownload(null);
          }}
          isLoading={isDownloading}
          progress={progress}
        />

        {/* Vault Locked Modal */}
        {showLockedModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div 
              className="border-4 border-black bg-white p-8 max-w-md w-full shadow-brutal animate-in fade-in zoom-in-95 duration-200"
              style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
            >
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-heirlock-yellow border-4 border-black flex items-center justify-center">
                  <Lock className="w-10 h-10 text-black" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-black text-center mb-2">
                🔒 Vault is Locked
              </h2>
              
              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                This vault is time-locked for security. Files cannot be downloaded until the unlock time.
              </p>

              {/* Unlock Time Card */}
              <div className="border-4 border-black bg-heirlock-pink/30 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-gray-600 uppercase">Unlocks On</p>
                    <p className="font-black text-black">{lockedUntilTime}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gray-100 border-2 border-gray-300 p-3 mb-6 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-heirlock-green" />
                  <span>Time-lock security ensures your files remain protected until the scheduled release date.</span>
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowLockedModal(false)}
                className="w-full border-4 border-black bg-black text-white p-3 font-black text-sm hover:bg-gray-800 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
