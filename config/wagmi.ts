import { http, createConfig } from 'wagmi';
import { polygonAmoy, polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Polygon Amoy Testnet & Polygon Mainnet Configuration
export const config = createConfig({
  chains: [polygonAmoy, polygon],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
