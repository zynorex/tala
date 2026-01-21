'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    localStorage.setItem('analytics_cookies', 'true');
    localStorage.setItem('preference_cookies', 'true');
    setConfirmMessage('✓ All cookies accepted. Thank you!');
    setIsConfirming(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsConfirming(false);
    }, 2000);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie_consent', 'essential');
    localStorage.setItem('analytics_cookies', 'false');
    localStorage.setItem('preference_cookies', 'false');
    setConfirmMessage('✓ Essential cookies only. Got it!');
    setIsConfirming(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsConfirming(false);
    }, 2000);
  };

  const handleClose = () => {
    // If closed without accepting, set to essential only (GDPR compliant)
    localStorage.setItem('cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Banner */}
      <div className="relative bg-white border-4 border-black shadow-brutal m-4 md:m-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors"
          aria-label="Close cookie consent"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirming ? (
          <div className="p-6 md:p-8">
            <div className="pr-10">
              <h2 className="font-black text-xl md:text-2xl text-black mb-3">
                🍪 Cookie Policy
              </h2>
              <p className="text-gray-800 font-medium mb-4">
                We use cookies to enhance your experience, remember your preferences, and understand how you use TALA. 
              </p>
              <p className="text-sm text-gray-700 font-medium mb-6">
                <strong>Essential cookies</strong> are required for the site to function. <strong>Analytics & preference cookies</strong> help us improve.{' '}
                <Link href="/cookies" className="text-blue-600 font-black underline hover:gap-1">
                  Learn more
                </Link>
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptEssential}
                  className="px-6 py-3 border-4 border-black font-black text-black bg-white hover:bg-gray-100 transition-all duration-200 active:scale-95"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 border-4 border-black font-black text-black bg-heirlock-yellow hover:bg-yellow-400 transition-all duration-200 active:scale-95"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <p className="font-black text-lg text-green-600">{confirmMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
