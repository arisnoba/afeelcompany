import type { NextConfig } from "next";

const projectRoot = process.cwd();

const legacyPermanentRedirects = [
  {
    source: '/shopinfo',
    destination: '/about',
    permanent: true,
  },
  {
    source: '/shopinfo/:path*',
    destination: '/about',
    permanent: true,
  },
  {
    source: '/board',
    destination: '/portfolio',
    permanent: true,
  },
  {
    source: '/board/:path*',
    destination: '/portfolio',
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',   // Facebook CDN fallback used by Meta
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return legacyPermanentRedirects;
  },
};

export default nextConfig;
