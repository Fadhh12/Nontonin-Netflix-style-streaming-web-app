import { describe, expect, it } from "vitest";
import { pickTrailer, youtubeEmbedUrl } from "./trailer";
import type { TmdbVideo } from "./types";

function video(overrides: Partial<TmdbVideo>): TmdbVideo {
  return {
    id: "1",
    key: "abc123",
    site: "YouTube",
    type: "Trailer",
    official: false,
    name: "Trailer",
    ...overrides,
  };
}

describe("pickTrailer", () => {
  it("returns null when there are no videos", () => {
    expect(pickTrailer(undefined)).toBeNull();
    expect(pickTrailer([])).toBeNull();
  });

  it("returns null when there is no YouTube trailer", () => {
    const videos = [video({ site: "Vimeo" }), video({ type: "Teaser" })];
    expect(pickTrailer(videos)).toBeNull();
  });

  it("prefers the official trailer over an unofficial one", () => {
    const unofficial = video({ id: "1", official: false, key: "unofficial" });
    const official = video({ id: "2", official: true, key: "official" });
    const result = pickTrailer([unofficial, official]);
    expect(result?.key).toBe("official");
  });

  it("falls back to the first YouTube trailer when none are official", () => {
    const first = video({ id: "1", key: "first" });
    const second = video({ id: "2", key: "second" });
    const result = pickTrailer([first, second]);
    expect(result?.key).toBe("first");
  });

  it("ignores non-trailer video types", () => {
    const teaser = video({ type: "Teaser", key: "teaser" });
    const trailer = video({ type: "Trailer", key: "trailer" });
    const result = pickTrailer([teaser, trailer]);
    expect(result?.key).toBe("trailer");
  });
});

describe("youtubeEmbedUrl", () => {
  it("builds a valid embed URL", () => {
    expect(youtubeEmbedUrl("abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });
});
