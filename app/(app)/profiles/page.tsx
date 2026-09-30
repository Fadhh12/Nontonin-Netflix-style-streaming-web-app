import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilesGrid } from "@/components/features/profiles-grid";
import type { AVATAR_KEYS } from "@/lib/validators/profile";

export const metadata: Metadata = { title: "Pilih profil — Nontonin" };

/** S04. Protected by middleware.ts (SRS G01); redirects to /login otherwise. */
export default async function ProfilesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?returnTo=/profiles");

  const { data } = await supabase
    .from("profiles")
    .select("id, name, avatar_key, is_kids")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const profiles = (data ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    avatarKey: p.avatar_key as (typeof AVATAR_KEYS)[number],
    isKids: p.is_kids as boolean,
  }));

  return <ProfilesGrid profiles={profiles} />;
}
