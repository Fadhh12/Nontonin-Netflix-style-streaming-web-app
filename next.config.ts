import type { NextConfig } from "next";

// SDD 3.5: basic security headers + a CSP that allows YouTube trailer embeds
// and TMDB/Unsplash images, without needing a per-request nonce setup.
// 'unsafe-eval' is dev-only: Next/Turbopack's dev runtime uses eval() for
// HMR and stack-trace reconstruction (confirmed by a broken client-side
// interaction under Playwright until this was scoped to development only).
// Production never needs it — Next explicitly avoids eval() in prod builds.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://image.tmdb.org https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
