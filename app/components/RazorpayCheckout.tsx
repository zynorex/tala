'use client';

/**
 * app/components/RazorpayCheckout.tsx
 *
 * Enterprise-grade Razorpay checkout integration.
 *
 * Provides:
 *  - `useRazorpay()` hook — open checkout programmatically
 *  - `<RazorpayButton />` — drop-in subscribe button for pricing pages
 *
 * The Razorpay checkout.js script is loaded lazily (only when the user first
 * clicks a payment button), preventing it from affecting page load performance.
 */

import React, { useCallback, useRef, useState } from 'react';
import type { PlanTier, BillingInterval } from '@/lib/payments/types';

// ─── Razorpay window type ─────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: {
    ondismiss?: () => void;
    animation?: boolean;
  };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
  on(event: string, callback: () => void): void;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ─── Script loader ────────────────────────────────────────────────────────────

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script.'));
    document.body.appendChild(script);
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CheckoutCallbacks {
  onSuccess?: (data: { planTier: PlanTier; planExpiresAt: string }) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

export type CheckoutStatus = 'idle' | 'loading' | 'open' | 'verifying' | 'success' | 'error';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRazorpay() {
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const rzpRef = useRef<RazorpayInstance | null>(null);

  const openCheckout = useCallback(
    async (
      planTier: PlanTier,
      billingInterval: BillingInterval,
      callbacks?: CheckoutCallbacks,
    ) => {
      setStatus('loading');
      setErrorMessage(null);

      try {
        // 1. Load script
        await loadRazorpayScript();

        // 2. Create order on server
        const orderRes = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planTier, billingInterval }),
        });

        if (!orderRes.ok) {
          const err = await orderRes.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? 'Failed to create payment order.');
        }

        const order = await orderRes.json() as {
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
          planTier: PlanTier;
          billingInterval: BillingInterval;
        };

        // 3. Open Razorpay modal
        const options: RazorpayOptions = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'T.A.L.A.',
          description: `${planTier.charAt(0) + planTier.slice(1).toLowerCase()} Plan — ${billingInterval === 'YEARLY' ? 'Annual' : 'Monthly'} subscription`,
          image: '/logo.png',
          order_id: order.orderId,
          theme: { color: '#B7FFB7' },
          handler: async (response: RazorpaySuccessResponse) => {
            // 4. Verify payment on server
            setStatus('verifying');
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              if (!verifyRes.ok) {
                const err = await verifyRes.json().catch(() => ({}));
                throw new Error((err as { error?: string }).error ?? 'Payment verification failed.');
              }

              const verified = await verifyRes.json() as {
                success: boolean;
                planTier: PlanTier;
                planExpiresAt: string;
              };

              setStatus('success');
              callbacks?.onSuccess?.({
                planTier: verified.planTier,
                planExpiresAt: verified.planExpiresAt,
              });
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Payment verification failed.';
              setStatus('error');
              setErrorMessage(msg);
              callbacks?.onError?.(msg);
            }
          },
          modal: {
            ondismiss: () => {
              setStatus('idle');
              callbacks?.onDismiss?.();
            },
            animation: true,
          },
        };

        const rzp = new window.Razorpay(options);
        rzpRef.current = rzp;
        setStatus('open');
        rzp.open();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unexpected error.';
        setStatus('error');
        setErrorMessage(msg);
        callbacks?.onError?.(msg);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return { openCheckout, status, errorMessage, reset };
}

// ─── Button component ─────────────────────────────────────────────────────────

interface RazorpayButtonProps {
  planTier: PlanTier;
  billingInterval: BillingInterval;
  label?: string;
  className?: string;
  onSuccess?: CheckoutCallbacks['onSuccess'];
  onError?: CheckoutCallbacks['onError'];
}

export function RazorpayButton({
  planTier,
  billingInterval,
  label = 'Subscribe Now',
  className = '',
  onSuccess,
  onError,
}: RazorpayButtonProps) {
  const { openCheckout, status, errorMessage } = useRazorpay();

  const isLoading = status === 'loading' || status === 'verifying' || status === 'open';
  const isSuccess = status === 'success';

  const handleClick = () => {
    void openCheckout(planTier, billingInterval, { onSuccess, onError });
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={isLoading || isSuccess}
        className={`w-full px-4 py-3 border-2 border-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
          isSuccess
            ? 'bg-green-400 text-black cursor-default'
            : isLoading
            ? 'bg-gray-200 text-gray-600 cursor-wait'
            : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
        } ${className}`}
      >
        {isSuccess ? (
          <>
            <CheckIcon />
            Plan Activated!
          </>
        ) : isLoading ? (
          <>
            <SpinnerIcon />
            {status === 'verifying' ? 'Verifying…' : 'Loading…'}
          </>
        ) : (
          label
        )}
      </button>

      {status === 'error' && errorMessage && (
        <p className="mt-2 text-xs text-red-600 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}

// ─── Micro icons ──────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
