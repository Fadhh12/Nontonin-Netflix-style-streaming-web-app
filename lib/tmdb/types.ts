/**
 * Minimal TMDB API types — only the fields Nontonin actually reads.
 * Full schema: https://developer.themoviedb.org/reference
 */

export type MediaType = "movie" | "tv";

export interface TmdbListItem {
  id: number;
  media_type?: MediaType;
  title?: string; // movie
  name?: string; // tv
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string; // movie
  first_air_date?: string; // tv
  vote_average: number;
  genre_ids?: number[];
}

export interface TmdbListResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbListItem[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  site: "YouTube" | string;
  type: string; // "Trailer" | "Teaser" | ...
  official: boolean;
  name: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbDetail extends TmdbListItem {
  genres: TmdbGenre[];
  runtime?: number; // movie, minutes
  episode_run_time?: number[]; // tv
  number_of_seasons?: number; // tv
  videos?: { results: TmdbVideo[] };
  credits?: { cast: TmdbCastMember[] };
  recommendations?: { results: TmdbListItem[] };
}
