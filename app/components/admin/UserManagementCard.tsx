'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Trash2, Mail, MoreVertical } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  vaultCount: number;
  isActive: boolean;
}

export default function UserManagementCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_auth_token');
      const response = await fetch(
        `/api/admin/users?page=${page}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeleting(userId);
    try {
      const token = localStorage.getItem('admin_auth_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-800/50 border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 border border-white/20">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">User Management</h2>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-slate-400 text-center py-8">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-900/30 border border-blue-600/50 flex items-center justify-center rounded">
                      <span className="text-xs font-bold text-blue-300">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {user.vaultCount} vaults
                    </p>
                    <p className={`text-xs ${user.isActive ? 'text-green-400' : 'text-slate-400'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleting === user.id}
                    className="p-2 hover:bg-red-900/30 border border-red-600/20 hover:border-red-600/50 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-400">
            Page {page} of {Math.ceil(users.length / pageSize)}
          </p>
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
