import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // unoptimized: TMDB already serves pre-sized images (SDD 3.5), and
    // Unsplash below is a temporary placeholder catalog (lib/mock/titles.ts)
    // used until TMDB_READ_TOKEN is configured.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
