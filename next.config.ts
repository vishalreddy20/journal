import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Allow server-only packages in API routes
  serverExternalPackages: ['@anthropic-ai/sdk'],
};

export default nextConfig;
