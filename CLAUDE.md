# Nontonin: project rules

Source of truth: `PROJECT_PLAN.md` (PRD, SRS, SDD, UI/UX flow, task breakdown). Read it before any change.
If code and plan disagree, follow the plan or ask; never silently diverge.

## Stack (fixed, all free tier)
Next.js App Router, TypeScript strict, Tailwind CSS, Supabase (Auth + Postgres + RLS),
TMDB API, Vercel Hobby, GitHub Actions. Do not add paid services or new infrastructure.

UI primitives are hand-rolled in `components/ui/` (class-variance-authority + Tailwind),
not a shadcn/ui CLI install — same visual system, no extra generated files.

## Hard constraints
- Non-commercial only: no ads, payments, affiliate links.
- Never use the Netflix name, logo, or brand red. Wordmark is "Nontonin", accent `#FF6B35`.
- Content = TMDB metadata + official YouTube trailers. Never host or link copyrighted full movies.
- TMDB attribution (logo + official notice) in the footer of every page.
- TMDB token is server-only (`lib/tmdb/client.ts` imports `server-only`). Never prefix it with
  `NEXT_PUBLIC`. Never use the Supabase service-role key in app code.
- RLS enabled on every table; all mutations go through Server Actions using the user's session.
- Validate all input with Zod (`lib/validators/`) on the server. Use the exact Indonesian
  messages from the SRS.

## Language
- UI copy: Indonesian.
- Code, comments, commit messages, README, PR text: English.

## Workflow
- Work sprint by sprint in the order of `PROJECT_PLAN.md` section 5. Do not start the next
  sprint before the DoD is met.
- Commits are grouped by a coherent chunk of work (not one commit per checklist line), each
  pushed once lint/typecheck/test/build pass, using Conventional Commits (feat:, fix:, docs:,
  test:, chore:). Every feature-sized commit updates the relevant documentation in the same
  commit (README, CLAUDE.md, or inline comments) — code and docs land together.
- Before calling a chunk done: run lint, typecheck, unit tests, and build; fix all failures.
- Tick the matching checkbox in `PROJECT_PLAN.md` when a task is done.
- Ideas outside the plan go to `BACKLOG.md`, not into the code.
- Stop and ask only when blocked by something only the project owner can provide (accounts,
  keys, a product decision the plan does not answer).

## Current status
See `PROJECT_PLAN.md` section 5.2 checklists for the authoritative per-task status.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
