# Claude Code Prompt Kit: Nontonin

Everything you need to drive Claude Code through the whole build. Order of use:

1. Do the **manual account setup** (section 1). Claude Code cannot create accounts for you.
2. Put `PROJECT_PLAN.md` in the repo root and save the **CLAUDE.md** from section 2 next to it.
3. Open Claude Code in the repo and paste the **Master Prompt** (section 3).
4. After each sprint, paste the matching **Sprint Prompt** (section 4).
5. Use the **Finishing Prompts** (section 5) for the README and GitHub metadata.

---

## 1. Manual setup (you do this once)

| Step | What to do | Result |
| --- | --- | --- |
| 1 | Create a **public** GitHub repo named `nontonin` | Repo URL |
| 2 | Sign up at themoviedb.org, verify your email, open Settings > API, copy the **API Read Access Token** | `TMDB_READ_TOKEN` |
| 3 | Create a Supabase project (Free plan). In Auth settings, turn **off** email confirmation. Copy the project URL and anon key from Project Settings > API | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 4 | Import the GitHub repo into Vercel (Hobby plan) and add the same four variables | Live URL |
| 5 | In GitHub repo settings > Secrets, add `SITE_URL` with your Vercel URL | Keep-alive workflow works |

Local `.env.local` (never commit it; commit `.env.example` with empty values):

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TMDB_READ_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 2. CLAUDE.md (save in the repo root)

```text
# Nontonin: project rules

Source of truth: PROJECT_PLAN.md (PRD, SRS, SDD, UI/UX flow, task breakdown). Read it before any change.
If code and plan disagree, follow the plan or ask; never silently diverge.

## Stack (fixed, all free tier)
Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Supabase (Auth + Postgres + RLS),
TMDB API, Vercel Hobby, GitHub Actions. Do not add paid services or new infrastructure.

## Hard constraints
- Non-commercial only: no ads, payments, affiliate links.
- Never use the Netflix name, logo, or brand red. Wordmark is "Nontonin", accent #FF6B35.
- Content = TMDB metadata + official YouTube trailers. Never host or link copyrighted full movies.
- TMDB attribution (logo + official notice) in the footer of every page.
- TMDB token is server-only. Never prefix it with NEXT_PUBLIC. Never use the Supabase service-role key in app code.
- RLS enabled on every table; all mutations go through Server Actions using the user's session.
- Validate all input with Zod on the server. Use the exact Indonesian messages from the SRS.

## Language
- UI copy: Indonesian.
- Code, comments, commit messages, README, PR text: English.

## Workflow
- Work sprint by sprint in the order of PROJECT_PLAN.md section 5. Do not start the next sprint before the DoD is met.
- One task = one branch = one focused commit set. Conventional Commits (feat:, fix:, docs:, test:, chore:).
- Before calling a task done: run lint, typecheck, unit tests, and build; fix all failures.
- Tick the matching checkbox in PROJECT_PLAN.md when a task is done.
- Ideas outside the plan go to BACKLOG.md, not into the code.
- Stop and ask only when blocked by something only I can provide (accounts, keys, a product decision the plan does not answer).
```

---

## 3. Master Prompt (paste this first)

```text
You are the lead engineer building "Nontonin", a Netflix-style streaming web app for my portfolio.

Read PROJECT_PLAN.md completely before writing any code. It contains the PRD, SRS, SDD, UI/UX flow, and the sprint task breakdown, and it is the source of truth. Also read CLAUDE.md for the project rules.

Goal: a polished, deployed app that a recruiter can explore in 2 minutes without signing up, built entirely on free tiers (Next.js, TypeScript, Tailwind, shadcn/ui, Supabase, TMDB, Vercel Hobby, GitHub Actions).

How I want you to work:
1. Execute the plan sprint by sprint, starting with Sprint 0. Do not jump ahead.
2. At the start of each sprint, create a task list from that sprint's checklist in PROJECT_PLAN.md. Work through it in order.
3. Follow the SRS exactly: validation rules, error messages (Indonesian), behaviors, and acceptance criteria AC1 to AC7. Follow the SDD exactly: folder structure, database schema and RLS, Server Actions and route handlers, caching decisions.
4. Follow the UI/UX document for screens, states, design tokens, and accessibility rules. Every screen needs its loading, empty, and error states.
5. Whenever a step needs something only I can do (creating the Supabase project, TMDB token, Vercel import, GitHub secrets), stop and give me the exact steps and the exact variable names, then continue once I confirm.
6. After each task, run lint, typecheck, unit tests, and build. Fix failures before moving on. Commit with Conventional Commits and tick the checkbox in PROJECT_PLAN.md.
7. At the end of each sprint, give me: what was built, how to verify it (commands and URLs), which acceptance criteria now pass, and any open question. Then wait for me to say "next sprint".

Non-negotiables: stay on free tiers and non-commercial use, never use Netflix branding, use only TMDB data and official YouTube trailers, keep the TMDB token server-side, enable RLS on every table, and write all code, comments, and commits in English while UI copy stays Indonesian.

Begin now with Sprint 0 (tasks T0.1 to T0.5). Before writing code, summarize in 5 bullets what you understood about the project and list any assumption you are about to make.
```

