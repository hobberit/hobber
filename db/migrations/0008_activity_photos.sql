-- Adds Storage support for photos attached to a logged activity (progress_logs.photo_url,
-- already present since 0001_init.sql but unused until now). Apply after 0007_hobby_images.sql.
-- Mirrors the avatars bucket pattern from 0003_avatars.sql.

-- Public bucket: activity photos are shown in-app (Tracker history), so read
-- access needs no auth. Writes are locked down to each user's own folder below.
insert into storage.buckets (id, name, public)
values ('activity-photos', 'activity-photos', true)
on conflict (id) do nothing;

create policy "activity photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'activity-photos');

-- Files must be uploaded under a path like "<user_id>/<filename>" for these
-- policies to scope access correctly — see src/services/activityPhotos.ts.

create policy "users can upload their own activity photos"
  on storage.objects for insert
  with check (
    bucket_id = 'activity-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can update their own activity photos"
  on storage.objects for update
  using (
    bucket_id = 'activity-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can delete their own activity photos"
  on storage.objects for delete
  using (
    bucket_id = 'activity-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
