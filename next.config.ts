import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allows us to load images from out supabase bucket
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qieslzondvbkbokewujq.supabase.co",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
