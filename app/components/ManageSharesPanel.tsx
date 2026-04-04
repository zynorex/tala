'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Link2, Copy, Check, Trash2, Clock, Users, Eye, Download, 
  Edit3, AlertCircle, RefreshCw, MoreVertical, ExternalLink,
  X, Calendar, Hash, Loader2, Share2
} from 'lucide-react';

// ============ TYPES ============

interface ManageSharesPanelProps {
  vaultId: string;
  vaultName: string;
  onShareCreated?: () => void;
}

interface Share {
  id: string;
  shareToken: string;
  shareUrl: string;
  permission: 'VIEW_ONLY' | 'DOWNLOAD' | 'FULL_ACCESS';
  status: 'active' | 'expired' | 'exhausted' | 'revoked';
  requiresPassword: boolean;
  expiresAt: string | null;
  maxAccessCount: number | null;
  accessCount: number;
  inviteEmail: string | null;
  inviteSent: boolean;
  isActive: boolean;
  createdAt: string;
  lastAccessedAt: string | null;
  sharedWithUser: {
    id: string;
    name: string | null;
    email: string | null;
    displayName: string | null;
  } | null;
}

interface SharesData {
  vaultId: string;
  vaultName: string;
  shares: Share[];
  totalShares: number;
  activeShares: number;
}

// ============ HELPER FUNCTIONS ============

