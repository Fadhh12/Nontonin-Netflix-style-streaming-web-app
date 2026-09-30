import { defineConfig, devices } from "@playwright/test";

/**
 * Sprint 5 (T5.2): the 3 main flows from PROJECT_PLAN.md — guest plays a
 * trailer, register -> create profile -> My List, and search. Runs against
 * a Next.js dev server it starts itself, so `npm run test:e2e` works with
 * no extra setup beyond .env.local being filled in (real TMDB + Supabase).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
