"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { ACTIVE_PROFILE_COOKIE, setActiveProfileCookie } from "@/lib/actions/profile-cookie";

export interface AuthActionState {
  error: string | null;
  fieldErrors?: Record<string, string>;
}

function isSafeReturnTo(path: FormDataEntryValue | null): path is string {
  return (
    typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
  );
}

/** SRS FR-A1/FR-A2: register, sign in, redirect to /profiles to pick/create a profile. */
export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: null, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Supabase reports this as a generic "already registered" condition.
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: null, fieldErrors: { email: "Email sudah terdaftar" } };
    }
    return { error: "Gagal mendaftar, coba lagi." };
  }

  redirect("/profiles");
}

/** SRS FR-A2: generic error message — never reveal whether the email exists. */
export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email atau kata sandi salah" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Email atau kata sandi salah" };
  }

  const returnTo = formData.get("returnTo");
  redirect(isSafeReturnTo(returnTo) ? returnTo : "/profiles");
}

/**
 * F14: one-click demo for recruiters. Signs into a fixed, pre-seeded
 * account (scripts/seed-demo-account.mjs) and auto-selects its single
 * profile, skipping straight to /browse instead of the profile picker.
 */
export async function signInDemo() {
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;
  if (!email || !password) redirect("/login");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", data.user.id)
    .limit(1)
    .maybeSingle();

  if (profile) {
    await setActiveProfileCookie(profile.id);
    redirect("/browse");
  }

  redirect("/profiles");
}

/** SRS FR-A3: clear the session and the active-profile cookie. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  (await cookies()).delete(ACTIVE_PROFILE_COOKIE);
  redirect("/");
}
