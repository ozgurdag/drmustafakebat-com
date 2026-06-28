import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  generateBuildId: async () => {
    // Return a constant build ID to prevent Next.js from rewriting the asset paths 
    // in all static HTML files during every build, saving time and FTP transfer.
    return 'drmustafakebat-build-id';
  },
};

export default nextConfig;
