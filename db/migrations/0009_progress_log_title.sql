-- Adds a user-entered title to each logged session (e.g. "Golden hour shoot"),
-- shown above the date/duration line in the Tracker history and activity feed.

alter table progress_logs
  add column title text;
