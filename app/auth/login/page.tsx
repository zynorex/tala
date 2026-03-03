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
      <div className="min-h-screen bg-heirlock-yellow flex items-center justify-center p-6 md:p-12 font-sans selection:bg-black selection:text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-heirlock-pink border-4 border-black rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-heirlock-blue border-4 border-black rounded-full mix-blend-multiply blur-xl opacity-70"></div>
        
        <div className="w-full max-w-3xl border-8 border-black bg-white p-8 md:p-12 shadow-brutal text-black relative z-10">
          
          <div className="absolute -top-6 -right-6 lg:-right-8 bg-heirlock-red text-black border-4 border-black px-6 py-2 font-black uppercase text-xl md:text-2xl transform rotate-3 shadow-brutal">
            SYSTEM LOCKED
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 mt-6 md:mt-2">
            <div className="w-24 h-24 shrink-0 flex items-center justify-center border-8 border-black bg-black text-white shadow-brutal hover:bg-heirlock-yellow hover:text-black transition-colors rotate-[-5deg]">
              <Lock className="w-12 h-12" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 leading-none">Access<br/>Suspended</h1>
              <p className="text-xl font-bold border-l-8 border-black pl-4 mt-4 bg-cream p-2 italic">Protocol upgrades in progress.</p>
            </div>
          </div>

          <div className="bg-cream border-4 border-black p-8 mb-10 shadow-brutal">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-black" strokeWidth={3} />
              Directive Status
            </h2>
            <ul className="text-lg md:text-xl font-bold space-y-4 list-none">
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 shrink-0 bg-heirlock-green border-2 border-black mt-1 shadow-[2px_2px_0_0_#000]"></span>
                Existing vaults remain fully encrypted and secure.
              </li>
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 shrink-0 bg-heirlock-blue border-2 border-black mt-1 shadow-[2px_2px_0_0_#000]"></span>
                No action is required from current keyholders.
              </li>
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 shrink-0 bg-heirlock-pink border-2 border-black mt-1 shadow-[2px_2px_0_0_#000]"></span>
                Public access channels will reopen shortly.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/" className="flex-1 inline-flex items-center justify-center px-6 py-5 bg-black text-white font-black text-xl border-4 border-black shadow-brutal hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#FFB3BA] hover:text-heirlock-pink transition-all uppercase tracking-wider">
              Abort to Home
            </Link>
            <a href="mailto:support@usetala.in" className="flex-1 inline-flex items-center justify-center px-6 py-5 bg-heirlock-blue text-black font-black text-xl border-4 border-black shadow-brutal hover:-translate-y-1 hover:bg-black hover:text-heirlock-blue transition-all uppercase tracking-wider">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream font-sans selection:bg-black selection:text-heirlock-green">
      {/* Left Panel - Branding */}
      <div className="w-full md:w-5/12 bg-black text-white p-8 md:p-16 border-b-8 md:border-b-0 md:border-r-8 border-black flex flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-heirlock-pink rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-heirlock-blue rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 mt-12 md:mt-0">
          <Link href="/" className="inline-block group">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-heirlock-yellow border-4 border-black shadow-brutal mb-10 group-hover:-translate-y-2 group-hover:scale-105 transition-all rotate-[-3deg]">
              <Lock className="w-12 h-12 text-black" strokeWidth={3} />
            </div>
          </Link>
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-none">
            Tala<br />
            <span className="text-heirlock-green mix-blend-screen bg-black px-2">Vault</span>
          </h1>
          <div className="border-l-8 border-heirlock-yellow pl-6 py-2">
            <p className="text-xl md:text-2xl font-bold max-w-sm leading-tight text-gray-200">
              Zero compromises.<br/>Absolute encryption.<br/>Total sovereignty.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-16 md:mt-0 font-bold flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-dark p-4 border-2 border-gray-800 w-fit">
            <div className="w-4 h-4 bg-heirlock-green border-2 border-black rounded-none shadow-[2px_2px_0_0_#FFFACD] animate-pulse"></div>
            <span className="uppercase tracking-widest text-sm text-white">System Operational</span>
          </div>
          <p className="text-xs text-gray-500 max-w-xs uppercase tracking-wider font-medium">
            Strict authorization logging enabled. Intruders will be permanently blacklisted.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Area */}
      <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] relative">
        
        {/* Back to Home Button */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
          <Link href="/" className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all Group">
            <span className="text-xl leading-none -mt-1">&larr;</span> HOME
          </Link>
        </div>

        <div className="w-full max-w-md relative z-10 flex flex-col gap-8">
          
          <div>
            <div className="mb-6 inline-block transform -rotate-2">
              <span className="bg-black text-white px-4 py-2 font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0_0_#BAE1FF]">
                Authentication Gateway
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-4 tracking-tighter text-black">
              Sign In
            </h2>
            <p className="text-xl font-bold text-black/70 border-b-4 border-black pb-6">
              Establish identity to access vault records.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-5 bg-heirlock-red border-4 border-black shadow-brutal flex items-start gap-4 transform rotate-1">
              <AlertCircle className="w-8 h-8 text-black shrink-0" strokeWidth={3} />
              <div>
                <p className="font-black text-black uppercase text-lg leading-tight">Access Denied</p>
                <p className="text-base font-bold text-black/90 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Google Login */}
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={loading || walletLoading}
                className="w-full px-6 py-6 bg-heirlock-pink border-4 border-black text-black font-black text-xl flex items-center justify-between shadow-brutal hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0_0_#000] focus:translate-y-0 focus:translate-x-0 focus:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-4">
                  <Mail className="w-8 h-8 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  {loading ? 'INITIATING...' : 'CONTINUE WITH GOOGLE'}
                </div>
                {!loading && <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t-4 border-black"></div>
              <span className="flex-shrink-0 mx-6 text-black font-black text-2xl select-none">OR</span>
              <div className="flex-grow border-t-4 border-black"></div>
            </div>

            {/* Wallet Login */}
            <div className="p-6 md:p-8 bg-heirlock-blue border-4 border-black text-black shadow-brutal relative">
              {/* Badge */}
              <div className="absolute -top-5 -right-5 bg-heirlock-yellow border-4 border-black px-4 py-2 font-black text-lg transform rotate-6 shadow-brutal z-10">
                WEB3
              </div>

              <h3 className="font-black uppercase text-3xl mb-3 flex items-center gap-3">
                <Wallet className="w-8 h-8" strokeWidth={2.5} /> Wallet Entry
              </h3>
              <p className="font-bold text-base mb-8 text-black/80">
                Cryptographically prove identity without gas fees.
              </p>
              
              <div className={`transition-all ${isConnected && address ? 'mb-6' : ''}`}>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                type="button"
                                className="px-6 py-4 bg-white border-4 border-black text-black font-black text-xl flex items-center shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all w-full md:w-auto"
                              >
                                CONNECT WALLET
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                type="button"
                                className="px-6 py-4 bg-red-500 border-4 border-black text-white font-black text-xl flex items-center shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap"
                              >
                                WRONG NETWORK
                              </button>
                            );
                          }

                          return (
                            <div className="flex flex-col sm:flex-row gap-4">
                              <button
                                onClick={openChainModal}
                                style={{ display: 'flex', alignItems: 'center' }}
                                type="button"
                                className="px-4 py-3 bg-white border-4 border-black text-black font-black flex items-center gap-2 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 24,
                                      height: 24,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 24, height: 24 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button
                                onClick={openAccountModal}
                                type="button"
                                className="px-5 py-3 bg-white border-4 border-black text-black font-black flex items-center shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
                              >
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>

              {isConnected && address && (
                <button
                  onClick={handleWalletLogin}
                  disabled={walletLoading || loading}
                  className="w-full mt-4 px-6 py-5 bg-white border-4 border-black text-black font-black text-xl flex items-center justify-between shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="uppercase">{walletLoading ? 'Awaiting Signature...' : 'Sign Verification Payload'}</span>
                  {!walletLoading && <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />}
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t-8 border-black font-bold text-black/70">
            <p className="mb-4 text-sm md:text-base leading-relaxed">
              By authenticating, you implicitly bind yourself to our{' '}
              <Link href="/terms" className="text-black bg-heirlock-yellow px-1 py-0.5 border-2 border-transparent hover:border-black transition-all">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-black bg-heirlock-pink px-1 py-0.5 border-2 border-transparent hover:border-black transition-all">Privacy Policy</Link>.
            </p>
            <p className="text-sm uppercase tracking-widest text-black">Tala Vault © {new Date().getFullYear()}</p>
          </div>
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


