import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | T.A.L.A.',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="h-screen bg-cream overflow-hidden flex flex-col">
      {/* Image Section - Responsive Size */}
      <div className="shrink-0 h-36 sm:h-40 md:h-48 flex items-center justify-center px-2">
        <Image
          src="/404.png"
          alt="404 - Page Not Found"
          width={1200}
          height={600}
          className="object-contain h-full w-auto"
          priority
        />
      </div>

      {/* Content Section - Scrollable if needed but fits in one frame */}
      <div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header - Compact */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-black font-mono leading-none">
                404
              </h1>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black leading-tight">
              Lost in the Vault
            </h2>
            <p className="text-sm sm:text-base text-gray-800 font-medium">
              The page you're looking for doesn't exist or has been removed.
            </p>
          </div>

          {/* Divider - Thin */}
          <div className="border-t-3 border-black my-4"></div>

          {/* Compact Suggestions - 2 or 3 columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <Link href="/">
              <div className="border-3 border-black p-4 bg-heirlock-yellow shadow-brutal text-center cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200">
                <div className="text-2xl font-black text-black mb-1">01</div>
                <h3 className="font-black text-black text-xs sm:text-sm uppercase">Home</h3>
              </div>
            </Link>

            <Link href="/docs">
              <div className="border-3 border-black p-4 bg-heirlock-pink shadow-brutal text-center cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200">
                <div className="text-2xl font-black text-black mb-1">02</div>
                <h3 className="font-black text-black text-xs sm:text-sm uppercase">Docs</h3>
              </div>
            </Link>

            <Link href="mailto:support@tala.protocol">
              <div className="border-3 border-black p-4 bg-heirlock-blue shadow-brutal text-center cursor-pointer hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200 hidden md:block">
                <div className="text-2xl font-black text-black mb-1">03</div>
                <h3 className="font-black text-black text-xs sm:text-sm uppercase">Support</h3>
              </div>
            </Link>
          </div>

          {/* CTA Buttons - Compact */}
          <div className="flex gap-2 sm:gap-3">
            <Link href="/" className="flex-1">
              <button className="w-full px-4 py-3 sm:py-4 bg-black text-heirlock-yellow font-black border-3 border-black shadow-brutal text-xs sm:text-sm hover:translate-y-[-2px] transition-all duration-200">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </Link>
            <Link href="/docs" className="flex-1">
              <button className="w-full px-4 py-3 sm:py-4 bg-white text-black font-black border-3 border-black shadow-brutal text-xs sm:text-sm hover:translate-y-[-2px] transition-all duration-200">
                <span className="hidden sm:inline">Docs</span>
                <span className="sm:hidden">View</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
