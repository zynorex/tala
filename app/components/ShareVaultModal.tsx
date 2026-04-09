'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  X, Share2, Link2, Copy, Check, Clock, Users, Shield, 
  Eye, Download, Edit3, Loader2, AlertCircle, Lock,
  Mail, Calendar, Hash, Infinity, Plus
} from 'lucide-react';

// ============ TYPES ============

interface ShareVaultModalProps {
  isOpen: boolean;
  vaultId: string;
  vaultName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type SharePermission = 'VIEW_ONLY' | 'DOWNLOAD' | 'FULL_ACCESS';

interface ShareSettings {
  permission: SharePermission;
  expiresAt: string | null;
  maxAccessCount: number | null;
  requiresPassword: boolean;
  sharePassword: string;
  inviteEmail: string;
}

interface CreatedShare {
  id: string;
  shareToken: string;
  shareUrl: string;
  permission: SharePermission;
  expiresAt: string | null;
  maxAccessCount: number | null;
}

// ============ CONSTANTS ============

const PERMISSION_OPTIONS: { value: SharePermission; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    value: 'VIEW_ONLY', 
    label: 'View Only', 
    description: 'Can see file names and metadata only',
    icon: <Eye className="w-4 h-4" />
  },
  { 
    value: 'DOWNLOAD', 
    label: 'Download', 
    description: 'Can view and download files (vault password required)',
    icon: <Download className="w-4 h-4" />
  },
  { 
    value: 'FULL_ACCESS', 
    label: 'Full Access', 
    description: 'Can view, download, and modify files',
    icon: <Edit3 className="w-4 h-4" />
  },
];

const EXPIRY_OPTIONS = [
  { value: null, label: 'Never', icon: <Infinity className="w-4 h-4" /> },
  { value: 1, label: '1 Hour', hours: 1 },
  { value: 24, label: '24 Hours', hours: 24 },
  { value: 168, label: '7 Days', hours: 168 },
  { value: 720, label: '30 Days', hours: 720 },
  { value: 'custom', label: 'Custom Date', icon: <Calendar className="w-4 h-4" /> },
];

const ACCESS_LIMIT_OPTIONS = [
  { value: null, label: 'Unlimited' },
  { value: 1, label: '1 time' },
  { value: 5, label: '5 times' },
  { value: 10, label: '10 times' },
  { value: 25, label: '25 times' },
  { value: 100, label: '100 times' },
];

// ============ COMPONENT ============

