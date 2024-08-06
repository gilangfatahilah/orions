/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({ nextConfig });
