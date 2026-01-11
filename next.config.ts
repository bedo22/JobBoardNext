import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
