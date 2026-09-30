import { Suspense } from "react";
import type { Title } from "@/lib/tmdb/mappers";
import { TmdbError } from "@/lib/tmdb/client";
import { MediaRow } from "./media-row";
import { MediaRailSkeleton } from "./media-rail";

interface MediaRowAsyncProps {
  heading: string;
  fetcher: () => Promise<Title[]>;
}

/**
 * Streams one row in independently: a slow or failing TMDB call shows this
 * row's skeleton, then its own retry state, without blocking the rest of
 * the page (SRS AC7, "satu baris gagal tidak menjatuhkan seluruh halaman").
 */
export function MediaRowAsync({ heading, fetcher }: MediaRowAsyncProps) {
  return (
    <Suspense fallback={<MediaRailSkeleton />}>
      <MediaRowContent heading={heading} fetcher={fetcher} />
    </Suspense>
  );
}

async function MediaRowContent({ heading, fetcher }: MediaRowAsyncProps) {
  let titles: Title[] | null = null;
  let failed = false;

  try {
    titles = await fetcher();
  } catch (err) {
    if (!(err instanceof TmdbError)) throw err;
    failed = true;
  }

  return <MediaRow heading={heading} titles={titles ?? []} error={failed} />;
}
