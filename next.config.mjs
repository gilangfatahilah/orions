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
  fallbacks: {
    document: '/offline'
  },
  buildExcludes: [/app-build-manifest\.json$/],
});

const config = withPWA({
	...nextConfig,
});

export default config;
