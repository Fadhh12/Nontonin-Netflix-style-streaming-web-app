import "server-only";

/**
 * In-memory sliding-window counter for /api/search (SDD 3.5, SRS behavior
 * table: 30 requests/minute/IP). Best-effort only — serverless instances
 * don't share memory, so this dampens accidents, not attacks.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
