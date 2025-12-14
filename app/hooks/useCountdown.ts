'use client';

import { useState, useEffect } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isUnlocked: boolean;
}

/**
 * Hook for calculating time remaining until unlock
 * Updates every second
 */
export function useCountdown(unlockTime: number | bigint) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    isUnlocked: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const unlockTimestamp = typeof unlockTime === 'bigint' ? Number(unlockTime) : unlockTime;
      const secondsRemaining = Math.max(0, unlockTimestamp - now);

      if (secondsRemaining === 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          isUnlocked: true,
        });
        return;
      }

      const days = Math.floor(secondsRemaining / (24 * 60 * 60));
      const hours = Math.floor((secondsRemaining % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
      const seconds = secondsRemaining % 60;

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total: secondsRemaining,
        isUnlocked: false,
      });
    };

    // Calculate immediately
    calculateTime();

    // Update every second
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [unlockTime]);

  return timeRemaining;
}
