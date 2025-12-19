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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-heirlock-yellow border-4 border-black">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl font-black text-heirlock-yellow mb-2">TALA</h1>
          <p className="text-lg text-white font-bold">Secure Authentication</p>
          <p className="text-sm text-gray-400">Sign in to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-heirlock-pink border-4 border-black shadow-brutal flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-black">{error}</p>
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || walletLoading}
            className="w-full px-6 py-4 bg-heirlock-green border-4 border-black text-black font-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
            {!loading && <ChevronRight className="w-5 h-5 ml-auto" />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-700 h-1"></div>
            <span className="text-xs font-black text-white uppercase">OR</span>
            <div className="flex-1 bg-gray-700 h-1"></div>
          </div>

          {/* Wallet Login */}
          <div className="space-y-2">
            <div className="p-4 bg-heirlock-blue border-4 border-black text-black shadow-brutal">
              <div className="text-xs font-bold text-black mb-3">🔗 CONNECT WALLET</div>
              <ConnectButtonDynamic />
            </div>

            {isConnected && address && (
              <button
                onClick={handleWalletLogin}
                disabled={walletLoading || loading}
                className="w-full px-6 py-4 bg-heirlock-yellow border-4 border-black text-black font-black flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brutal transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-5 h-5" />
                {walletLoading ? 'Signing...' : 'Sign in with Wallet'}
                {!walletLoading && <ChevronRight className="w-5 h-5 ml-auto" />}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p className="mb-2">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline font-bold text-white hover:text-heirlock-yellow">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline font-bold text-white hover:text-heirlock-yellow">
              Privacy Policy
            </Link>
          </p>
          <p className="text-xs">🔐 Your security is our priority</p>
        </div>
      </div>
    </div>
  );
}
