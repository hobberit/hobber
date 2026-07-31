-- Adds an insert RLS policy for monthly_challenges. Apply via Supabase
-- Dashboard -> SQL Editor -> New query -> Run (this project's convention --
-- see HANDOFF.md, no Supabase CLI usage in this project).
--
-- 0001_init.sql's comment assumed the monthly challenge row would be
-- generated server-side via service_role on a cron schedule. Phase 5 was
-- rebuilt without cron or push notifications (neither testable in this dev
-- environment) -- instead, the client lazily creates this month's challenge
-- the first time the signed-in user opens the Home tab in a given month,
-- same as every other write in this project: under the caller's own JWT,
-- subject to RLS.

create policy "users can insert own monthly_challenges" on monthly_challenges
  for insert with check (auth.uid() = user_id);
