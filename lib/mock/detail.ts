import type { MediaType } from "@/lib/tmdb/types";
import type { TitleDetail } from "@/lib/tmdb/mappers";
import { getMockPopular, getMockTrending } from "./titles";

const GENRES = ["Action", "Drama", "Adventure"];
const CAST = [
  "Amara Widjaya",
  "Reza Pratama",
  "Sena Kusuma",
  "Talia Sinaga",
  "Bima Aditya",
];

/**
 * Same placeholder-catalog contract as lib/mock/titles.ts, extended to the
 * full TitleDetail shape lib/tmdb/mappers.mapDetail() produces, so
 * app/(app)/title/[type]/[id]/page.tsx doesn't change when real TMDB
 * queries replace this.
 */
export function getMockDetail(mediaType: MediaType, id: number): TitleDetail | null {
  const pool = [...getMockTrending(), ...getMockPopular()];
  const base = pool.find((t) => t.id === id) ?? pool[id % pool.length];
  if (!base) return null;

  return {
    ...base,
    id,
    mediaType,
    genres: GENRES,
    runtimeMinutes: mediaType === "movie" ? 128 : 45,
    seasons: mediaType === "tv" ? 3 : null,
    cast: CAST.map((name, i) => ({ id: i, name, character: `Karakter ${i + 1}` })),
    similar: getMockPopular().filter((t) => t.id !== id).slice(0, 12),
  };
}
