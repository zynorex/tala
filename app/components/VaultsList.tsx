'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Lock, Clock, Trash2, Eye, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Vault {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  _count?: {
    files: number;
  };
}

interface VaultsListProps {
  showSensitiveData: boolean;
}

export default function VaultsList({ showSensitiveData }: VaultsListProps) {
  const { address } = useAccount();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'unlocked'>('all');

  useEffect(() => {
    if (address) {
      loadVaults();
    }
  }, [address]);

  const loadVaults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vaults?page=1&pageSize=20');
      if (!response.ok) throw new Error('Failed to fetch vaults');
      
      const data = await response.json();
      const allVaults = data.data?.data || [];
      setVaults(allVaults);
    } catch (error) {
      console.error('Failed to load vaults:', error);
      setVaults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredVaults = () => {
    switch (filter) {
      case 'active':
        return vaults.filter(v => v.isActive);
      case 'unlocked':
        return vaults.filter(v => !v.isActive);
      default:
        return vaults;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredVaults = getFilteredVaults();

  return (
    <div className="border-4 border-black bg-white shadow-brutal">
      {/* Header */}
      <div className="border-b-4 border-black p-6 bg-cream">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-2xl text-black flex items-center gap-3">
            <Lock className="w-6 h-6" />
            My Vaults
          </h2>
          <span className="text-sm font-black text-gray-700 bg-white border-3 border-black px-3 py-1">
            {vaults.length} {vaults.length === 1 ? 'vault' : 'vaults'}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'active', 'unlocked'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 border-2 border-black font-bold text-sm uppercase transition-all ${
                filter === filterType
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {filterType === 'all' ? 'All' : filterType === 'active' ? 'Active' : 'Unlocked'}
            </button>
          ))}
        </div>
      </div>

      {/* Vaults List */}
      <div className="divide-y-4 divide-black">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <p className="text-gray-600 font-medium">Loading vaults...</p>
            </div>
          </div>
        ) : filteredVaults.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-4">
              {filter === 'all' && 'No vaults yet. Create your first vault to get started!'}
              {filter === 'active' && 'No active vaults yet.'}
              {filter === 'unlocked' && 'No inactive vaults yet.'}
            </p>
            <Link
              href="/create-vault"
              className="inline-block px-6 py-2 border-3 border-black font-black bg-heirlock-yellow hover:bg-yellow-400 transition-all"
            >
              Create Vault
            </Link>
          </div>
        ) : (
          filteredVaults.map((vault) => {
            const filesCount = vault._count?.files || 0;
            const createdDate = new Date(vault.createdAt);

            return (
              <Link
                key={vault.id}
                href={`/vault/${vault.id}`}
                className="block p-6 hover:bg-cream transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg text-black group-hover:text-heirlock-blue transition-colors truncate">
                      {showSensitiveData ? vault.name : '●●●●●●●●●●'}
                    </h3>
                    {vault.description && (
                      <p className="text-sm text-gray-700 font-medium mt-1 truncate">
                        {showSensitiveData ? vault.description : 'Encrypted description'}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2 flex-wrap text-xs text-gray-700 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {createdDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {filesCount} {filesCount === 1 ? 'file' : 'files'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 border-2 border-black font-black text-xs uppercase whitespace-nowrap ${
                        vault.isActive
                          ? 'bg-heirlock-green text-black'
                          : 'bg-gray-300 text-black'
                      }`}
                    >
                      {vault.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* View Link */}
                <div className="pt-3 border-t-2 border-gray-300 flex items-center justify-between text-xs text-gray-600 font-medium">
                  <span>Vault ID: {vault.id.slice(0, 8)}...</span>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      {vaults.length > 0 && (
        <div className="border-t-4 border-black p-4 bg-cream flex justify-between items-center">
          <p className="text-xs text-gray-700 font-medium">
            Showing {filteredVaults.length} of {vaults.length} vaults
          </p>
          <Link
            href="/create-vault"
            className="px-4 py-2 border-3 border-black font-black text-sm bg-black text-white hover:bg-gray-800 transition-all"
          >
            + New Vault
          </Link>
        </div>
      )}
    </div>
  );
}