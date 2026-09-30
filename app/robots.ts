import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Protected/account screens have nothing useful to index.
        disallow: ["/profiles", "/my-list"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
