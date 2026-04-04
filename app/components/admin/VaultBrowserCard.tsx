'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Search, Lock, User, FileIcon } from 'lucide-react';

interface Vault {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  fileCount: number;
  isActive: boolean;
  description: string;
}

export default function VaultBrowserCard() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVaults();
  }, [filter]);

  const fetchVaults = async () => {
    try {
      const token = localStorage.getItem('admin_auth_token');
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('isActive', filter === 'active' ? 'true' : 'false');
      }

      const response = await fetch(`/api/admin/vaults?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVaults(data.vaults || []);
      }
    } catch (error) {
      console.error('Failed to fetch vaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVaults = vaults.filter(
    (vault) =>
      vault.name.toLowerCase().includes(search.toLowerCase()) ||
      vault.owner.toLowerCase().includes(search.toLowerCase()) ||
      vault.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-800/50 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 border border-white/20">
          <FolderOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Vault Browser</h2>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vaults..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-white"
        >
          <option value="all">All Vaults</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Vaults Grid */}
      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading vaults...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVaults.length === 0 ? (
            <div className="col-span-full text-slate-400 text-center py-8">
              No vaults found
            </div>
          ) : (
            filteredVaults.map((vault) => (
              <div
                key={vault.id}
                className="bg-slate-900/50 border border-white/10 hover:border-white/30 p-4 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-purple-900/30 border border-purple-600/50">
                      <FolderOpen className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">
                        {vault.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" />
                        {vault.owner}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      vault.isActive
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-slate-700/30 text-slate-400'
                    }`}
                  >
                    {vault.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {vault.description || 'No description'}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <FileIcon className="w-4 h-4" />
                    {vault.fileCount} files
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(vault.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

