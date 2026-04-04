'use client';

import { LogOut, Shield } from 'lucide-react';

interface AdminDashboardHeaderProps {
  adminName?: string;
  onLogout: () => void;
}

export default function AdminDashboardHeader({
  adminName = 'Owner',
  onLogout,
}: AdminDashboardHeaderProps) {
  return (
    <header className="bg-slate-800/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 border border-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">TALA ADMIN</h1>
            <p className="text-xs text-slate-400">Owner Portal</p>
          </div>
        </div>

        {/* Right - User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-bold text-white">{adminName}</span>
              <span className="px-2 py-1 bg-amber-900/50 border border-amber-600/50 text-amber-300 text-xs font-bold rounded">
                OWNER
              </span>
            </div>
            <p className="text-xs text-slate-400">Admin Access Active</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

