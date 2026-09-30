import { tmdbFetch } from "./client";
import { mapDetail, mapListItem, type Title, type TitleDetail } from "./mappers";
import type { MediaType, TmdbDetail, TmdbListResponse } from "./types";

// Revalidation windows from PROJECT_PLAN.md 3.5.
const ROW_REVALIDATE = 60 * 60; // 1 hour
const DETAIL_REVALIDATE = 60 * 60 * 24; // 1 day

// Genre ids restricted to profil anak (SRS FR-B4): Animasi (16), Keluarga (10751).
export const KIDS_GENRE_IDS = [16, 10751];

export async function getTrending(): Promise<Title[]> {
  const data = await tmdbFetch<TmdbListResponse>(
    "/trending/all/day",
    {},
    { revalidate: ROW_REVALIDATE },
  );
  return data.results.map((item) => mapListItem(item));
}

export async function getPopularMovies(): Promise<Title[]> {
  const data = await tmdbFetch<TmdbListResponse>(
    "/movie/popular",
    {},
    { revalidate: ROW_REVALIDATE },
  );
  return data.results.map((item) => mapListItem(item, "movie"));
}

export async function getTopRatedMovies(): Promise<Title[]> {
  const data = await tmdbFetch<TmdbListResponse>(
    "/movie/top_rated",
    {},
    { revalidate: ROW_REVALIDATE },
  );
  return data.results.map((item) => mapListItem(item, "movie"));
}

export async function getPopularSeries(): Promise<Title[]> {
  const data = await tmdbFetch<TmdbListResponse>(
    "/tv/popular",
    {},
    { revalidate: ROW_REVALIDATE },
  );
  return data.results.map((item) => mapListItem(item, "tv"));
}

export async function discoverByGenre(
  mediaType: MediaType,
  genreIds: number[],
): Promise<Title[]> {
  const data = await tmdbFetch<TmdbListResponse>(
    `/discover/${mediaType}`,
    { with_genres: genreIds.join(",") },
    { revalidate: ROW_REVALIDATE },
  );
  return data.results.map((item) => mapListItem(item, mediaType));
}

export async function getTitleDetail(
  mediaType: MediaType,
  id: number,
): Promise<TitleDetail> {
  const data = await tmdbFetch<TmdbDetail>(
    `/${mediaType}/${id}`,
    { append_to_response: "videos,credits,recommendations" },
    { revalidate: DETAIL_REVALIDATE },
  );
  return mapDetail(data, mediaType);
}

export async function getVideosFor(mediaType: MediaType, id: number) {
  const data = await tmdbFetch<TmdbDetail>(
    `/${mediaType}/${id}`,
    { append_to_response: "videos" },
    { revalidate: DETAIL_REVALIDATE },
  );
  return data.videos?.results ?? [];
}

/** No cache — search results must always be fresh (SDD 3.5). */
export async function searchMulti(
  query: string,
  page: number,
): Promise<{ page: number; totalPages: number; results: Title[] }> {
  const data = await tmdbFetch<
    TmdbListResponse & { results: (TmdbListResponse["results"][number] & { media_type: MediaType | "person" })[] }
  >("/search/multi", { query, page });

  // SRS FR-S2: discard "person" results.
  const results = data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => mapListItem(r, r.media_type as MediaType));

  return { page: data.page, totalPages: data.total_pages, results };
}
