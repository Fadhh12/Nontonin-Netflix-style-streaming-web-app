import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TitleDetailContent } from "@/components/features/title-detail-content";
import { getTitleDetail } from "@/lib/tmdb/queries";
import { TmdbError } from "@/lib/tmdb/client";
import type { MediaType } from "@/lib/tmdb/types";

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

function parseMediaType(value: string): MediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  const mediaType = parseMediaType(type);

  const detail = mediaType
    ? await getTitleDetail(mediaType, Number(id)).catch((err) => {
        if (err instanceof TmdbError) return null;
        throw err;
      })
    : null;
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

/** S08 — full-page detail, used on direct navigation/refresh (SRS FR-D1). */
export default async function TitleDetailPage({ params }: PageProps) {
  const { type, id } = await params;
  const mediaType = parseMediaType(type);
  const numericId = Number(id);

  if (!mediaType || Number.isNaN(numericId)) notFound();

  return <TitleDetailContent mediaType={mediaType} id={numericId} variant="page" />;
}
