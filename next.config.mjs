import nextPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'lh3.googleusercontent.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
};

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const config = withPWA({
	...nextConfig,
});

export default config;
