import { describe, expect, it } from "vitest";
import { mapDetail, mapListItem } from "./mappers";
import type { TmdbDetail, TmdbListItem } from "./types";

const movieItem: TmdbListItem = {
  id: 1,
  title: "The Last Horizon",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  overview: "Sinopsis singkat.",
  release_date: "2026-03-14",
  vote_average: 8.44,
  media_type: "movie",
};

const tvItem: TmdbListItem = {
  id: 2,
  name: "Neon City",
  poster_path: null,
  backdrop_path: null,
  overview: "Sinopsis series.",
  first_air_date: "2025-01-01",
  vote_average: 7,
};

describe("mapListItem", () => {
  it("maps a movie item, preferring title and release_date", () => {
    const title = mapListItem(movieItem);
    expect(title).toMatchObject({
      id: 1,
      mediaType: "movie",
      title: "The Last Horizon",
      year: "2026",
      rating: 8.4,
    });
    expect(title.posterUrl).toContain("/poster.jpg");
  });

  it("uses the fallback media type and handles missing images", () => {
    const title = mapListItem(tvItem, "tv");
    expect(title.mediaType).toBe("tv");
    expect(title.title).toBe("Neon City");
    expect(title.posterUrl).toBeNull();
    expect(title.backdropUrl).toBeNull();
    expect(title.year).toBe("2025");
  });

  it("returns null year when no date is present", () => {
    const title = mapListItem({ ...tvItem, first_air_date: undefined });
    expect(title.year).toBeNull();
  });
});

describe("mapDetail", () => {
  it("maps genres, runtime, cast, and similar titles for a movie", () => {
    const detail: TmdbDetail = {
      ...movieItem,
      genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }],
      runtime: 128,
      videos: { results: [] },
      credits: {
        cast: Array.from({ length: 12 }, (_, i) => ({
          id: i,
          name: `Actor ${i}`,
          character: `Character ${i}`,
          profile_path: null,
        })),
      },
      recommendations: { results: [tvItem] },
    };

    const result = mapDetail(detail, "movie");
    expect(result.genres).toEqual(["Action", "Drama"]);
    expect(result.runtimeMinutes).toBe(128);
    expect(result.seasons).toBeNull();
    expect(result.cast).toHaveLength(10); // capped at 10 (SRS FR-D1)
    expect(result.similar).toHaveLength(1);
  });

  it("maps season count and episode runtime for a tv show", () => {
    const detail: TmdbDetail = {
      ...tvItem,
      genres: [],
      episode_run_time: [45, 42],
      number_of_seasons: 3,
    };

    const result = mapDetail(detail, "tv");
    expect(result.runtimeMinutes).toBe(45);
    expect(result.seasons).toBe(3);
  });
});
