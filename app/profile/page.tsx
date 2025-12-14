'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import {
  ArrowLeft, User, Mail, Bell, Lock, Palette, Settings, Download, Copy, LogOut,
  AlertCircle, CheckCircle, Eye, EyeOff, Save, X, Plus, Trash2, Shield, Smartphone,
  Globe, Moon, Sun, Code
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';

interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    vaultCreated: boolean;
    vaultUnlocked: boolean;
    securityAlerts: boolean;
    weeklySummary: boolean;
  };
  privacy: {
    showProfile: boolean;
    allowSharing: boolean;
  };
  createdAt: number;
  lastLogin: number;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: number;
  lastUsed?: number;
}

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  email: '',
  bio: '',
  theme: 'light',
  notifications: {
    vaultCreated: true,
    vaultUnlocked: true,
    securityAlerts: true,
    weeklySummary: false,
  },
  privacy: {
    showProfile: true,
    allowSharing: false,
  },
  createdAt: Math.floor(Date.now() / 1000),
  lastLogin: Math.floor(Date.now() / 1000),
};

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'api'>('profile');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewApiKey, setShowNewApiKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load profile
  useEffect(() => {
    if (!isConnected || !address) return;

    try {
      const storedProfile = localStorage.getItem(`profile_${address}`);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setEditedProfile(parsed);
      } else {
        setProfile({
          ...DEFAULT_PROFILE,
          displayName: address.slice(0, 6) + '...' + address.slice(-4),
        });
        setEditedProfile({
          ...DEFAULT_PROFILE,
          displayName: address.slice(0, 6) + '...' + address.slice(-4),
        });
      }

      // Load API keys
      const storedKeys = localStorage.getItem(`api_keys_${address}`);
      if (storedKeys) {
        setApiKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast('Failed to load profile', 'error');
    }
  }, [isConnected, address, toast]);

  const saveProfile = async () => {
    if (!address) return;

    setIsSaving(true);
    try {
      localStorage.setItem(`profile_${address}`, JSON.stringify(editedProfile));
      setProfile(editedProfile);
      setIsEditing(false);
      toast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast('Failed to save profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast('Please enter a key name', 'error');
      return;
    }

    if (!address) return;

    const key = `tala_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(7),
      name: newKeyName,
      key,
      createdAt: Math.floor(Date.now() / 1000),
    };

    const updatedKeys = [...apiKeys, newKey];
    localStorage.setItem(`api_keys_${address}`, JSON.stringify(updatedKeys));
    setApiKeys(updatedKeys);
    setNewKeyName('');
    setShowNewApiKey(false);
    toast('API key generated successfully', 'success');
  };

  const deleteApiKey = (id: string) => {
    if (!address) return;

    const updatedKeys = apiKeys.filter(k => k.id !== id);
    localStorage.setItem(`api_keys_${address}`, JSON.stringify(updatedKeys));
    setApiKeys(updatedKeys);
    toast('API key deleted', 'success');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAccountAge = () => {
    const seconds = Math.floor(Date.now() / 1000) - profile.createdAt;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-4">Please connect your wallet to view your profile</p>
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
            className="flex items-center gap-2 text-heirlock-blue font-black hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-black flex items-center gap-3">
              <User className="w-8 h-8" />
              Profile Settings
            </h1>
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditedProfile(profile);
                }}
                className="px-4 py-2 border-2 border-black bg-white font-black text-xs hover:bg-gray-50"
              >
                Edit Profile
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b-4 border-black mb-8 flex gap-1 overflow-x-auto">
          {['profile', 'notifications', 'security', 'api'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-black text-xs uppercase border-b-4 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              {tab === 'profile' && '👤 Profile'}
              {tab === 'notifications' && '🔔 Notifications'}
              {tab === 'security' && '🔒 Security'}
              {tab === 'api' && '⚙️ API'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Wallet Info Card */}
            <div className="border-4 border-heirlock-blue bg-blue-50 p-8">
              <h2 className="font-black text-lg mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Wallet Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-heirlock-blue mb-2">WALLET ADDRESS</p>
                  <div className="flex gap-2 items-center">
                    <code className="flex-1 text-xs font-mono p-3 bg-white border-2 border-black break-all">
                      {address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(address || '', 'wallet')}
                      className={`px-3 py-3 font-black border-2 border-black text-xs transition-all ${
                        copiedKey === 'wallet'
                          ? 'bg-heirlock-green text-white'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {copiedKey === 'wallet' ? '✓' : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-700 mb-2">Account Age</p>
                    <p className="text-sm font-mono">{getAccountAge()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 mb-2">Created</p>
                    <p className="text-sm font-mono">{formatDate(profile.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 mb-2">Last Login</p>
                    <p className="text-sm font-mono">{formatDate(profile.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-700 mb-2">Status</p>
                    <p className="text-sm font-black text-heirlock-green">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <div className="border-4 border-black bg-white p-8">
              <h2 className="font-black text-lg mb-6">Profile Information</h2>

              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2">Display Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.displayName}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, displayName: e.target.value })
                      }
                      className="w-full p-3 border-2 border-black font-mono text-sm"
                      placeholder="Your display name"
                    />
                  ) : (
                    <p className="text-sm font-mono p-3 bg-gray-50 border-2 border-black">
                      {profile.displayName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2">Email (Optional)</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                      className="w-full p-3 border-2 border-black font-mono text-sm"
                      placeholder="your@email.com"
                    />
                  ) : (
                    <p className="text-sm font-mono p-3 bg-gray-50 border-2 border-black">
                      {profile.email || '—'}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      className="w-full p-3 border-2 border-black font-mono text-sm resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                      maxLength={200}
                    />
                  ) : (
                    <p className="text-sm font-mono p-3 bg-gray-50 border-2 border-black min-h-20">
                      {profile.bio || '—'}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-600 mt-1">
                      {editedProfile.bio.length}/200
                    </p>
                  )}
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-2">Theme Preference</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() =>
                            setEditedProfile({ ...editedProfile, theme: theme as any })
                          }
                          className={`flex-1 p-3 border-2 border-black font-black text-xs transition-all flex items-center justify-center gap-2 ${
                            editedProfile.theme === theme
                              ? 'bg-black text-white'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {theme === 'light' && <Sun className="w-4 h-4" />}
                          {theme === 'dark' && <Moon className="w-4 h-4" />}
                          {theme === 'system' && <Globe className="w-4 h-4" />}
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-mono p-3 bg-gray-50 border-2 border-black capitalize">
                      {profile.theme}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-black border-2 border-black font-black text-xs hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="border-4 border-black bg-white p-8">
              <h2 className="font-black text-lg mb-6">Privacy Settings</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedProfile.privacy.showProfile : profile.privacy.showProfile}
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        privacy: { ...editedProfile.privacy, showProfile: e.target.checked },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Show My Profile Publicly</p>
                    <p className="text-xs text-gray-600">Allow others to view your profile</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={isEditing ? editedProfile.privacy.allowSharing : profile.privacy.allowSharing}
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        privacy: { ...editedProfile.privacy, allowSharing: e.target.checked },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Allow Vault Sharing</p>
                    <p className="text-xs text-gray-600">Allow sharing vaults with other users</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="border-4 border-black bg-white p-8">
              <h2 className="font-black text-lg mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={
                      isEditing
                        ? editedProfile.notifications.vaultCreated
                        : profile.notifications.vaultCreated
                    }
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        notifications: {
                          ...editedProfile.notifications,
                          vaultCreated: e.target.checked,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Vault Created</p>
                    <p className="text-xs text-gray-600">Notify when a new vault is created</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={
                      isEditing
                        ? editedProfile.notifications.vaultUnlocked
                        : profile.notifications.vaultUnlocked
                    }
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        notifications: {
                          ...editedProfile.notifications,
                          vaultUnlocked: e.target.checked,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Vault Unlocked</p>
                    <p className="text-xs text-gray-600">Notify when a vault is unlocked</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={
                      isEditing
                        ? editedProfile.notifications.securityAlerts
                        : profile.notifications.securityAlerts
                    }
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        notifications: {
                          ...editedProfile.notifications,
                          securityAlerts: e.target.checked,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Security Alerts</p>
                    <p className="text-xs text-gray-600">Critical security notifications</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-black cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={
                      isEditing
                        ? editedProfile.notifications.weeklySummary
                        : profile.notifications.weeklySummary
                    }
                    onChange={(e) =>
                      isEditing &&
                      setEditedProfile({
                        ...editedProfile,
                        notifications: {
                          ...editedProfile.notifications,
                          weeklySummary: e.target.checked,
                        },
                      })
                    }
                    disabled={!isEditing}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black">Weekly Summary</p>
                    <p className="text-xs text-gray-600">Get weekly vault activity summary</p>
                  </div>
                </label>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-4 border-heirlock-green bg-green-50 p-8">
              <h2 className="font-black text-lg mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Overview
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3">
                  <CheckCircle className="w-5 h-5 text-heirlock-green" />
                  <div>
                    <p className="text-xs font-black">Wallet Connected</p>
                    <p className="text-xs text-gray-700">Your wallet is securely connected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3">
                  <CheckCircle className="w-5 h-5 text-heirlock-green" />
                  <div>
                    <p className="text-xs font-black">Encryption Enabled</p>
                    <p className="text-xs text-gray-700">All vaults use AES-256-GCM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3">
                  <CheckCircle className="w-5 h-5 text-heirlock-green" />
                  <div>
                    <p className="text-xs font-black">Backup Available</p>
                    <p className="text-xs text-gray-700">Recovery phrase configured</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-4 border-black bg-white p-8">
              <h2 className="font-black text-lg mb-6">Quick Actions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/security"
                  className="border-4 border-heirlock-blue bg-blue-50 p-6 hover:shadow-brutal transition-all"
                >
                  <Lock className="w-6 h-6 text-heirlock-blue mb-2" />
                  <h3 className="font-black text-sm mb-1">Manage Security</h3>
                  <p className="text-xs text-gray-700">Update encryption settings</p>
                </Link>

                <Link
                  href="/dashboard/security"
                  className="border-4 border-heirlock-pink bg-pink-50 p-6 hover:shadow-brutal transition-all"
                >
                  <Download className="w-6 h-6 text-heirlock-pink mb-2" />
                  <h3 className="font-black text-sm mb-1">Backup Keys</h3>
                  <p className="text-xs text-gray-700">Download recovery backup</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="border-4 border-black bg-white p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  API Keys
                </h2>
                {!showNewApiKey && (
                  <button
                    onClick={() => setShowNewApiKey(true)}
                    className="px-4 py-2 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Key
                  </button>
                )}
              </div>

              {showNewApiKey && (
                <div className="border-4 border-heirlock-green bg-green-50 p-6 mb-6">
                  <h3 className="font-black mb-4">Generate New API Key</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Key name (e.g., Production, Development)"
                      className="w-full p-3 border-2 border-black font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={generateApiKey}
                        className="flex-1 px-4 py-3 bg-heirlock-green text-white border-2 border-black font-black text-xs hover:opacity-90"
                      >
                        Generate Key
                      </button>
                      <button
                        onClick={() => {
                          setShowNewApiKey(false);
                          setNewKeyName('');
                        }}
                        className="flex-1 px-4 py-3 bg-gray-200 text-black border-2 border-black font-black text-xs hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {apiKeys.length === 0 ? (
                <div className="border-4 border-black p-8 text-center bg-gray-50">
                  <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 font-black">No API keys yet</p>
                  <p className="text-xs text-gray-600 mt-2">Create your first API key to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="border-2 border-black p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-black text-sm">{key.name}</p>
                          <p className="text-xs text-gray-600 mt-1">Created {formatDate(key.createdAt)}</p>
                          {key.lastUsed && (
                            <p className="text-xs text-gray-600">
                              Last used {formatDate(key.lastUsed)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteApiKey(key.id)}
                          className="p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <code className="flex-1 text-xs font-mono p-2 bg-gray-100 border-2 border-black break-all">
                          {key.key}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className={`px-3 py-2 font-black border-2 border-black text-xs transition-all ${
                            copiedKey === key.id
                              ? 'bg-heirlock-green text-white'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {copiedKey === key.id ? '✓' : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-4 border-heirlock-blue bg-blue-50 p-8">
              <h3 className="font-black text-sm mb-3">API Documentation</h3>
              <p className="text-xs text-gray-700 mb-4">
                Use your API keys to integrate TALA with your applications. Keep your keys secure and never share them publicly.
              </p>
              <Link
                href="#"
                className="text-xs font-black text-heirlock-blue underline hover:opacity-70"
              >
                View API Documentation →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
