import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    additionalProcessExts: [],
  },
};

export default nextConfig;
