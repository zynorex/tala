'use client';

import { Database, Lock, TrendingUp, Shield } from 'lucide-react';

interface DashboardStatsProps {
  data: {
    totalVaults: number;
    totalStorageUsed: number;
    activeVaults: number;
    secureVaults: number;
  };
  isLoading: boolean;
  showSensitiveData: boolean;
}

export default function DashboardStats({ data, isLoading, showSensitiveData }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Vaults',
      value: data.totalVaults,
      icon: Lock,
      color: 'heirlock-blue',
      bgColor: 'bg-blue-50',
      trend: '+2 this month',
    },
    {
      label: 'Storage Used',
      value: `${(data.totalStorageUsed / 1024 / 1024).toFixed(2)} MB`,
      icon: Database,
      color: 'heirlock-green',
      bgColor: 'bg-green-50',
      trend: '10 MB limit',
    },
    {
      label: 'Active Vaults',
      value: data.activeVaults,
      icon: TrendingUp,
      color: 'heirlock-yellow',
      bgColor: 'bg-yellow-50',
      trend: `${data.totalVaults > 0 ? ((data.activeVaults / data.totalVaults) * 100).toFixed(0) : 0}% active`,
    },
    {
      label: 'Security Score',
      value: '98/100',
      icon: Shield,
      color: 'heirlock-pink',
      bgColor: 'bg-pink-50',
      trend: 'Excellent',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`border-4 border-black ${stat.bgColor} p-6 shadow-brutal hover:shadow-lg transition-all hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-black text-gray-700 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
              <Icon className="w-5 h-5 text-gray-700" />
            </div>

            <div className="mb-4">
              <p className="font-black text-3xl text-black">
                {isLoading ? '—' : stat.value}
              </p>
            </div>

            <div className="pt-3 border-t-2 border-black">
              <p className="text-xs font-medium text-gray-600">
                {isLoading ? 'Loading...' : stat.trend}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}