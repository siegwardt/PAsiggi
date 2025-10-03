import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  env: {
    PORT: process.env.PORT || '5000'
  }
};

export default nextConfig;
