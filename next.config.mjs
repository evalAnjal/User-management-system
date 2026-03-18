/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        pathname: '/**'
      }
    ]
  },
  /* config options here */
};

export default nextConfig;
