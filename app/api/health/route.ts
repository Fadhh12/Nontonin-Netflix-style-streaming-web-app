import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * SDD 3.4/3.6: pinged by GitHub Actions every 3 days so the free Supabase
 * project sees real activity and isn't auto-paused after 7 days idle.
 * Uses the anon key directly (no user session exists for a cron hit) to
 * call the public ping() function from the migration.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.rpc("ping");
    if (error) throw error;

    return NextResponse.json({ ok: true, time: data });
  } catch {
    return NextResponse.json({ ok: false, error: "Database unreachable" }, { status: 503 });
  }
}
