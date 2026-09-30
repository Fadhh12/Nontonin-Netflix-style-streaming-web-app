"use client";

import { useState } from "react";
import { Play, Plus, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrailerModal } from "./trailer-modal";

interface TitleDetailActionsProps {
  title: string;
  /** null until Sprint 2 wires real TMDB videos (pickTrailer/youtubeEmbedUrl). */
  trailerEmbedUrl: string | null;
}

/**
 * Putar Trailer / + List / Suka row (SRS FR-D2, FR-L1, FR-R1). List and Suka
 * are disabled placeholders until auth + Server Actions land in Sprint 3-4 —
 * clicking either should require login per SRS AC4, not silently no-op.
 */
export function TitleDetailActions({ title, trailerEmbedUrl }: TitleDetailActionsProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTrailerOpen(true)}
          className={buttonVariants({ variant: "primary" })}
        >
          <Play className="h-4 w-4 fill-current" strokeWidth={0} />
          Putar Trailer
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "secondary" }))}
          aria-pressed={false}
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          List
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "secondary" }))}
          aria-pressed={false}
        >
          <Heart className="h-4 w-4" strokeWidth={1.75} />
          Suka
        </button>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        embedUrl={trailerEmbedUrl}
        title={title}
      />
    </>
  );
}
