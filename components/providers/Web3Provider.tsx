'use client';

import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wagmi';

// Dynamic import for RainbowKit to avoid SSR issues
const RainbowKitProvider = React.lazy(() =>
  import('@rainbow-me/rainbowkit').then(mod => ({
    default: mod.RainbowKitProvider,
  }))
);

// Create a client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </Suspense>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
