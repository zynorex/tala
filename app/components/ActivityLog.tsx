'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Activity, Lock, Plus, Eye, AlertCircle, Download, Upload } from 'lucide-react';
import Link from 'next/link';

interface ActivityEvent {
  id: string;
  action: string;
  description: string;
  createdAt: string;
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

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/activity?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      setActivities(data.data || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  const getIcon = (action: string) => {
    if (action.includes('CREATED')) return Plus;
    if (action.includes('UPLOADED')) return Upload;
    if (action.includes('DOWNLOADED')) return Download;
    if (action.includes('DELETED')) return AlertCircle;
    return Activity;
  };

  const getColor = (action: string) => {
    if (action.includes('CREATED')) return 'text-heirlock-green';
    if (action.includes('UPLOADED')) return 'text-heirlock-blue';
    if (action.includes('DOWNLOADED')) return 'text-heirlock-yellow';
    if (action.includes('DELETED')) return 'text-red-600';
    return 'text-gray-600';
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
            const Icon = getIcon(activity.action);
            const color = getColor(activity.action);

            return (
              <div key={activity.id} className="p-4 hover:bg-cream transition-colors">
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 ${color} flex-shrink-0 mt-1`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 font-medium mt-1">
                      {formatTime(activity.createdAt)}
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
