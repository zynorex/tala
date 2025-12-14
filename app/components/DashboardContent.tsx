'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { BarChart, TrendingUp, Lock, Shield, Clock, Database, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData();
    }
  }, [isConnected, address]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get vaults from localStorage (in production, this would be from API/blockchain)
      const vaultsStr = localStorage.getItem(`vaults_${address}`);
      const vaults = vaultsStr ? JSON.parse(vaultsStr) : [];

      const now = Date.now() / 1000;
      const activeVaults = vaults.filter((v: any) => v.unlockTime > now).length;

      let totalStorage = 0;
      let totalDuration = 0;

      vaults.forEach((vault: any) => {
        totalStorage += vault.fileSize || 0;
        totalDuration += (vault.unlockTime - vault.createdAt) || 0;
      });

      const avgDuration = vaults.length > 0 ? totalDuration / vaults.length : 0;
      const lastVault = vaults.length > 0 ? new Date(vaults[vaults.length - 1].createdAt * 1000).toLocaleDateString() : null;

      setDashboardData({
        totalVaults: vaults.length,
        totalStorageUsed: totalStorage,
        activeVaults,
        secureVaults: vaults.length, // All are secure by default
        lastVaultCreated: lastVault,
        averageVaultDuration: avgDuration,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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
              Welcome back, <span className="font-black text-heirlock-blue">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
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
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="w-6 h-6 text-black" />
            <h2 className="font-black text-2xl text-black">Vault Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-3 border-black bg-cream">
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

            <div className="p-6 border-3 border-black bg-cream">
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

            <div className="p-6 border-3 border-black bg-cream">
              <p className="text-xs font-black text-gray-700 uppercase mb-2">Security Score</p>
              <p className="font-black text-3xl text-heirlock-pink">
                {dashboardData.totalVaults > 0 ? '98' : '—'}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-2">All vaults encrypted & secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}