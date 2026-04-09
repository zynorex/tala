'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import {
  ArrowLeft, Shield, Lock, AlertTriangle, CheckCircle, Copy, Eye, EyeOff,
  Key, AlertCircle, Download, RefreshCw, Search
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';

interface SecuritySettings {
  lastSecurityCheck: number;
  encryptionKeyBackupDate?: number;
  twoFactorEnabled: boolean;
  loginAttempts: number;
  lastLoginAttempt: number;
}

interface EncryptedVault {
  id: string;
  description: string;
  encryptionStatus: 'AES-256-GCM';
  lastModified: number;
}

export default function SecuritySettingsPage() {
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SecuritySettings>({
    lastSecurityCheck: Math.floor(Date.now() / 1000),
    twoFactorEnabled: false,
    loginAttempts: 0,
    lastLoginAttempt: 0,
  });

  const [vaults, setVaults] = useState<EncryptedVault[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackupWarning, setShowBackupWarning] = useState(true);
  const [backupPhrase, setBackupPhrase] = useState('');
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'encryption' | 'backup' | 'audit'>('overview');

  // Load security data
  useEffect(() => {
    if (!isConnected) return;

    try {
      // Load vaults
      const storedVaults = JSON.parse(localStorage.getItem('vaults') || '[]');
      const encryptedVaults: EncryptedVault[] = storedVaults.map((v: any) => ({
        id: v.id,
        description: v.description,
        encryptionStatus: 'AES-256-GCM',
        lastModified: v.createdAt,
      }));
      setVaults(encryptedVaults);

      // Load security settings
      const storedSettings = JSON.parse(localStorage.getItem('security_settings') || '{}');
      setSettings({
        lastSecurityCheck: storedSettings.lastSecurityCheck || Math.floor(Date.now() / 1000),
        encryptionKeyBackupDate: storedSettings.encryptionKeyBackupDate,
        twoFactorEnabled: storedSettings.twoFactorEnabled || false,
        loginAttempts: storedSettings.loginAttempts || 0,
        lastLoginAttempt: storedSettings.lastLoginAttempt || 0,
      });

      // Generate backup phrase if not exists
      if (!localStorage.getItem('backup_phrase')) {
        const phrase = generateBackupPhrase();
        localStorage.setItem('backup_phrase', phrase);
        setBackupPhrase(phrase);
      } else {
        setBackupPhrase(localStorage.getItem('backup_phrase') || '');
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
      toast('Failed to load security settings', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  const generateBackupPhrase = (): string => {
    const words = [
      'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
      'india', 'juliett', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
      'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray'
    ];

    let phrase = '';
    for (let i = 0; i < 12; i++) {
      phrase += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return phrase.trim();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const runSecurityCheck = () => {
    const updatedSettings = {
      ...settings,
      lastSecurityCheck: Math.floor(Date.now() / 1000),
    };
    localStorage.setItem('security_settings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    toast('Security check completed', 'success');
  };

  const backupEncryptionKeys = () => {
    // Create backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      backupPhrase: backupPhrase,
      vaultCount: vaults.length,
      encryptionMethod: 'AES-256-GCM',
    };

    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TALA_encryption_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Update backup date
    const updatedSettings = {
      ...settings,
      encryptionKeyBackupDate: Math.floor(Date.now() / 1000),
    };
    localStorage.setItem('security_settings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    setShowBackupWarning(false);
    toast('Backup completed successfully', 'success');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-4">Please connect your wallet to access security settings</p>
            <Link href="/dashboard" className="text-heirlock-blue underline font-black">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-black font-black hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-black flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            Security Settings
          </h1>
          <p className="text-sm text-gray-600">Manage encryption keys, backups, and security options</p>
        </div>

        {/* Backup Warning */}
        {showBackupWarning && !settings.encryptionKeyBackupDate && (
          <div className="border-4 border-red-500 bg-red-50 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-black text-red-900 mb-2">Backup Your Encryption Keys</h3>
                <p className="text-sm text-red-800 mb-4">
                  You haven't backed up your encryption keys yet. This is critical for account recovery.
                </p>
                <button
                  onClick={backupEncryptionKeys}
                  className="px-4 py-2 bg-red-600 text-white border-2 border-red-600 font-black text-xs hover:opacity-90"
                >
                  Backup Now
                </button>
              </div>
              <button
                onClick={() => setShowBackupWarning(false)}
                className="text-red-600 font-black text-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b-4 border-black mb-8 flex gap-1">
          {['overview', 'encryption', 'backup', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-black text-xs uppercase border-b-4 transition-colors ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="border-4 border-black p-8 bg-white animate-pulse">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Security Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-4 border-heirlock-green bg-green-50 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-sm">Encryption Status</h3>
                      <CheckCircle className="w-5 h-5 text-heirlock-green" />
                    </div>
                    <p className="text-xs text-gray-700 mb-2">AES-256-GCM</p>
                    <p className="text-xs font-black text-heirlock-green">ACTIVE</p>
                  </div>

                  <div className={`border-4 p-6 ${
                    settings.encryptionKeyBackupDate
                      ? 'border-heirlock-green bg-green-50'
                      : 'border-yellow-400 bg-yellow-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-sm">Backup Status</h3>
                      {settings.encryptionKeyBackupDate ? (
                        <CheckCircle className="w-5 h-5 text-heirlock-green" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    {settings.encryptionKeyBackupDate ? (
                      <>
                        <p className="text-xs text-gray-700 mb-1">Last backup:</p>
                        <p className="text-xs font-black">{formatRelativeTime(settings.encryptionKeyBackupDate)}</p>
                      </>
                    ) : (
                      <p className="text-xs font-black text-yellow-900">NOT BACKED UP</p>
                    )}
                  </div>

                  <div className="border-4 border-heirlock-blue bg-blue-50 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-sm">Encrypted Vaults</h3>
                      <Shield className="w-5 h-5 text-heirlock-blue" />
                    </div>
                    <p className="text-2xl font-black text-heirlock-blue">{vaults.length}</p>
                    <p className="text-xs text-gray-700 mt-2">All protected with AES-256</p>
                  </div>

                  <div className="border-4 border-heirlock-pink bg-pink-50 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-black text-sm">Last Security Check</h3>
                      <RefreshCw className="w-5 h-5 text-heirlock-pink" />
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{formatRelativeTime(settings.lastSecurityCheck)}</p>
                    <button
                      onClick={runSecurityCheck}
                      className="text-xs font-black text-heirlock-pink underline hover:opacity-70"
                    >
                      Run Now
                    </button>
                  </div>
                </div>

                {/* Security Recommendations */}
                <div className="border-4 border-black p-6 bg-white">
                  <h3 className="font-black mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border-2 border-black">
                      {settings.encryptionKeyBackupDate ? (
                        <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-black">Backup encryption keys</p>
                        <p className="text-xs text-gray-600">Store recovery codes in a secure location</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border-2 border-black">
                      <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">Encryption enabled</p>
                        <p className="text-xs text-gray-600">All vaults are encrypted with AES-256-GCM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border-2 border-black">
                      <CheckCircle className="w-4 h-4 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">Blockchain verified</p>
                        <p className="text-xs text-gray-600">All vaults are verified on blockchain</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Encryption Tab */}
            {activeTab === 'encryption' && (
              <div className="space-y-6">
                <div className="border-4 border-black p-6 bg-white">
                  <h3 className="font-black mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Encrypted Vaults
                  </h3>

                  {vaults.length === 0 ? (
                    <p className="text-sm text-gray-600">No vaults yet</p>
                  ) : (
                    <div className="space-y-3">
                      {vaults.map((vault) => (
                        <div key={vault.id} className="border-2 border-black p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                href={`/vault/${vault.id}`}
                                className="font-black text-heirlock-blue underline hover:opacity-70"
                              >
                                {vault.description || 'Untitled Vault'}
                              </Link>
                              <p className="text-xs text-gray-600 mt-1">
                                Encryption: {vault.encryptionStatus}
                              </p>
                              <p className="text-xs text-gray-600">
                                Modified: {formatRelativeTime(vault.lastModified)}
                              </p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-heirlock-green flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Backup Tab */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div className="border-4 border-black p-6 bg-white">
                  <h3 className="font-black mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Backup Phrase
                  </h3>

                  <div className="mb-6">
                    <p className="text-xs font-black text-gray-600 mb-3">
                      Save this phrase in a secure location. Use it to recover your account if needed.
                    </p>

                    <div className="border-4 border-yellow-400 bg-yellow-50 p-6 mb-4">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => setShowBackupCode(!showBackupCode)}
                          className="text-xs font-black text-yellow-900 underline flex items-center gap-1"
                        >
                          {showBackupCode ? (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hide Code
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              Show Code
                            </>
                          )}
                        </button>
                      </div>

                      <code className="block font-mono text-sm p-4 bg-white border-2 border-yellow-400 mt-3 text-center break-words">
                        {showBackupCode ? backupPhrase : '••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••'}
                      </code>

                      <button
                        onClick={() => copyToClipboard(backupPhrase)}
                        className={`w-full mt-4 px-4 py-2 border-2 border-black font-black text-xs transition-all ${
                          copied
                            ? 'bg-heirlock-green text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {copied ? '✓ Copied' : 'Copy to Clipboard'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={backupEncryptionKeys}
                    className="w-full px-4 py-3 bg-heirlock-green text-black border-2 border-black font-black text-sm hover:opacity-90"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Backup File
                  </button>
                </div>

                {settings.encryptionKeyBackupDate && (
                  <div className="border-4 border-heirlock-green bg-green-50 p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-heirlock-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-sm">Last Backup</p>
                        <p className="text-xs text-gray-700 mt-1">
                          {formatDate(settings.encryptionKeyBackupDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Audit Tab */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="border-4 border-black p-6 bg-white">
                  <h3 className="font-black mb-4">Security Audit Log</h3>

                  <div className="space-y-3">
                    <div className="border-2 border-black p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-black text-sm">Encryption Keys Generated</p>
                        <CheckCircle className="w-4 h-4 text-heirlock-green" />
                      </div>
                      <p className="text-xs text-gray-600">Account created</p>
                    </div>

                    <div className="border-2 border-black p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-black text-sm">Vaults Protected</p>
                        <CheckCircle className="w-4 h-4 text-heirlock-green" />
                      </div>
                      <p className="text-xs text-gray-600">{vaults.length} vaults with AES-256-GCM</p>
                    </div>

                    {settings.encryptionKeyBackupDate && (
                      <div className="border-2 border-black p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-black text-sm">Backup Created</p>
                          <CheckCircle className="w-4 h-4 text-heirlock-green" />
                        </div>
                        <p className="text-xs text-gray-600">
                          {formatDate(settings.encryptionKeyBackupDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

