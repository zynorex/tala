'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount, useSignMessage } from 'wagmi';
import Link from 'next/link';
import { Lock, Wallet, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Suspense, useEffect } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const loginEnabled = process.env.NEXT_PUBLIC_LOGIN_ENABLED !== 'false';
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  // Check if we just completed Google login
  useEffect(() => {
    const completeGoogleLogin = async () => {
      const sessionReady = searchParams.get('sessionReady');
      if (sessionReady === 'true') {
        try {
          console.log('Session ready detected, generating token...');
          // Generate JWT token from session
          const tokenResponse = await fetch('/api/auth/generate-token', {
            method: 'POST',
          });

          console.log('Token response status:', tokenResponse.status);
          
          if (tokenResponse.ok) {
            const data = await tokenResponse.json();
            console.log('Token generated, storing in localStorage');
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Redirecting to dashboard');
            router.push('/dashboard');
          } else {
            console.error('Failed to generate token, status:', tokenResponse.status);
            const error = await tokenResponse.text();
            console.error('Error:', error);
            setError('Failed to generate authentication token. Please try again.');
          }
        } catch (err) {
          console.error('Failed to generate token:', err);
          setError('An error occurred during authentication. Please try again.');
        }
      }
    };
    completeGoogleLogin();
  }, [searchParams, router]);

  // Google Login — OAuth requires a full browser redirect to Google's consent screen.
  // After authentication, NextAuth redirects back to callbackUrl with a session cookie.
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // redirect: true (default) navigates the browser to Google.
      // After consent, NextAuth redirects to /auth/login?sessionReady=true
      await signIn('google', {
        callbackUrl: '/auth/login?sessionReady=true',
      });
      // The browser leaves this page — no code runs after this.
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
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

  if (!loginEnabled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-2xl border-4 border-black bg-heirlock-yellow p-8 md:p-10 shadow-brutal text-black rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center border-4 border-black bg-white">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-black">Login opens soon</h1>
              <p className="text-sm md:text-base text-black">We are finalizing access for the next release. Your credentials stay safe with us.</p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-6 rounded-lg mb-4">
            <p className="text-sm md:text-base text-black font-bold mb-2">What to expect</p>
            <ul className="text-sm md:text-base text-black space-y-2 list-disc list-inside">
              <li>Existing accounts stay intact; no action needed.</li>
              <li>We will notify you before opening sign in.</li>
              <li>Support is available for onboarding questions.</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-black text-white font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity">Return home</Link>
            <a href="mailto:support@usetala.in" className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-heirlock-blue text-black font-bold border-4 border-black rounded-lg hover:opacity-90 transition-opacity">Contact support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
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
              <ConnectButton />
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}


