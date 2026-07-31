-- Wires public.users to Supabase Auth and locks down every table with RLS.
-- Apply after 0001_init.sql. Safe to run against a fresh project; assumes no
-- data has been written under the old (RLS-off) posture yet.

-- ─── Onboarding flag ────────────────────────────────────────────────────
-- personality_profile being non-null isn't a reliable "done" signal (partial
-- saves, future re-takes of the quiz), so track completion explicitly.

alter table users add column onboarding_completed_at timestamptz;

-- ─── Auto-create a public.users row for every new auth.users row ───────
-- Standard Supabase pattern: https://supabase.com/docs/guides/auth/managing-user-data
-- security definer so it can insert despite the caller having no RLS grant
-- on public.users yet (the row doesn't exist for them until this runs).

create function public.handle_new_auth_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ─── Row Level Security ─────────────────────────────────────────────────

-- Catalog tables: public read-only. Writes happen via service_role (admin
-- seeding/curation), which bypasses RLS entirely, so no write policies here.

alter table hobbies enable row level security;
alter table equipment_items enable row level security;
alter table roadmaps enable row level security;
alter table resources enable row level security;
alter table milestones enable row level security;

create policy "hobbies are publicly readable" on hobbies for select using (true);
create policy "equipment_items are publicly readable" on equipment_items for select using (true);
create policy "roadmaps are publicly readable" on roadmaps for select using (true);
create policy "resources are publicly readable" on resources for select using (true);
create policy "milestones are publicly readable" on milestones for select using (true);

-- users: read/update own row only. No insert policy — rows are created
-- exclusively by the handle_new_auth_user trigger above.

alter table users enable row level security;

create policy "users can read own row" on users
  for select using (auth.uid() = id);

create policy "users can update own row" on users
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_hobbies: own rows only.

alter table user_hobbies enable row level security;

create policy "users can read own user_hobbies" on user_hobbies
  for select using (auth.uid() = user_id);

create policy "users can insert own user_hobbies" on user_hobbies
  for insert with check (auth.uid() = user_id);

create policy "users can update own user_hobbies" on user_hobbies
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_milestones: scoped via the owning user_hobbies row.

alter table user_milestones enable row level security;

create policy "users can read own user_milestones" on user_milestones
  for select using (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );

create policy "users can update own user_milestones" on user_milestones
  for update using (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  ) with check (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );

-- progress_logs: scoped via the owning user_hobbies row.

alter table progress_logs enable row level security;

create policy "users can read own progress_logs" on progress_logs
  for select using (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );

create policy "users can insert own progress_logs" on progress_logs
  for insert with check (
    auth.uid() = (select user_id from user_hobbies where id = user_hobby_id)
  );

-- monthly_challenges: read own; status updates (accept/skip) come from the
-- client, the challenge itself is generated server-side via service_role.

alter table monthly_challenges enable row level security;

create policy "users can read own monthly_challenges" on monthly_challenges
  for select using (auth.uid() = user_id);

create policy "users can update own monthly_challenges" on monthly_challenges
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
