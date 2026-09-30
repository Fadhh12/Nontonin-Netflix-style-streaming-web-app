"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveProfile } from "@/lib/actions/profile-cookie";
import { myListItemSchema } from "@/lib/validators/title";
import { MAX_HISTORY_ITEMS } from "@/lib/validators/profile";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { Title } from "@/lib/tmdb/mappers";

/**
 * SRS FR-H1: upsert the view timestamp when a logged-in profile opens a
 * detail page, then prune down to the latest MAX_HISTORY_ITEMS (G04).
 * Silently no-ops for guests — history is not part of the guest flow.
 */
export async function recordView(input: {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
}) {
  const parsed = myListItemSchema.safeParse(input);
  if (!parsed.success) return;

  const profile = await getActiveProfile();
  if (!profile) return;

  const supabase = await createClient();

  await supabase.from("watch_history").upsert(
    {
      profile_id: profile.id,
      tmdb_id: parsed.data.tmdbId,
      media_type: parsed.data.mediaType,
      title: parsed.data.title,
      poster_path: parsed.data.posterPath,
      last_viewed_at: new Date().toISOString(),
    },
    { onConflict: "profile_id,media_type,tmdb_id" },
  );

  const { data: rows } = await supabase
    .from("watch_history")
    .select("id")
    .eq("profile_id", profile.id)
    .order("last_viewed_at", { ascending: false })
    .range(MAX_HISTORY_ITEMS, MAX_HISTORY_ITEMS + 200);

  if (rows && rows.length > 0) {
    await supabase
      .from("watch_history")
      .delete()
      .in(
        "id",
        rows.map((r) => r.id),
      );
  }
}

/** SRS FR-H2: latest 20 for the "Baru dilihat" row. */
export async function getRecentlyViewed(): Promise<Title[]> {
  const profile = await getActiveProfile();
  if (!profile) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("watch_history")
    .select("tmdb_id, media_type, title, poster_path")
    .eq("profile_id", profile.id)
    .order("last_viewed_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((row) => ({
    id: row.tmdb_id as number,
    mediaType: row.media_type as "movie" | "tv",
    title: row.title as string,
    overview: "",
    posterUrl: tmdbImageUrl(row.poster_path as string | null, "w342"),
    posterPath: row.poster_path as string | null,
    backdropUrl: null,
    year: null,
    rating: 0,
  }));
}
