'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function MobileWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has dismissed this warning
    const isDismissed = localStorage.getItem('mobile-warning-dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismissWarning = () => {
    setIsVisible(false);
    localStorage.setItem('mobile-warning-dismissed', 'true');
  };

  if (!isMounted || !isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-80 z-40" onClick={dismissWarning} />

      {/* Modal */}
      <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-heirlock-pink to-heirlock-yellow border-4 border-black shadow-brutal w-full max-w-sm">
          {/* Header */}
          <div className="bg-black text-white p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-heirlock-yellow flex-shrink-0" />
              <h2 className="text-lg font-black">MOBILE WARNING</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            <p className="text-sm font-bold text-black mb-4">
              ⚠️ This platform is optimized for <span className="text-heirlock-pink font-black">DESKTOP & TABLET</span> devices only.
            </p>
            
            <p className="text-xs font-bold text-gray-700 mb-6 leading-relaxed">
              Mobile devices have limited screen space and reduced functionality. For the best experience and full access to all features, please use a computer or tablet with a larger screen.
            </p>

            <div className="bg-heirlock-yellow bg-opacity-20 border-2 border-heirlock-yellow p-3 rounded mb-6">
              <p className="text-xs font-black text-black">
                💡 Recommended: Desktop (1920x1080 or higher)
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={dismissWarning}
                className="flex-1 px-4 py-3 bg-black text-white font-black border-4 border-black hover:bg-heirlock-pink hover:text-black transition-all shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                Continue on Mobile
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={dismissWarning}
              className="w-full mt-2 px-4 py-2 text-xs font-black text-gray-600 hover:text-black transition-colors underline"
            >
              Close This Warning
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

