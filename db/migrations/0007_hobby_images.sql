-- Adds a background image to each hobby. Apply via Supabase Dashboard ->
-- SQL Editor -> New query -> Run (this project's convention -- see
-- HANDOFF.md, no Supabase CLI usage in this project).
--
-- image_url points at a real Unsplash CDN photo (images.unsplash.com),
-- one per hobby -- see db/seed/0004_hobby_images.sql for the actual URLs.
-- Used as the card background (with a gradient overlay for text legibility)
-- on the Tracker tab and the Generate/Home "accept a suggestion" cards.

alter table hobbies add column image_url text;
