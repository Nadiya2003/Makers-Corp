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
    ],
  },
};

module.exports = nextConfig;
