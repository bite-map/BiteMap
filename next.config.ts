import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allows us to load images from out supabase bucket
  images: {
    domains: ["maps.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",

        hostname: "qieslzondvbkbokewujq.supabase.co",
      },
    ],
  },
  reactStrictMode: false,
  // allows uploading of larger images
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
