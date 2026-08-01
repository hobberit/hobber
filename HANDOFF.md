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
11. `db/seed/0004_hobby_images.sql` — one real, verified, free Unsplash background photo per hobby (all 35) — used on the hobby card banner (My Hobbies tab, Generate/Home accept cards)
12. `db/seed/0005_additional_milestones.sql` — adds a `Week 2` and a `Month 9` milestone to every hobby (all 35), on top of the original Month 1/3/6/12 set — shifts existing `order_index` values via an `update`, then inserts the two new rows per hobby. `Week 2` gives an early quick-win before the first monthly checkpoint; `Month 9` bridges the old 6-to-12-month gap.
13. `db/migrations/0008_activity_photos.sql` — `activity-photos` Storage bucket + RLS, same public-read/own-folder-write pattern as `0003_avatars.sql`. Needed for the My Hobbies tab's "Add Session" photo attachment (see Key decisions).
14. `db/migrations/0009_progress_log_title.sql` — adds a nullable `title text` column to `progress_logs`. The app enforces it's filled in (client-side validation on the Log An Activity form), but it's nullable at the DB level so it doesn't break any rows logged before this migration.

All 35 hobbies now have full starter-guide depth, with 6 milestones each (Week 2 / Month 1 / 3 / 6 / 9 / 12). The original 5 **flagship hobbies** have fixed IDs, useful for direct testing:
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
| 2 — Auth + onboarding quiz | ✅ | Email/password, **6-question** quiz → `users` profile fields (trimmed from 11 — the 5 removed questions were captured but never read by the generator). Quiz UI extracted into shared `src/components/quiz-form.tsx`, reused by both the original onboarding flow and the new "Retake the quiz" entry point on the Generate screen (see Key decisions). |
| 3 — Hobby Generator | ✅ | 3 modes (Might Like / Left Field / Surprise Me), **rule-based**, not LLM. No longer its own tab — moved to a pushed screen (`generate.tsx`), reached only via the + button on My Hobbies (see Key decisions). |
| 4 — Hobby Starter Guide | ✅ | Cost, equipment, roadmap, embedded YouTube resources, milestones |
| 5 — Monthly Challenge | ⏸️ Built, disabled | Rebuilt without cron/push (see Key decisions), fully implemented on the **Home tab** — but currently hidden behind a `MONTHLY_CHALLENGE_ENABLED = false` flag in `src/app/(tabs)/index.tsx` by explicit user request ("future feature, not right now"). Nothing was deleted; flip the constant to `true` to bring it back. |
| 6 — Progression Tracker | ✅ | Logging an activity now lives on its **own screen** (`tracker/[userHobbyId]/log-activity.tsx`), reached via a "Log An Activity" button on the hobby detail page — no longer an inline form (see Key decisions). Each logged session now has a required **title**, and a **hobby switcher** lets you log against any of your active hobbies, not just the one you navigated from. Milestone achieve-toggle shown as a real checkbox instead of a text link. North Star (3-week) progress card removed from the UI by explicit user request (see Key decisions) — the underlying `countDistinctWeeksLogged` logic was removed too since nothing else used it. |
| 7 — Progression content feed | ❌ Removed | Built as a "Progression Stories" section on the My Hobbies tab (below Current Hobbies, one progression_story video per active hobby), then removed by explicit user request — see Key decisions. `listProgressionFeed`/`ProgressionFeedItem` still exist in `src/services/resources.ts` but are unused. |
| 8 — Polish/instrumentation/beta | ❌ Not started | No analytics wired up yet |
| Extra: Profile page | ✅ | Avatar upload, editable name, active hobbies, activity summary, stats chart, calendar |
| Extra: Edit/delete tracked activity | ✅ | Pencil icon on each Tracker history entry — edit duration/notes/mood or delete, with confirm step |
| Extra: Current/Finished hobbies + feedback | ✅ | My Hobbies tab splits hobbies into Current/Finished (list is now read-only — no action buttons); Finish/Resume and the "did you enjoy it?" feedback popup now live on the **hobby detail page** instead (see Key decisions). Feedback biases future `might_like`/`monthly_challenge` picks toward or away from similar hobbies. |
| Extra: Hobby card photos | ✅ | Every hobby card (My Hobbies tab, Generate/Home accept cards) shows a real background photo + gradient overlay + name, via new `HobbyCardImage` component (no category badge — removed after initial design feedback) |

