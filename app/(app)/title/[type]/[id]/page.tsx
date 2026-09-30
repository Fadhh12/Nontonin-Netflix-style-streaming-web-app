import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaRow } from "@/components/features/media-row";
import { TitleDetailActions } from "@/components/features/title-detail-actions";
import { getTitleDetail } from "@/lib/tmdb/queries";
import { youtubeEmbedUrl } from "@/lib/tmdb/trailer";
import { TmdbError } from "@/lib/tmdb/client";
import type { MediaType } from "@/lib/tmdb/types";

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

function parseMediaType(value: string): MediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  const mediaType = parseMediaType(type);
  const detail = mediaType ? await loadDetail(mediaType, Number(id)) : null;
  if (!detail) return { title: "Nontonin" };

  return {
    title: `${detail.title} — Nontonin`,
    description: detail.overview,
    openGraph: {
      title: detail.title,
      description: detail.overview,
      images: detail.posterUrl ? [detail.posterUrl] : undefined,
    },
  };
}

export default async function TitleDetailPage({ params }: PageProps) {
  const { type, id } = await params;
  const mediaType = parseMediaType(type);
  const numericId = Number(id);

  if (!mediaType || Number.isNaN(numericId)) notFound();

  const detail = await loadDetail(mediaType, numericId);
  if (!detail) notFound();

  const durationLabel =
    detail.mediaType === "movie" && detail.runtimeMinutes
      ? `${Math.floor(detail.runtimeMinutes / 60)}h ${detail.runtimeMinutes % 60}m`
      : detail.seasons
        ? `${detail.seasons} season`
        : null;

  return (
    <article>
      <div
        className="relative flex min-h-[380px] items-end px-6 pb-10 pt-32 md:min-h-[460px] md:px-16"
        style={{
          backgroundImage: detail.backdropUrl
            ? `linear-gradient(0deg, #0B0B0F 0%, rgba(11,11,15,.4) 55%, rgba(11,11,15,.15) 100%), url('${detail.backdropUrl}')`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-[1] max-w-[760px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            {detail.mediaType === "movie" ? "Movie" : "Series"} · {detail.year}
          </p>
          <h1 className="font-heading text-[clamp(28px,4vw,44px)] font-extrabold leading-tight tracking-[-0.02em] text-white">
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

      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-16">
        <TitleDetailActions
          title={detail.title}
          trailerEmbedUrl={detail.trailerKey ? youtubeEmbedUrl(detail.trailerKey) : null}
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

        <MediaRow heading="Judul serupa" titles={detail.similar} />
      </div>
    </article>
  );
}
