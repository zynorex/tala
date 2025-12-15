import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminSession {
  token: string;
  name: string;
  adminId: string;
}

export function useAdminAuth() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_auth_token');
    const name = localStorage.getItem('admin_name');

    if (token && name) {
      setSession({
        token,
        name,
        adminId: name, // Could be separate if needed
      });
    } else {
      // Redirect to login if not authenticated
      router.push('/admin/ADMIN');
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_name');
    setSession(null);
    router.push('/admin/ADMIN');
  };

  return { session, loading, logout, isAuthenticated: !!session };
}
