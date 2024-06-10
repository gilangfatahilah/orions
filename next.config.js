/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
};

module.exports = nextConfig;
