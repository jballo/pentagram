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
        },
        {
          protocol: 'https',
          hostname: 'ogzcfno7x9sosrqw.public.blob.vercel-storage.com',
          port: '',
          pathname: '/*'
        }
      ],
  }
};

export default nextConfig;
