'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Activity, Lock, Plus, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface ActivityEvent {
  id: string;
  type: 'vault_created' | 'vault_accessed' | 'vault_unlocked' | 'error';
  description: string;
  timestamp: number;
  icon: typeof Lock;
  color: string;
}

interface ActivityLogProps {
  limit?: number;
}

export default function ActivityLog({ limit = 10 }: ActivityLogProps) {
  const { address } = useAccount();
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      loadActivities();
    }
  }, [address]);

  const loadActivities = () => {
    setIsLoading(true);
    try {
      // Get activities from localStorage
      const activitiesStr = localStorage.getItem(`activities_${address}`);
      const allActivities = activitiesStr ? JSON.parse(activitiesStr) : [];

      // Get vaults and generate activity events
      const vaultsStr = localStorage.getItem(`vaults_${address}`);
      const vaults = vaultsStr ? JSON.parse(vaultsStr) : [];

      const events: ActivityEvent[] = vaults.map((vault: any, index: number) => ({
        id: `vault_${index}`,
        type: 'vault_created' as const,
        description: `Created vault: "${vault.description}"`,
        timestamp: vault.createdAt,
        icon: Plus,
        color: 'text-heirlock-green',
      }));

      // Sort by timestamp (newest first) and limit
      const sortedActivities = [...allActivities, ...events]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'vault_created':
        return Plus;
      case 'vault_accessed':
        return Eye;
      case 'vault_unlocked':
        return Lock;
      case 'error':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'vault_created':
        return 'text-heirlock-green';
      case 'vault_accessed':
        return 'text-heirlock-blue';
      case 'vault_unlocked':
        return 'text-heirlock-yellow';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="border-4 border-black bg-white shadow-brutal">
      {/* Header */}
      <div className="border-b-4 border-black p-6 bg-heirlock-blue flex items-center gap-3">
        <Activity className="w-6 h-6 text-white" />
        <h3 className="font-black text-xl text-white">Recent Activity</h3>
      </div>

      {/* Activity List */}
      <div className="divide-y-2 divide-gray-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 font-medium text-sm">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium text-sm">No activity yet</p>
          </div>
        ) : (
          activities.slice(0, limit).map((activity) => {
            const Icon = getIcon(activity.type);
            const color = getColor(activity.type);

            return (
              <div key={activity.id} className="p-4 hover:bg-cream transition-colors">
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 ${color} flex-shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 font-medium mt-1">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="border-t-4 border-black p-4 bg-cream text-center">
          <Link
            href="/dashboard/activity"
            className="text-xs font-black text-heirlock-blue hover:text-blue-700 transition-colors"
          >
            View all activity →
          </Link>
        </div>
      )}
    </div>
  );
}