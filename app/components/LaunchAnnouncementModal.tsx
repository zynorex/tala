'use client';

import { useState, useEffect } from 'react';
import { X, Rocket, Calendar, Zap } from 'lucide-react';

export default function LaunchAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen this modal
    const hasSeenModal = localStorage.getItem('launchModalSeen');
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('launchModalSeen', 'true');
  };

  if (!isOpen) return null;

  const launchDate = new Date('2026-03-14');
  const today = new Date();
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-[10000] w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-4 border-black shadow-brutal rounded-lg overflow-hidden">
          {/* Header with Close Button */}
          <div className="bg-heirlock-yellow border-b-4 border-black p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Rocket className="w-6 h-6 md:w-8 md:h-8 text-black animate-bounce flex-shrink-0" />
              <h2 className="text-xl md:text-2xl font-black text-black">Coming Soon!</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8 space-y-4 md:space-y-6">
            {/* Main Message */}
            <div className="text-center space-y-2 md:space-y-3">
              <p className="text-gray-800 text-base md:text-lg font-bold">
                T.A.L.A. is launching very soon!
              </p>
              <p className="text-gray-700 text-xs md:text-sm">
                Get ready to revolutionize vault security with military-grade encryption and blockchain verification.
              </p>
            </div>

            {/* Launch Date */}
            <div className="bg-heirlock-blue border-3 border-black p-3 md:p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0" />
                <span className="font-black text-black text-sm md:text-base">Launch Date</span>
              </div>
              <p className="text-center text-xl md:text-2xl font-black text-black">
                March 14, 2026
              </p>
              <p className="text-center text-xs md:text-sm text-gray-700 mt-2 font-bold">
                {daysUntilLaunch} days to go
              </p>
            </div>

            {/* Features Preview */}
            <div className="space-y-2 md:space-y-3">
              <h3 className="font-black text-black text-xs md:text-sm uppercase tracking-widest">
                What's Coming
              </h3>
              <div className="space-y-1 md:space-y-2">
                {[
                  'Military-grade AES-256 encryption',
                  'Blockchain-verified security',
                  'Decentralized IPFS storage',
                  'Zero-knowledge architecture',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <span className="text-black font-black">→</span>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-2 md:space-y-3">
              <a
                href="/#pricing"
                onClick={() => handleClose()}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-center text-sm md:text-base"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                View Pricing Plans
              </a>
              <button
                onClick={handleClose}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white text-black font-bold border-3 border-black rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                I'll Wait
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-center text-gray-600 border-t-2 border-black pt-3 md:pt-4">
              🚀 Be among the first to experience next-generation vault security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
