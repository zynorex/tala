/**
 * Vault Unlock Status Component
 * Displays lock status, countdown timer, and unlock eligibility
 */

'use client';

import { useState, useEffect } from 'react';
import { Clock, Lock, Unlock, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface VaultUnlockStatus {
  canUnlock: boolean;
  status: 'LOCKED' | 'WAITING' | 'UNLOCKED' | 'VOIDED' | 'EXPIRED' | 'ERROR';
  unlockTime: string | null;
  timeRemaining: number;
  message: string;
  vault: {
    id: string;
    name: string;
    unlockTime: string | null;
    lockStatus: string;
    isDemo: boolean;
  };
}

interface VaultUnlockStatusProps {
  vaultId: string;
  onUnlockEligibilityChange?: (canUnlock: boolean, status: string) => void;
}

export function VaultUnlockStatusComponent({ vaultId, onUnlockEligibilityChange }: VaultUnlockStatusProps) {
  const [unlockStatus, setUnlockStatus] = useState<VaultUnlockStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Fetch unlock status
  useEffect(() => {
    const fetchUnlockStatus = async () => {
      try {
        // Get auth token (same as vault detail page)
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No auth token found for unlock status');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/vaults/${vaultId}/unlock-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Unlock status response not ok:', response.status);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setUnlockStatus(data.data);

        if (onUnlockEligibilityChange) {
          onUnlockEligibilityChange(data.data.canUnlock, data.data.status);
        }
      } catch (error) {
        console.error('Error fetching unlock status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnlockStatus();
  }, [vaultId, onUnlockEligibilityChange]);

  // Update countdown timer every second
  useEffect(() => {
    if (!unlockStatus || !unlockStatus.unlockTime) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const unlockDateTime = new Date(unlockStatus.unlockTime!).getTime();
      const timeRemaining = Math.max(0, unlockDateTime - now);

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [unlockStatus]);

  if (isLoading) {
    return (
      <div className="border-4 border-black bg-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    );
  }

  if (!unlockStatus) {
    return (
      <div className="border-4 border-black bg-red-100 p-6">
        <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
        <p className="font-black text-black">Error loading vault status</p>
      </div>
    );
  }

  const statusConfig = {
    LOCKED: {
      bgColor: 'bg-heirlock-pink',
      textColor: 'text-pink-900',
      icon: Lock,
      borderColor: 'border-pink-600',
      title: 'Vault Locked',
    },
    WAITING: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-900',
      icon: Clock,
      borderColor: 'border-yellow-600',
      title: 'Unlocking Soon',
    },
    UNLOCKED: {
      bgColor: 'bg-heirlock-green',
      textColor: 'text-green-900',
      icon: Unlock,
      borderColor: 'border-green-600',
      title: 'Vault Unlocked',
    },
    VOIDED: {
      bgColor: 'bg-gray-200',
      textColor: 'text-gray-900',
      icon: AlertCircle,
      borderColor: 'border-gray-600',
      title: 'Vault Deleted',
    },
    EXPIRED: {
      bgColor: 'bg-red-200',
      textColor: 'text-red-900',
      icon: AlertCircle,
      borderColor: 'border-red-600',
      title: 'Vault Expired',
    },
    ERROR: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-900',
      icon: AlertCircle,
      borderColor: 'border-red-600',
      title: 'Error',
    },
  };

  const config = statusConfig[unlockStatus.status as keyof typeof statusConfig];
  const IconComponent = config.icon;

  return (
    <div className={`border-4 ${config.borderColor} ${config.bgColor} p-6 shadow-brutal`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className="w-6 h-6" />
        <h3 className="text-xl font-black text-black">{config.title}</h3>
      </div>

      {/* Status Message */}
      <p className="font-medium text-black mb-4">{unlockStatus.message}</p>

      {/* Countdown Timer (if locked or waiting) */}
      {(unlockStatus.status === 'LOCKED' || unlockStatus.status === 'WAITING') && countdown && (
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">Time Until Unlock</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="border-2 border-black bg-white p-3 text-center">
              <p className="text-2xl font-black text-black">{String(countdown.days).padStart(2, '0')}</p>
              <p className="text-xs font-black text-gray-600 mt-1">Days</p>
            </div>
            <div className="border-2 border-black bg-white p-3 text-center">
              <p className="text-2xl font-black text-black">{String(countdown.hours).padStart(2, '0')}</p>
              <p className="text-xs font-black text-gray-600 mt-1">Hours</p>
            </div>
            <div className="border-2 border-black bg-white p-3 text-center">
              <p className="text-2xl font-black text-black">{String(countdown.minutes).padStart(2, '0')}</p>
              <p className="text-xs font-black text-gray-600 mt-1">Min</p>
            </div>
            <div className="border-2 border-black bg-white p-3 text-center">
              <p className="text-2xl font-black text-black">{String(countdown.seconds).padStart(2, '0')}</p>
              <p className="text-xs font-black text-gray-600 mt-1">Sec</p>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Time */}
      {unlockStatus.unlockTime && (
        <div className="text-sm font-medium text-black mb-3">
          <p className="font-black uppercase text-xs text-gray-700 mb-1">Scheduled Unlock</p>
          <p className="font-mono bg-white border-2 border-black p-2">
            {new Date(unlockStatus.unlockTime).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short',
            })}
          </p>
        </div>
      )}

      {/* Access Status Badge */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-black">
        {unlockStatus.canUnlock ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-black text-sm text-black">Access Granted - Files available</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 text-red-600" />
            <span className="font-black text-sm text-black">Access Denied - Come back later</span>
          </>
        )}
      </div>
    </div>
  );
}
