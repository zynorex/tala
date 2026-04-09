import Link from 'next/link';
import { Home, Search, ArrowRight, Shield, Lock, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | T.A.L.A.',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main 404 Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Left: Large 404 Text */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-9xl md:text-[120px] font-black text-black leading-none mb-4">
                404
              </h1>
              <div className="absolute top-0 left-0 w-32 h-32 border-4 border-heirlock-pink opacity-20 pointer-events-none"></div>
            </div>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
                Lost in the Vault?
              </h2>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                Looks like this page doesn't exist in our secure vault. It might have been encrypted, moved to a different location, or never existed in the first place.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/" className="flex-1">
                <button className="w-full px-6 py-4 bg-black text-white font-black border-4 border-black shadow-brutal hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-lg group">
                  <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Return Home
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <Link href="/dashboard" className="flex-1">
                <button className="w-full px-6 py-4 bg-heirlock-yellow text-black font-black border-4 border-black shadow-brutal hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96">
              {/* Animated vault door */}
              <div className="absolute inset-0 border-4 border-black bg-heirlock-blue shadow-brutal flex items-center justify-center overflow-hidden">
                {/* Vault door styling */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-heirlock-blue to-blue-200">
                  {/* Lock icon */}
                  <div className="text-center">
                    <Lock className="w-24 h-24 text-black mx-auto mb-4 opacity-40" />
                    <p className="text-xl font-black text-black opacity-50">Empty Vault</p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-3 border-black opacity-30"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-3 border-black opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="border-4 border-black bg-white shadow-brutal p-8 mb-8">
          <h3 className="text-2xl font-black text-black mb-6">Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard">
              <div className="border-4 border-black p-6 bg-heirlock-pink hover:bg-pink-300 transition-all cursor-pointer group h-full">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                  <span className="font-black text-black text-lg">Dashboard</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Manage your vaults</p>
              </div>
            </Link>

            <Link href="/create-vault">
              <div className="border-4 border-black p-6 bg-heirlock-green hover:bg-green-300 transition-all cursor-pointer group h-full">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                  <span className="font-black text-black text-lg">Create Vault</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Start encrypting</p>
              </div>
            </Link>

            <Link href="/how-it-works">
              <div className="border-4 border-black p-6 bg-heirlock-yellow hover:bg-yellow-300 transition-all cursor-pointer group h-full">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                  <span className="font-black text-black text-lg">How It Works</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Learn more</p>
              </div>
            </Link>

            <Link href="/about">
              <div className="border-4 border-black p-6 bg-heirlock-blue hover:bg-blue-300 transition-all cursor-pointer group h-full">
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                  <span className="font-black text-black text-lg">About</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Discover T.A.L.A</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Error Details */}
        <div className="border-4 border-black bg-gray-50 p-8 text-center">
          <h4 className="font-black text-black text-lg mb-3">What Happened?</h4>
          <p className="text-gray-700 font-medium max-w-2xl mx-auto">
            The page you're looking for is either encrypted behind a different route, has been permanently archived, or never existed. Our security system is working as intended.
          </p>
        </div>
      </div>
    </div>
  );
}


