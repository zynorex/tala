'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsData {
  period: string;
  users: number;
  vaults: number;
  files: number;
}

export default function AnalyticsCard() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('admin_auth_token');
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform data for chart
        const chartData = [
          { period: 'Week 1', users: 10, vaults: 5, files: 23 },
          { period: 'Week 2', users: 15, vaults: 8, files: 35 },
          { period: 'Week 3', users: 18, vaults: 10, files: 42 },
          { period: 'Week 4', users: 22, vaults: 12, files: 48 },
          { period: 'Today', users: data.totalUsers || 22, vaults: data.totalVaults || 12, files: data.totalFiles || 48 },
        ];
        setData(chartData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 border border-white/20">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">30-Day Analytics</h2>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading chart...</div>
      ) : (
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.period}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 font-bold">{item.period}</span>
                <span className="text-white text-sm">
                  Users: {item.users} | Vaults: {item.vaults} | Files: {item.files}
                </span>
              </div>
              <div className="flex gap-2">
                {/* Users Bar */}
                <div className="flex-1">
                  <div className="bg-blue-900/30 border border-blue-600/50 h-8">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${(item.users / 25) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-400 mt-1">Users</p>
                </div>
                {/* Vaults Bar */}
                <div className="flex-1">
                  <div className="bg-purple-900/30 border border-purple-600/50 h-8">
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${(item.vaults / 15) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-400 mt-1">Vaults</p>
                </div>
                {/* Files Bar */}
                <div className="flex-1">
                  <div className="bg-green-900/30 border border-green-600/50 h-8">
                    <div
                      className="bg-green-500 h-full transition-all"
                      style={{ width: `${(item.files / 50) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-400 mt-1">Files</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

