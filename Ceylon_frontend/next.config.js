/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'blogs.worldbank.org',
      },
      {
        protocol: 'https',
        hostname: 'pegasusels.com',
      },
      // Local backend (development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/public/uploads/**',
      },
      // Production backend – http (images uploaded from production server use http)
      {
        protocol: 'http',
        hostname: 'makersceylon.com',
        pathname: '/public/**',
      },
      {
        protocol: 'http',
        hostname: 'www.makersceylon.com',
        pathname: '/public/**',
      },
      // Production backend – https
      {
        protocol: 'https',
        hostname: 'makersceylon.com',
        pathname: '/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.makersceylon.com',
        pathname: '/public/**',
      },
      // Any other https hostname (catch-all)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow standard <img> tags to load from any source (used in admin gallery)
    unoptimized: true,
  },
};

module.exports = nextConfig;

