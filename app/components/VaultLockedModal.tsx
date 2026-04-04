'use client';

import { Lock, Clock, Shield, X, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VaultLockedModalProps {
  isOpen: boolean;
  unlockTime: string | null;
  vaultName?: string;
  onClose: () => void;
}

/**
 * Vault Locked Modal
 * Professional, enterprise-grade popup shown immediately when a user
 * attempts to download from a time-locked vault.
 */
export function VaultLockedModal({ isOpen, unlockTime, vaultName, onClose }: VaultLockedModalProps) {
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Live countdown
  useEffect(() => {
    if (!isOpen || !unlockTime) return;

    const update = () => {
      const now = Date.now();
      const target = new Date(unlockTime).getTime();
      const remaining = Math.max(0, target - now);

      setCountdown({
        days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((remaining % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isOpen, unlockTime]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedUnlockTime = unlockTime
    ? new Date(unlockTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : 'the scheduled date';

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="border-4 border-black bg-white max-w-md w-full shadow-brutal relative overflow-hidden"
        style={{ boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      >
        {/* Accent Bar */}
        <div className="h-2 bg-heirlock-pink w-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-heirlock-pink/30 border-4 border-black flex items-center justify-center">
                <Lock className="w-10 h-10 text-black" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-heirlock-yellow border-3 border-black flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-center text-black mb-2">
            Access Restricted
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 text-sm mb-6 leading-relaxed">
            {vaultName ? (
              <>
                <span className="font-bold text-black">&ldquo;{vaultName}&rdquo;</span> is currently time-locked.
              </>
            ) : (
              'This vault is currently time-locked.'
            )}
            {' '}Files cannot be accessed until the scheduled unlock date.
          </p>

          {/* Countdown */}
          {countdown && unlockTime && (
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 text-center mb-3">
                Time Remaining
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hours' },
                  { value: countdown.minutes, label: 'Min' },
                  { value: countdown.seconds, label: 'Sec' },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="border-3 border-black bg-gray-50 p-3 text-center"
                  >
                    <p className="text-2xl font-black text-black tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlock Date Card */}
          <div className="border-3 border-black bg-heirlock-yellow/20 p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider">
                  Scheduled Unlock
                </p>
                <p className="font-black text-black text-sm">{formattedUnlockTime}</p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-gray-50 border-2 border-gray-200 p-3 mb-6">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-heirlock-green" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Time-lock protection ensures your files remain secure and tamper-proof until the designated release date. This is enforced by the smart contract on-chain.
              </p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={onClose}
            className="w-full border-4 border-black bg-black text-white p-3 font-black text-sm hover:bg-gray-800 transition-all active:translate-y-0.5"
          >
            Understood
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            You&apos;ll be able to download files once the vault unlocks automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