---

## 4. Sprint Prompts (paste one per sprint, after the previous one is done)

### Sprint 0: Setup

```text
Execute Sprint 0 from PROJECT_PLAN.md (T0.1 to T0.5).
Scaffold Next.js (TypeScript, Tailwind, App Router, ESLint), install shadcn/ui, set up fonts and the design tokens from the UI/UX section, implement lib/tmdb (typed client, mappers, trailer picker) with unit tests, add the Supabase migration 0001_init.sql and @supabase/ssr with middleware.ts, add the CI workflow, and commit .env.example.
Stop and ask me for the Supabase and TMDB credentials when you need them.
Definition of done: pnpm lint, typecheck, test, and build all pass; CI is green; the app is deployable to Vercel.
```

### Sprint 1: Browse

```text
Execute Sprint 1 (T1.1 to T1.6).
Build navbar, TMDB-attribution footer, TitleCard, Row (horizontal scroll with arrows and swipe), Hero billboard, the /browse page with at least 6 rows using Suspense, skeletons and a per-row error state with a retry button, and the landing page.
Use TMDB CDN image sizes through next/image with unoptimized, and the revalidation times from the SDD.
Definition of done: acceptance criteria AC1 and AC7 pass; layout works from 360px to 1280px.
```

### Sprint 2: Detail and Search

```text
Execute Sprint 2 (T2.1 to T2.5).
Build the title detail page with ISR and Open Graph metadata, the detail modal using parallel and intercepting routes, the TrailerModal (YouTube embed, official trailer first, disabled state when missing, focus trap, Esc to close), /api/search with validation and the simple in-memory rate limit, the search page (400 ms debounce, load more, empty states), and the 404 and error pages.
Definition of done: acceptance criteria AC2 and AC3 pass.
```

### Sprint 3: Auth and Profiles

```text
Execute Sprint 3 (T3.1 to T3.6).
Implement register, login, and logout with Zod validation and the exact Indonesian messages, route guards with a safe returnTo, the /profiles page with create, update, delete, and select-profile Server Actions, the unique-name and 5-profile rules, the kids profile genre filter, and integration tests that prove RLS isolates users.
Definition of done: acceptance criteria AC5 and AC6 pass.
```

### Sprint 4: My List, History, Reactions

```text
Execute Sprint 4 (T4.1 to T4.5).
Implement toggleMyList with optimistic UI and rollback, the /my-list page, recordView with pruning to the latest 50 and the "Baru dilihat" row, setReaction with aria-pressed buttons, and the guest flow: click List, log in, return to the same title with the item saved.
Definition of done: AC4 passes and all 8 Must features work on the production URL. Deploy to Vercel and give me the URL.
```

### Sprint 5: Polish and Release

```text
Execute Sprint 5 (T5.1 to T5.5).
Add /api/health calling the ping() database function and the keepalive GitHub Actions workflow, Playwright E2E tests for the 3 main flows, run Lighthouse and fix issues until Performance, Accessibility, Best Practices, and SEO are all 90 or higher on mobile, add security headers with a CSP that allows YouTube embeds and image.tmdb.org, add sitemap and robots, and write the README.
Definition of done: every metric in PROJECT_PLAN.md section 1.6 is met; report the actual Lighthouse scores.
```

### Sprint 6: Stretch (one feature at a time)

```text
Implement stretch feature <F11 | F13 | F14 | F15 | F16 | F17> from PROJECT_PLAN.md section 1.4 only.
Keep it within free tiers and the project constraints in CLAUDE.md. Add tests, update the README feature list, and do not touch unrelated code.
```

---

## 5. Finishing Prompts

### README

```text
Write the README.md in English for a recruiter audience: one-line pitch, live demo link, screenshot and demo GIF placeholders, feature list, tech stack with a short reason for each choice, the architecture diagram (Mermaid, from PROJECT_PLAN.md section 3.1), how RLS and auth work, how to run locally (prerequisites, env variables, commands), the free-tier deployment notes including the Supabase keep-alive, the TMDB attribution notice, and a short "What I learned" section. Keep it skimmable.
```

### GitHub metadata

```text
Set the repository description, website URL, and topics using the values in section 6 of CLAUDE_CODE_PROMPT.md. Show me the exact gh CLI commands before running them.
```

---

## 6. GitHub repository metadata

**Repository name:** `nontonin`

**Title (README heading / social preview):** Nontonin: Netflix-style streaming web app

**Description (under 350 characters):**

```text
A Netflix-style streaming web app built with Next.js, TypeScript, Supabase, and the TMDB API, featuring multi-profile accounts, My List, watch history, and trailer playback secured with row-level security. Runs entirely on free tiers.
```

**Topics:** `nextjs` `typescript` `supabase` `tmdb-api` `tailwindcss` `shadcn-ui` `streaming` `netflix-clone` `postgres` `row-level-security` `vercel` `portfolio-project`

**Website:** your Vercel URL
