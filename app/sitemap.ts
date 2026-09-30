import type { MetadataRoute } from "next";

/**
 * SRS 2.5 (SEO): only the guest-facing static routes. Detail pages are
 * numerous and change with TMDB's catalog, so they're left to normal
 * crawling via internal links rather than enumerated here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/browse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/register`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
