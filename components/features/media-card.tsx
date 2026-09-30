import Image from "next/image";
import Link from "next/link";
import type { Title } from "@/lib/tmdb/mappers";
import { cn } from "@/lib/utils";

/**
 * Poster card reused across Trending, Populer, Top Rated, Search, My List,
 * and Judul Serupa (NONTONIN_MASTER_DESIGN_AGENT_PROMPT.md section 26 — one
 * MediaCard, not five look-alikes). 2:3 poster ratio, hover scale 1.05x.
 *
 * Defaults to a fixed 168px width for horizontal rails; pass `className`
 * with `w-full` (and drop the rail from its flex container) to use it
 * inside a CSS grid instead (Search, My List).
 */
export function MediaCard({ title, className }: { title: Title; className?: string }) {
  const href = `/title/${title.mediaType}/${title.id}`;
  const badge = title.mediaType === "movie" ? "Film" : "Series";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block w-[168px] shrink-0 overflow-hidden rounded-[8px] bg-surface transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.05] focus-visible:z-10 focus-visible:scale-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      aria-label={`${title.title}, ${badge}, ${title.year ?? ""}`}
    >
      <div className="relative aspect-2/3">
        {title.posterUrl ? (
          <Image
            src={title.posterUrl}
            alt={title.title}
            fill
            unoptimized
            className="object-cover"
            sizes="168px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-alt text-xs text-muted">
            Tanpa poster
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute inset-x-2 bottom-2.5">
          <span className="mb-1.5 inline-block rounded-[4px] bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {badge}
          </span>
          <p className="truncate text-xs font-bold text-text">{title.title}</p>
          <p className="mt-0.5 text-[10px] text-muted">
            {title.year} · ⭐ {title.rating.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}
