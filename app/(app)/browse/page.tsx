import type { Metadata } from "next";
import { HeroBanner } from "@/components/features/hero-banner";
import { MediaRowAsync } from "@/components/features/media-row-async";
import { MediaRow } from "@/components/features/media-row";
import {
  KIDS_GENRE_IDS,
  discoverByGenre,
  getOverviewFallback,
  getPopularMovies,
  getPopularSeries,
  getRecommendationsFor,
  getTopRatedMovies,
  getTrending,
} from "@/lib/tmdb/queries";
import type { Title } from "@/lib/tmdb/mappers";
import { getMockHero } from "@/lib/mock/titles";
import { getActiveProfile } from "@/lib/actions/profile-cookie";
import { getRecentlyViewed } from "@/lib/actions/history";

export const metadata: Metadata = {
  title: "Beranda — Nontonin",
};

// Genre ids from TMDB's official list (SDD 3.4 discover/movie|tv).
const ACTION_GENRE_ID = 28;

async function getHero(isKids: boolean): Promise<Title> {
  try {
    const trending = isKids
      ? await discoverByGenre("movie", KIDS_GENRE_IDS)
      : await getTrending();
    const hero = trending[0] ?? getMockHero();

    // SRS G05: id-ID overview can be empty; fall back to en-US (SRS G05).
    if (!hero.overview) {
      hero.overview = await getOverviewFallback(hero.mediaType, hero.id);
    }

    return hero;
  } catch {
    return getMockHero();
  }
}

export default async function BrowsePage() {
  const activeProfile = await getActiveProfile();
  const isKids = activeProfile?.isKids ?? false;
  const hero = await getHero(isKids);

  // SRS FR-B4: profil anak only sees Animasi (16) / Keluarga (10751) rows.
  if (isKids) {
    return (
      <>
        <HeroBanner title={hero} />
        <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-16">
          <MediaRowAsync
            heading="Film Animasi & Keluarga"
            fetcher={() => discoverByGenre("movie", KIDS_GENRE_IDS)}
          />
          <MediaRowAsync
            heading="Series Animasi & Keluarga"
            fetcher={() => discoverByGenre("tv", KIDS_GENRE_IDS)}
          />
        </div>
      </>
    );
  }

  const recentlyViewed = await getRecentlyViewed();
  const mostRecent = recentlyViewed[0];

  return (
    <>
      <HeroBanner title={hero} />
      <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-16">
        {/* SRS FR-H2: hidden automatically when history is empty. */}
        <MediaRow heading="Baru dilihat" titles={recentlyViewed} />
        {/* F11: "Karena kamu melihat X", only when there's a most-recent title. */}
        {mostRecent && (
          <MediaRowAsync
            heading={`Karena kamu melihat ${mostRecent.title}`}
            fetcher={() => getRecommendationsFor(mostRecent.mediaType, mostRecent.id)}
          />
        )}
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
