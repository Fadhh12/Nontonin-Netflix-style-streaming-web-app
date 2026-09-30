"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Title } from "@/lib/tmdb/mappers";
import { MediaCard } from "./media-card";

/**
 * Horizontally scrollable poster row (SRS FR-B2): arrow buttons on desktop,
 * native swipe on touch. Left/Right arrow keys scroll while the row has
 * focus (PROJECT_PLAN.md 4.5 keyboard rules).
 */
export function MediaRail({ titles }: { titles: Title[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(-1);
    }
  }

  return (
    <div className="group/rail relative" onKeyDown={handleKeyDown} tabIndex={-1}>
      <button
        type="button"
        aria-label="Sebelumnya"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/75 text-white opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 focus-visible:opacity-100 md:flex"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-3.5 overflow-x-auto scroll-smooth pb-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {titles.map((title) => (
          <MediaCard key={`${title.mediaType}-${title.id}`} title={title} />
        ))}
      </div>

      <button
        type="button"
        aria-label="Berikutnya"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/75 text-white opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 focus-visible:opacity-100 md:flex"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}

/** Loading state for a row while TMDB data streams in (SRS: skeleton, not a spinner). */
export function MediaRailSkeleton() {
  return (
    <div className="flex gap-3.5 overflow-hidden pb-3.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-2/3 w-[168px] shrink-0 animate-pulse rounded-[8px] bg-surface"
        />
      ))}
    </div>
  );
}
