import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'nextui.org',
          port: '',
          pathname: '/images/*',
        }
      ],
  }
};

export default nextConfig;
