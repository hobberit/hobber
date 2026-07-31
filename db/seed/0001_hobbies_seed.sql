-- Hobber seed data. Apply after 0001_init.sql: `psql -f 0001_hobbies_seed.sql`
-- (or `supabase db push` if placed under supabase/seed.sql).
--
-- Scope: broad catalog (35 hobbies, 7 per category) so the AI Hobby Generator
-- has enough breadth to feel real, plus FULL starter-guide depth (equipment,
-- 4-week roadmap, resources, milestones) for one flagship hobby per category.
-- The remaining 30 hobbies are catalog-only for now — deepen them the same
-- way as we validate which hobbies users actually pick.
--
-- Hobby ids are hardcoded (not gen_random_uuid()) so the flagship rows below
-- can reference them directly without a round trip.
--
-- Resource URLs point at YouTube *search* queries rather than specific video
-- IDs — real, working links today, without fabricating a claim that one
-- exact video exists. Swap in curated video URLs once picked by hand.

-- ─── Hobbies: Creative ──────────────────────────────────────────────────

insert into hobbies (id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, time_intermediate_hrs_week, tags) values
('10000000-0000-0000-0000-000000000001', 'Photography', 'creative', 'Learn to see and capture the world through a camera, starting with the phone already in your pocket.', 'both', 'solo', 'high', 0, 800, 2, 5, '{photography,visual-art,creative,gear-optional}'),
('10000000-0000-0000-0000-000000000002', 'Painting', 'creative', 'Explore acrylics or watercolors to build a relaxing creative practice.', 'indoor', 'solo', 'low', 20, 150, 2, 4, '{painting,visual-art,creative,relaxing}'),
('10000000-0000-0000-0000-000000000003', 'Playing Guitar', 'creative', 'Pick up an instrument and start playing your first songs within weeks.', 'indoor', 'solo', 'medium', 100, 500, 3, 6, '{music,instrument,creative}'),
('10000000-0000-0000-0000-000000000004', 'Creative Writing', 'creative', 'Develop a regular writing practice, from short stories to journaling.', 'indoor', 'solo', 'free', 0, 20, 2, 5, '{writing,creative,low-cost}'),
('10000000-0000-0000-0000-000000000005', 'Pottery', 'creative', 'Shape clay by hand or on a wheel at a local studio.', 'indoor', 'both', 'high', 30, 600, 2, 4, '{pottery,ceramics,craft,studio-access}'),
('10000000-0000-0000-0000-000000000006', 'Drawing & Sketching', 'creative', 'Build observational drawing skills with nothing but paper and pencil.', 'indoor', 'solo', 'low', 0, 50, 2, 4, '{drawing,visual-art,low-cost,portable}'),
('10000000-0000-0000-0000-000000000007', 'Knitting', 'creative', 'Learn a portable, meditative fiber craft you can pick up anywhere.', 'indoor', 'solo', 'low', 15, 60, 2, 3, '{knitting,fiber-craft,relaxing,low-cost}');

-- ─── Hobbies: Physical ──────────────────────────────────────────────────

