"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getActiveProfile } from "@/lib/actions/profile-cookie";
import { myListItemSchema } from "@/lib/validators/title";
import { MAX_MY_LIST_ITEMS } from "@/lib/validators/profile";

export interface MyListActionResult {
  ok: boolean;
  inList?: boolean;
  error?: { code: string; message: string };
}

/**
 * SRS FR-L1: toggle My List membership with a single call — insert if
 * absent, delete if present. `list_full` at MAX_MY_LIST_ITEMS (SRS G04).
 */
export async function toggleMyList(input: {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
}): Promise<MyListActionResult> {
  const parsed = myListItemSchema.safeParse(input);
  if (!parsed.success) {
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
  const { data: existing } = await supabase
    .from("my_list")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("media_type", parsed.data.mediaType)
    .eq("tmdb_id", parsed.data.tmdbId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("my_list").delete().eq("id", existing.id);
    if (error) {
      return { ok: false, error: { code: "unknown", message: "Gagal menyimpan, coba lagi" } };
    }
    revalidatePath("/my-list");
    return { ok: true, inList: false };
  }

  const { count } = await supabase
    .from("my_list")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profile.id);

  if ((count ?? 0) >= MAX_MY_LIST_ITEMS) {
    return {
      ok: false,
      error: { code: "list_full", message: `Maksimal ${MAX_MY_LIST_ITEMS} judul di My List` },
    };
  }

  const { error } = await supabase.from("my_list").insert({
    profile_id: profile.id,
    tmdb_id: parsed.data.tmdbId,
    media_type: parsed.data.mediaType,
    title: parsed.data.title,
    poster_path: parsed.data.posterPath,
  });

  if (error) {
    return { ok: false, error: { code: "unknown", message: "Gagal menyimpan, coba lagi" } };
  }

  revalidatePath("/my-list");
  return { ok: true, inList: true };
}

/** Used by the detail page to render the button's initial aria-pressed state. */
export async function isInMyList(mediaType: "movie" | "tv", tmdbId: number): Promise<boolean> {
  const profile = await getActiveProfile();
  if (!profile) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("my_list")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("media_type", mediaType)
    .eq("tmdb_id", tmdbId)
    .maybeSingle();

  return !!data;
}
