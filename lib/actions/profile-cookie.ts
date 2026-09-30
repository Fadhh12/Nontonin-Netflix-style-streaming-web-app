import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { AVATAR_KEYS } from "@/lib/validators/profile";

export const ACTIVE_PROFILE_COOKIE = "active_profile_id";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export async function setActiveProfileCookie(profileId: string) {
  (await cookies()).set(ACTIVE_PROFILE_COOKIE, profileId, COOKIE_OPTIONS);
}

export interface ActiveProfile {
  id: string;
  name: string;
  avatarKey: (typeof AVATAR_KEYS)[number];
  isKids: boolean;
}

/**
 * Reads and validates the active-profile cookie against the logged-in
 * user's own profiles (SRS G03): a stale or foreign profile id is treated
 * as "no active profile", never trusted as-is.
 */
export async function getActiveProfile(): Promise<ActiveProfile | null> {
  const cookieStore = await cookies();
  const profileId = cookieStore.get(ACTIVE_PROFILE_COOKIE)?.value;
  if (!profileId) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_key, is_kids")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    try {
      cookieStore.delete(ACTIVE_PROFILE_COOKIE);
    } catch {
      // Called from a Server Component render — cookies can only be
      // written in a Server Action or Route Handler. middleware.ts and
      // the next mutating action will clean it up instead.
    }
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    avatarKey: data.avatar_key,
    isKids: data.is_kids,
  };
}
