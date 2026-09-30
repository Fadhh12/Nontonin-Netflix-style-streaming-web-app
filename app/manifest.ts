import type { MetadataRoute } from "next";

/** F17: PWA — installable to the home screen, matching the app's own tokens. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nontonin",
    short_name: "Nontonin",
    description: "Jelajahi film dan series, putar trailer, dan simpan judul favoritmu.",
    start_url: "/browse",
    display: "standalone",
    background_color: "#0B0B0F",
    theme_color: "#0B0B0F",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
