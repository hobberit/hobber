-- Adds update/delete RLS policies for progress_logs. Apply via Supabase
-- Dashboard -> SQL Editor -> New query -> Run (this project's convention --
-- see HANDOFF.md, no Supabase CLI usage in this project).
--
-- 0002_auth_and_rls.sql only granted select + insert on progress_logs.
-- This adds update + delete, scoped the same way (via the owning
-- user_hobbies row), so users can edit or remove their own logged
-- activities from the Tracker.

create policy "users can update own progress_logs" on progress_logs
  for update using (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );

create policy "users can delete own progress_logs" on progress_logs
  for delete using (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );
