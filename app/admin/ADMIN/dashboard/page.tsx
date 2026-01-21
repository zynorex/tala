'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/app/hooks/useAdminAuth';
import AdminDashboardHeader from '@/app/components/admin/AdminDashboardHeader';
import AnalyticsCard from '@/app/components/admin/AnalyticsCard';
import UserManagementCard from '@/app/components/admin/UserManagementCard';
import VaultBrowserCard from '@/app/components/admin/VaultBrowserCard';
import ActivityLogsCard from '@/app/components/admin/ActivityLogsCard';
import { BarChart3, Users, FolderOpen, Activity, Zap, HardDrive } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalVaults: number;
  totalFiles: number;
  totalStorage: number;
  activeUsers: number;
  growth: {
    users: number;
    vaults: number;
    files: number;
  };
}

export default function AdminDashboard() {
  const { session, loading, logout, isAuthenticated } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated && session?.token) {
      fetchStats();
    }
  }, [isAuthenticated, session?.token]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_auth_token');
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalVaults: data.totalVaults || 0,
          totalFiles: data.totalFiles || 0,
          totalStorage: data.totalStorage || 0,
          activeUsers: data.activeUsers || 0,
          growth: data.growth || { users: 0, vaults: 0, files: 0 },
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <AdminDashboardHeader adminName={session?.name} onLogout={logout} />

      {/* Main Content */}
      <main className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <span>Admin</span>
              <span>/</span>
              <span>Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Owner Dashboard
            </h1>
            <p className="text-slate-400">
              Complete system overview and management tools
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-white/10">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'vaults', label: 'Vaults', icon: FolderOpen },
              { id: 'logs', label: 'Activity Logs', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-bold transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                  icon={Users}
                  label="Total Users"
                  value={stats?.totalUsers || 0}
                  growth={stats?.growth.users}
                  loading={statsLoading}
                />
                <StatsCard
                  icon={FolderOpen}
                  label="Total Vaults"
                  value={stats?.totalVaults || 0}
                  growth={stats?.growth.vaults}
                  loading={statsLoading}
                />
                <StatsCard
                  icon={Zap}
                  label="Total Files"
                  value={stats?.totalFiles || 0}
                  growth={stats?.growth.files}
                  loading={statsLoading}
                />
                <StatsCard
                  icon={HardDrive}
                  label="Total Storage"
                  value={`${(stats?.totalStorage || 0).toFixed(2)} MB`}
                  loading={statsLoading}
                />
                <StatsCard
                  icon={Users}
                  label="Active Users (30d)"
                  value={stats?.activeUsers || 0}
                  loading={statsLoading}
                />
              </div>

              {/* Analytics Chart */}
              <AnalyticsCard />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && <UserManagementCard />}

          {/* Vaults Tab */}
          {activeTab === 'vaults' && <VaultBrowserCard />}

          {/* Logs Tab */}
          {activeTab === 'logs' && <ActivityLogsCard />}
        </div>
      </main>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  growth?: number;
  loading?: boolean;
}

function StatsCard({ icon: Icon, label, value, growth, loading }: StatsCardProps) {
  return (
    <div className="bg-slate-800/50 border border-white/10 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm font-bold mb-2">{label}</p>
          <p className="text-3xl font-black text-white">
            {loading ? '-' : value}
          </p>
        </div>
        <div className="p-3 bg-white/10 border border-white/20">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {growth !== undefined && (
        <div className="text-sm text-green-400 font-bold">
          +{growth}% this month
        </div>
      )}
    </div>
  );
}

