import { notFound } from "next/navigation";
import { MediaRow } from "@/components/features/media-row";
import { TitleDetailActions } from "@/components/features/title-detail-actions";
import { VideoGallery } from "@/components/features/video-gallery";
import { getTitleDetail } from "@/lib/tmdb/queries";
import { youtubeEmbedUrl } from "@/lib/tmdb/trailer";
import { TmdbError } from "@/lib/tmdb/client";
import type { MediaType } from "@/lib/tmdb/types";
import { isInMyList } from "@/lib/actions/my-list";
import { getReaction } from "@/lib/actions/reactions";
import { recordView } from "@/lib/actions/history";

async function loadDetail(mediaType: MediaType, id: number) {
  try {
    return await getTitleDetail(mediaType, id);
  } catch (err) {
    // TMDB 404s for an unknown id; surface Nontonin's own 404 either way
    // rather than a raw error screen (SRS: "Judul tidak ada di TMDB").
    if (err instanceof TmdbError) return null;
    throw err;
  }
}

interface TitleDetailContentProps {
  mediaType: MediaType;
  id: number;
  /** S07 (modal, capped ~850px) vs S08 (full page, own hero-width padding). */
  variant: "modal" | "page";
}

/**
 * Shared body for both the full-page detail (T2.1) and the intercepted
 * modal (T2.2) — S07 and S08 render the same content, so one component
 * backs both instead of duplicating the fetch + markup.
 */
export async function TitleDetailContent({ mediaType, id, variant }: TitleDetailContentProps) {
  const detail = await loadDetail(mediaType, id);
  if (!detail) notFound();

  // Fire-and-forget: recordView no-ops for guests, and a failed write here
  // shouldn't block rendering the page (SRS FR-H1).
  void recordView({
    tmdbId: detail.id,
    mediaType: detail.mediaType,
    title: detail.title,
    posterPath: detail.posterPath,
  });

  const [inList, reaction] = await Promise.all([
    isInMyList(detail.mediaType, detail.id),
    getReaction(detail.mediaType, detail.id),
  ]);

  const durationLabel =
    detail.mediaType === "movie" && detail.runtimeMinutes
      ? `${Math.floor(detail.runtimeMinutes / 60)}h ${detail.runtimeMinutes % 60}m`
      : detail.seasons
        ? `${detail.seasons} season`
        : null;

  const isModal = variant === "modal";

  return (
    <article>
      <div
        className={
          isModal
            ? "relative flex min-h-[280px] items-end rounded-t-xl px-6 pb-6 pt-10 md:min-h-[340px] md:px-8"
            : "relative flex min-h-[380px] items-end px-6 pb-10 pt-32 md:min-h-[460px] md:px-16"
        }
        style={{
          backgroundImage: detail.backdropUrl
            ? `linear-gradient(0deg, ${isModal ? "#15151C" : "#0B0B0F"} 0%, rgba(11,11,15,.4) 55%, rgba(11,11,15,.15) 100%), url('${detail.backdropUrl}')`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-[1] max-w-[760px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            {detail.mediaType === "movie" ? "Movie" : "Series"} · {detail.year}
          </p>
          <h1 className="font-heading text-[clamp(24px,4vw,44px)] font-extrabold leading-tight tracking-[-0.02em] text-white">
            {detail.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm text-[#d8d8df]">
            <span>{detail.year}</span>
            {durationLabel && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#777]" />
                <span>{durationLabel}</span>
              </>
            )}
            <span className="h-1 w-1 rounded-full bg-[#777]" />
            <span>⭐ {detail.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className={isModal ? "px-6 py-6 md:px-8" : "mx-auto max-w-[1440px] px-6 py-8 md:px-16"}>
        <TitleDetailActions
          tmdbId={detail.id}
          mediaType={detail.mediaType}
          title={detail.title}
          posterPath={detail.posterPath}
          trailerEmbedUrl={detail.trailerKey ? youtubeEmbedUrl(detail.trailerKey) : null}
          initialInList={inList}
          initialReaction={reaction}
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="mb-2 text-sm font-bold text-text">Sinopsis</h2>
            <p className="text-sm leading-relaxed text-muted">{detail.overview}</p>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-bold text-text">Genre &amp; Cast</h2>
            <p className="text-sm text-muted">{detail.genres.join(" · ")}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {detail.cast.map((c) => (
                <li key={c.id}>
                  {c.name} <span className="text-[#6f6f7c]">— {c.character}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <VideoGallery title={detail.title} videos={detail.videos} />

        <MediaRow heading="Judul serupa" titles={detail.similar} />
      </div>
    </article>
  );
}
