#!/usr/bin/env node
/**
 * Integration check for T3.6 / SRS AC5 & AC6 — run manually against a real
 * Supabase project (needs .env.local filled in). Not part of `npm test`:
 * it hits the network and creates throwaway auth users, so it doesn't
 * belong in CI without dedicated secrets.
 *
 * Usage: node scripts/verify-rls.mjs
 *
 * Checks:
 *  - AC5: a 6th profile on one account is rejected (profile_limit_reached).
 *  - AC6: a second account can't read or write the first account's rows
 *    (RLS on profiles, and on my_list via the profiles ownership check).
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const get = (key) => text.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
  const url = get("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    throw new Error("Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local first.");
  }
  return { url, anonKey };
}

function assert(condition, message) {
  if (!condition) throw new Error("FAILED: " + message);
  console.log("  ok:", message);
}

async function signUpFreshUser(url, anonKey, label) {
  const client = createClient(url, anonKey);
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const { data, error } = await client.auth.signUp({ email, password: "abcd1234" });
  if (error) throw new Error(`signUp(${label}) failed: ${error.message}`);
  if (!data.session) {
    throw new Error(
      `signUp(${label}) did not return a session — is "Confirm email" still enabled in Supabase Auth settings?`,
    );
  }
  return { client, userId: data.user.id };
}

async function main() {
  const { url, anonKey } = loadEnv();

  console.log("AC5: 5-profile limit");
  const a = await signUpFreshUser(url, anonKey, "rls-a");
  for (let i = 1; i <= 5; i++) {
    const { error } = await a.client
      .from("profiles")
      .insert({ user_id: a.userId, name: `P${i}`, avatar_key: "coral", is_kids: false });
    if (error) throw new Error(`Unexpected error creating profile ${i}: ${error.message}`);
  }
  const { error: sixthError } = await a.client
    .from("profiles")
    .insert({ user_id: a.userId, name: "P6", avatar_key: "coral", is_kids: false });
  assert(sixthError?.message === "profile_limit_reached", "6th profile is rejected");

  const { data: aProfiles } = await a.client.from("profiles").select("id").eq("user_id", a.userId);
  assert(aProfiles.length === 5, "account A has exactly 5 profiles");

  console.log("\nAC6: cross-account isolation");
  const b = await signUpFreshUser(url, anonKey, "rls-b");
  await b.client.from("profiles").insert({ user_id: b.userId, name: "BOnly", avatar_key: "teal", is_kids: false });

  const { data: crossRead } = await b.client.from("profiles").select("*").eq("user_id", a.userId);
  assert(crossRead.length === 0, "account B cannot read account A's profiles");

  const { error: crossWriteError } = await b.client
    .from("my_list")
    .insert({ profile_id: aProfiles[0].id, tmdb_id: 1, media_type: "movie", title: "x", poster_path: null });
  assert(!!crossWriteError, "account B cannot write my_list rows against account A's profile");

  console.log("\nAll RLS checks passed.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
