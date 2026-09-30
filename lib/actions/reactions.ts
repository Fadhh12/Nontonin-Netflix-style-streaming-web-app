"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveProfile } from "@/lib/actions/profile-cookie";
import { mediaTypeSchema, reactionValueSchema, tmdbIdSchema } from "@/lib/validators/title";

export interface ReactionActionResult {
  ok: boolean;
  value?: 1 | -1 | null;
  error?: { code: string; message: string };
}

/**
 * SRS FR-R1: one reaction per title per profile. Pressing the same
 * reaction again clears it (value: null deletes the row).
 */
export async function setReaction(input: {
  tmdbId: number;
  mediaType: "movie" | "tv";
  value: 1 | -1 | null;
}): Promise<ReactionActionResult> {
  const tmdbId = tmdbIdSchema.safeParse(input.tmdbId);
  const mediaType = mediaTypeSchema.safeParse(input.mediaType);
  const value = reactionValueSchema.safeParse(input.value);

  if (!tmdbId.success || !mediaType.success || !value.success) {
    return { ok: false, error: { code: "invalid", message: "Permintaan tidak valid" } };
  }

  const profile = await getActiveProfile();
  if (!profile) {
    return {
      ok: false,
      error: { code: "unauthenticated", message: "Sesi berakhir, silakan masuk lagi" },
    };
  }

  const supabase = await createClient();

  if (value.data === null) {
    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("profile_id", profile.id)
      .eq("media_type", mediaType.data)
      .eq("tmdb_id", tmdbId.data);
    if (error) {
      return { ok: false, error: { code: "unknown", message: "Gagal menyimpan, coba lagi" } };
    }
    return { ok: true, value: null };
  }

  const { error } = await supabase.from("reactions").upsert(
    {
      profile_id: profile.id,
      tmdb_id: tmdbId.data,
      media_type: mediaType.data,
      value: value.data,
    },
    { onConflict: "profile_id,media_type,tmdb_id" },
  );

  if (error) {
    return { ok: false, error: { code: "unknown", message: "Gagal menyimpan, coba lagi" } };
  }

  return { ok: true, value: value.data };
}

export async function getReaction(
  mediaType: "movie" | "tv",
  tmdbId: number,
): Promise<1 | -1 | null> {
  const profile = await getActiveProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("reactions")
    .select("value")
    .eq("profile_id", profile.id)
    .eq("media_type", mediaType)
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  return (data?.value as 1 | -1 | undefined) ?? null;
}
