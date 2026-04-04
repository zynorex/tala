'use client';

import { useCallback } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, Toast } from '@/app/hooks/useToast';

/**
 * Toast Display Component
 * Shows toast notifications with proper styling and animations
 */
export function ToastDisplay() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border-4 border-black p-4 shadow-brutal animate-in slide-in-from-right flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-900'
              : toast.type === 'error'
                ? 'bg-red-100 text-red-900'
                : toast.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-900'
                  : 'bg-blue-100 text-blue-900'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {toast.type === 'info' && <Info className="w-5 h-5" />}
          </div>

          <div className="flex-1">
            <p className="font-bold text-sm">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-30 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Toast Context Provider Wrapper
 * Provides toast notifications throughout the app
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastDisplay />
    </>
  );
}

