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
    <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-heirlock-pink border-b-4 border-black shadow-brutal">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-black text-black mb-1">
                ⚠️ Mobile Experience Limited
              </p>
              <p className="text-xs font-bold text-gray-900">
                This platform is optimized for desktop/tablet. For the best experience and full features, please use a larger device.
              </p>
            </div>
          </div>
          <button
            onClick={dismissWarning}
            className="flex-shrink-0 p-1.5 hover:bg-black hover:bg-opacity-10 transition-all rounded"
            title="Dismiss"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
