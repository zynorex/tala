'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching React errors
 * Displays user-friendly error messages instead of white screen
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="border-4 border-black p-8 bg-red-100 shadow-brutal">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-black text-black mb-2">
                      Something Went Wrong
                    </h2>
                    <p className="text-gray-800 font-medium mb-4">
                      {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                      onClick={() => this.setState({ hasError: false, error: null })}
                      className="px-4 py-2 bg-black text-white font-black border-3 border-black shadow-brutal hover:translate-y-[-2px] transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
