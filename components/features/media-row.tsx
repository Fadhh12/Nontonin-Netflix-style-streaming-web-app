import type { Title } from "@/lib/tmdb/mappers";
import { MediaRail } from "./media-rail";
import { RowError } from "./row-error";

interface MediaRowProps {
  heading: string;
  titles: Title[];
  /** Set when the underlying fetch failed; renders the retry state instead (SRS AC7). */
  error?: boolean;
}

/** One category row: heading + horizontally scrollable posters, or a retry state on failure. */
export function MediaRow({ heading, titles, error }: MediaRowProps) {
  if (error) {
    return <RowError heading={heading} />;
  }

  // Rows with no results stay hidden rather than showing an empty shell
  // (SRS FR-H2, applied to every row for consistency).
  if (titles.length === 0) return null;

  return (
    <section className="mt-9">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-text">{heading}</h2>
      </div>
      <MediaRail titles={titles} />
    </section>
  );
}
