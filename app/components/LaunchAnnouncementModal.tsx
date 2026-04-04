'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock3, Rocket, ShieldCheck, X, Zap } from 'lucide-react';

export default function LaunchAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already seen this modal
    const hasSeenModal = localStorage.getItem('launchModalSeen');
    if (!hasSeenModal) {
      setIsOpen(true);
      setAnimateIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('launchModalSeen', 'true');
  };

  if (!isOpen) return null;

  const launchDate = new Date('2026-03-14');
  const today = new Date();
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10000 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" ref={modalRef}>
        <div
          className={`bg-white border-4 border-black shadow-brutal rounded-lg overflow-hidden transition-all duration-200 ease-out ${
            animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
          }`}
        >
          <div className="bg-heirlock-yellow border-b-4 border-black p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Rocket className="w-6 h-6 md:w-8 md:h-8 text-black" />
              <div>
                <p className="text-[11px] md:text-xs font-black uppercase tracking-wide text-black">Launch update</p>
                <h2 className="text-xl md:text-2xl font-black text-black">Production opens soon</h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-black/10 rounded transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Close announcement"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </button>
          </div>

          <div className="p-4 md:p-8 space-y-5 md:space-y-6">
            <div className="bg-heirlock-blue border-3 border-black p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wide text-black">
                <Calendar className="w-4 h-4" />
                March 14 2026
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-800 font-semibold">
                <Clock3 className="w-4 h-4" />
                {daysUntilLaunch} days until access opens
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-gray-900 text-base md:text-lg font-black">
                TALA brings contract enforced unlocks, device side encryption, and distributed storage in one flow.
              </p>
              <p className="text-gray-700 text-sm md:text-base font-medium">
                Set a vault, lock it to a schedule, and verify availability without surrendering custody.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-black text-xs md:text-sm uppercase tracking-widest">What to expect</h3>
              <div className="space-y-2">
                {[
                  'Device side AES 256 encryption for every vault',
                  'Smart contract unlock logic on Polygon',
                  'Redundant IPFS distribution with audit trails',
                  'Launch day support for teams and institutions',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="/launch"
                onClick={() => handleClose()}
                className="w-full px-3 md:px-4 py-3 md:py-3 bg-black text-heirlock-yellow font-black border-3 border-black rounded-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center text-sm md:text-base shadow-brutal"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                See the launch plan
              </a>
              <button
                onClick={handleClose}
                className="w-full px-3 md:px-4 py-3 md:py-3 bg-white text-black font-black border-3 border-black rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                Remind me later
              </button>
            </div>

            <p className="text-xs text-center text-gray-700 border-t-2 border-black pt-3 md:pt-4">
              Join early to verify timing, custody, and distribution before production opens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

