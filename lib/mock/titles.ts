import type { Title } from "@/lib/tmdb/mappers";

/**
 * Placeholder catalog used until real TMDB credentials are configured
 * (see .env.example). Shape matches lib/tmdb/mappers.Title exactly, so
 * swapping these calls for lib/tmdb/queries.ts later is a one-line change
 * per row — no component needs to change.
 */

const POSTERS = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
];

const BACKDROP =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=85";

const NAMES = [
  "The Last Horizon",
  "Midnight Stories",
  "Neon City",
  "After Rain",
  "Parallel",
  "Wild Road",
  "The Journey",
  "Echoes",
  "Final Act",
  "Moonlight",
];

function buildRow(seed: number, mediaTypeCycle: Title["mediaType"][]): Title[] {
  return NAMES.map((title, i) => ({
    id: seed * 100 + i,
    mediaType: mediaTypeCycle[i % mediaTypeCycle.length],
    title,
    overview:
      "Ketika sebuah perjalanan sederhana berubah menjadi misi besar, sekelompok karakter harus menghadapi pilihan yang mengubah masa depan mereka.",
    posterUrl: POSTERS[(i + seed) % POSTERS.length],
    posterPath: null,
    backdropUrl: BACKDROP,
    year: String(2024 + (i % 3)),
    rating: Math.round((7.5 + ((i + seed) % 5) / 10) * 10) / 10,
  }));
}

export function getMockTrending(): Title[] {
  return buildRow(0, ["movie", "tv"]);
}

export function getMockPopular(): Title[] {
  return buildRow(2, ["movie"]);
}

export function getMockTopRated(): Title[] {
  return buildRow(4, ["movie", "tv"]);
}

export function getMockPopularSeries(): Title[] {
  return buildRow(6, ["tv"]);
}

export function getMockHero(): Title {
  return getMockTrending()[0];
}
