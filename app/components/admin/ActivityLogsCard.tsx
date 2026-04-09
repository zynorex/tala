'use client';

import { useEffect, useState } from 'react';
import { Activity, Search, Filter } from 'lucide-react';

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  vaultId?: string;
  details?: string;
}

export default function ActivityLogsCard() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);

  const pageSize = 20;

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('admin_auth_token');
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());
      if (actionFilter !== 'all') {
        params.append('action', actionFilter);
      }

      const response = await fetch(`/api/admin/logs?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.userId.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search)
  );

  const actions = [...new Set(logs.map((log) => log.action))];

  const getActionColor = (action: string) => {
    if (action.includes('upload') || action.includes('create'))
      return 'text-green-400';
    if (action.includes('delete') || action.includes('remove'))
      return 'text-red-400';
    if (action.includes('view') || action.includes('read'))
      return 'text-blue-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800/50 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 border border-white/20">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Activity Logs</h2>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, action, or IP..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-white"
        >
          <option value="all">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {/* Logs Timeline */}
      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading logs...</div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-400 text-center py-8">No logs found</div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="flex gap-4 p-4 bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                {/* Timeline Dot */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className="w-3 h-3 bg-white border border-white/20 rounded-full" />
                  {idx !== filteredLogs.length - 1 && (
                    <div className="w-0.5 h-12 bg-white/10" />
                  )}
                </div>

                {/* Log Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-bold ${getActionColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        User: <span className="text-white">{log.userId}</span>
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
                    <span>IP: {log.ipAddress}</span>
                    {log.vaultId && <span>Vault: {log.vaultId}</span>}
                    {log.userAgent && (
                      <span className="truncate max-w-xs">
                        Agent: {log.userAgent.split('/')[0]}
                      </span>
                    )}
                  </div>

                  {log.details && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-slate-800/50 border border-white/5">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredLogs.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-400">Page {page}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-bold"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

