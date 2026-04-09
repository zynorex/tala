'use client';

import { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Plus, Trash2, Search, Mail, Loader2 } from 'lucide-react';

interface AllowedEntry {
  id: string;
  email: string;
  note: string | null;
  addedBy: string;
  createdAt: string;
}

export default function AllowlistCard() {
  const [entries, setEntries] = useState<AllowedEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Add form
  const [newEmail, setNewEmail] = useState('');
  const [newNote, setNewNote] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const token = () => localStorage.getItem('admin_auth_token') ?? '';

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search.trim()) qs.set('search', search.trim());

      const res = await fetch(`/api/admin/allowlist?${qs}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.items ?? []);
        setTotal(data.total ?? 0);
      }
    } catch (e) {
      console.error('Failed to fetch allowlist:', e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAdding(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/allowlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ email: newEmail.trim(), note: newNote.trim() || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'ok', msg: data.message });
        setNewEmail('');
        setNewNote('');
        fetchEntries();
      } else {
        setFeedback({ type: 'err', msg: data.error ?? 'Failed to add email.' });
      }
    } catch {
      setFeedback({ type: 'err', msg: 'Network error.' });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`Remove "${email}" from the allowlist? They will no longer be able to log in.`)) return;
    setRemoving(email);
    try {
      const res = await fetch('/api/admin/allowlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setFeedback({ type: 'ok', msg: `Removed ${email}.` });
        fetchEntries();
      } else {
        const data = await res.json();
        setFeedback({ type: 'err', msg: data.error ?? 'Failed to remove.' });
      }
    } catch {
      setFeedback({ type: 'err', msg: 'Network error.' });
    } finally {
      setRemoving(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="border-4 border-black bg-white shadow-brutal">
      {/* Header */}
      <div className="bg-heirlock-green p-6 border-b-4 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black text-heirlock-green border-2 border-black">
            <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wide">Login Allowlist</h2>
            <p className="text-sm font-bold text-black/60">{total} email{total !== 1 ? 's' : ''} authorized</p>
          </div>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="p-5 border-b-4 border-black bg-cream">
        <p className="text-sm font-bold mb-3 text-black/70">Grant a new email access to sign in</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border-4 border-black font-bold text-sm bg-white focus:outline-none focus:border-heirlock-green shadow-[3px_3px_0_0_#000] focus:shadow-none transition-shadow"
            />
          </div>
          <input
            type="text"
            placeholder="Note  (optional)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="sm:w-48 px-3 py-2.5 border-4 border-black font-bold text-sm bg-white focus:outline-none focus:border-heirlock-green shadow-[3px_3px_0_0_#000] focus:shadow-none transition-shadow"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2.5 bg-black text-white font-black uppercase text-sm border-4 border-black shadow-[3px_3px_0_0_#BAFFC9] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#BAFFC9] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
        {feedback && (
          <p className={`mt-3 text-sm font-bold ${feedback.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
            {feedback.msg}
          </p>
        )}
      </form>

      {/* Search */}
      <div className="p-4 border-b-4 border-black">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border-4 border-black font-bold text-sm bg-white focus:outline-none focus:border-heirlock-blue"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black text-white uppercase text-xs tracking-wider font-black">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Note</th>
              <th className="px-5 py-3">Added</th>
              <th className="px-5 py-3 w-16" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center font-bold text-black/50">Loading...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center font-bold text-black/50">No emails on the allowlist yet.</td></tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b-2 border-black/10 hover:bg-heirlock-green/10 transition-colors">
                  <td className="px-5 py-3 font-bold">{entry.email}</td>
                  <td className="px-5 py-3 text-black/60">{entry.note ?? '—'}</td>
                  <td className="px-5 py-3 text-black/60 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleRemove(entry.email)}
                      disabled={removing === entry.email}
                      className="p-1.5 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-red-600 transition-all disabled:opacity-50"
                      title="Revoke access"
                    >
                      {removing === entry.email ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t-4 border-black bg-cream">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-1.5 border-3 border-black font-black text-sm bg-white disabled:opacity-40 shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            Prev
          </button>
          <span className="font-bold text-sm text-black/60">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-1.5 border-3 border-black font-black text-sm bg-white disabled:opacity-40 shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
