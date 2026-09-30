import { notFound } from "next/navigation";
import { DetailModalShell } from "@/components/features/detail-modal-shell";
import { TitleDetailContent } from "@/components/features/title-detail-content";
import type { MediaType } from "@/lib/tmdb/types";

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

function parseMediaType(value: string): MediaType | null {
  return value === "movie" || value === "tv" ? value : null;
}

/**
 * S07 — intercepts in-app navigation to /title/[type]/[id] and shows it as
 * a modal over whatever page triggered it (T2.2). A direct visit or a
 * refresh bypasses interception entirely and hits the real S08 full page.
 */
export default async function TitleDetailModal({ params }: PageProps) {
  const { type, id } = await params;
  const mediaType = parseMediaType(type);
  const numericId = Number(id);

  if (!mediaType || Number.isNaN(numericId)) notFound();

  return (
    <DetailModalShell>
      <TitleDetailContent mediaType={mediaType} id={numericId} variant="modal" />
    </DetailModalShell>
  );
}
