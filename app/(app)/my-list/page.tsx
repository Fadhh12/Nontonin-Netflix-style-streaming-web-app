import type { Metadata } from "next";
import Link from "next/link";
import { MediaCard } from "@/components/features/media-card";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getActiveProfile } from "@/lib/actions/profile-cookie";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { Title } from "@/lib/tmdb/mappers";

export const metadata: Metadata = { title: "My List — Nontonin" };

/** S11. Protected by middleware.ts; redirects to /profiles if no active profile. */
export default async function MyListPage() {
  const profile = await getActiveProfile();

  const items: Title[] = [];
  if (profile) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("my_list")
      .select("tmdb_id, media_type, title, poster_path")
      .eq("profile_id", profile.id)
      .order("added_at", { ascending: false });

    for (const row of data ?? []) {
      items.push({
        id: row.tmdb_id as number,
        mediaType: row.media_type as "movie" | "tv",
        title: row.title as string,
        overview: "",
        posterUrl: tmdbImageUrl(row.poster_path as string | null, "w342"),
        posterPath: row.poster_path as string | null,
        backdropUrl: null,
        year: null,
        rating: 0,
      });
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-28 md:px-16">
      <h1 className="text-2xl font-bold text-text">My List</h1>
      <p className="mb-8 text-sm text-muted">Judul yang kamu simpan.</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-muted">My List masih kosong</p>
          <Link href="/browse" className={buttonVariants({ variant: "primary" })}>
            Jelajahi film
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((title) => (
            <MediaCard
              key={`${title.mediaType}-${title.id}`}
              title={title}
              className="w-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
