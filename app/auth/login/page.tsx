'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAccount, useSignMessage } from 'wagmi';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Lock, Wallet, Mail, ChevronRight, AlertCircle } from 'lucide-react';

// Dynamic import for RainbowKit to avoid SSR issues
const ConnectButtonDynamic = dynamic(
  () => import('@rainbow-me/rainbowkit').then(mod => ({ 
    default: () => <mod.ConnectButton /> 
  })),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [mounted, setMounted] = useState(typeof window !== 'undefined');

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Wallet Login
  const handleWalletLogin = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setWalletLoading(true);
    setError('');

    try {
      // Create message to sign
      const message = `Sign in to TALA\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`;

      // Sign message
      const signature = await signMessageAsync({ message });

      // Send to backend
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Wallet authentication failed');
        return;
      }

      // Store token
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to authenticate with wallet');
      console.error(err);
    } finally {
      setWalletLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Grid background */}
      <div className="fixed inset-0 grid grid-cols-8 gap-px opacity-10">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border border-black/20" />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-black border-4 border-black">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-black mb-2">TALA</h1>
          <p className="text-lg text-black font-bold">Tamper-proof Automated Locking</p>
          <p className="text-sm text-slate-600">Trust is Code</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || walletLoading}
            className="w-full px-6 py-4 bg-white border-4 border-black text-black font-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
            {!loading && <ChevronRight className="w-5 h-5 ml-auto" />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-black h-1"></div>
            <span className="text-xs font-black text-black uppercase">OR</span>
            <div className="flex-1 bg-black h-1"></div>
          </div>

          {/* Wallet Login */}
          <div className="space-y-2">
            <div className="p-4 bg-slate-900 border-4 border-black text-white">
              <div className="text-xs font-bold text-slate-400 mb-2">CONNECT WALLET</div>
              <ConnectButtonDynamic />
            </div>

            {isConnected && address && (
              <button
                onClick={handleWalletLogin}
                disabled={walletLoading || loading}
                className="w-full px-6 py-4 bg-black border-4 border-black text-white font-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-5 h-5" />
                {walletLoading ? 'Signing...' : 'Sign in with Wallet'}
                {!walletLoading && <ChevronRight className="w-5 h-5 ml-auto" />}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-600">
          <p className="mb-2">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline font-bold">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline font-bold">
              Privacy Policy
            </Link>
          </p>
          <p className="text-xs">🔐 Your security is our priority</p>
        </div>
      </div>
    </div>
  );
}