insert into hobbies (id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, time_intermediate_hrs_week, tags) values
('20000000-0000-0000-0000-000000000001', 'Rock Climbing', 'physical', 'Build full-body strength and problem-solving skills on the wall, indoors or out.', 'both', 'both', 'medium', 20, 250, 3, 6, '{climbing,strength,adrenaline,gym-access}'),
('20000000-0000-0000-0000-000000000002', 'Running', 'physical', 'The lowest-barrier cardio habit there is — just shoes and a route.', 'outdoor', 'both', 'low', 0, 150, 2, 5, '{running,cardio,low-cost,outdoors}'),
('20000000-0000-0000-0000-000000000003', 'Brazilian Jiu-Jitsu', 'physical', 'A grappling martial art built around technique over strength, learned live with a team.', 'indoor', 'social', 'medium', 80, 300, 3, 6, '{martial-arts,self-defense,social,gym-membership}'),
('20000000-0000-0000-0000-000000000004', 'Dance', 'physical', 'Learn partner or freestyle dance styles like salsa, swing, or hip-hop.', 'indoor', 'social', 'low', 0, 100, 2, 4, '{dance,social,rhythm,classes}'),
('20000000-0000-0000-0000-000000000005', 'Surfing', 'physical', 'Read the ocean and ride waves — one of the steeper but most rewarding physical hobbies.', 'outdoor', 'both', 'high', 30, 1000, 3, 6, '{surfing,ocean,adrenaline,travel-friendly}'),
('20000000-0000-0000-0000-000000000006', 'Yoga', 'physical', 'Build flexibility, strength, and a mindfulness habit with just a mat.', 'both', 'both', 'low', 0, 80, 2, 4, '{yoga,mindfulness,flexibility,low-cost}'),
('20000000-0000-0000-0000-000000000007', 'Cycling', 'physical', 'Ride for fitness, commuting, or long-distance touring.', 'outdoor', 'both', 'high', 0, 600, 3, 6, '{cycling,cardio,outdoors,gear-medium}');

-- ─── Hobbies: Technical ─────────────────────────────────────────────────

insert into hobbies (id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, time_intermediate_hrs_week, tags) values
('30000000-0000-0000-0000-000000000001', 'Learning to Code', 'technical', 'Build real software, starting with a laptop you probably already own.', 'indoor', 'solo', 'free', 0, 0, 4, 8, '{coding,programming,free,laptop-required}'),
('30000000-0000-0000-0000-000000000002', 'Robotics', 'technical', 'Combine electronics and code to build machines that move and sense the world.', 'indoor', 'both', 'medium', 50, 400, 3, 6, '{robotics,electronics,stem,kit-based}'),
('30000000-0000-0000-0000-000000000003', '3D Printing', 'technical', 'Design and print physical objects from digital models.', 'indoor', 'solo', 'high', 200, 800, 2, 5, '{3d-printing,maker,hardware,upfront-cost}'),
('30000000-0000-0000-0000-000000000004', 'Electronics', 'technical', 'Learn circuits by building small projects with a beginner component kit.', 'indoor', 'solo', 'medium', 30, 200, 2, 5, '{electronics,maker,tinkering,kit-based}'),
('30000000-0000-0000-0000-000000000005', 'Woodworking', 'technical', 'Build real furniture and objects with hand or power tools.', 'indoor', 'solo', 'high', 100, 1000, 3, 6, '{woodworking,craft,tools,workshop-access}'),
('30000000-0000-0000-0000-000000000006', 'PC Building', 'technical', 'Learn computer hardware inside-out by building your own machine.', 'indoor', 'solo', 'high', 500, 2000, 1, 3, '{pc-building,hardware,tech,one-time-cost}'),
('30000000-0000-0000-0000-000000000007', 'Home Automation', 'technical', 'Wire up smart devices and learn the electronics/software behind them.', 'indoor', 'solo', 'medium', 50, 500, 2, 5, '{smart-home,electronics,tech,kit-based}');

-- ─── Hobbies: Outdoor ───────────────────────────────────────────────────

