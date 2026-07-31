-- Adds profile picture support: a column on users plus a Storage bucket to
-- hold the images. Apply after 0002_auth_and_rls.sql.

alter table users add column avatar_url text;

-- Public bucket: avatar images are meant to be viewable by anyone (they're
-- shown in-app), so read access needs no auth. Writes are still locked down
-- below to each user's own folder.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Files must be uploaded under a path like "<user_id>/<filename>" for these
-- policies to scope access correctly — see src/services/avatar.ts.

create policy "users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
