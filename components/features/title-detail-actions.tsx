"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Play, Plus, Check, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrailerModal } from "./trailer-modal";
import { toggleMyList } from "@/lib/actions/my-list";
import { setReaction } from "@/lib/actions/reactions";
import type { MediaType } from "@/lib/tmdb/types";

interface TitleDetailActionsProps {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  trailerEmbedUrl: string | null;
  initialInList: boolean;
  initialReaction: 1 | -1 | null;
}

/**
 * Putar Trailer / + List / Suka row (SRS FR-D2, FR-L1, FR-R1). Optimistic
 * updates with rollback on failure; an unauthenticated response sends the
 * guest to /login?returnTo=<this page> (SRS AC4) instead of failing silently.
 */
export function TitleDetailActions({
  tmdbId,
  mediaType,
  title,
  posterPath,
  trailerEmbedUrl,
  initialInList,
  initialReaction,
}: TitleDetailActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [inList, setInList] = useState(initialInList);
  const [reaction, setReactionState] = useState(initialReaction);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function requireLogin() {
    router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
  }

  function handleToggleList() {
    const next = !inList;
    setInList(next);
    setError(null);
    startTransition(async () => {
      const result = await toggleMyList({
        tmdbId,
        mediaType,
        title,
        posterPath,
      });
      if (!result.ok) {
        setInList(!next);
        if (result.error?.code === "unauthenticated") {
          requireLogin();
        } else {
          setError(result.error?.message ?? "Gagal menyimpan, coba lagi.");
        }
      }
    });
  }

  function handleReaction(value: 1 | -1) {
    const next = reaction === value ? null : value;
    const previous = reaction;
    setReactionState(next);
    setError(null);
    startTransition(async () => {
      const result = await setReaction({ tmdbId, mediaType, value: next });
      if (!result.ok) {
        setReactionState(previous);
        if (result.error?.code === "unauthenticated") {
          requireLogin();
        } else {
          setError(result.error?.message ?? "Gagal menyimpan, coba lagi.");
        }
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
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
          onClick={handleToggleList}
          aria-pressed={inList}
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          {inList ? (
            <Check className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={1.75} />
          )}
          {inList ? "Di List" : "List"}
        </button>
        <button
          type="button"
          onClick={() => handleReaction(1)}
          aria-pressed={reaction === 1}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            reaction === 1 && "text-primary",
          )}
        >
          <Heart
            className="h-4 w-4"
            strokeWidth={1.75}
            fill={reaction === 1 ? "currentColor" : "none"}
          />
          Suka
        </button>
        {error && <span className="text-xs text-error">{error}</span>}
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
