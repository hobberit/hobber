# Hobber — Handoff Doc

Last updated: 2026-07-31

## What this is

Hobber ("Bored? Just hobber it.") is a hobby-discovery app: quiz-driven
recommendations, a starter guide per hobby (cost, equipment, roadmap,
video resources), and progress tracking. Full product spec was a PRD
covering an AI Hobby Generator, Monthly Challenge, Starter Guide,
Progression Tracker, and Progression-Based Content Feed.

## Stack

- **Frontend**: Expo (React Native + Expo Router, SDK 57), TypeScript, web output via `react-native-web`
- **Backend**: Supabase — Postgres, Auth, Row Level Security, Edge Functions (Deno), Storage
- **No LLM/AI API dependency** — see "Key decisions" below

## ⚠️ Git state: no commits exist yet

This repo has **never been committed** — `git log` fails with "does not have any commits yet." Every file (the entire Expo scaffold plus everything built since) is currently sitting **staged** (`git status` shows `A`/`AM`/`AD` for essentially the whole tree) on `master`, with no history at all. Before doing any real work here — and especially before pushing anywhere or connecting a remote — make an initial commit (or a logical sequence of them) so there's an actual history to branch from and diff against. Nothing has been pushed anywhere; this has all been local-only.

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env`, fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project's **Settings → API**.
3. `npx expo start --web` (this project has only been tested via web in this session — see "Known limitations")

### Applying the database

There's no Supabase CLI usage in this project's history — everything was deployed via the **Supabase Dashboard**, copy-pasting file contents in. Run these in order, via **SQL Editor → New query → Run**, one file per query:

1. `db/migrations/0001_init.sql` — enums, tables, indexes
2. `db/migrations/0002_auth_and_rls.sql` — `auth.users` → `public.users` sync trigger, RLS policies on every table
3. `db/migrations/0003_avatars.sql` — `avatar_url` column + `avatars` Storage bucket + RLS
4. `db/seed/0001_hobbies_seed.sql` — 35-hobby catalog (7 per category), full starter-guide depth for 5 flagship hobbies
5. `db/seed/0002_resource_urls_update.sql` — replaces placeholder resource links with 20 real, verified YouTube videos for the 5 flagship hobbies
6. `db/seed/0003_deepen_non_flagship_hobbies.sql` — full starter-guide depth (equipment, roadmap, resources, milestones) for the remaining 30 hobbies, with real verified YouTube videos throughout
7. `db/migrations/0004_progress_logs_edit_delete.sql` — update/delete RLS policies for `progress_logs` (editing/deleting a tracked activity from the Tracker detail screen)
8. `db/migrations/0005_monthly_challenge_client_insert.sql` — insert RLS policy for `monthly_challenges` (Phase 5, client-generated rather than cron/service_role — see below)
9. `db/migrations/0006_user_hobbies_feedback.sql` — `feedback_enjoyed boolean` column on `user_hobbies` (Finish-a-hobby feedback, feeds the generator — see below)
10. `db/migrations/0007_hobby_images.sql` — `image_url text` column on `hobbies`
11. `db/seed/0004_hobby_images.sql` — one real, verified, free Unsplash background photo per hobby (all 35) — used on the hobby card banner (Tracker tab, Generate/Home accept cards)

All 35 hobbies now have full starter-guide depth. The original 5 **flagship hobbies** have fixed IDs, useful for direct testing:
- Photography: `10000000-0000-0000-0000-000000000001`
- Rock Climbing: `20000000-0000-0000-0000-000000000001`
- Learning to Code: `30000000-0000-0000-0000-000000000001`
- Gardening: `40000000-0000-0000-0000-000000000001`
- Cooking Classes: `50000000-0000-0000-0000-000000000001`

### Deploying the edge function

**Edge Functions → Deploy a new function → Via Editor** (not CLI), name it exactly `generate-hobby-suggestion`, paste in `supabase/functions/generate-hobby-suggestion/index.ts`. No secrets required — see below.

This function now handles a 4th mode, `monthly_challenge` (Phase 5), factors in finished-hobby feedback for `might_like`/`monthly_challenge` scoring, excludes every hobby the user is currently tracking or has finished from all 4 modes, and (as of the hobby-card-photos work) selects `image_url` on the hobby it returns (see Key decisions) — if you deployed it before any of these changes, **redeploy it** (Edge Functions → `generate-hobby-suggestion` → re-paste the updated file) or you'll either 400 on `monthly_challenge`, miss the feedback bias, see already-owned hobbies resuggested, or get a blank photo on Generate/Home cards.

## What's built (by phase)

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | ✅ | Expo Router scaffold, TS strict, path aliases |
| 1 — Hobby catalog + data layer | ✅ | 35 hobbies, `src/services/*` read layer |
| 2 — Auth + onboarding quiz | ✅ | Email/password, **6-question** quiz → `users` profile fields (trimmed from 11 — the 5 removed questions were captured but never read by the generator) |
| 3 — Hobby Generator | ✅ | 3 modes (Might Like / Left Field / Surprise Me), **rule-based**, not LLM |
| 4 — Hobby Starter Guide | ✅ | Cost, equipment, roadmap, embedded YouTube resources, milestones |
| 5 — Monthly Challenge | ✅ | Rebuilt without cron/push (see Key decisions) — lives on the **Home tab**, which this replaced |
| 6 — Progression Tracker | ✅ | Log sessions, milestone achieve-toggle, North Star (3-week) progress |
| 7 — Progression content feed | ✅ | "Progression Stories" section on the Tracker tab, below Current Hobbies — one progression_story video per active hobby |
| 8 — Polish/instrumentation/beta | ❌ Not started | No analytics wired up yet |
| Extra: Profile page | ✅ | Avatar upload, editable name, active hobbies, activity summary, stats chart, calendar |
| Extra: Edit/delete tracked activity | ✅ | Pencil icon on each Tracker history entry — edit duration/notes/mood or delete, with confirm step |
| Extra: Current/Finished hobbies + feedback | ✅ | Tracker tab splits hobbies into Current/Finished; Finish prompts a "did you enjoy it?" popup that biases future `might_like`/`monthly_challenge` picks toward or away from similar hobbies |
| Extra: Hobby card photos | ✅ | Every hobby card (Tracker tab, Generate/Home accept cards) shows a real background photo + gradient overlay + name, via new `HobbyCardImage` component (no category badge — removed after initial design feedback) |

The **Home** tab now shows the Monthly Challenge (Phase 5). **Explore** is still the unmodified Expo starter template — never replaced, by explicit choice each time it came up.

## Architecture

```
src/
  app/                     Expo Router screens (file-based routing)
    (auth)/                sign-in, sign-up — shown when signed out
    (onboarding)/           quiz — shown when signed in but not onboarded
    (tabs)/                 Home (Monthly Challenge), Explore*, Generate, Tracker, Profile (*=placeholder)
    hobby/[id].tsx          Starter Guide detail (pushed over tabs)
    tracker/[userHobbyId].tsx   Tracker detail (pushed over tabs)
    _layout.tsx             root Stack.Protected auth/onboarding/app gating
  components/               shared UI (themed-*, youtube-embed, activity-calendar, duration-bar-chart, profile-header, hobby-card-image)
  services/                 all Supabase reads/writes, one file per concern, barrel-exported from index.ts
  types/                    hand-authored types mirroring the DB (see gotcha below), enums.ts kept in sync with Postgres enums
  features/
    auth/AuthProvider.tsx   session + profile context, used via useAuth()
    onboarding/quizConfig.ts   quiz question definitions
  lib/                      supabase client, date helpers, youtube URL parsing
db/
  migrations/               schema, in numbered order
  seed/                     catalog + resource content
supabase/functions/         edge functions (Deno)
```

Routing model: `Stack.Protected` in `src/app/_layout.tsx` switches between three mutually-exclusive screen groups based on `session` + `profile.onboarding_completed_at`. `hobby/[id]` and `tracker/[userHobbyId]` are pushed on top of the tabs (not tabs themselves) — reachable from the Generator result card and the Tracker/Profile lists respectively.

## Key decisions (context that isn't obvious from the code)

- **No LLM/API-dependent features, by explicit user preference.** The Hobby Generator was originally going to call the Claude API for "Might Like"/"Left Field" (tool-use, structured hobby pick). The user's Anthropic account had no credit balance and they said they'd never want to pay for API credits — Claude Pro (claude.ai) subscriptions don't include API credits, they're billed separately. The generator was rebuilt as **pure rule-based scoring**: hard filters (budget/indoor-outdoor/solo-social) + soft interest-overlap scoring, entirely inside the edge function, zero ongoing cost. Keep this in mind before adding any future AI-flavored feature (Monthly Challenge, roadmap personalization, etc.) — default to heuristics, not an LLM call, unless explicitly told otherwise.
- **Deploys are dashboard-only, no Supabase CLI.** Established early (chose "Dashboard SQL Editor" over CLI) and repeated for edge functions ("Via Editor"). Every future migration/function should ship with dashboard copy-paste instructions, not CLI commands.
- **`interface` vs `type` matters for the hand-authored `Database` type** (`src/types/database.ts`). Every entity type in `src/types/*.ts` must be declared `type X = {}`, not `interface X {}`. supabase-js's generic constraints require each table's Row to structurally satisfy `Record<string, unknown>`, and TypeScript's conditional-type `extends` check doesn't grant `interface` declarations an implicit index signature the way it does `type` object literals. Get this wrong and `.insert()`/`.update()` calls silently collapse to a `never` parameter type — with no error until you actually try to pass a payload, since `never` is quietly assignable to anything on reads. Full writeup is in the comment at the top of `database.ts`.
- **Resource video URLs are real, verified, hand-picked YouTube videos** (not fabricated) for all 35 hobbies — found by web search and verified per-video (title/channel confirmed via YouTube's oEmbed endpoint, and checked for accidental YouTube Shorts). See `db/seed/0002_resource_urls_update.sql` (5 flagships) and `db/seed/0003_deepen_non_flagship_hobbies.sql` (remaining 30).
- **Monthly Challenge (Phase 5) has no cron and no push notifications, by explicit user request** — neither is testable in this dev environment anyway. Instead it's generated **lazily**: the first time a signed-in user opens the Home tab in a given calendar month, the client checks for an existing `monthly_challenges` row for that (user_id, month) and creates one on the spot if missing, via the same `generate-hobby-suggestion` edge function (new `monthly_challenge` mode, scored the same as `might_like`). This runs under the caller's own JWT like everything else in this project (see `db/migrations/0005_monthly_challenge_client_insert.sql`) — the original `0001_init.sql` comment assumed service_role/cron, which was never built. A `user_hobbies` row is only created when the user actually **Accepts** the challenge (not at generation time) — `monthly_challenges` has no `user_hobby_id` column, so regenerating via "Try Another" never leaves orphaned `suggested` rows behind the way the other 3 generator modes can.
- **"Quit" was renamed to "Finish"; quitting/finishing reuses the existing `user_hobby_status` enum rather than adding a new value.** Finish sets status to `completed` (not `paused` — an earlier iteration of this feature used `paused` before the user asked for it to become "Finish" instead); Resume sets it back to `active`. `abandoned` remains unused, still available if a distinct "gave up, not coming back" state is ever wanted. Finishing opens a feedback popup ("Did you enjoy it?") that writes `user_hobbies.feedback_enjoyed` (`db/migrations/0006_user_hobbies_feedback.sql`) via a separate call from the status change itself, so skipping the popup still leaves the hobby correctly marked finished. That feedback then biases `might_like`/`monthly_challenge` scoring in the edge function — hobbies similar to ones marked "enjoyed" (same category weighted highest, shared tags weighted lower) score higher, similar to "not really" ones score lower. `left_field` is deliberately excluded from this bias, since it's supposed to depart from taste rather than reinforce it.
- **Hobby card photos are real, verified, unique-per-hobby Unsplash images** (not fabricated, not stock placeholders shared across hobbies) — same rigor as the YouTube video sourcing: searched, filtered to exclude `plus.unsplash.com` (paid Unsplash+ photos aren't licensed for this), and verified with a `curl -I` HEAD request per URL before being written to `db/seed/0004_hobby_images.sql`. Rendered via the new shared `src/components/hobby-card-image.tsx`, which needed `expo-linear-gradient` added as a dependency (installed via `npx expo install`, so it's version-pinned to the SDK) — the dev server needs a restart after `npm install`/`expo install` adds a new native module, plain Fast Refresh won't pick it up.
- **A hobby the user is currently tracking (`active`) or has finished (`completed`) is never re-suggested, in any generator mode.** This is enforced server-side in the edge function (a `user_hobbies` query scoped to the caller, merged with the client's session-local `excludeHobbyIds`), not just client-side — it holds across app restarts and covers `monthly_challenge` too, unlike the old "Generate Another"-only exclusion which was purely local component state. If a user has active/finished every hobby in the 35-hobby catalog, all 4 modes now correctly 404 with "you're already tracking or have finished everything left."
- **The edge function's `hobbies` query lists columns explicitly (not `select("*")`) — every future column added to `hobbies` needs to be added there too, or the generator silently returns it as `undefined`.** This bit us once already: `image_url` was added to the `hobbies` table and to every client-side `select("*")` call automatically, but the edge function's hand-written column list wasn't updated in the same pass, so Generate/Home cards fell back to the no-photo state even with the DB fully seeded. Fixed, but check this list (`supabase/functions/generate-hobby-suggestion/index.ts`, in the `hobbies` select and the `HobbyRow` interface) whenever a new hobby column needs to reach the generator's output.

## Known limitations

- **Only tested via web** (`npx expo start --web`) in an in-app browser tool with no ability to authenticate as a real user — every auth-gated feature (quiz, generator, tracker, profile) was verified by the user manually, not by this session directly. Native (iOS/Android) has never been run.
- **This dev machine's shell has a stale PATH** that doesn't include Node.js (`C:\Program Files\nodejs`) despite it being installed — every terminal command needs it prepended manually. See any recent session transcript for the exact incantation if this trips you up again.
- No automated tests exist anywhere in this project.
- No analytics/instrumentation — the North Star metric ("Successful Hobby Start": active + 3 distinct weeks logged) is computed ad hoc in the Tracker UI, not tracked as an event anywhere.

## Suggested next steps

1. **Make an initial commit** — see the git-state warning above. This should happen before anything else.
2. Phase 8 — polish/instrumentation/beta: no analytics wired up yet anywhere, including the North Star metric.
3. Consider adding an actual push notification (native builds required) once Monthly Challenge's lazy on-open generation feels too passive — not needed for the current design.
4. Replace the placeholder Explore tab with real Hobber content (Home is done).
5. Basic test coverage — there is currently none.
