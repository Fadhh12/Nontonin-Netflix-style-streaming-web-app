"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { TrailerModal } from "./trailer-modal";
import { youtubeEmbedUrl } from "@/lib/tmdb/trailer";
import type { TmdbVideo } from "@/lib/tmdb/types";

// Indonesian labels for TMDB's video types (UI copy stays Indonesian per CLAUDE.md).
const TYPE_LABELS: Record<string, string> = {
  Trailer: "Trailer",
  Teaser: "Cuplikan",
  Clip: "Klip",
  Featurette: "Sorotan",
  "Behind the Scenes": "Di Balik Layar",
  Bloopers: "Blooper",
};

interface VideoGalleryProps {
  title: string;
  videos: TmdbVideo[];
}

/**
 * Netflix-style "more videos" row: every official YouTube video TMDB has
 * for a title (trailers, teasers, clips, featurettes) — not just the one
 * trailer the main CTA plays. Still promotional YouTube content only,
 * never full films (CLAUDE.md hard constraint).
 */
export function VideoGallery({ title, videos }: VideoGalleryProps) {
  const [active, setActive] = useState<TmdbVideo | null>(null);

  const youtubeVideos = videos.filter((v) => v.site === "YouTube");
  if (youtubeVideos.length === 0) return null;

  return (
    <section className="mt-9">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-text">Video</h2>
      <div className="flex gap-3.5 overflow-x-auto pb-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {youtubeVideos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video)}
            className="group relative block w-[260px] shrink-0 overflow-hidden rounded-[8px] bg-surface text-left transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail CDN, not an app asset next/image needs to optimize */}
              <img
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-10 w-10 text-white" strokeWidth={1.5} fill="white" />
              </div>
              <span className="absolute left-2 top-2 rounded-[4px] bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-bg">
                {TYPE_LABELS[video.type] ?? video.type}
              </span>
            </div>
            <p className="truncate px-2.5 py-2 text-xs font-semibold text-text">{video.name}</p>
          </button>
        ))}
      </div>

      <TrailerModal
        open={!!active}
        onClose={() => setActive(null)}
        embedUrl={active ? youtubeEmbedUrl(active.key) : null}
        title={active ? `${title} — ${active.name}` : title}
      />
    </section>
  );
}
