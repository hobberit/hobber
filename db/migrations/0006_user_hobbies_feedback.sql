-- Adds a feedback column to user_hobbies. Apply via Supabase Dashboard ->
-- SQL Editor -> New query -> Run (this project's convention -- see
-- HANDOFF.md, no Supabase CLI usage in this project).
--
-- "Quit" was renamed to "Finish" -- finishing a hobby now prompts the user
-- to say whether they enjoyed it. That answer biases how often similar
-- hobbies (same category, overlapping tags) get suggested by the
-- "might_like" and "monthly_challenge" generator modes going forward --
-- see supabase/functions/generate-hobby-suggestion/index.ts.

alter table user_hobbies add column feedback_enjoyed boolean;
