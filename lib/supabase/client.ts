import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for Client Components. Anon key only — safe to expose (RLS-protected). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
