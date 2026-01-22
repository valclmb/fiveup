import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Le domaine de Google pour les avatars
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
