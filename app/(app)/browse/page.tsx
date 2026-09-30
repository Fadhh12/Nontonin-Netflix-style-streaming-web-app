import type { Metadata } from "next";
import { HeroBanner } from "@/components/features/hero-banner";
import { MediaRowAsync } from "@/components/features/media-row-async";
import {
  discoverByGenre,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTrending,
} from "@/lib/tmdb/queries";
import { getMockHero } from "@/lib/mock/titles";

export const metadata: Metadata = {
  title: "Beranda — Nontonin",
};

// Genre ids from TMDB's official list (SDD 3.4 discover/movie|tv).
const ACTION_GENRE_ID = 28;

async function getHero() {
  try {
    const trending = await getTrending();
    return trending[0] ?? getMockHero();
  } catch {
    return getMockHero();
  }
}

export default async function BrowsePage() {
  const hero = await getHero();

  return (
    <>
      <HeroBanner title={hero} />
      <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-16">
        <MediaRowAsync heading="Trending hari ini" fetcher={getTrending} />
        <MediaRowAsync heading="Populer" fetcher={getPopularMovies} />
        <MediaRowAsync heading="Top Rated" fetcher={getTopRatedMovies} />
        <MediaRowAsync
          heading="Film Aksi"
          fetcher={() => discoverByGenre("movie", [ACTION_GENRE_ID])}
        />
        <MediaRowAsync heading="Series Populer" fetcher={getPopularSeries} />
      </div>
    </>
  );
}
