'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AdminButtonNav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('admin_auth_token');
    setIsAdmin(!!token);
  }, []);

  if (!mounted) return null;

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin/ADMIN/dashboard"
      className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900 border-2 border-amber-600 text-amber-300 font-bold text-xs hover:bg-amber-800 transition-colors"
    >
      <Shield className="w-4 h-4" />
      OWNER
    </Link>
  );
}

