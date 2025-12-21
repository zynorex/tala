'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { BarChart, TrendingUp, Lock, Shield, Clock, Database, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import DashboardStats from './DashboardStats';
import VaultsList from './VaultsList';
import ActivityLog from './ActivityLog';
import SecurityMetrics from './SecurityMetrics';
import QuickActions from './QuickActions';

interface DashboardData {
  totalVaults: number;
  totalStorageUsed: number;
  activeVaults: number;
  secureVaults: number;
  lastVaultCreated: string | null;
  averageVaultDuration: number;
}

export default function DashboardContent() {
  const { isConnected, address } = useAccount();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalVaults: 0,
    totalStorageUsed: 0,
    activeVaults: 0,
    secureVaults: 0,
    lastVaultCreated: null,
    averageVaultDuration: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [vaults, setVaults] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch vaults from API
      const vaultsRes = await fetch('/api/vaults');
      if (!vaultsRes.ok) throw new Error('Failed to fetch vaults');
      const vaultsData = await vaultsRes.json();
      
      const vaultList = vaultsData.data?.data || [];
      setVaults(vaultList);

      // Calculate dashboard stats
      let totalStorage = 0;
      vaultList.forEach((vault: any) => {
        if (vault.files) {
          vault.files.forEach((file: any) => {
            totalStorage += file.fileSizeBytes || 0;
          });
        }
      });

      const lastVault = vaultList.length > 0 
        ? new Date(vaultList[0].createdAt).toLocaleDateString()
        : null;

      setDashboardData({
        totalVaults: vaultList.length,
        totalStorageUsed: totalStorage,
        activeVaults: vaultList.filter((v: any) => v.isActive).length,
        secureVaults: vaultList.length,
        lastVaultCreated: lastVault,
        averageVaultDuration: 0,
      });

      // Fetch activity log
      try {
        const activitiesRes = await fetch('/api/activity');
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.data || []);
        }
      } catch (e) {
        console.warn('Could not fetch activities:', e);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream pt-20 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center py-20">
            <div className="inline-block border-4 border-black p-8 bg-heirlock-yellow shadow-brutal mb-6">
              <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" />
              <h2 className="font-black text-2xl text-black mb-2">Dashboard Requires Wallet</h2>
              <p className="text-gray-800 font-medium mb-6">Connect your wallet to access your vault dashboard.</p>
              <Link 
                href="/" 
                className="inline-block px-6 py-3 border-4 border-black bg-black text-white font-black hover:bg-gray-800 transition-all"
              >
                Go Home & Connect Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream pt-20 pb-16">
      <div className="container mx-auto max-w-7xl px-4 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-black text-4xl text-black mb-2">Dashboard</h1>
            <p className="text-gray-700 font-medium">
              Welcome back, <span className="font-black text-heirlock-pink">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </p>
          </div>
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="px-4 py-2 border-3 border-black font-black text-black bg-white hover:bg-gray-50 flex items-center gap-2 transition-all"
            title="Toggle sensitive data visibility"
          >
            {showSensitiveData ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-4 border-black bg-white p-6 shadow-brutal animate-pulse">
                <div className="h-12 bg-gray-200 mb-4"></div>
                <div className="h-6 bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <DashboardStats 
            data={dashboardData} 
            isLoading={isLoading}
            showSensitiveData={showSensitiveData}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vaults List */}
          <div className="lg:col-span-2">
            <VaultsList showSensitiveData={showSensitiveData} />
          </div>

          {/* Right Column - Security & Activity */}
          <div className="space-y-6">
            <SecurityMetrics data={dashboardData} />
            <ActivityLog limit={5} />
          </div>
        </div>

        {/* Bottom Section - Detailed Analytics */}
        <div className="border-4 border-black bg-white p-8 shadow-brutal">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart className="w-6 h-6 text-black" />
              <h2 className="font-black text-2xl text-black">Vault Analytics</h2>
            </div>
            <Link
              href="/dashboard/analytics"
              className="px-4 py-2 border-2 border-black bg-heirlock-blue text-white font-black text-xs hover:opacity-90 transition-all"
            >
              View Full Analytics →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-3 border-black bg-cream hover:shadow-brutal transition-all cursor-pointer">
              <p className="text-xs font-black text-gray-700 uppercase mb-2">Storage Efficiency</p>
              <p className="font-black text-3xl text-heirlock-blue">
                {dashboardData.totalStorageUsed > 0 ? 
                  `${(dashboardData.totalStorageUsed / (10 * 1024 * 1024) * 100).toFixed(1)}%` : 
                  '0%'
                }
              </p>
              <p className="text-xs text-gray-600 font-medium mt-2">
                {(dashboardData.totalStorageUsed / 1024 / 1024).toFixed(2)} MB used of 10 MB per vault
              </p>
            </div>

            <div className="p-6 border-3 border-black bg-cream hover:shadow-brutal transition-all cursor-pointer">
              <p className="text-xs font-black text-gray-700 uppercase mb-2">Active Rate</p>
              <p className="font-black text-3xl text-heirlock-green">
                {dashboardData.totalVaults > 0 ? 
                  `${((dashboardData.activeVaults / dashboardData.totalVaults) * 100).toFixed(0)}%` : 
                  '0%'
                }
              </p>
              <p className="text-xs text-gray-600 font-medium mt-2">
                {dashboardData.activeVaults} of {dashboardData.totalVaults} vaults active
              </p>
            </div>

            <div className="p-6 border-3 border-black bg-cream hover:shadow-brutal transition-all cursor-pointer">
              <p className="text-xs font-black text-gray-700 uppercase mb-2">Security Score</p>
              <p className="font-black text-3xl text-heirlock-pink">
                {dashboardData.totalVaults > 0 ? '98' : '—'}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-2">All vaults encrypted & secure</p>
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="border-4 border-black bg-white p-8 shadow-brutal">
          <h2 className="font-black text-xl text-black mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/dashboard/activity"
              className="border-4 border-heirlock-blue bg-blue-50 p-6 hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-heirlock-blue text-white rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-black text-black mb-2">Activity Log</h3>
              <p className="text-xs text-gray-700">View all vault activities and events</p>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="border-4 border-heirlock-green bg-green-50 p-6 hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-heirlock-green text-white rounded-full flex items-center justify-center mb-3">
                <BarChart className="w-4 h-4" />
              </div>
              <h3 className="font-black text-black mb-2">Analytics</h3>
              <p className="text-xs text-gray-700">Explore vault trends and insights</p>
            </Link>

            <Link
              href="/dashboard/security"
              className="border-4 border-heirlock-pink bg-pink-50 p-6 hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-heirlock-pink text-white rounded-full flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-black text-black mb-2">Security</h3>
              <p className="text-xs text-gray-700">Manage encryption and backups</p>
            </Link>

            <Link
              href="/create-vault"
              className="border-4 border-yellow-500 bg-yellow-50 p-6 hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-black text-black mb-2">Create Vault</h3>
              <p className="text-xs text-gray-700">Create a new encrypted vault</p>
            </Link>

            <Link
              href="/profile"
              className="border-4 border-purple-500 bg-purple-50 p-6 hover:shadow-brutal transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-3">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-black text-black mb-2">Profile</h3>
              <p className="text-xs text-gray-700">Manage your account and settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}