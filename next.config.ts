import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'], // Ensure only these extensions are treated as pages
  experimental: {
    appDir: true, // Explicitly enable app directory
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
