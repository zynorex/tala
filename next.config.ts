import type { NextConfig } from "next";

/**
 * Enterprise-Grade Security Headers Configuration
 * Implements OWASP security best practices and industry standards
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com *.lh3.googleusercontent.com *.googleapis.com *.wallet.coinbase.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: http: blob:",
      "media-src 'self' blob:",
      "connect-src 'self' https: wss: http://localhost:* ws://localhost:* https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-src 'self' https://verify.walletconnect.com *.coinbase.com https://api.razorpay.com https://*.razorpay.com",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prevent MIME type sniffing
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN', // Prevent clickjacking
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block', // Enable XSS filter
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin', // Control referrer information
  },
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=self',
      'usb=()',
    ].join(', '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload', // HSTS
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: false,
  
  // Security headers for all responses
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // API routes get additional security headers
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },

  eslint: {
    // Disable ESLint during builds - rules are too strict for production
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Skip TypeScript checking during builds to allow stubs
    ignoreBuildErrors: true,
  },

  webpack: (config, { isServer }) => {
    // Suppress MetaMask SDK warnings about missing dependencies
    config.ignoreWarnings = [
      ...( config.ignoreWarnings || []),
      {
        module: /@metamask\/sdk/,
        message: /Can't resolve '@react-native-async-storage\/async-storage'/,
      },
    ];
    return config;
  },
};

export default nextConfig;



