'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Container */}
        <div className="bg-heirlock-pink border-4 border-black shadow-brutal p-8 md:p-12 rounded-xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-black border-4 border-heirlock-pink rounded-lg">
              <AlertTriangle className="w-12 h-12 text-heirlock-pink" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-4xl md:text-5xl font-black text-black text-center mb-4">
            OOPS!
          </h1>

          {/* Error Status */}
          <div className="bg-black text-heirlock-pink p-4 border-4 border-heirlock-pink mb-6 text-center">
            <p className="font-bold text-lg">ERROR_OCCURRED</p>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <p className="text-lg font-bold text-black mb-4">
              Something went wrong!
            </p>
            <div className="bg-black bg-opacity-10 border-2 border-dashed border-black p-4 rounded-lg">
              <p className="text-sm font-mono text-white break-words">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-700 mt-2 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>

          {/* Error Description */}
          <p className="text-base font-bold text-black mb-8 leading-relaxed">
            The application encountered an error while processing your request. 
            Our team has been notified. Please try again or return to the home page.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => reset()}
              className="flex-1 px-6 py-4 bg-heirlock-yellow text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 text-base"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>

            <Link href="/" className="flex-1">
              <button className="w-full px-6 py-4 bg-heirlock-green text-black font-bold border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 text-base">
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </Link>
          </div>

          {/* Error Code Display */}
          <div className="mt-8 pt-8 border-t-4 border-black">
            <p className="text-xs font-mono text-heirlock-pink text-center bg-black bg-opacity-5 p-3 rounded border-2 border-dashed border-black">
              ERROR_BOUNDARY | {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-heirlock-blue border-4 border-black shadow-brutal p-6">
          <h3 className="font-bold text-black mb-2">Need Help?</h3>
          <p className="text-sm text-black mb-4">
            If this problem persists, please contact our support team.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact">
              <button className="px-4 py-2 bg-black text-heirlock-blue font-bold border-2 border-black hover:bg-heirlock-blue hover:text-heirlock-green transition-all">
                Contact Support
              </button>
            </Link>
            <Link href="/docs">
              <button className="px-4 py-2 bg-black text-heirlock-green font-bold border-2 border-black hover:bg-heirlock-green hover:text-heirlock-blue transition-all">
                View Docs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

