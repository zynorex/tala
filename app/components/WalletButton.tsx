'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function WalletButton({ isScrolled = false }: { isScrolled?: boolean }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <button
      onClick={() => {
        if (isConnected) {
          disconnect();
        } else if (connectors[0]) {
          connect({ connector: connectors[0] });
        }
      }}
      className={`px-5 lg:px-7 py-2 text-sm lg:text-base font-bold border-4 shadow-brutal transition-all ${isScrolled ? 'bg-white text-black border-black hover:bg-heirlock-green hover:border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none' : 'bg-heirlock-green text-black border-black hover:bg-heirlock-pink hover:text-heirlock-green hover:translate-x-1 hover:translate-y-1 hover:shadow-none'}`}
    >
      {isConnected ? displayAddress : 'Connect Wallet'}
    </button>
  );
}
