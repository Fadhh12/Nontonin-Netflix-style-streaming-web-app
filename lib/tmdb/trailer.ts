import type { TmdbVideo } from "./types";

/**
 * Picks the best trailer to play: official YouTube trailers first, then
 * any YouTube trailer, in TMDB's own order. Returns null when none exist
 * (SRS FR-D2 / behavior table: "Trailer belum tersedia").
 */
export function pickTrailer(videos: TmdbVideo[] | undefined): TmdbVideo | null {
  if (!videos || videos.length === 0) return null;

  const youtubeTrailers = videos.filter(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );
  if (youtubeTrailers.length === 0) return null;

  const official = youtubeTrailers.find((v) => v.official);
  return official ?? youtubeTrailers[0];
}

export function youtubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}`;
}
