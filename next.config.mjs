import nextPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
};

const withPWA = nextPwa({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
});

const config = withPWA({
	...nextConfig,
});

export default config;