export default function ShareVaultModal({
  isOpen,
  vaultId,
  vaultName,
  onClose,
  onSuccess,
}: ShareVaultModalProps) {
  // State
  const [step, setStep] = useState<'configure' | 'success'>('configure');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [createdShare, setCreatedShare] = useState<CreatedShare | null>(null);
  
  // Form state
  const [settings, setSettings] = useState<ShareSettings>({
    permission: 'VIEW_ONLY',
    expiresAt: null,
    maxAccessCount: null,
    requiresPassword: true,
    sharePassword: '',
    inviteEmail: '',
  });
  
  const [expiryMode, setExpiryMode] = useState<number | 'custom' | null>(null);
  const [customDate, setCustomDate] = useState('');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('configure');
      setError(null);
      setCopied(false);
      setCreatedShare(null);
      setSettings({
        permission: 'VIEW_ONLY',
        expiresAt: null,
        maxAccessCount: null,
        requiresPassword: true,
        sharePassword: '',
        inviteEmail: '',
      });
      setExpiryMode(null);
      setCustomDate('');
    }
  }, [isOpen]);

  // Handle expiry mode change
  const handleExpiryChange = useCallback((mode: number | 'custom' | null) => {
    setExpiryMode(mode);
    
    if (mode === null) {
      setSettings(prev => ({ ...prev, expiresAt: null }));
    } else if (mode === 'custom') {
      // Will be set when custom date is selected
    } else {
      const date = new Date();
      date.setHours(date.getHours() + mode);
      setSettings(prev => ({ ...prev, expiresAt: date.toISOString() }));
    }
  }, []);

  // Handle custom date change
  const handleCustomDateChange = useCallback((dateStr: string) => {
    setCustomDate(dateStr);
    if (dateStr) {
      const date = new Date(dateStr);
      setSettings(prev => ({ ...prev, expiresAt: date.toISOString() }));
    }
  }, []);

  // Copy share URL to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!createdShare?.shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(createdShare.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [createdShare?.shareUrl]);

  // Create share
  const handleCreateShare = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/vaults/${vaultId}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permission: settings.permission,
          expiresAt: settings.expiresAt,
          maxAccessCount: settings.maxAccessCount,
          requiresPassword: settings.requiresPassword,
          sharePassword: settings.sharePassword || null,
          inviteEmail: settings.inviteEmail || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create share');
      }

      setCreatedShare(data.data.share);
      setStep('success');
      onSuccess?.();
    } catch (err) {
      console.error('Create share error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create share link');
    } finally {
      setIsSubmitting(false);
    }
  }, [vaultId, settings, onSuccess]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="border-4 border-black bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      >
        {/* Header */}
        <div className="border-b-4 border-black p-4 bg-heirlock-green flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-black">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg">
                {step === 'configure' ? 'Share Vault' : 'Share Link Created!'}
              </h2>
              <p className="text-xs text-gray-700 truncate max-w-[200px]">{vaultName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/50 transition-colors disabled:opacity-50"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'configure' ? (
            <ConfigureStep 
              settings={settings}
              setSettings={setSettings}
              expiryMode={expiryMode}
              setExpiryMode={handleExpiryChange}
              customDate={customDate}
              setCustomDate={handleCustomDateChange}
              error={error}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateShare}
              onCancel={onClose}
            />
          ) : (
            <SuccessStep 
              share={createdShare!}
              settings={settings}
              copied={copied}
              onCopy={copyToClipboard}
              onClose={onClose}
              onCreateAnother={() => setStep('configure')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ CONFIGURE STEP ============

interface ConfigureStepProps {
  settings: ShareSettings;
  setSettings: React.Dispatch<React.SetStateAction<ShareSettings>>;
  expiryMode: number | 'custom' | null;
  setExpiryMode: (mode: number | 'custom' | null) => void;
  customDate: string;
  setCustomDate: (date: string) => void;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

function ConfigureStep({
  settings,
  setSettings,
  expiryMode,
  setExpiryMode,
  customDate,
  setCustomDate,
  error,
  isSubmitting,
  onSubmit,
  onCancel,
}: ConfigureStepProps) {
  return (
    <div className="space-y-6">
      {/* Permission Level */}
      <div>
        <label className="block font-black text-sm mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Permission Level
        </label>
        <div className="space-y-2">
          {PERMISSION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSettings(prev => ({ ...prev, permission: option.value }))}
              className={`w-full p-3 border-2 border-black text-left transition-all ${
                settings.permission === option.value
                  ? 'bg-heirlock-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 border-2 border-black ${
                  settings.permission === option.value ? 'bg-white' : 'bg-gray-100'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
                {settings.permission === option.value && (
                  <Check className="w-5 h-5 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Expiration */}
      <div>
        <label className="block font-black text-sm mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Link Expiration
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EXPIRY_OPTIONS.map((option) => (
            <button
              key={String(option.value)}
              onClick={() => setExpiryMode(option.value as any)}
              className={`p-2 border-2 border-black text-xs font-bold transition-all ${
                expiryMode === option.value
                  ? 'bg-heirlock-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {expiryMode === 'custom' && (
          <input
            type="datetime-local"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full mt-2 p-2 border-2 border-black font-mono text-sm"
          />
        )}
      </div>

      {/* Access Limit */}
      <div>
        <label className="block font-black text-sm mb-2 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Access Limit
        </label>
        <select
          value={settings.maxAccessCount ?? 'null'}
          onChange={(e) => setSettings(prev => ({ 
            ...prev, 
            maxAccessCount: e.target.value === 'null' ? null : parseInt(e.target.value) 
          }))}
          className="w-full p-2 border-2 border-black font-bold text-sm"
        >
          {ACCESS_LIMIT_OPTIONS.map((option) => (
            <option key={String(option.value)} value={option.value ?? 'null'}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Share Password (Optional) */}
      <div>
        <label className="block font-black text-sm mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Share Password (Optional)
        </label>
        <p className="text-xs text-gray-600 mb-2">
          Add an extra password for accessing this share link. The vault password is still required for decryption.
        </p>
        <input
          type="password"
          value={settings.sharePassword}
          onChange={(e) => setSettings(prev => ({ ...prev, sharePassword: e.target.value }))}
          placeholder="Optional extra password"
          className="w-full p-2 border-2 border-black font-mono text-sm placeholder:text-gray-400"
        />
      </div>

      {/* Invite Email (Optional) */}
      <div>
        <label className="block font-black text-sm mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Send Invite (Optional)
        </label>
        <input
          type="email"
          value={settings.inviteEmail}
          onChange={(e) => setSettings(prev => ({ ...prev, inviteEmail: e.target.value }))}
          placeholder="recipient@example.com"
          className="w-full p-2 border-2 border-black font-mono text-sm placeholder:text-gray-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          We&apos;ll send them the link (but not the vault password)
        </p>
      </div>

      {/* Important Notice */}
      <div className="border-2 border-black p-3 bg-heirlock-yellow/30">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Important:</p>
            <p className="text-gray-700">
              The vault password must be shared separately. Recipients need both the share link and the vault password to decrypt files.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="border-2 border-black p-3 bg-red-100">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 p-3 border-4 border-black bg-white font-black text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 p-3 border-4 border-black bg-heirlock-green font-black text-sm hover:brightness-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              Create Share Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============ SUCCESS STEP ============

interface SuccessStepProps {
  share: CreatedShare;
  settings: ShareSettings;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
  onCreateAnother: () => void;
}

function SuccessStep({
  share,
  settings,
  copied,
  onCopy,
  onClose,
  onCreateAnother,
}: SuccessStepProps) {
  return (
    <div className="space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="p-4 bg-heirlock-green border-4 border-black" style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
          <Check className="w-10 h-10" />
        </div>
      </div>

      {/* Share URL */}
      <div>
        <label className="block font-black text-sm mb-2">Share Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={share.shareUrl}
            readOnly
            className="flex-1 p-2 border-2 border-black font-mono text-xs bg-gray-50 truncate"
          />
          <button
            onClick={onCopy}
            className={`p-2 border-2 border-black font-bold transition-all ${
              copied ? 'bg-heirlock-green' : 'bg-white hover:bg-gray-50'
            }`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-green-600 mt-1 font-bold">✓ Copied to clipboard!</p>
        )}
      </div>

      {/* Share Details */}
      <div className="border-2 border-black p-4 bg-gray-50 space-y-3">
        <h3 className="font-black text-sm">Share Details</h3>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Permission</p>
            <p className="font-bold">{share.permission.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Expires</p>
            <p className="font-bold">
              {share.expiresAt 
                ? new Date(share.expiresAt).toLocaleDateString() 
                : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Access Limit</p>
            <p className="font-bold">
              {share.maxAccessCount ? `${share.maxAccessCount} times` : 'Unlimited'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Share Password</p>
            <p className="font-bold">{settings.sharePassword ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Reminder */}
      <div className="border-2 border-black p-3 bg-heirlock-pink/30">
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Don&apos;t forget!</p>
            <p className="text-gray-700">
              Share the vault password separately through a secure channel. The recipient will need it to decrypt files.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCreateAnother}
          className="flex-1 p-3 border-4 border-black bg-white font-black text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Another
        </button>
        <button
          onClick={onClose}
          className="flex-1 p-3 border-4 border-black bg-heirlock-blue font-black text-sm hover:brightness-95 transition-all"
          style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
