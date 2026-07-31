-- Hobber initial schema.
-- Apply with `supabase db push` (Supabase CLI) or `psql -f 0001_init.sql`.
-- Assumes a Supabase project: public.users.id references auth.users(id).
-- If not using Supabase Auth, drop that FK and add password/auth columns instead.

create extension if not exists pgcrypto;

-- ─── Enums ──────────────────────────────────────────────────────────────
-- Keep in sync with src/types/enums.ts

create type hobby_category as enum ('creative', 'physical', 'technical', 'outdoor', 'social');
create type cost_tier as enum ('free', 'low', 'medium', 'high');
create type indoor_outdoor as enum ('indoor', 'outdoor', 'both');
create type solo_social as enum ('solo', 'social', 'both');
create type skill_level as enum ('beginner', 'intermediate', 'advanced');
create type resource_type as enum ('video', 'article', 'product_link');
create type resource_category as enum ('first_30_minutes', 'first_week', 'beginner_mistakes', 'progression_story');
create type user_hobby_status as enum (
  'suggested', 'accepted', 'skipped', 'saved_for_later',
  'active', 'paused', 'completed', 'abandoned'
);
create type source_mode as enum ('might_like', 'left_field', 'surprise_me', 'monthly_challenge');
create type monthly_challenge_status as enum ('pending', 'accepted', 'skipped', 'generated_another');

-- ─── updated_at helper ──────────────────────────────────────────────────

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── users ──────────────────────────────────────────────────────────────

create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  auth_provider text not null default 'email',
  personality_profile jsonb,
  budget_range jsonb,                    -- { "min": number, "max": number }
  indoor_outdoor_pref indoor_outdoor,
  solo_social_pref solo_social,
  skill_level skill_level,
  free_time_hrs_week numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
  before update on users
  for each row execute function set_updated_at();

-- ─── hobbies (master catalog) ───────────────────────────────────────────

create table hobbies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category hobby_category not null,
  description text not null,
  indoor_outdoor indoor_outdoor not null,
  solo_social solo_social not null,
  cost_tier cost_tier not null,
  cost_min numeric not null default 0,
  cost_max numeric not null default 0,
  time_beginner_hrs_week numeric not null,
  time_intermediate_hrs_week numeric not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  constraint hobbies_cost_range_valid check (cost_max >= cost_min)
);

create index hobbies_category_idx on hobbies (category);

-- ─── equipment_items ────────────────────────────────────────────────────

create table equipment_items (
  id uuid primary key default gen_random_uuid(),
  hobby_id uuid not null references hobbies (id) on delete cascade,
  name text not null,
  is_essential boolean not null default true,
  cost_min numeric not null default 0,
  cost_max numeric not null default 0,
  product_link text,
  alt_note text
);

create index equipment_items_hobby_id_idx on equipment_items (hobby_id);

-- ─── roadmaps (4-week starter plan template, per hobby) ────────────────

create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  hobby_id uuid not null references hobbies (id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 4),
  title text not null,
  description text not null,
  goals jsonb not null default '[]',
  unique (hobby_id, week_number)
);

create index roadmaps_hobby_id_idx on roadmaps (hobby_id);

-- ─── resources ──────────────────────────────────────────────────────────

create table resources (
  id uuid primary key default gen_random_uuid(),
  hobby_id uuid not null references hobbies (id) on delete cascade,
  type resource_type not null,
  category resource_category not null,
  title text not null,
  url text not null,
  source text,
  thumbnail_url text,
  duration_seconds integer
);

create index resources_hobby_id_idx on resources (hobby_id);
create index resources_hobby_category_idx on resources (hobby_id, category);

-- ─── milestones (template, per hobby) ───────────────────────────────────

create table milestones (
  id uuid primary key default gen_random_uuid(),
  hobby_id uuid not null references hobbies (id) on delete cascade,
  title text not null,
  description text not null,
  typical_timeframe text not null,
  order_index smallint not null default 0
);

create index milestones_hobby_id_idx on milestones (hobby_id);

-- ─── user_hobbies (core enrollment/tracking entity) ─────────────────────

create table user_hobbies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  hobby_id uuid not null references hobbies (id) on delete cascade,
  status user_hobby_status not null default 'suggested',
  source_mode source_mode not null,
  current_week smallint,
  started_at timestamptz,
  last_logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_hobbies_user_id_idx on user_hobbies (user_id);
create index user_hobbies_hobby_id_idx on user_hobbies (hobby_id);
create index user_hobbies_user_status_idx on user_hobbies (user_id, status);

create trigger user_hobbies_set_updated_at
  before update on user_hobbies
  for each row execute function set_updated_at();

-- ─── user_milestones ─────────────────────────────────────────────────────

create table user_milestones (
  id uuid primary key default gen_random_uuid(),
  user_hobby_id uuid not null references user_hobbies (id) on delete cascade,
  milestone_id uuid not null references milestones (id) on delete cascade,
  achieved_at timestamptz,
  unique (user_hobby_id, milestone_id)
);

create index user_milestones_user_hobby_id_idx on user_milestones (user_hobby_id);

-- ─── progress_logs ───────────────────────────────────────────────────────

create table progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_hobby_id uuid not null references user_hobbies (id) on delete cascade,
  log_date date not null,
  duration_minutes integer not null check (duration_minutes > 0),
  notes text,
  mood_rating smallint check (mood_rating between 1 and 5),
  photo_url text,
  created_at timestamptz not null default now()
);

create index progress_logs_user_hobby_id_idx on progress_logs (user_hobby_id);
create index progress_logs_user_hobby_date_idx on progress_logs (user_hobby_id, log_date);

-- ─── monthly_challenges ──────────────────────────────────────────────────

create table monthly_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  hobby_id uuid not null references hobbies (id) on delete cascade,
  month date not null,
  status monthly_challenge_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

create index monthly_challenges_user_id_idx on monthly_challenges (user_id);
