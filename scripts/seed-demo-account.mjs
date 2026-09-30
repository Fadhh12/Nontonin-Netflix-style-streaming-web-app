#!/usr/bin/env node
/**
 * One-time setup for F14 (Akun demo untuk recruiter). Creates a fixed
 * Supabase account + one profile via the public signUp flow (same anon-key
 * path a real user goes through — no admin access needed since
 * mailer_autoconfirm is on). Run once, then copy the printed credentials
 * into .env.local as DEMO_EMAIL / DEMO_PASSWORD.
 *
 * Safe to re-run: if the account already exists, it just signs in instead
 * of erroring, and skips creating a duplicate profile.
 *
 * Usage: node scripts/seed-demo-account.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const DEMO_EMAIL = "demo@nontonin.app";
const DEMO_PASSWORD = "NontoninDemo2026!";

function loadEnv() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const get = (key) => text.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
  const url = get("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) throw new Error("Fill in .env.local first.");
  return { url, anonKey };
}

async function main() {
  const { url, anonKey } = loadEnv();
  const supabase = createClient(url, anonKey);

  let { data, error } = await supabase.auth.signUp({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (error?.message.toLowerCase().includes("already registered")) {
    console.log("Demo account already exists, signing in instead...");
    ({ data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    }));
  }

  if (error) throw error;
  if (!data.session) throw new Error("No session — is mailer_autoconfirm on?");

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", data.user.id);

  if (!existing || existing.length === 0) {
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: data.user.id,
      name: "Demo",
      avatar_key: "coral",
      is_kids: false,
    });
    if (profileError) throw profileError;
    console.log("Created demo profile.");
  } else {
    console.log("Demo profile already exists, skipping.");
  }

  console.log("\nAdd these to .env.local:\n");
  console.log(`DEMO_EMAIL=${DEMO_EMAIL}`);
  console.log(`DEMO_PASSWORD=${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