function getPermissionIcon(permission: string) {
  switch (permission) {
    case 'VIEW_ONLY': return <Eye className="w-3 h-3" />;
    case 'DOWNLOAD': return <Download className="w-3 h-3" />;
    case 'FULL_ACCESS': return <Edit3 className="w-3 h-3" />;
    default: return <Link2 className="w-3 h-3" />;
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'active': return 'bg-heirlock-green text-black';
    case 'expired': return 'bg-gray-300 text-gray-700';
    case 'exhausted': return 'bg-heirlock-yellow text-black';
    case 'revoked': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-600';
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

// ============ COMPONENT ============

export default function ManageSharesPanel({
  vaultId,
  vaultName,
  onShareCreated,
}: ManageSharesPanelProps) {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch shares
  const fetchShares = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/vaults/${vaultId}/shares`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch shares');
      }

      setShares(data.data.shares || []);
    } catch (err) {
      console.error('Fetch shares error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load shares');
    } finally {
      setLoading(false);
    }
  }, [vaultId]);

  // Initial fetch
  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  // Copy share URL
  const copyShareUrl = useCallback(async (share: Share) => {
    try {
      await navigator.clipboard.writeText(share.shareUrl);
      setCopiedId(share.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Revoke share
  const revokeShare = useCallback(async (shareId: string) => {
    if (!confirm('Are you sure you want to revoke this share link? It will no longer be accessible.')) {
      return;
    }

    setDeletingId(shareId);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/vaults/${vaultId}/shares/${shareId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to revoke share');
      }

      // Update local state
      setShares(prev => prev.map(s => 
        s.id === shareId 
          ? { ...s, isActive: false, status: 'revoked' as const }
          : s
      ));
    } catch (err) {
      console.error('Revoke error:', err);
      alert(err instanceof Error ? err.message : 'Failed to revoke share');
    } finally {
      setDeletingId(null);
    }
  }, [vaultId]);

  // Loading state
  if (loading) {
    return (
      <div className="border-4 border-black p-6 bg-white">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="font-bold">Loading shares...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border-4 border-black p-6 bg-white">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
        <button
          onClick={fetchShares}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-gray-50 font-bold text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (shares.length === 0) {
    return (
      <div className="border-4 border-black p-6 bg-white">
        <div className="text-center py-8">
          <div className="inline-flex p-4 bg-gray-100 border-2 border-black mb-4">
            <Share2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-black text-lg mb-2">No Active Shares</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create a share link to let others access this vault.
          </p>
        </div>
      </div>
    );
  }

  // Active shares count
  const activeCount = shares.filter(s => s.status === 'active').length;

  return (
    <div className="border-4 border-black bg-white">
      {/* Header */}
      <div className="p-4 border-b-4 border-black bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5" />
          <div>
            <h3 className="font-black">Active Shares</h3>
            <p className="text-xs text-gray-600">
              {activeCount} active / {shares.length} total
            </p>
          </div>
        </div>
        <button
          onClick={fetchShares}
          className="p-2 hover:bg-white border-2 border-transparent hover:border-black transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Shares List */}
      <div className="divide-y-2 divide-black">
        {shares.map((share) => (
          <ShareItem
            key={share.id}
            share={share}
            isExpanded={expandedId === share.id}
            isCopied={copiedId === share.id}
            isDeleting={deletingId === share.id}
            onToggleExpand={() => setExpandedId(expandedId === share.id ? null : share.id)}
            onCopy={() => copyShareUrl(share)}
            onRevoke={() => revokeShare(share.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ============ SHARE ITEM COMPONENT ============

interface ShareItemProps {
  share: Share;
  isExpanded: boolean;
  isCopied: boolean;
  isDeleting: boolean;
  onToggleExpand: () => void;
  onCopy: () => void;
  onRevoke: () => void;
}

function ShareItem({
  share,
  isExpanded,
  isCopied,
  isDeleting,
  onToggleExpand,
  onCopy,
  onRevoke,
}: ShareItemProps) {
  const isInactive = share.status !== 'active';

  return (
    <div className={`${isInactive ? 'opacity-60' : ''}`}>
      {/* Main Row */}
      <div className="p-4 flex items-center gap-4">
        {/* Permission Icon */}
        <div className={`p-2 border-2 border-black ${
          share.status === 'active' ? 'bg-heirlock-green' : 'bg-gray-200'
        }`}>
          {getPermissionIcon(share.permission)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-bold border border-black ${getStatusStyles(share.status)}`}>
              {share.status.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 border border-black">
              {share.permission.replace('_', ' ')}
            </span>
            {share.sharedWithUser && (
              <span className="text-xs text-gray-600">
                → {share.sharedWithUser.name || share.sharedWithUser.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getTimeAgo(share.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {share.accessCount} views
            </span>
            {share.maxAccessCount && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {share.accessCount}/{share.maxAccessCount} limit
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            disabled={isInactive}
            className={`p-2 border-2 border-black transition-all ${
              isCopied 
                ? 'bg-heirlock-green' 
                : 'bg-white hover:bg-gray-50 disabled:opacity-50'
            }`}
            title={isCopied ? 'Copied!' : 'Copy link'}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleExpand}
            className="p-2 border-2 border-black bg-white hover:bg-gray-50 transition-all"
            title="Details"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t-2 border-dashed border-gray-300 pt-4 mx-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <p className="text-gray-500 mb-1">Created</p>
              <p className="font-bold">{formatDate(share.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Last Accessed</p>
              <p className="font-bold">{share.lastAccessedAt ? formatDate(share.lastAccessedAt) : 'Never'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Expires</p>
              <p className="font-bold">{share.expiresAt ? formatDate(share.expiresAt) : 'Never'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Access Limit</p>
              <p className="font-bold">
                {share.maxAccessCount 
                  ? `${share.accessCount} / ${share.maxAccessCount}` 
                  : 'Unlimited'}
              </p>
            </div>
            {share.inviteEmail && (
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Invited Email</p>
                <p className="font-bold">{share.inviteEmail}</p>
              </div>
            )}
          </div>

          {/* Share URL */}
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-1">Share URL</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={share.shareUrl}
                readOnly
                className="flex-1 p-2 border-2 border-black bg-gray-50 font-mono text-xs truncate"
              />
              <a
                href={share.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-black bg-white hover:bg-gray-50"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Actions */}
          {share.status === 'active' && (
            <button
              onClick={onRevoke}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Revoke Share
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
