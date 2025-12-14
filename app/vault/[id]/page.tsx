'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { 
  Lock, Download, Share2, Trash2, Edit2, Shield, Clock, FileText, 
  ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Copy, MoreVertical,
  Calendar, HardDrive, Activity
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';
import { useCountdown } from '@/app/hooks/useCountdown';

interface Vault {
  id: string;
  description: string;
  createdAt: number;
  unlockTime: number;
  fileSize: number;
  fileName: string;
  txHash: string;
  encryptionMethod: string;
  isUnlocked: boolean;
  fileHash: string;
}

interface ActivityEvent {
  id: string;
  type: 'accessed' | 'unlocked' | 'downloaded' | 'settings_changed';
  timestamp: number;
  description: string;
}

export default function VaultDetailPage({ params }: { params: { id: string } }) {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();
  
  const [vault, setVault] = useState<Vault | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFileHash, setShowFileHash] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const timeRemaining = useCountdown(vault?.unlockTime || 0);

  // Load vault data
  useEffect(() => {
    if (!isConnected) return;

    try {
      const storedVaults = JSON.parse(localStorage.getItem('vaults') || '[]');
      const foundVault = storedVaults.find((v: Vault) => v.id === params.id);
      
      if (foundVault) {
        setVault(foundVault);
        setEditedDescription(foundVault.description);

        // Load activities for this vault
        const storedActivities = JSON.parse(localStorage.getItem(`vault_activities_${params.id}`) || '[]');
        setActivities(storedActivities);
      }
    } catch (error) {
      console.error('Error loading vault:', error);
      toast('Failed to load vault details', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, params.id, toast]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-4">Please connect your wallet to view vault details</p>
            <Link href="/dashboard" className="text-heirlock-blue underline font-black">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !vault) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 bg-white animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast(`${label} copied!`, 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUpdateDescription = () => {
    if (editedDescription.trim() === vault.description) {
      setIsEditing(false);
      return;
    }

    const updatedVault = { ...vault, description: editedDescription };
    const storedVaults = JSON.parse(localStorage.getItem('vaults') || '[]');
    const updated = storedVaults.map((v: Vault) => v.id === vault.id ? updatedVault : v);
    localStorage.setItem('vaults', JSON.stringify(updated));
    setVault(updatedVault);
    setIsEditing(false);
    toast('Vault description updated', 'success');

    // Log activity
    const newActivity: ActivityEvent = {
      id: Date.now().toString(),
      type: 'settings_changed',
      timestamp: Math.floor(Date.now() / 1000),
      description: 'Updated vault description'
    };
    const updatedActivities = [...activities, newActivity];
    localStorage.setItem(`vault_activities_${vault.id}`, JSON.stringify(updatedActivities));
    setActivities(updatedActivities);
  };

  const handleDeleteVault = () => {
    const storedVaults = JSON.parse(localStorage.getItem('vaults') || '[]');
    const filtered = storedVaults.filter((v: Vault) => v.id !== vault.id);
    localStorage.setItem('vaults', JSON.stringify(filtered));
    localStorage.removeItem(`vault_activities_${vault.id}`);
    toast('Vault deleted successfully', 'success');
    // Redirect after short delay
    setTimeout(() => window.location.href = '/dashboard', 500);
  };

  const isUnlocked = vault.unlockTime <= Math.floor(Date.now() / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-heirlock-blue font-black hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 border-2 border-black rounded"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vault Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vault Header Card */}
            <div className="border-4 border-black p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full p-3 border-2 border-black font-mono text-sm resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateDescription}
                          className="px-4 py-2 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedDescription(vault.description);
                          }}
                          className="px-4 py-2 bg-gray-200 text-black border-2 border-black font-black text-xs hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-black mb-2 break-words">{vault.description || 'Untitled Vault'}</h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-black text-heirlock-blue underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Description
                      </button>
                    </div>
                  )}
                </div>
                <div className={`px-4 py-2 border-3 border-black font-black text-xs ${
                  isUnlocked 
                    ? 'bg-heirlock-green text-white' 
                    : 'bg-yellow-200 text-black'
                }`}>
                  {isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                </div>
              </div>
            </div>

            {/* Unlock Status */}
            {!isUnlocked && (
              <div className="border-4 border-yellow-400 bg-yellow-50 p-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-yellow-900 mb-1">TIME REMAINING</p>
                    <p className="text-2xl font-black text-yellow-900">
                      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                    </p>
                    <p className="text-xs text-yellow-800 mt-1">
                      Unlocks at {formatDate(vault.unlockTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vault Details Grid */}
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
                  <HardDrive className="w-4 h-4" />
                  FILE SIZE
                </p>
                <p className="font-mono text-sm">{formatFileSize(vault.fileSize)}</p>
              </div>

              <div className="border-4 border-black p-4 bg-white md:col-span-2">
                <p className="text-xs font-black text-gray-600 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  ENCRYPTION
                </p>
                <p className="font-mono text-sm">{vault.encryptionMethod}</p>
              </div>
            </div>

            {/* File Hash */}
            <div className="border-4 border-black p-6 bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-gray-600">FILE HASH</p>
                <button
                  onClick={() => setShowFileHash(!showFileHash)}
                  className="text-xs font-black text-heirlock-blue underline"
                >
                  {showFileHash ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-black">
                  {showFileHash ? vault.fileHash : '•'.repeat(64)}
                </code>
                <button
                  onClick={() => copyToClipboard(vault.fileHash, 'File Hash')}
                  className={`px-3 py-2 font-black border-2 border-black text-xs transition-all ${
                    copied === 'File Hash'
                      ? 'bg-heirlock-green text-white border-heirlock-green'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {copied === 'File Hash' ? '✓' : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isUnlocked && (
                <button className="border-4 border-heirlock-blue bg-heirlock-blue text-white p-4 font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download File
                </button>
              )}
              
              <button className={`border-4 p-4 font-black text-sm transition-all flex items-center justify-center gap-2 ${
                isUnlocked ? '' : 'opacity-50 cursor-not-allowed'
              }`} disabled={!isUnlocked}>
                <Share2 className="w-5 h-5" />
                Share Access
              </button>
            </div>
          </div>

          {/* Right Column - Security & Activity */}
          <div className="space-y-6">
            {/* Security Card */}
            <div className="border-4 border-heirlock-blue p-6 bg-blue-50">
              <p className="text-xs font-black text-heirlock-blue mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                SECURITY STATUS
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-heirlock-green" />
                  <span className="text-xs font-black">Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-heirlock-green" />
                  <span className="text-xs font-black">Time-locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-heirlock-green" />
                  <span className="text-xs font-black">Blockchain Verified</span>
                </div>
              </div>
            </div>

            {/* TX Hash */}
            <div className="border-4 border-black p-4 bg-white">
              <p className="text-xs font-black text-gray-600 mb-2">TX HASH</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs font-mono break-all p-2 bg-gray-100 border-2 border-black">
                  {vault.txHash.substring(0, 12)}...
                </code>
                <button
                  onClick={() => copyToClipboard(vault.txHash, 'TX Hash')}
                  className={`px-3 py-2 font-black border-2 border-black text-xs transition-all ${
                    copied === 'TX Hash'
                      ? 'bg-heirlock-green text-white border-heirlock-green'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {copied === 'TX Hash' ? '✓' : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-4 border-black p-6 bg-white">
              <p className="text-xs font-black text-gray-600 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                RECENT ACTIVITY
              </p>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-xs text-gray-500">No activities yet</p>
                ) : (
                  activities.slice(-5).reverse().map((activity) => (
                    <div key={activity.id} className="border-l-4 border-heirlock-blue pl-3 py-1">
                      <p className="text-xs font-black capitalize">{activity.type}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(activity.timestamp * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Settings Menu */}
            {showSettings && (
              <div className="border-4 border-red-500 bg-red-50 p-4 space-y-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border-4 border-red-500 bg-red-500 text-white p-3 font-black text-xs hover:opacity-90 flex items-center justify-center gap-2"
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
            <div className="border-4 border-black bg-white p-8 max-w-sm">
              <h2 className="text-2xl font-black mb-4">Delete Vault?</h2>
              <p className="text-sm mb-6">This action cannot be undone. All vault data will be permanently deleted.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-4 border-black bg-gray-200 p-3 font-black text-xs hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVault}
                  className="flex-1 border-4 border-red-500 bg-red-500 text-white p-3 font-black text-xs hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
