import { tmdbImageUrl } from "./client";
import { pickTrailer } from "./trailer";
import type { MediaType, TmdbDetail, TmdbListItem, TmdbVideo } from "./types";

/** Shape every card/row component in Nontonin renders — TMDB details hidden behind this. */
export interface Title {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterUrl: string | null;
  /** Raw TMDB path (e.g. "/abc.jpg"), for storing in my_list/watch_history (SDD 3.3). */
  posterPath: string | null;
  backdropUrl: string | null;
  year: string | null;
  rating: number;
}

export function mapListItem(
  item: TmdbListItem,
  fallbackMediaType?: MediaType,
): Title {
  const mediaType = item.media_type ?? fallbackMediaType ?? "movie";
  const title = item.title ?? item.name ?? "";
  const date = item.release_date ?? item.first_air_date ?? "";

  return {
    id: item.id,
    mediaType,
    title,
    overview: item.overview,
    posterUrl: tmdbImageUrl(item.poster_path, "w342"),
    posterPath: item.poster_path,
    backdropUrl: tmdbImageUrl(item.backdrop_path, "w1280"),
    year: date ? date.slice(0, 4) : null,
    rating: Math.round(item.vote_average * 10) / 10,
  };
}

export interface TitleDetail extends Title {
  genres: string[];
  runtimeMinutes: number | null;
  seasons: number | null;
  cast: { id: number; name: string; character: string }[];
  similar: Title[];
  /** YouTube video key of the best trailer, or null (SRS FR-D2). */
  trailerKey: string | null;
  /** Every YouTube video TMDB has (trailers, teasers, clips) — F-videos gallery. */
  videos: TmdbVideo[];
}

export function mapDetail(
  detail: TmdbDetail,
  mediaType: MediaType,
): TitleDetail {
  const base = mapListItem(detail, mediaType);

  return {
    ...base,
    genres: detail.genres?.map((g) => g.name) ?? [],
    runtimeMinutes:
      mediaType === "movie" ? (detail.runtime ?? null) : (detail.episode_run_time?.[0] ?? null),
    seasons: mediaType === "tv" ? (detail.number_of_seasons ?? null) : null,
    cast:
      detail.credits?.cast.slice(0, 10).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
      })) ?? [],
    similar:
      detail.recommendations?.results
        .slice(0, 12)
        .map((r) => mapListItem(r, mediaType)) ?? [],
    trailerKey: pickTrailer(detail.videos?.results)?.key ?? null,
    videos: detail.videos?.results ?? [],
  };
}
