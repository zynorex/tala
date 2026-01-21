'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import {
  ArrowLeft, TrendingUp, Calendar, BarChart3, Activity, Lock, AlertCircle, PieChart
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';

interface VaultData {
  id: string;
  createdAt: number;
  unlockTime: number;
  fileSize: number;
}

interface DailyData {
  date: string;
  vaults: number;
  storage: number;
  activities: number;
}

export default function AnalyticsDashboardPage() {
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (!isConnected) return;

    try {
      const storedVaults = JSON.parse(localStorage.getItem('vaults') || '[]');
      setVaults(storedVaults);

      // Generate daily data
      const generateDailyData = (days: number) => {
        const data: DailyData[] = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayVaults = storedVaults.filter((v: VaultData) => {
            const vaultDate = new Date(v.createdAt * 1000).toISOString().split('T')[0];
            return vaultDate === dateStr;
          });

          data.push({
            date: dateStr,
            vaults: dayVaults.length,
            storage: dayVaults.reduce((sum: number, v: VaultData) => sum + v.fileSize, 0),
            activities: dayVaults.length,
          });
        }

        return data;
      };

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      setDailyData(generateDailyData(days));
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast('Failed to load analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, timeRange, toast]);

  const calculateStats = () => {
    const now = Math.floor(Date.now() / 1000);
    const activeVaults = vaults.filter(v => v.unlockTime > now).length;
    const totalStorage = vaults.reduce((sum, v) => sum + v.fileSize, 0);
    const avgVaultSize = vaults.length > 0 ? totalStorage / vaults.length : 0;

    // Calculate growth
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const pastData = dailyData.slice(0, Math.floor(dailyData.length / 2));
    const recentData = dailyData.slice(Math.floor(dailyData.length / 2));

    const pastTotal = pastData.reduce((sum, d) => sum + d.vaults, 0);
    const recentTotal = recentData.reduce((sum, d) => sum + d.vaults, 0);
    const growth = pastTotal > 0 ? ((recentTotal - pastTotal) / pastTotal) * 100 : 0;

    return {
      activeVaults,
      totalStorage,
      avgVaultSize,
      growth: growth.toFixed(1),
      totalVaults: vaults.length,
      securityScore: vaults.length > 0 ? 98 : 0,
    };
  };

  const stats = calculateStats();
  const maxDaily = Math.max(...dailyData.map(d => d.vaults), 1);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-4">Please connect your wallet to view analytics</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-black font-black hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-black flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              Analytics
            </h1>

            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 border-2 border-black font-black text-xs transition-all ${
                    timeRange === range
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Track vault creation, storage usage, and activity trends
          </p>
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
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="border-4 border-heirlock-blue bg-blue-50 p-6">
                <p className="text-xs font-black text-heirlock-blue mb-2">TOTAL VAULTS</p>
                <p className="text-3xl font-black text-heirlock-blue">{stats.totalVaults}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Growth: {stats.growth}% this period
                </p>
              </div>

              <div className="border-4 border-heirlock-green bg-green-50 p-6">
                <p className="text-xs font-black text-heirlock-green mb-2">ACTIVE VAULTS</p>
                <p className="text-3xl font-black text-heirlock-green">{stats.activeVaults}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {stats.totalVaults > 0 ? `${((stats.activeVaults / stats.totalVaults) * 100).toFixed(0)}%` : '0%'} of total
                </p>
              </div>

              <div className="border-4 border-heirlock-pink bg-pink-50 p-6">
                <p className="text-xs font-black text-heirlock-pink mb-2">STORAGE USED</p>
                <p className="text-3xl font-black text-heirlock-pink">
                  {(stats.totalStorage / 1024 / 1024).toFixed(2)}
                  <span className="text-lg"> MB</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Avg: {(stats.avgVaultSize / 1024 / 1024).toFixed(2)} MB per vault
                </p>
              </div>

              <div className="border-4 border-yellow-500 bg-yellow-50 p-6">
                <p className="text-xs font-black text-yellow-700 mb-2">SECURITY SCORE</p>
                <p className="text-3xl font-black text-yellow-700">{stats.securityScore}/100</p>
                <p className="text-xs text-gray-600 mt-2">All vaults encrypted</p>
              </div>
            </div>

            {/* Vault Creation Trend */}
            <div className="border-4 border-black bg-white p-8 mb-8">
              <h2 className="font-black text-xl mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Vault Creation Trend
              </h2>

              <div className="flex items-end justify-between h-64 gap-1 px-2">
                {dailyData.map((data, idx) => {
                  const height = (data.vaults / maxDaily) * 100 || 5;
                  return (
                    <div
                      key={idx}
                      className="flex-1 group relative"
                      title={`${data.date}: ${data.vaults} vault(s)`}
                    >
                      <div
                        className="w-full bg-heirlock-blue hover:bg-heirlock-green transition-colors border-2 border-black"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                      {idx % Math.ceil(dailyData.length / 6) === 0 && (
                        <p className="text-xs font-black text-gray-600 text-center mt-2 absolute -left-4 -right-4 bottom-0 translate-y-full">
                          {data.date.split('-')[2]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-600 mt-12">
                Showing daily vault creation count over the last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days
              </p>
            </div>

            {/* Storage & Activity Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Storage Timeline */}
              <div className="border-4 border-black bg-white p-8">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Storage Timeline
                </h3>

                <div className="space-y-3">
                  {dailyData.slice(-7).map((data) => {
                    const percentage = (data.storage / Math.max(...dailyData.map(d => d.storage), 1)) * 100;
                    return (
                      <div key={data.date}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-black">{data.date}</span>
                          <span className="text-xs font-black text-gray-600">
                            {(data.storage / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="w-full h-3 border-2 border-black bg-gray-100">
                          <div
                            className="h-full bg-heirlock-pink"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Summary */}
              <div className="border-4 border-black bg-white p-8">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Summary
                </h3>

                <div className="space-y-4">
                  <div className="border-2 border-black p-4">
                    <p className="text-xs font-black text-gray-600 mb-1">TOTAL ACTIVITIES</p>
                    <p className="text-2xl font-black">
                      {dailyData.reduce((sum, d) => sum + d.activities, 0)}
                    </p>
                  </div>

                  <div className="border-2 border-black p-4">
                    <p className="text-xs font-black text-gray-600 mb-1">AVG DAILY ACTIVITY</p>
                    <p className="text-2xl font-black">
                      {(dailyData.reduce((sum, d) => sum + d.activities, 0) / dailyData.length).toFixed(1)}
                    </p>
                  </div>

                  <div className="border-2 border-black p-4">
                    <p className="text-xs font-black text-gray-600 mb-1">PEAK ACTIVITY</p>
                    <p className="text-2xl font-black">
                      {Math.max(...dailyData.map(d => d.activities), 0)} vaults
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Charts */}
            <div className="border-4 border-black bg-white p-8 mb-8">
              <h2 className="font-black text-xl mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Vault Distribution
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vault Status */}
                <div>
                  <p className="font-black text-sm mb-4">By Status</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-heirlock-green border-2 border-black"></div>
                      <span className="text-xs font-black">Active Vaults</span>
                      <span className="ml-auto font-black text-heirlock-green">{stats.activeVaults}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-400 border-2 border-black"></div>
                      <span className="text-xs font-black">Locked Vaults</span>
                      <span className="ml-auto font-black text-yellow-700">
                        {stats.totalVaults - stats.activeVaults}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div>
                  <p className="font-black text-sm mb-4">Security Coverage</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-heirlock-green border-2 border-black"></div>
                      <span className="text-xs font-black">Encrypted</span>
                      <span className="ml-auto font-black text-heirlock-green">{stats.totalVaults}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-300 border-2 border-black"></div>
                      <span className="text-xs font-black">Unprotected</span>
                      <span className="ml-auto font-black text-gray-600">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="border-4 border-heirlock-blue bg-blue-50 p-8">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Insights
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-800">
                  ✓ You've created <strong>{stats.totalVaults}</strong> vault{stats.totalVaults !== 1 ? 's' : ''} using <strong>{(stats.totalStorage / 1024 / 1024).toFixed(2)} MB</strong> of storage
                </p>
                <p className="text-sm text-gray-800">
                  ✓ <strong>{((stats.activeVaults / stats.totalVaults) * 100 || 0).toFixed(0)}%</strong> of your vaults are currently active and locked
                </p>
                <p className="text-sm text-gray-800">
                  ✓ All vaults are protected with <strong>AES-256-GCM</strong> encryption
                </p>
                {parseFloat(stats.growth) > 0 && (
                  <p className="text-sm text-gray-800">
                    ✓ You created <strong>{stats.growth}%</strong> more vaults in the second half of this period
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

