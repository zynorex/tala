'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import {
  ArrowLeft, Activity, Filter, Download, Search, Plus, Lock, Unlock, Eye, AlertCircle,
  Calendar
} from 'lucide-react';
import { useToast } from '@/app/hooks/useToast';

interface ActivityEvent {
  id: string;
  type: 'vault_created' | 'vault_accessed' | 'vault_unlocked' | 'file_downloaded' | 'error';
  description: string;
  timestamp: number;
  vaultId?: string;
  details?: Record<string, any>;
}

const ACTIVITY_TYPES = [
  { value: 'vault_created', label: 'Vault Created', icon: Plus, color: 'heirlock-green' },
  { value: 'vault_accessed', label: 'Vault Accessed', icon: Eye, color: 'heirlock-blue' },
  { value: 'vault_unlocked', label: 'Vault Unlocked', icon: Unlock, color: 'yellow-500' },
  { value: 'file_downloaded', label: 'File Downloaded', icon: Download, color: 'heirlock-pink' },
  { value: 'error', label: 'Error', icon: AlertCircle, color: 'red-500' },
];

export default function ActivityHistoryPage() {
  const { isConnected } = useAccount();
  const { toast } = useToast();

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const itemsPerPage = 15;

  // Load activities
  useEffect(() => {
    if (!isConnected) return;

    try {
      const allActivities: ActivityEvent[] = [];

      // Collect activities from all vaults
      const vaults = JSON.parse(localStorage.getItem('vaults') || '[]');
      vaults.forEach((vault: any) => {
        const vaultActivities = JSON.parse(
          localStorage.getItem(`vault_activities_${vault.id}`) || '[]'
        );
        allActivities.push(...vaultActivities);
      });

      // Add vault creation events
      vaults.forEach((vault: any) => {
        allActivities.push({
          id: `vault_created_${vault.id}`,
          type: 'vault_created',
          description: `Created vault: ${vault.description}`,
          timestamp: vault.createdAt,
          vaultId: vault.id,
        });
      });

      // Sort by timestamp (newest first)
      allActivities.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast('Failed to load activity history', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  // Filter and search
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.vaultId?.includes(searchTerm) ?? false);

    // Type filter
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.type);

    // Date range filter
    const activityDate = new Date(activity.timestamp * 1000);
    const matchesDateRange =
      (!dateRange.start || new Date(dateRange.start) <= activityDate) &&
      (!dateRange.end || activityDate <= new Date(dateRange.end));

    return matchesSearch && matchesType && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActivityIcon = (type: string) => {
    const actType = ACTIVITY_TYPES.find(a => a.value === type);
    return actType;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatRelativeTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Type', 'Description', 'Vault ID'].join(','),
      ...filteredActivities.map(a =>
        [
          formatDate(a.timestamp),
          a.type,
          `"${a.description}"`,
          a.vaultId || ''
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Activity history exported', 'success');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white p-4 md:p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="border-4 border-black p-8 text-center bg-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-4">Wallet Not Connected</h1>
            <p className="text-sm mb-4">Please connect your wallet to view activity history</p>
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
              <Activity className="w-8 h-8" />
              Activity History
            </h1>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-heirlock-green text-black border-2 border-black font-black text-sm hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Total activities: {filteredActivities.length}
          </p>
        </div>

        {/* Filters */}
        <div className="border-4 border-black p-6 bg-white mb-8">
          <h2 className="font-black text-black mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-xs font-black mb-2">Search</label>
              <div className="flex gap-2">
                <Search className="w-4 h-4 absolute mt-3 ml-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 pl-8 p-2 border-2 border-black font-mono text-sm"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-black mb-2">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, start: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="flex-1 p-2 border-2 border-black text-sm"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, end: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="flex-1 p-2 border-2 border-black text-sm"
                />
              </div>
            </div>
          </div>

          {/* Activity Type Filter */}
          <div className="mt-6">
            <label className="block text-xs font-black mb-3">Activity Types</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ACTIVITY_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type.value]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type.value));
                      }
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 border-2 border-black"
                  />
                  <span className="text-xs font-black">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Activities Table */}
        {isLoading ? (
          <div className="border-4 border-black p-8 bg-white animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : paginatedActivities.length === 0 ? (
          <div className="border-4 border-black p-8 bg-white text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm font-black text-gray-600">No activities found</p>
          </div>
        ) : (
          <>
            <div className="border-4 border-black overflow-hidden bg-white">
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b-4 border-black bg-gray-100 font-black text-xs">
                <div>Timestamp</div>
                <div>Type</div>
                <div>Description</div>
                <div>Vault ID</div>
              </div>

              {/* Rows */}
              <div className="divide-y-4 divide-black">
                {paginatedActivities.map((activity) => {
                  const typeInfo = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
                    >
                      <div>
                        <p className="text-xs font-mono font-black">
                          {formatDate(activity.timestamp)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {typeInfo && (
                          <>
                            <typeInfo.icon className="w-4 h-4" />
                            <span className="text-xs font-black">{typeInfo.label}</span>
                          </>
                        )}
                      </div>

                      <div className="text-xs text-gray-800">{activity.description}</div>

                      <div className="text-xs font-mono text-gray-600">
                        {activity.vaultId ? (
                          <Link
                            href={`/vault/${activity.vaultId}`}
                            className="text-heirlock-blue underline hover:font-black"
                          >
                            {activity.vaultId.substring(0, 8)}...
                          </Link>
                        ) : (
                          '-'
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-black font-black text-xs disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 border-2 border-black font-black text-xs ${
                        currentPage === i + 1
                          ? 'bg-black text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-black font-black text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

