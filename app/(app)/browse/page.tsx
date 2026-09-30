import type { Metadata } from "next";
import { HeroBanner } from "@/components/features/hero-banner";
import { MediaRow } from "@/components/features/media-row";
import {
  getMockHero,
  getMockPopular,
  getMockPopularSeries,
  getMockTopRated,
  getMockTrending,
} from "@/lib/mock/titles";

// TODO(Sprint 2+, needs TMDB_READ_TOKEN): swap these mock calls for
// lib/tmdb/queries.ts (getTrending, getPopularMovies, ...). Row components
// (MediaRow/MediaRail/MediaCard) already accept the same Title shape either
// way, so this file is the only thing that changes.

export const metadata: Metadata = {
  title: "Beranda — Nontonin",
};

export default function BrowsePage() {
  const hero = getMockHero();

  return (
    <>
      <HeroBanner title={hero} />
      <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-16">
        <MediaRow heading="Trending hari ini" titles={getMockTrending()} />
        <MediaRow heading="Populer" titles={getMockPopular()} />
        <MediaRow heading="Top Rated" titles={getMockTopRated()} />
        <MediaRow heading="Series Populer" titles={getMockPopularSeries()} />
      </div>
    </>
  );
}
