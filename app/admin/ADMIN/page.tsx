'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated
    const token = localStorage.getItem('admin_auth_token');
    if (token) {
      router.push('/admin/ADMIN/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid credentials');
        return;
      }

      // Store auth token
      localStorage.setItem('admin_auth_token', data.token);
      localStorage.setItem('admin_name', data.name);

      // Redirect to dashboard
      router.push('/admin/ADMIN/dashboard');
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Grid background */}
      <div className="fixed inset-0 grid grid-cols-4 gap-px opacity-10">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border border-white/20" />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/10 border border-white/20 rounded">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">TALA ADMIN</h1>
          <p className="text-slate-400 text-sm">Owner Access Required</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-slate-800/50 border border-white/10 backdrop-blur-sm p-8 mb-6"
        >
          {/* Admin ID Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              ADMIN ID
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter admin ID"
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-white disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-900 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-white disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !adminId || !password}
            className="w-full py-3 bg-white text-black font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-slate-500 text-xs">
            🔐 This page requires owner credentials
          </p>
        </div>
      </div>
    </div>
  );
}

