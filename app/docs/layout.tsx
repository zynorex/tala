'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Code, Shield, Server } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Hide footer on docs pages
  useEffect(() => {
    document.body.setAttribute('data-page', 'docs');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  const navLinks = [
    { href: '/docs', label: 'Overview', icon: Book },
    { href: '/docs/architecture', label: 'Architecture', icon: Server },
    { href: '/docs/smart-contract', label: 'Smart Contract', icon: Code },
    { href: '/docs/security', label: 'Security Model', icon: Shield },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r-4 border-black overflow-y-auto pt-20">
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="mb-8 pb-6 border-b-4 border-black">
            <h2 className="font-black text-xl text-black font-mono">
              DOCS_NAV
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg border-2 font-bold transition-all duration-200
                    ${
                      active
                        ? 'bg-black text-white border-black shadow-brutal'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Version Badge */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-2 border-black bg-white px-3 py-2 text-center rounded">
              <span className="text-xs font-black font-mono">v1.0.4</span>
              <div className="text-xs font-bold text-orange-600">[BETA]</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full pt-20">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
