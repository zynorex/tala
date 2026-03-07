'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/login');
  const isCreateVault = pathname?.startsWith('/create-vault');
  
  // Hide Navbar/Footer for auth pages and the full-screen vault creation
  if (isAuthPage || isCreateVault) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">{children}</div>
      <Footer />
    </>
  );
}