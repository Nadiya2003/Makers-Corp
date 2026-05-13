/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Production backend – any hostname (catch-all)
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

