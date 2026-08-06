-- Removes the mood feature entirely — the app no longer collects or shows it.
-- Irreversible: any previously logged mood_rating values are permanently deleted.

alter table progress_logs
  drop column mood_rating;
