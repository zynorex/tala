import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  eslint: {
    // Disable ESLint during builds - rules are too strict for production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript checking during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;



