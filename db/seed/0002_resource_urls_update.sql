-- Replaces the placeholder YouTube search-link resources from
-- 0001_hobbies_seed.sql with real, verified videos for the 5 flagship
-- hobbies. Run after 0001_hobbies_seed.sql (SQL Editor -> New query -> Run).
--
-- Each flagship hobby has exactly one resource per category, so
-- (hobby_id, category) is a reliable match key even though resources.id
-- was never captured from the original insert.
--
-- thumbnail_url uses YouTube's standard predictable thumbnail path
-- (img.youtube.com/vi/<video_id>/hqdefault.jpg) — no scraping needed.

-- ─── Photography (10000000-0000-0000-0000-000000000001) ────────────────

update resources set
  title = 'PHOTOGRAPHY BASICS in 10 MINUTES',
  url = 'https://www.youtube.com/watch?v=V7z7BAZdt2M',
  source = 'David Manning',
  thumbnail_url = 'https://img.youtube.com/vi/V7z7BAZdt2M/hqdefault.jpg',
  duration_seconds = 670
where hobby_id = '10000000-0000-0000-0000-000000000001' and category = 'first_30_minutes';

update resources set
  title = '7-Day Photography Challenge: Developing Your Photography Vision',
  url = 'https://www.youtube.com/watch?v=6oNO5gr-UUg',
  source = 'Photography with Andrew Baker',
  thumbnail_url = 'https://img.youtube.com/vi/6oNO5gr-UUg/hqdefault.jpg',
  duration_seconds = 623
where hobby_id = '10000000-0000-0000-0000-000000000001' and category = 'first_week';

update resources set
  title = 'Top 5 BEGINNER PHOTOGRAPHY MISTAKES (and yes I made them all!)',
  url = 'https://www.youtube.com/watch?v=U5dKJibNVSA',
  source = 'Simon d''Entremont',
  thumbnail_url = 'https://img.youtube.com/vi/U5dKJibNVSA/hqdefault.jpg',
  duration_seconds = 617
where hobby_id = '10000000-0000-0000-0000-000000000001' and category = 'beginner_mistakes';

update resources set
  title = '1 Year of Progression in Photography',
  url = 'https://www.youtube.com/watch?v=4f9dbxEaNeQ',
  source = 'JMontage',
  thumbnail_url = 'https://img.youtube.com/vi/4f9dbxEaNeQ/hqdefault.jpg',
  duration_seconds = 304
where hobby_id = '10000000-0000-0000-0000-000000000001' and category = 'progression_story';

-- ─── Rock Climbing (20000000-0000-0000-0000-000000000001) ──────────────

update resources set
  title = 'Just Started Climbing? Watch This - Indoor Climbing for Beginners',
  url = 'https://www.youtube.com/watch?v=S-4XZgARAuA',
  source = 'Send Edition',
  thumbnail_url = 'https://img.youtube.com/vi/S-4XZgARAuA/hqdefault.jpg',
  duration_seconds = 698
where hobby_id = '20000000-0000-0000-0000-000000000001' and category = 'first_30_minutes';

update resources set
  title = 'What to Expect in Your First Year of Climbing',
  url = 'https://www.youtube.com/watch?v=o2336vfQBhM',
  source = 'Climbing Stuff',
  thumbnail_url = 'https://img.youtube.com/vi/o2336vfQBhM/hqdefault.jpg',
  duration_seconds = 764
where hobby_id = '20000000-0000-0000-0000-000000000001' and category = 'first_week';

update resources set
  title = 'Your Biggest Climbing Mistakes FIXED - V0-V4',
  url = 'https://www.youtube.com/watch?v=zxW-b2pFu5U',
  source = 'Lattice Training',
  thumbnail_url = 'https://img.youtube.com/vi/zxW-b2pFu5U/hqdefault.jpg',
  duration_seconds = 327
where hobby_id = '20000000-0000-0000-0000-000000000001' and category = 'beginner_mistakes';

update resources set
  title = 'What 1-Year Bouldering Progression Looks Like (From Beginner)',
  url = 'https://www.youtube.com/watch?v=fb8mWIhPIqU',
  source = 'Justin Ly',
  thumbnail_url = 'https://img.youtube.com/vi/fb8mWIhPIqU/hqdefault.jpg',
  duration_seconds = 563
where hobby_id = '20000000-0000-0000-0000-000000000001' and category = 'progression_story';

-- ─── Learning to Code (30000000-0000-0000-0000-000000000001) ───────────

update resources set
  title = 'Learn Python in Only 30 Minutes (Beginner Tutorial)',
  url = 'https://www.youtube.com/watch?v=Ro_MScTDfU4',
  source = 'Indently',
  thumbnail_url = 'https://img.youtube.com/vi/Ro_MScTDfU4/hqdefault.jpg',
  duration_seconds = 1800
where hobby_id = '30000000-0000-0000-0000-000000000001' and category = 'first_30_minutes';

