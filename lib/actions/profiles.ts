"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, MAX_PROFILES_PER_ACCOUNT } from "@/lib/validators/profile";
import { setActiveProfileCookie } from "@/lib/actions/profile-cookie";

export interface ProfileActionState {
  error: string | null;
  fieldErrors?: Record<string, string>;
}

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Sesi berakhir, silakan masuk lagi",
  name_taken: "Nama profil sudah dipakai",
  profile_limit_reached: `Maksimal ${MAX_PROFILES_PER_ACCOUNT} profil per akun`,
  last_profile: "Profil terakhir tidak bisa dihapus",
  not_found: "Profil tidak ditemukan",
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  return { supabase, user };
}

/** SRS FR-P2, G04: create a profile; unique-name and 5-profile limit are enforced by the DB. */
export async function createProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: ERROR_MESSAGES.unauthenticated };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    avatarKey: formData.get("avatarKey"),
    isKids: formData.get("isKids") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: null, fieldErrors };
  }

  const { error } = await supabase.from("profiles").insert({
    user_id: user.id,
    name: parsed.data.name,
    avatar_key: parsed.data.avatarKey,
    is_kids: parsed.data.isKids,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: null, fieldErrors: { name: ERROR_MESSAGES.name_taken } };
    }
    if (error.message.includes("profile_limit_reached")) {
      return { error: ERROR_MESSAGES.profile_limit_reached };
    }
    return { error: "Gagal menyimpan profil, coba lagi." };
  }

  revalidatePath("/profiles");
  return { error: null };
}

export async function updateProfile(
  id: string,
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: ERROR_MESSAGES.unauthenticated };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    avatarKey: formData.get("avatarKey"),
    isKids: formData.get("isKids") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: null, fieldErrors };
  }

  const { error, count } = await supabase
    .from("profiles")
    .update(
      {
        name: parsed.data.name,
        avatar_key: parsed.data.avatarKey,
        is_kids: parsed.data.isKids,
      },
      { count: "exact" },
    )
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: null, fieldErrors: { name: ERROR_MESSAGES.name_taken } };
    }
    return { error: "Gagal menyimpan profil, coba lagi." };
  }
  if (count === 0) return { error: ERROR_MESSAGES.not_found };

  revalidatePath("/profiles");
  return { error: null };
}

/** SRS FR-P2: the last remaining profile on an account may not be deleted. */
export async function deleteProfile(id: string): Promise<ProfileActionState> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: ERROR_MESSAGES.unauthenticated };

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) <= 1) {
    return { error: ERROR_MESSAGES.last_profile };
  }

  const { error, count: deletedCount } = await supabase
    .from("profiles")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Gagal menghapus profil, coba lagi." };
  if (deletedCount === 0) return { error: ERROR_MESSAGES.not_found };

  revalidatePath("/profiles");
  return { error: null };
}

/** SRS FR-P4: store the chosen profile in the cookie, then enter Browse. */
export async function selectProfile(id: string) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?returnTo=/profiles");

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) redirect("/profiles");

  await setActiveProfileCookie(id);
  redirect("/browse");
}
