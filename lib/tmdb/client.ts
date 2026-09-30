import "server-only";

/**
 * Server-only TMDB client. TMDB_READ_TOKEN must never reach the browser —
 * do not prefix it with NEXT_PUBLIC and never import this file from a
 * Client Component. See PROJECT_PLAN.md 3.5 (Rahasia) and SRS G05.
 */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export class TmdbError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

interface TmdbFetchOptions {
  /** Seconds to cache via Next.js fetch cache. Omit for no caching (e.g. search). */
  revalidate?: number;
}

/**
 * Calls a TMDB endpoint with the id-ID → en-US language fallback and
 * include_adult=false enforced on every request (SRS G05).
 */
export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: TmdbFetchOptions = {},
): Promise<T> {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) {
    throw new TmdbError("TMDB_READ_TOKEN is not configured", 500);
  }

  const search = new URLSearchParams({
    language: "id-ID",
    include_adult: "false",
    ...Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined) as [
        string,
        string,
      ][],
    ),
  });

  const url = `${TMDB_BASE_URL}${path}?${search.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
      next: options.revalidate !== undefined
        ? { revalidate: options.revalidate }
        : undefined,
      cache: options.revalidate === undefined ? "no-store" : undefined,
    });

    if (!res.ok) {
      throw new TmdbError(`TMDB request failed: ${path}`, res.status);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof TmdbError) throw err;
    throw new TmdbError(`TMDB request errored: ${path}`, 502);
  } finally {
    clearTimeout(timeout);
  }
}

/** Build a TMDB CDN image URL. Returns null when the path is missing. */
export function tmdbImageUrl(
  path: string | null,
  size: "w342" | "w780" | "w1280" | "original" = "w342",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