insert into hobbies (id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, time_intermediate_hrs_week, tags) values
('40000000-0000-0000-0000-000000000001', 'Gardening', 'outdoor', 'Grow food or flowers, starting with a few containers or a small bed.', 'outdoor', 'both', 'medium', 20, 200, 2, 5, '{gardening,plants,outdoors,low-cost}'),
('40000000-0000-0000-0000-000000000002', 'Hiking', 'outdoor', 'Explore trails at your own pace, from short walks to multi-day treks.', 'outdoor', 'both', 'medium', 0, 200, 2, 5, '{hiking,outdoors,cardio,low-cost}'),
('40000000-0000-0000-0000-000000000003', 'Fishing', 'outdoor', 'Learn to read water, cast, and catch — as social or solo as you like.', 'outdoor', 'both', 'medium', 30, 300, 2, 4, '{fishing,outdoors,patience,gear-medium}'),
('40000000-0000-0000-0000-000000000004', 'Bird Watching', 'outdoor', 'A quiet, low-cost hobby that sharpens observation and gets you outside.', 'outdoor', 'both', 'low', 0, 150, 1, 3, '{birdwatching,nature,low-cost,relaxing}'),
('40000000-0000-0000-0000-000000000005', 'Camping', 'outdoor', 'Get comfortable spending a night (or several) outdoors.', 'outdoor', 'both', 'medium', 50, 500, 1, 3, '{camping,outdoors,adventure,gear-medium}'),
('40000000-0000-0000-0000-000000000006', 'Stargazing', 'outdoor', 'Learn the night sky with your eyes, a star chart, or an entry telescope.', 'outdoor', 'both', 'medium', 0, 400, 1, 3, '{astronomy,stargazing,nature,night}'),
('40000000-0000-0000-0000-000000000007', 'Foraging', 'outdoor', 'Learn to safely identify and gather wild edible plants and mushrooms.', 'outdoor', 'both', 'low', 0, 40, 1, 3, '{foraging,nature,low-cost,outdoors}');

-- ─── Hobbies: Social ────────────────────────────────────────────────────

insert into hobbies (id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, time_intermediate_hrs_week, tags) values
('50000000-0000-0000-0000-000000000001', 'Cooking Classes', 'social', 'Build real kitchen skills through hands-on classes and home practice.', 'indoor', 'social', 'medium', 0, 300, 2, 4, '{cooking,culinary,social,classes}'),
('50000000-0000-0000-0000-000000000002', 'Board Games', 'social', 'Build a regular game night habit — strategy, party, or co-op games.', 'indoor', 'social', 'low', 0, 150, 1, 3, '{board-games,social,strategy,low-cost}'),
('50000000-0000-0000-0000-000000000003', 'Volunteering', 'social', 'Give time to a cause you care about while meeting like-minded people.', 'both', 'social', 'free', 0, 0, 2, 4, '{volunteering,community,social,free}'),
('50000000-0000-0000-0000-000000000004', 'Language Learning', 'social', 'Pick up a new language through apps, classes, and conversation practice.', 'indoor', 'both', 'low', 0, 150, 3, 6, '{language,learning,free-to-start,app-based}'),
('50000000-0000-0000-0000-000000000005', 'Improv & Acting', 'social', 'Build confidence and quick thinking through improv or scene classes.', 'indoor', 'social', 'medium', 0, 200, 2, 4, '{improv,acting,social,performance}'),
('50000000-0000-0000-0000-000000000006', 'Wine & Spirits Tasting', 'social', 'Develop your palate and learn the stories behind what you''re drinking.', 'indoor', 'social', 'medium', 20, 200, 1, 3, '{wine,tasting,social,classes}'),
('50000000-0000-0000-0000-000000000007', 'Public Speaking', 'social', 'Build confidence speaking in front of others through a practice club.', 'indoor', 'social', 'low', 0, 100, 1, 3, '{public-speaking,confidence,social,free-to-start}');

