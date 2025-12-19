import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | T.A.L.A.',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <div className="max-w-3xl w-full">
        {/* 404 Container */}
        <div className="bg-heirlock-yellow border-4 border-black shadow-brutal p-8 md:p-12 mb-8">
          {/* 404 Number */}
          <div className="text-center mb-8">
            <h1 className="text-7xl md:text-9xl font-black text-black mb-4 tracking-tighter">
              404
            </h1>
            <div className="h-2 w-32 bg-black mx-auto"></div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-6">
            PAGE NOT FOUND
          </h2>

          {/* Description */}
          <p className="text-lg font-bold text-black text-center mb-8 leading-relaxed">
            We couldn't find what you were looking for. The page might have been moved, deleted, or never existed.
          </p>

          {/* Illustration Placeholder */}
          <div className="bg-black border-4 border-black rounded-lg p-8 mb-8 flex items-center justify-center h-48 bg-opacity-10">
            <div className="text-center">
              <Search className="w-16 h-16 text-black mx-auto mb-4 opacity-50" />
              <p className="text-sm font-bold text-black">Nothing here...</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <button className="w-full px-6 py-4 bg-heirlock-green text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 text-base">
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </Link>

            <Link href="/how-it-works" className="flex-1">
              <button className="w-full px-6 py-4 bg-heirlock-blue text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-base">
                How It Works
              </button>
            </Link>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-heirlock-pink border-4 border-black shadow-brutal p-6">
          <h3 className="font-bold text-black text-lg mb-4">Suggested Pages:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard">
              <button className="w-full px-3 py-3 bg-black text-heirlock-pink font-bold border-2 border-black hover:bg-heirlock-pink hover:text-black transition-all text-sm">
                Dashboard
              </button>
            </Link>
            <Link href="/create-vault">
              <button className="w-full px-3 py-3 bg-black text-heirlock-green font-bold border-2 border-black hover:bg-heirlock-green hover:text-black transition-all text-sm">
                Create Vault
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full px-3 py-3 bg-black text-heirlock-yellow font-bold border-2 border-black hover:bg-heirlock-yellow hover:text-black transition-all text-sm">
                About
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full px-3 py-3 bg-black text-heirlock-blue font-bold border-2 border-black hover:bg-heirlock-blue hover:text-black transition-all text-sm">
                Contact
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