The **Home** tab has Monthly Challenge (Phase 5) fully built but currently disabled (see table above) — it shows Streak + Recent Activity only right now. **Explore** is still the unmodified Expo starter template — never replaced, by explicit choice each time it came up.

## Architecture

```
src/
  app/                     Expo Router screens (file-based routing)
    (auth)/                sign-in, sign-up — shown when signed out
    (onboarding)/           quiz — shown when signed in but not onboarded
    (tabs)/                 Home (Monthly Challenge), Explore*, Tracker (labeled "My Hobbies"), Profile — 4 tabs (*=placeholder)
    generate.tsx            Hobby Generator (pushed over tabs, not a tab itself — see Key decisions)
    hobby/[id].tsx          Starter Guide detail (pushed over tabs)
    tracker/[userHobbyId]/
      index.tsx             Tracker detail — history, milestones, Finish/Resume (pushed over tabs)
      log-activity.tsx      Log An Activity — own screen, own route (see Key decisions)
    retake-quiz.tsx         Retake-the-quiz flow (pushed over tabs)
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

Routing model: `Stack.Protected` in `src/app/_layout.tsx` switches between three mutually-exclusive screen groups based on `session` + `profile.onboarding_completed_at`. `hobby/[id]` and `tracker/[userHobbyId]/index` are pushed on top of the tabs (not tabs themselves) — reachable from the Generator result card and the My Hobbies/Profile lists respectively. `tracker/[userHobbyId]/log-activity` is pushed on top of the detail screen, reached via its "Log An Activity" button.

## Key decisions (context that isn't obvious from the code)

- **No LLM/API-dependent features, by explicit user preference.** The Hobby Generator was originally going to call the Claude API for "Might Like"/"Left Field" (tool-use, structured hobby pick). The user's Anthropic account had no credit balance and they said they'd never want to pay for API credits — Claude Pro (claude.ai) subscriptions don't include API credits, they're billed separately. The generator was rebuilt as **pure rule-based scoring**: hard filters (budget/indoor-outdoor/solo-social) + soft interest-overlap scoring, entirely inside the edge function, zero ongoing cost. Keep this in mind before adding any future AI-flavored feature (Monthly Challenge, roadmap personalization, etc.) — default to heuristics, not an LLM call, unless explicitly told otherwise.
- **Deploys are dashboard-only, no Supabase CLI.** Established early (chose "Dashboard SQL Editor" over CLI) and repeated for edge functions ("Via Editor"). Every future migration/function should ship with dashboard copy-paste instructions, not CLI commands.
- **`interface` vs `type` matters for the hand-authored `Database` type** (`src/types/database.ts`). Every entity type in `src/types/*.ts` must be declared `type X = {}`, not `interface X {}`. supabase-js's generic constraints require each table's Row to structurally satisfy `Record<string, unknown>`, and TypeScript's conditional-type `extends` check doesn't grant `interface` declarations an implicit index signature the way it does `type` object literals. Get this wrong and `.insert()`/`.update()` calls silently collapse to a `never` parameter type — with no error until you actually try to pass a payload, since `never` is quietly assignable to anything on reads. Full writeup is in the comment at the top of `database.ts`.
- **Resource video URLs are real, verified, hand-picked YouTube videos** (not fabricated) for all 35 hobbies — found by web search and verified per-video (title/channel confirmed via YouTube's oEmbed endpoint, and checked for accidental YouTube Shorts). See `db/seed/0002_resource_urls_update.sql` (5 flagships) and `db/seed/0003_deepen_non_flagship_hobbies.sql` (remaining 30).
- **Monthly Challenge (Phase 5) has no cron and no push notifications, by explicit user request** — neither is testable in this dev environment anyway. Instead it's generated **lazily**: the first time a signed-in user opens the Home tab in a given calendar month, the client checks for an existing `monthly_challenges` row for that (user_id, month) and creates one on the spot if missing, via the same `generate-hobby-suggestion` edge function (new `monthly_challenge` mode, scored the same as `might_like`). This runs under the caller's own JWT like everything else in this project (see `db/migrations/0005_monthly_challenge_client_insert.sql`) — the original `0001_init.sql` comment assumed service_role/cron, which was never built. A `user_hobbies` row is only created when the user actually **Accepts** the challenge (not at generation time) — `monthly_challenges` has no `user_hobby_id` column, so regenerating via "Try Another" never leaves orphaned `suggested` rows behind the way the other 3 generator modes can.
- **"Quit" was renamed to "Finish"; quitting/finishing reuses the existing `user_hobby_status` enum rather than adding a new value.** Finish sets status to `completed` (not `paused` — an earlier iteration of this feature used `paused` before the user asked for it to become "Finish" instead); Resume sets it back to `active`. `abandoned` remains unused, still available if a distinct "gave up, not coming back" state is ever wanted. Finishing opens a feedback popup ("Did you enjoy it?") that writes `user_hobbies.feedback_enjoyed` (`db/migrations/0006_user_hobbies_feedback.sql`) via a separate call from the status change itself, so skipping the popup still leaves the hobby correctly marked finished. That feedback then biases `might_like`/`monthly_challenge` scoring in the edge function — hobbies similar to ones marked "enjoyed" (same category weighted highest, shared tags weighted lower) score higher, similar to "not really" ones score lower. `left_field` is deliberately excluded from this bias, since it's supposed to depart from taste rather than reinforce it.
- **Hobby card photos are real, verified, unique-per-hobby Unsplash images** (not fabricated, not stock placeholders shared across hobbies) — same rigor as the YouTube video sourcing: searched, filtered to exclude `plus.unsplash.com` (paid Unsplash+ photos aren't licensed for this), and verified with a `curl -I` HEAD request per URL before being written to `db/seed/0004_hobby_images.sql`. Rendered via the new shared `src/components/hobby-card-image.tsx`, which needed `expo-linear-gradient` added as a dependency (installed via `npx expo install`, so it's version-pinned to the SDK) — the dev server needs a restart after `npm install`/`expo install` adds a new native module, plain Fast Refresh won't pick it up.
- **A hobby the user is currently tracking (`active`) or has finished (`completed`) is never re-suggested, in any generator mode.** This is enforced server-side in the edge function (a `user_hobbies` query scoped to the caller, merged with the client's session-local `excludeHobbyIds`), not just client-side — it holds across app restarts and covers `monthly_challenge` too, unlike the old "Generate Another"-only exclusion which was purely local component state. If a user has active/finished every hobby in the 35-hobby catalog, all 4 modes now correctly 404 with "you're already tracking or have finished everything left."
- **"Log Progress" was renamed to "Add Session," by explicit user request — no longer call it "log progress" anywhere user-facing.** Only the UI copy and the local handler name (`handleAddSession`) changed in `src/app/tracker/[userHobbyId].tsx`; the underlying `progress_logs` table, `ProgressLog` type, and `progressLogs.ts` service keep their original names, since renaming the schema wasn't in scope. Alongside the rename, "Add Session" gained optional photo attachment: `progress_logs.photo_url` existed since `0001_init.sql` but was unused until now. Photos upload via the new `src/services/activityPhotos.ts` (`uploadActivityPhoto`, mirroring `src/services/avatar.ts`'s pattern exactly) into the new `activity-photos` Storage bucket (`db/migrations/0008_activity_photos.sql`), scoped by `<user_id>/<filename>` RLS like avatars. Available on both the initial Add Session form and when editing an existing entry.
- **The "Tracker" tab was renamed to "My Hobbies," by explicit user request.** Only the label changed (`src/app/(tabs)/_layout.tsx` and `_layout.web.tsx` trigger labels, the on-screen `<ThemedText type="title">` in `tracker.tsx`, and the Home tab's cross-reference copy) — the route segment, file name (`tracker.tsx`, `tracker/[userHobbyId].tsx`), and every internal type/service/component keep the `tracker`/`Tracker` name. Same pattern as the "Log Progress" → "Add Session" rename: user-facing wording changes, internal naming doesn't, unless told otherwise.
- **"Progression Stories" (Phase 7) was built, then removed from the My Hobbies tab by explicit user request** — it had briefly been explored as a Paper wireframe change first, but this removal is in the real app. `tracker.tsx` no longer calls `listProgressionFeed` or renders the section; `listProgressionFeed`/`ProgressionFeedItem` are left defined in `src/services/resources.ts` since deleting the service wasn't asked for, they're just unused now. If this needs to come back, the git history for `src/app/(tabs)/tracker.tsx` has the exact removed block (fetch call, JSX section, and the two styles it used: `card`, `embedWrapper`).
- **The North Star ("X of 3 weeks logged") progress card was removed from the Tracker Detail screen by explicit user request.** It lived at the top of `src/app/tracker/[userHobbyId].tsx`, above "Add Session". Removed along with it: the `weeksLogged` variable, the `countDistinctWeeksLogged` helper, the `NORTH_STAR_WEEKS_GOAL` constant, and the `northStarCard` style — all were only used by that card, so nothing was left dangling. The North Star **concept** still exists (documented in `src/types/userHobby.ts`), it's just not computed or displayed anywhere in the app right now.
- **Milestones use a real checkbox now, not a "Mark as achieved" text link,** by explicit user request. It's still one-directional (checking a milestone calls the existing `markMilestoneAchieved`; there's no "unmark" — the checkbox is simply disabled once checked) since only the visual treatment was asked for, not new toggle-off behavior.
- **"Retake the quiz" (`src/app/retake-quiz.tsx`) lets an already-onboarded user redo the onboarding quiz from the Generate screen, updating their `users` profile fields (interests, budget, time, indoor/outdoor, solo/social).** The original `(onboarding)/quiz.tsx` only mounts while `isSignedIn && !isOnboarded` (see `Stack.Protected` in `src/app/_layout.tsx`), so it isn't reachable once onboarding is done — `retake-quiz` is a separate route registered as a pushed screen in the `isSignedIn && isOnboarded` protected group instead (alongside `hobby/[id]` and `tracker/[userHobbyId]`). Both screens now share the actual quiz stepper UI via `src/components/quiz-form.tsx`; they differ only in what happens on submit — the original calls `refreshProfile()` and lets the root layout's guards route into `(tabs)` automatically, while retake calls `refreshProfile()` then `router.back()` to return to Generate. No changes were needed to make sure a retake doesn't resurface current/completed hobbies — the edge function already excludes any hobby with `user_hobbies.status` of `active` or `completed` from every generator mode, unconditionally (see the exclusion note above), so this was already covered before this feature existed.
- **Generate was removed as its own tab, by explicit user request — it's a pushed screen now (`src/app/generate.tsx`, moved out of `(tabs)/`), reachable only via the + button already on My Hobbies (`router.push("/generate")`, wired earlier).** Removed the `NativeTabs.Trigger`/`TabTrigger` entries for it from `src/app/(tabs)/_layout.tsx` and `_layout.web.tsx` — the tab bar is down to 4 tabs (Home, Explore, My Hobbies, Profile). Registered as `headerShown: true, title: "Generate"` in the root `Stack.Protected` group, same pattern as `hobby/[id]`, `tracker/[userHobbyId]`, and `retake-quiz`. Two places that said "the Generate tab" in user-facing copy (`tracker.tsx`'s and `profile.tsx`'s empty-active-hobbies messages) were reworded to point at the + button instead. One gotcha hit while making this change: moving a route file while the dev server is running can corrupt `.expo/types/router.d.ts` (the auto-generated typed-routes file) mid-write, causing `tsc` to fail with syntax errors in that file — it's not a real code issue, just delete `.expo/types/router.d.ts` and restart the dev server to regenerate it cleanly.
- **The edge function's `hobbies` query lists columns explicitly (not `select("*")`) — every future column added to `hobbies` needs to be added there too, or the generator silently returns it as `undefined`.** This bit us once already: `image_url` was added to the `hobbies` table and to every client-side `select("*")` call automatically, but the edge function's hand-written column list wasn't updated in the same pass, so Generate/Home cards fell back to the no-photo state even with the DB fully seeded. Fixed, but check this list (`supabase/functions/generate-hobby-suggestion/index.ts`, in the `hobbies` select and the `HobbyRow` interface) whenever a new hobby column needs to reach the generator's output.

- **Logging an activity moved to its own screen, by explicit user request — no longer an inline form on the Tracker detail page.** `src/app/tracker/[userHobbyId].tsx` became a folder: `index.tsx` (detail — history, milestones, Finish/Resume) plus `log-activity.tsx` (the form), reached via a "Log An Activity" button on the detail screen. The detail screen switched from `useEffect` to `useFocusEffect` so its history list refreshes when you navigate back from logging. Each session now also has a required **title** (`db/migrations/0009_progress_log_title.sql`, validated client-side like duration/date already were) and a **hobby switcher** — a bordered dropdown-style field defaulting to whichever hobby's detail page you came from, opening a modal listing all your active hobbies (`listActiveHobbies`) so you can log against a different one instead. Submission uses whichever hobby is currently selected in that picker, not necessarily the one from the route param — so "back" after logging returns to the *original* hobby's detail page, which won't show the new entry if you switched hobbies in the picker.
- **Finish/Resume moved from the My Hobbies list to the hobby detail page, by explicit user request — the list card is now read-only (photo, dates, "View Starter Guide" only).** `src/app/(tabs)/tracker.tsx` lost its inline Finish confirm-row, Resume link, and the "did you enjoy it?" feedback modal entirely; that logic (and a restyled copy of the modal) now lives in `src/app/tracker/[userHobbyId]/index.tsx`, beneath the "Log An Activity" button — a bordered red "Finish Hobby" button (outlined blue "Resume Hobby" once completed) with the same inline confirm-row pattern, then the feedback modal on success. Since finished hobbies no longer have a Resume link on the list, their cards were made tappable (matching active cards) so Resume stays reachable.
- **Monthly Challenge (Phase 5) is fully built but currently disabled, by explicit user request ("might be a future feature but not right now").** Gated behind `const MONTHLY_CHALLENGE_ENABLED = false` in `src/app/(tabs)/index.tsx` — both the `load()` fetch/create logic and the entire rendered section (title, all `state.kind` branches) are wrapped in checks against this flag. Nothing was deleted; flipping it to `true` restores the feature exactly as it was.
- **Several screens (onboarding quiz, Generate, Log An Activity, the Finish-feedback modal) were redesigned to match Paper mockups — a monochrome black/white system, not the original blue (`#3c87f7`) accent.** `src/components/quiz-form.tsx` and `src/app/generate.tsx` were fully rewritten with literal hex colors (not `ThemedText`/`ThemedView` theme tokens) to pixel-match the Paper designs regardless of device theme — this is a deliberate style split from the rest of the app, which stays theme-aware. If new screens get designed in Paper going forward, expect the same literal-color treatment when porting them to code, and expect it to keep spreading (blue buttons elsewhere are likely next in line if this direction continues).
- **The Paper file (design mockups) is an external tool, not part of this repo.** Screens designed there (My Hobbies, Track Activity, Log Activity, Generate + result state, onboarding quiz, Finish Feedback popup, and a partially-built Starter Guide screen — paused mid-build on a Paper weekly-usage cap) exist only in Paper's own storage, not as files here. There's no automated sync between Paper and the code — every port from Paper to code so far has been a manual, explicit step per screen.

## Known limitations

- **Only tested via web** (`npx expo start --web`) in an in-app browser tool with no ability to authenticate as a real user — every auth-gated feature (quiz, generator, tracker, profile) was verified by the user manually, not by this session directly. Native (iOS/Android) has never been run.
- **This dev machine's shell has a stale PATH** that doesn't include Node.js (`C:\Program Files\nodejs`) despite it being installed — every terminal command needs it prepended manually. See any recent session transcript for the exact incantation if this trips you up again.
- No automated tests exist anywhere in this project.
- No analytics/instrumentation — the North Star metric ("Successful Hobby Start": active + 3 distinct weeks logged, per `src/types/userHobby.ts`) isn't tracked as an event anywhere, and as of the Tracker Detail progress-card removal, isn't computed or shown in the UI at all anymore either.

## Suggested next steps

1. **Run `db/migrations/0009_progress_log_title.sql` against your Supabase project** if you haven't yet — logging an activity will fail with a generic error until the `title` column exists (see console for the real Postgres error, now logged).
2. Finish the Starter Guide screen in Paper — paused mid-build (header/description/cost-time/equipment done; roadmap, learning resources, and milestones sections still needed) after hitting Paper's weekly usage cap.
3. Phase 8 — polish/instrumentation/beta: no analytics wired up yet anywhere, including the North Star metric.
4. Decide whether to re-enable Monthly Challenge (`MONTHLY_CHALLENGE_ENABLED` in `src/app/(tabs)/index.tsx`) or leave it parked.
5. Consider adding an actual push notification (native builds required) once Monthly Challenge's lazy on-open generation feels too passive — not needed for the current design.
6. Replace the placeholder Explore tab with real Hobber content (Home is done).
7. Basic test coverage — there is currently none.