-- ═══════════════════════════════════════════════════════════════════════
-- Flagship deep content: one hobby per category gets full starter-guide
-- depth (equipment, 4-week roadmap, resources, milestones).
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Photography (flagship: creative) ──────────────────────────────────

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000001', 'Your smartphone camera', true, 0, 0, null, 'Start here — no need to buy anything'),
('10000000-0000-0000-0000-000000000001', 'Free editing app (Snapseed or Lightroom Mobile)', true, 0, 0, 'https://www.google.com/search?q=snapseed+app', null),
('10000000-0000-0000-0000-000000000001', 'Entry mirrorless or DSLR camera', false, 400, 800, 'https://www.amazon.com/s?k=entry+level+mirrorless+camera', 'Only once you outgrow your phone'),
('10000000-0000-0000-0000-000000000001', '32GB+ SD card', false, 10, 25, 'https://www.amazon.com/s?k=32gb+sd+card', 'Needed only if you buy a dedicated camera'),
('10000000-0000-0000-0000-000000000001', 'Tripod', false, 20, 60, 'https://www.amazon.com/s?k=camera+tripod', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000001', 1, 'See Your Phone Camera Differently', 'Get comfortable with manual/pro mode and the exposure basics before worrying about gear.', '["Turn on your camera''s pro/manual mode", "Learn what ISO, aperture, and shutter speed each do", "Shoot 20 photos of everyday objects, focused on composition not subject"]'),
('10000000-0000-0000-0000-000000000001', 2, 'Composition Fundamentals', 'Build a repeatable eye for framing a shot.', '["Practice the rule of thirds and leading lines", "Do a themed 7-day photo challenge (one photo/day)", "Review your shots and pick your 3 strongest"]'),
('10000000-0000-0000-0000-000000000001', 3, 'Light Is Everything', 'Learn to shoot with — not against — available light.', '["Shoot during golden hour (first/last hour of daylight)", "Practice shooting with the light behind, beside, and in front of your subject", "Experiment with shadows as a compositional element"]'),
('10000000-0000-0000-0000-000000000001', 4, 'Editing & Your First Mini-Portfolio', 'Turn a month of practice into something shareable.', '["Learn basic edits: exposure, crop, color", "Curate your best 10 photos into a mini portfolio", "Share it somewhere and get feedback"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000001', 'video', 'first_30_minutes', 'Photography Basics for Absolute Beginners', 'https://www.youtube.com/results?search_query=photography+basics+for+absolute+beginners', 'YouTube'),
('10000000-0000-0000-0000-000000000001', 'video', 'first_week', '7-Day Beginner Photography Challenge', 'https://www.youtube.com/results?search_query=7+day+beginner+photography+challenge', 'YouTube'),
('10000000-0000-0000-0000-000000000001', 'video', 'beginner_mistakes', 'Common Beginner Photography Mistakes to Avoid', 'https://www.youtube.com/results?search_query=common+beginner+photography+mistakes', 'YouTube'),
('10000000-0000-0000-0000-000000000001', 'video', 'progression_story', 'I Took a Photo Every Day for 30 Days', 'https://www.youtube.com/results?search_query=photo+every+day+for+30+days+progress', 'YouTube');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000001', 'Comfortable in manual mode', 'Can confidently shoot in manual/pro mode and explain the exposure triangle.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000001', 'A growing library of intentional shots', 'Has a folder of 50+ photos that were composed on purpose, not snapshots.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000001', 'A consistent personal style', 'Recognizes good light instinctively and edits toward a consistent look.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000001', 'A shareable portfolio', 'Has a portfolio and a clear sense of a preferred genre (portrait, landscape, street, etc.).', 'Month 12', 4);

-- ─── Rock Climbing (flagship: physical) ─────────────────────────────────

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000001', 'Climbing shoes', true, 0, 120, 'https://www.amazon.com/s?k=climbing+shoes', 'Rent at the gym for your first several visits'),
('20000000-0000-0000-0000-000000000001', 'Harness', true, 0, 70, 'https://www.amazon.com/s?k=climbing+harness', 'Rent at the gym initially'),
('20000000-0000-0000-0000-000000000001', 'Chalk bag and chalk', true, 15, 30, 'https://www.amazon.com/s?k=climbing+chalk+bag', null),
('20000000-0000-0000-0000-000000000001', 'Gym day pass or membership', true, 15, 100, null, 'Day passes first, membership once you know you''ll stick with it'),
('20000000-0000-0000-0000-000000000001', 'Belay certification class', false, 30, 60, null, 'Needed before you can belay a partner at most gyms');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000001', 1, 'Learn the Gym & Basic Movement', 'Get oriented and build foundational footwork.', '["Complete the gym''s new-climber orientation", "Learn proper footwork and hand positioning basics", "Top-rope 5 easy routes"]'),
('20000000-0000-0000-0000-000000000001', 2, 'Belay Basics & Falling Confidence', 'Learn to keep a partner safe and get comfortable falling.', '["Get belay certified at your gym", "Practice controlled falls/lowers", "Climb a full session with a partner"]'),
('20000000-0000-0000-0000-000000000001', 3, 'Reading Routes', 'Start climbing with your head, not just your body.', '["Learn the V-scale and/or YDS grading systems", "Attempt routes one grade harder than last week", "Focus a session purely on footwork precision"]'),
('20000000-0000-0000-0000-000000000001', 4, 'Building a Climbing Habit', 'Turn a month of trying it into a habit.', '["Climb 3 times this week", "Try bouldering if you''ve only top-roped (or vice versa)", "Set a grade goal for next month"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000001', 'video', 'first_30_minutes', 'Rock Climbing for Complete Beginners - Gym Basics', 'https://www.youtube.com/results?search_query=rock+climbing+for+complete+beginners+gym+basics', 'YouTube'),
('20000000-0000-0000-0000-000000000001', 'video', 'first_week', 'Your First Week Climbing: What to Expect', 'https://www.youtube.com/results?search_query=first+week+rock+climbing+what+to+expect', 'YouTube'),
('20000000-0000-0000-0000-000000000001', 'video', 'beginner_mistakes', 'Beginner Climbing Mistakes That Are Holding You Back', 'https://www.youtube.com/results?search_query=beginner+rock+climbing+mistakes', 'YouTube'),
('20000000-0000-0000-0000-000000000001', 'video', 'progression_story', '1 Year of Climbing Progress: Beginner to V4', 'https://www.youtube.com/results?search_query=1+year+climbing+progress+beginner+to+v4', 'YouTube');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000001', 'Comfortable top-roping', 'Top-ropes 5.7-5.9 (or boulders V0-V1) and belays confidently.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000001', 'Reading routes', 'Climbs 5.9-5.10 (V2-V3) and understands basic route reading.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000001', 'Climbing-specific strength', 'Has visible finger/core strength gains and climbs 2-3x/week consistently.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000001', 'Ready for outdoor routes', 'Climbs 5.10-5.11 (V4-V5) and is comfortable trying outdoor routes.', 'Month 12', 4);

-- ─── Learning to Code (flagship: technical) ─────────────────────────────

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000001', 'A laptop', true, 0, 0, null, 'Any laptop you already own works to start'),
('30000000-0000-0000-0000-000000000001', 'VS Code (free editor)', true, 0, 0, 'https://code.visualstudio.com/', null),
('30000000-0000-0000-0000-000000000001', 'Internet connection', true, 0, 0, null, 'Library or cafe wifi is fine'),
('30000000-0000-0000-0000-000000000001', 'External monitor', false, 100, 300, 'https://www.amazon.com/s?k=monitor', 'A nice-to-have once you''re coding regularly');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000001', 1, 'Pick a Language & Write Your First Program', 'Get your environment set up and write real code on day one.', '["Choose Python or JavaScript to start", "Install your editor and run \"hello world\"", "Write and run 5 small scripts"]'),
('30000000-0000-0000-0000-000000000001', 2, 'Core Fundamentals', 'Learn the building blocks every language shares.', '["Learn variables, loops, and conditionals", "Learn how to write and call functions", "Complete 10 beginner practice exercises"]'),
('30000000-0000-0000-0000-000000000001', 3, 'Build Something Small', 'Apply fundamentals to a real, if tiny, project.', '["Build a small project (to-do list, calculator, or simple game)", "Get comfortable reading error messages and debugging", "Finish the project end to end"]'),
('30000000-0000-0000-0000-000000000001', 4, 'Structure & Sharing Code', 'Learn the habits professional developers rely on daily.', '["Learn basic git and GitHub", "Push your first project publicly", "Practice searching documentation and Stack Overflow effectively"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000001', 'video', 'first_30_minutes', 'Learn to Code in 30 Minutes - Absolute Beginner', 'https://www.youtube.com/results?search_query=learn+to+code+in+30+minutes+absolute+beginner', 'YouTube'),
('30000000-0000-0000-0000-000000000001', 'video', 'first_week', 'Your First Week Coding: What Beginners Should Focus On', 'https://www.youtube.com/results?search_query=first+week+learning+to+code+beginner', 'YouTube'),
('30000000-0000-0000-0000-000000000001', 'video', 'beginner_mistakes', 'Beginner Coding Mistakes That Slow You Down', 'https://www.youtube.com/results?search_query=beginner+coding+mistakes+to+avoid', 'YouTube'),
('30000000-0000-0000-0000-000000000001', 'video', 'progression_story', 'I Learned to Code for 100 Days - My Progress', 'https://www.youtube.com/results?search_query=100+days+of+code+progress', 'YouTube');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000001', 'Comfortable with fundamentals', 'Writes basic scripts using variables, loops, and functions without heavy hand-holding.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000001', 'Has shipped small projects', 'Has built and shared 2-3 small complete projects on GitHub.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000001', 'Debugs independently', 'Comfortable debugging independently and reading unfamiliar documentation.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000001', 'Ready to specialize', 'Can build a full small application end-to-end and is ready to specialize (web, data, etc.).', 'Month 12', 4);

-- ─── Gardening (flagship: outdoor) ──────────────────────────────────────

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000001', 'Hand trowel & gardening gloves', true, 10, 25, 'https://www.amazon.com/s?k=gardening+trowel+gloves+set', null),
('40000000-0000-0000-0000-000000000001', 'Potting soil or compost', true, 10, 30, 'https://www.amazon.com/s?k=potting+soil', null),
('40000000-0000-0000-0000-000000000001', 'Pots or a small garden bed', true, 0, 50, 'https://www.amazon.com/s?k=planter+pots', 'Use containers if you don''t have yard space'),
('40000000-0000-0000-0000-000000000001', 'Beginner-friendly seeds or starts', true, 5, 20, 'https://www.amazon.com/s?k=vegetable+seeds+starter+pack', 'Herbs and tomatoes are forgiving first plants'),
('40000000-0000-0000-0000-000000000001', 'Watering can', true, 10, 20, 'https://www.amazon.com/s?k=watering+can', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000001', 1, 'Start Small & Pick Easy Wins', 'Get plants in the ground (or a pot) fast.', '["Choose 2-3 beginner-friendly plants (herbs, tomatoes, succulents)", "Prep your soil or containers", "Plant them"]'),
('40000000-0000-0000-0000-000000000001', 2, 'Learn Your Plants'' Needs', 'Build the daily/weekly habits that keep plants alive.', '["Establish a watering and light routine", "Learn each plant''s specific sun/water needs", "Start a simple growth log"]'),
('40000000-0000-0000-0000-000000000001', 3, 'Troubleshooting & Care', 'Handle the problems that show up once things are growing.', '["Learn to spot common pests and issues early", "Practice pruning or deadheading", "Adjust care based on how plants are responding"]'),
('40000000-0000-0000-0000-000000000001', 4, 'Expand & Plan Ahead', 'Turn a first success into an ongoing habit.', '["Harvest or assess your first results", "Plan your next planting cycle", "Consider composting or expanding your bed/containers"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000001', 'video', 'first_30_minutes', 'Gardening for Absolute Beginners - Getting Started', 'https://www.youtube.com/results?search_query=gardening+for+absolute+beginners+getting+started', 'YouTube'),
('40000000-0000-0000-0000-000000000001', 'video', 'first_week', 'Your First Week of Gardening: Beginner Checklist', 'https://www.youtube.com/results?search_query=first+week+of+gardening+beginner+checklist', 'YouTube'),
('40000000-0000-0000-0000-000000000001', 'video', 'beginner_mistakes', 'Common Beginner Gardening Mistakes to Avoid', 'https://www.youtube.com/results?search_query=common+beginner+gardening+mistakes', 'YouTube'),
('40000000-0000-0000-0000-000000000001', 'video', 'progression_story', 'My Garden 6 Months Later: Beginner Progress', 'https://www.youtube.com/results?search_query=my+garden+6+months+later+beginner+progress', 'YouTube');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000001', 'Plants established', 'Has living plants established with a consistent watering routine.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000001', 'First harvest or bloom', 'Successfully harvested or bloomed first plants; identifies common pests/issues.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000001', 'Manages multiple plants', 'Manages a small multi-plant garden with minimal plant loss.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000001', 'Plans seasonally', 'Plans seasonal planting cycles and has expanded beyond the original bed/containers.', 'Month 12', 4);

-- ─── Cooking Classes (flagship: social) ──────────────────────────────────

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000001', 'Chef''s knife', true, 20, 60, 'https://www.amazon.com/s?k=chefs+knife', null),
('50000000-0000-0000-0000-000000000001', 'Cutting board', true, 10, 30, 'https://www.amazon.com/s?k=cutting+board', null),
('50000000-0000-0000-0000-000000000001', 'Basic pan and pot set', true, 0, 100, 'https://www.amazon.com/s?k=pan+and+pot+set', 'Most kitchens already have this'),
('50000000-0000-0000-0000-000000000001', 'Measuring cups & spoons', true, 10, 15, 'https://www.amazon.com/s?k=measuring+cups+and+spoons', null),
('50000000-0000-0000-0000-000000000001', 'A go-to beginner cookbook or recipe app', false, 0, 25, 'https://www.amazon.com/s?k=beginner+cookbook', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000001', 1, 'Knife Skills & Kitchen Basics', 'Build the fundamentals that make every recipe faster and safer.', '["Learn basic knife cuts: dice, julienne", "Practice mise en place before cooking", "Cook 3 simple recipes start to finish"]'),
('50000000-0000-0000-0000-000000000001', 2, 'Master 5 Core Techniques', 'Learn the techniques that show up in most recipes.', '["Practice sauteing, roasting, and simmering", "Practice seasoning to taste rather than just measuring", "Cook one meal without a recipe"]'),
('50000000-0000-0000-0000-000000000001', 3, 'Build a Weekly Rotation', 'Turn technique into a real weekly habit.', '["Cook 4-5 meals this week using what you''ve learned", "Try one new cuisine", "Note which recipes you''d repeat"]'),
('50000000-0000-0000-0000-000000000001', 4, 'Cook for Others', 'Take the leap from cooking for yourself to hosting.', '["Host or cook a full meal for friends or family", "Plate thoughtfully", "Ask for honest feedback"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000001', 'video', 'first_30_minutes', 'Cooking Basics for Absolute Beginners', 'https://www.youtube.com/results?search_query=cooking+basics+for+absolute+beginners', 'YouTube'),
('50000000-0000-0000-0000-000000000001', 'video', 'first_week', 'Your First Week of Home Cooking: Beginner Guide', 'https://www.youtube.com/results?search_query=first+week+of+home+cooking+beginner+guide', 'YouTube'),
('50000000-0000-0000-0000-000000000001', 'video', 'beginner_mistakes', 'Common Beginner Cooking Mistakes to Avoid', 'https://www.youtube.com/results?search_query=common+beginner+cooking+mistakes', 'YouTube'),
('50000000-0000-0000-0000-000000000001', 'video', 'progression_story', 'I Cooked Every Night for 30 Days - What Changed', 'https://www.youtube.com/results?search_query=cooked+every+night+for+30+days', 'YouTube');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000001', 'Comfortable with knife skills', 'Comfortable with basic knife skills and can cook 5 simple recipes from memory.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000001', 'Confident with recipes', 'Cooks from a recipe confidently and understands basic seasoning and flavor balancing.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000001', 'Can host a meal', 'Can cook a full meal for guests and improvise with what''s in the fridge.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000001', 'Has a real repertoire', 'Has a personal repertoire of 15+ reliable recipes across a few cuisines.', 'Month 12', 4);