update resources set
  title = 'How to Learn to Code - 8 Hard Truths',
  url = 'https://www.youtube.com/watch?v=NtfbWkxJTHw',
  source = 'Fireship',
  thumbnail_url = 'https://img.youtube.com/vi/NtfbWkxJTHw/hqdefault.jpg',
  duration_seconds = 406
where hobby_id = '30000000-0000-0000-0000-000000000001' and category = 'first_week';

update resources set
  title = '5 Beginner Coding Mistakes You Must Avoid',
  url = 'https://www.youtube.com/watch?v=_GRGyWbk6M0',
  source = 'The Code Zone Skool',
  thumbnail_url = 'https://img.youtube.com/vi/_GRGyWbk6M0/hqdefault.jpg',
  duration_seconds = 221
where hobby_id = '30000000-0000-0000-0000-000000000001' and category = 'beginner_mistakes';

update resources set
  title = 'I Spent 6 Months Learning To Code',
  url = 'https://www.youtube.com/watch?v=0CSIybqN86E',
  source = 'Chris Howett',
  thumbnail_url = 'https://img.youtube.com/vi/0CSIybqN86E/hqdefault.jpg',
  duration_seconds = 293
where hobby_id = '30000000-0000-0000-0000-000000000001' and category = 'progression_story';

-- ─── Gardening (40000000-0000-0000-0000-000000000001) ──────────────────

update resources set
  title = 'Gardening for Beginners Series: Gardening Basics for Beginners',
  url = 'https://www.youtube.com/watch?v=BO8yuSTc3fo',
  source = 'Dig, Plant, Water, Repeat',
  thumbnail_url = 'https://img.youtube.com/vi/BO8yuSTc3fo/hqdefault.jpg',
  duration_seconds = 660
where hobby_id = '40000000-0000-0000-0000-000000000001' and category = 'first_30_minutes';

update resources set
  title = 'Absolute Beginner''s Guide to Starting a Vegetable Garden',
  url = 'https://www.youtube.com/watch?v=1y_9ofkSNoY',
  source = 'Black Gumbo',
  thumbnail_url = 'https://img.youtube.com/vi/1y_9ofkSNoY/hqdefault.jpg',
  duration_seconds = 1380
where hobby_id = '40000000-0000-0000-0000-000000000001' and category = 'first_week';

update resources set
  title = '9 Beginner Gardening Mistakes to Avoid',
  url = 'https://www.youtube.com/watch?v=pLQuIuokP6Q',
  source = 'Epic Gardening',
  thumbnail_url = 'https://img.youtube.com/vi/pLQuIuokP6Q/hqdefault.jpg',
  duration_seconds = 811
where hobby_id = '40000000-0000-0000-0000-000000000001' and category = 'beginner_mistakes';

update resources set
  title = '1 Year of Growing Food - A Whole Season of Vegetable Gardening',
  url = 'https://www.youtube.com/watch?v=koHEvJL1OKI',
  source = 'Just Alex',
  thumbnail_url = 'https://img.youtube.com/vi/koHEvJL1OKI/hqdefault.jpg',
  duration_seconds = 6480
where hobby_id = '40000000-0000-0000-0000-000000000001' and category = 'progression_story';

-- ─── Cooking Classes (50000000-0000-0000-0000-000000000001) ────────────

update resources set
  title = 'Cooking Tips For Kitchen Beginners | Epicurious 101',
  url = 'https://www.youtube.com/watch?v=aopS3q6f1GY',
  source = 'Epicurious',
  thumbnail_url = 'https://img.youtube.com/vi/aopS3q6f1GY/hqdefault.jpg',
  duration_seconds = 491
where hobby_id = '50000000-0000-0000-0000-000000000001' and category = 'first_30_minutes';

update resources set
  title = 'The Home Cooking Survival Guide For Your Busy Work Week',
  url = 'https://www.youtube.com/watch?v=0boZvBnzQzc',
  source = 'LifebyMikeG',
  thumbnail_url = 'https://img.youtube.com/vi/0boZvBnzQzc/hqdefault.jpg',
  duration_seconds = 1260
where hobby_id = '50000000-0000-0000-0000-000000000001' and category = 'first_week';

update resources set
  title = '50 Food Mistakes You Need To Avoid',
  url = 'https://www.youtube.com/watch?v=9msDfJR-ct4',
  source = 'Joshua Weissman',
  thumbnail_url = 'https://img.youtube.com/vi/9msDfJR-ct4/hqdefault.jpg',
  duration_seconds = 1200
where hobby_id = '50000000-0000-0000-0000-000000000001' and category = 'beginner_mistakes';

update resources set
  title = 'How I Would Learn to Cook If I Could Start Over',
  url = 'https://www.youtube.com/watch?v=T8CK9aIqy20',
  source = 'Ethan Chlebowski',
  thumbnail_url = 'https://img.youtube.com/vi/T8CK9aIqy20/hqdefault.jpg',
  duration_seconds = 1020
where hobby_id = '50000000-0000-0000-0000-000000000001' and category = 'progression_story';
