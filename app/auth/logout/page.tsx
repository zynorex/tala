'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_name');

      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Redirect to home
      router.push('/');
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-bold">Logging out...</p>
      </div>
    </div>
  );
}

