-- Hobber seed data. Apply after 0002_resource_urls_update.sql: run via
-- Supabase Dashboard -> SQL Editor -> New query -> Run (this project's
-- convention -- see HANDOFF.md, no Supabase CLI usage in this project).
--
-- Scope: deepens the 30 non-flagship hobbies to full starter-guide depth
-- (equipment, 4-week roadmap, resources, milestones), matching the depth
-- the 5 flagship hobbies already have. After this migration, all 35
-- hobbies in the catalog have full starter-guide content.
--
-- Resource video URLs are real, specific YouTube videos (not search-query
-- placeholders) -- each was found via web search and independently
-- verified as a real, currently-live video via YouTube's oEmbed endpoint
-- (title + channel name pulled directly from YouTube, not fabricated).

-- ═══════════════════════════════════════════════════════════════════════
-- CREATIVE hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Painting ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000002', 'Acrylic paint starter set (12 colors)', true, 15, 30, 'https://www.amazon.com/s?k=acrylic+paint+set+beginner', null),
('10000000-0000-0000-0000-000000000002', 'Canvas boards or canvas pad (multi-pack)', true, 10, 20, 'https://www.amazon.com/s?k=canvas+boards+multipack', null),
('10000000-0000-0000-0000-000000000002', 'Basic synthetic brush set', true, 10, 20, 'https://www.amazon.com/s?k=acrylic+paint+brush+set', null),
('10000000-0000-0000-0000-000000000002', 'Palette or disposable palette pad', true, 5, 12, 'https://www.amazon.com/s?k=artist+palette', 'A paper plate works fine too'),
('10000000-0000-0000-0000-000000000002', 'Tabletop easel', false, 20, 50, 'https://www.amazon.com/s?k=tabletop+easel', 'Optional — you can prop your canvas against a wall or stack of books');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000002', 1, 'Materials & Mixing Basics', 'Get familiar with your paints, brushes, and how color mixing actually behaves.', '["Learn the color wheel and mix primary colors into secondaries", "Practice loading a brush and making consistent strokes", "Paint 3 simple studies using only 3 colors plus white"]'),
('10000000-0000-0000-0000-000000000002', 2, 'Shapes, Values, and Blocking In', 'Learn to see a subject as simple shapes and value blocks before details.', '["Practice blocking in a still life using 3-5 values", "Do a limited-palette study focused on light versus shadow", "Try wet-on-wet blending on a small canvas"]'),
('10000000-0000-0000-0000-000000000002', 3, 'Brush Control & Texture', 'Build control over brushwork and start introducing texture and detail.', '["Practice different brush techniques (dry brush, stippling, glazing)", "Paint a subject with visible, intentional brushstrokes", "Experiment with palette knife texture on one piece"]'),
('10000000-0000-0000-0000-000000000002', 4, 'Your First Finished Piece', 'Bring it all together into a complete, considered painting you are proud of.', '["Plan a composition with a sketch before painting", "Complete one finished painting start to finish", "Photograph your work and note what you''d do differently next time"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000002', 'video', 'first_30_minutes', 'Acrylic Painting Tutorial, Step by Step for Beginners', 'https://www.youtube.com/watch?v=jQlvCpSwQTE', 'YouTube — Katie Jobling Art'),
('10000000-0000-0000-0000-000000000002', 'video', 'first_week', 'ACRYLIC PAINT: BEGINNER EXERCISES', 'https://www.youtube.com/watch?v=Yag1mjm4RtA', 'YouTube — Mario Pires'),
('10000000-0000-0000-0000-000000000002', 'video', 'beginner_mistakes', 'Avoid These Beginner Painting Mistakes in 2025!', 'https://www.youtube.com/watch?v=Mwi-tBPLfm8', 'YouTube — Malcolm Dewey'),
('10000000-0000-0000-0000-000000000002', 'video', 'progression_story', 'What 1 Year Of Art Progress Actually Looks Like', 'https://www.youtube.com/watch?v=zWLYUb_2fNE', 'YouTube — goblish');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000002', 'Comfortable mixing any color', 'Can mix a target color confidently from a small starter palette without guessing.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000002', 'Finished first complete painting', 'Has planned and completed a full painting from blank canvas to final piece.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000002', 'Consistent brush control', 'Can produce intentional, controlled brushstrokes and basic textures on demand.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000002', 'A small body of work', 'Has 8-10 completed paintings and a sense of a preferred subject or style.', 'Month 12', 4);

-- ─── Playing Guitar ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000003', 'Beginner acoustic guitar', true, 120, 250, 'https://www.amazon.com/s?k=beginner+acoustic+guitar', null),
('10000000-0000-0000-0000-000000000003', 'Digital clip-on tuner', true, 8, 15, 'https://www.amazon.com/s?k=clip+on+guitar+tuner', null),
('10000000-0000-0000-0000-000000000003', 'Guitar picks (variety pack)', true, 3, 8, 'https://www.amazon.com/s?k=guitar+picks+variety+pack', null),
('10000000-0000-0000-0000-000000000003', 'Guitar strap', false, 10, 20, 'https://www.amazon.com/s?k=guitar+strap', 'Only needed if you plan to practice or play standing up'),
('10000000-0000-0000-0000-000000000003', 'Capo', false, 8, 15, 'https://www.amazon.com/s?k=guitar+capo', 'Optional, but handy once you start playing along with songs');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000003', 1, 'Getting Comfortable With the Instrument', 'Learn how to hold the guitar, tune it, and make your first sounds.', '["Learn to tune your guitar (by ear or with a tuner)", "Learn proper posture and hand position", "Learn your first 2 open chords (E minor, A minor) and switch between them"]'),
('10000000-0000-0000-0000-000000000003', 2, 'Basic Chords & Strumming', 'Expand your chord vocabulary and start strumming in rhythm.', '["Learn G, C, and D major chords", "Practice a simple down-up strumming pattern", "Play a slow chord progression (Em-C-G-D) cleanly"]'),
('10000000-0000-0000-0000-000000000003', 3, 'Changing Chords Smoothly', 'Focus on clean, fast transitions — the hardest early skill.', '["Practice chord-to-chord switching with a metronome", "Learn one simple full song using chords you already know", "Work on keeping consistent strumming rhythm while changing chords"]'),
('10000000-0000-0000-0000-000000000003', 4, 'Playing Your First Song', 'Put it all together into a song you can play start to finish.', '["Learn a complete beginner-friendly song", "Practice playing along with a backing track or recording", "Record yourself playing and note what to improve"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000003', 'video', 'first_30_minutes', 'Your Very FIRST Guitar Lesson for ABSOLUTE Beginners', 'https://www.youtube.com/watch?v=Wz7m8wGTbx0', 'YouTube — Good Guitarist'),
('10000000-0000-0000-0000-000000000003', 'video', 'first_week', 'Guitar Lesson 1: Absolute Beginner Acoustic Guitar Lesson (Free 7 day Starter Course)', 'https://www.youtube.com/watch?v=T32hJzHAIIE', 'YouTube — Relax and Learn Guitar'),
('10000000-0000-0000-0000-000000000003', 'video', 'beginner_mistakes', 'Avoid these 5 beginner guitar mistakes!', 'https://www.youtube.com/watch?v=aJOdp4mr6t0', 'YouTube — Doug Edgell Guitar Lessons'),
('10000000-0000-0000-0000-000000000003', 'video', 'progression_story', '1 year of Guitar Progress (self taught)', 'https://www.youtube.com/watch?v=JvKSTUtys0o', 'YouTube — Fremont Leland');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000003', 'Clean open chords', 'Can play E minor, A minor, G, C, and D cleanly without buzzing.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000003', 'Smooth chord changes', 'Can switch between common open chords in rhythm without stopping.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000003', 'First full songs', 'Can play several full songs from memory with steady strumming.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000003', 'Playing along confidently', 'Can jam along to recordings and is starting to learn barre chords or fingerpicking.', 'Month 12', 4);

-- ─── Creative Writing ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000004', 'Notebook and pen for freewriting/journaling', true, 5, 15, 'https://www.amazon.com/s?k=writers+notebook', null),
('10000000-0000-0000-0000-000000000004', 'Word processor (Google Docs or similar)', true, 0, 0, null, 'Google Docs is free — no need to buy software to start'),
('10000000-0000-0000-0000-000000000004', 'Grammar checker (Grammarly free plan)', false, 0, 0, 'https://www.google.com/search?q=grammarly', null),
('10000000-0000-0000-0000-000000000004', 'Dedicated long-form writing software (Scrivener)', false, 45, 60, 'https://www.amazon.com/s?k=scrivener+writing+software', 'Only worth it once you''re writing something long-form like a novel'),
('10000000-0000-0000-0000-000000000004', 'Writing prompt book or card deck', false, 10, 20, 'https://www.amazon.com/s?k=writing+prompts+book', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000004', 1, 'Building a Writing Habit', 'Get words on the page daily and quiet your inner editor.', '["Freewrite for 10-15 minutes every day, no editing allowed", "Try 3 different writing prompts to see what excites you", "Read one short story or piece you admire and note why it works"]'),
('10000000-0000-0000-0000-000000000004', 2, 'Finding Your Story', 'Move from random writing to a piece with a clear idea.', '["Brainstorm 5 story or essay ideas and pick one to develop", "Write a rough outline or character sketch for your chosen idea", "Draft the opening scene or paragraph"]'),
('10000000-0000-0000-0000-000000000004', 3, 'Developing Craft Basics', 'Learn the tools that make writing feel alive: voice, dialogue, and showing versus telling.', '["Rewrite one scene to show emotion through action instead of stating it directly", "Practice writing a page of natural-sounding dialogue", "Get feedback from one other person on a short piece"]'),
('10000000-0000-0000-0000-000000000004', 4, 'Finishing a Complete Piece', 'Take a piece from draft to a finished, polished version.', '["Complete a full short story, essay, or chapter (750-2000 words)", "Do one full editing pass focused on clarity and pacing", "Share your finished piece somewhere (a friend, a writing group, or online)"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000004', 'video', 'first_30_minutes', 'Free Creative Writing Course for Beginners (Creative Development Tutorial)', 'https://www.youtube.com/watch?v=wDhU9fOAhiA', 'YouTube — Skillademia'),
('10000000-0000-0000-0000-000000000004', 'video', 'first_week', '5 Easy Ways to Practice Writing Every Day', 'https://www.youtube.com/watch?v=ShpqoPXGWZI', 'YouTube — Reedsy'),
('10000000-0000-0000-0000-000000000004', 'video', 'beginner_mistakes', '7 Cringeworthy MISTAKES Beginner Writers Make ❌ (avoid these pitfalls!)', 'https://www.youtube.com/watch?v=_MuyS7yIqbE', 'YouTube — Abbie Emmons'),
('10000000-0000-0000-0000-000000000004', 'video', 'progression_story', 'I Wrote Every Day for a Year – This is What I Learned', 'https://www.youtube.com/watch?v=fOlWyLpXRJw', 'YouTube — Write & Accelerate with Natalie Forslind');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000004', 'A consistent writing habit', 'Writes most days of the week, even if just for 10-15 minutes.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000004', 'First finished piece', 'Has completed and edited one full short story, essay, or chapter.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000004', 'Feedback-tested work', 'Has shared work with others and revised based on real feedback.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000004', 'A small portfolio', 'Has multiple finished pieces and a clearer sense of personal voice and genre.', 'Month 12', 4);

-- ─── Pottery ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000005', 'Beginner clay (studio clay, roughly 5-10 lbs)', true, 10, 25, 'https://www.amazon.com/s?k=pottery+clay+for+beginners', null),
('10000000-0000-0000-0000-000000000005', 'Basic pottery tool kit (needle tool, rib, wire cutter, sponge)', true, 10, 20, 'https://www.amazon.com/s?k=pottery+tool+kit', null),
('10000000-0000-0000-0000-000000000005', 'Access to a pottery wheel and kiln (studio membership or class)', true, 50, 150, 'https://www.google.com/search?q=pottery+studio+membership+near+me', 'Most beginners rent wheel and kiln time at a local studio rather than buying one'),
('10000000-0000-0000-0000-000000000005', 'Canvas bat or work surface', false, 10, 20, 'https://www.amazon.com/s?k=pottery+bat', null),
('10000000-0000-0000-0000-000000000005', 'Personal pottery wheel for home practice', false, 150, 400, 'https://www.amazon.com/s?k=beginner+pottery+wheel', 'Only worth buying once you know you want to practice outside a studio');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000005', 1, 'Getting a Feel for Clay', 'Build comfort with the material itself before worrying about the wheel.', '["Practice wedging clay to remove air bubbles", "Try basic hand-building: a pinch pot and a coil pot", "Visit or join a studio and get oriented with the wheel and tools"]'),
('10000000-0000-0000-0000-000000000005', 2, 'Centering on the Wheel', 'Centering is the single hardest and most important early skill.', '["Practice centering clay for at least 30 minutes", "Learn to open and create an even-walled cylinder", "Expect to collapse a lot of pieces — that''s normal at this stage"]'),
('10000000-0000-0000-0000-000000000005', 3, 'Shaping Forms', 'Start turning centered cylinders into actual usable forms.', '["Practice pulling walls up evenly on 3-5 attempts", "Try shaping a simple bowl and a simple cup", "Learn to trim a leather-hard piece on the wheel"]'),
('10000000-0000-0000-0000-000000000005', 4, 'Finishing Your First Piece', 'Take a piece through drying, bisque firing, and glazing.', '["Complete and trim one piece you are happy with", "Learn basic glazing technique and glaze your piece", "Pick up your finished, fired piece and evaluate what to improve"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000005', 'video', 'first_30_minutes', 'Ceramics - Wheel Throwing For Beginners: How to Throw a Cylinder', 'https://www.youtube.com/watch?v=dmgMKbHyDFw', 'YouTube — Ceramic Jim'),
('10000000-0000-0000-0000-000000000005', 'video', 'first_week', 'How to: A Beginner''s Guide to Centering Clay on the Pottery Wheel', 'https://www.youtube.com/watch?v=yeFxVdNY-qE', 'YouTube — A Work of Stoneware'),
('10000000-0000-0000-0000-000000000005', 'video', 'beginner_mistakes', '5 Mistakes Every Pottery Beginner Makes', 'https://www.youtube.com/watch?v=QstgwNxx4PA', 'YouTube — Florian Gadsby'),
('10000000-0000-0000-0000-000000000005', 'video', 'progression_story', 'The last studio vlog of the year | 2025 Pottery Recap', 'https://www.youtube.com/watch?v=zuL2kCcknYk', 'YouTube — Terra Humida ceramics');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000005', 'Can center clay reliably', 'Centers a ball of clay on the wheel consistently without fighting it.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000005', 'First fired, finished piece', 'Has thrown, trimmed, glazed, and picked up a completed piece from the kiln.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000005', 'Consistent basic forms', 'Can throw cylinders, bowls, and cups with even walls fairly reliably.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000005', 'A personal collection', 'Has a small shelf of finished pieces and is experimenting with glazes and forms.', 'Month 12', 4);

-- ─── Drawing & Sketching ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000006', 'Sketchbook (plain paper, spiral or hardbound)', true, 8, 20, 'https://www.amazon.com/s?k=sketchbook+for+beginners', null),
('10000000-0000-0000-0000-000000000006', 'Graphite pencil set (range of hardness, HB-6B)', true, 8, 15, 'https://www.amazon.com/s?k=graphite+pencil+set', null),
('10000000-0000-0000-0000-000000000006', 'Kneaded eraser and vinyl eraser', true, 3, 6, 'https://www.amazon.com/s?k=kneaded+eraser', null),
('10000000-0000-0000-0000-000000000006', 'Blending stump / tortillon set', false, 5, 10, 'https://www.amazon.com/s?k=blending+stump+set', null),
('10000000-0000-0000-0000-000000000006', 'Fineliner pens or a basic drawing tablet', false, 10, 100, 'https://www.amazon.com/s?k=fineliner+pens', 'Fineliners are cheap; a drawing tablet is only worth it if you want to go digital');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000006', 1, 'Seeing Like an Artist', 'Train your eye to observe shapes, proportions, and lines before worrying about raw talent.', '["Practice basic marks: lines, circles, and hatching for 15 minutes a day", "Do 10 quick contour drawings of everyday objects with no erasing", "Learn to break objects down into simple shapes"]'),
('10000000-0000-0000-0000-000000000006', 2, 'Value & Shading', 'Learn how light and shadow give drawings depth.', '["Practice a value scale from light to dark", "Shade 3-5 simple objects using a consistent light direction", "Try blending techniques with a stump or your finger"]'),
('10000000-0000-0000-0000-000000000006', 3, 'Proportion & Perspective', 'Build the structural skills that make drawings look right.', '["Practice one-point and two-point perspective boxes", "Do a proportion study of a face or figure using guidelines", "Draw the same object from 3 different angles"]'),
('10000000-0000-0000-0000-000000000006', 4, 'Your First Finished Drawing', 'Combine everything into a complete, rendered piece.', '["Choose a reference photo and plan the composition", "Complete one fully rendered drawing with shading and detail", "Compare it to your Week 1 drawings and note the difference"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000006', 'video', 'first_30_minutes', 'Drawing for the Absolute Beginner Course - Lesson 1', 'https://www.youtube.com/watch?v=UJOcaBsPAxY', 'YouTube — ed2go'),
('10000000-0000-0000-0000-000000000006', 'video', 'first_week', '5 BEGINNER Drawing Exercises to IMPROVE Fast (Do these First!)', 'https://www.youtube.com/watch?v=UOC8ISSbFx0', 'YouTube — KeshArt'),
('10000000-0000-0000-0000-000000000006', 'video', 'beginner_mistakes', 'Top 5 Drawing Mistakes', 'https://www.youtube.com/watch?v=tCZIqbRDphs', 'YouTube — Proko'),
('10000000-0000-0000-0000-000000000006', 'video', 'progression_story', 'How I Got BETTER at Drawing 【1 YEAR JOURNEY】', 'https://www.youtube.com/watch?v=OwmQiPQ-ojY', 'YouTube — Brushes and Bunnies');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000006', 'Comfortable with basic shapes and shading', 'Can break a subject into simple forms and shade it with a clear light source.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000006', 'First fully rendered drawing', 'Has completed a detailed, shaded drawing from reference start to finish.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000006', 'Solid grasp of proportion', 'Can draw recognizable faces, figures, or objects with reasonably accurate proportions.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000006', 'A developing personal style', 'Has a sketchbook full of work and a noticeable preferred subject matter or style.', 'Month 12', 4);

-- ─── Knitting ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('10000000-0000-0000-0000-000000000007', 'Straight knitting needles (size US 8)', true, 5, 12, 'https://www.amazon.com/s?k=size+8+knitting+needles', null),
('10000000-0000-0000-0000-000000000007', 'Worsted weight yarn (light color, smooth)', true, 6, 15, 'https://www.amazon.com/s?k=worsted+weight+yarn+beginner', null),
('10000000-0000-0000-0000-000000000007', 'Yarn/tapestry needle for weaving in ends', true, 2, 5, 'https://www.amazon.com/s?k=tapestry+needle+set', null),
('10000000-0000-0000-0000-000000000007', 'Small scissors', true, 3, 6, 'https://www.amazon.com/s?k=small+craft+scissors', null),
('10000000-0000-0000-0000-000000000007', 'Stitch markers', false, 3, 8, 'https://www.amazon.com/s?k=knitting+stitch+markers', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('10000000-0000-0000-0000-000000000007', 1, 'Casting On & the Knit Stitch', 'Learn the two moves that make up almost all knitting: casting on and the knit stitch.', '["Learn to cast on 20-30 stitches", "Practice the knit stitch until it feels natural", "Knit a small garter-stitch swatch about 4 inches square"]'),
('10000000-0000-0000-0000-000000000007', 2, 'The Purl Stitch & Reading Your Work', 'Add the purl stitch and start learning to read stitches on the needle.', '["Learn the purl stitch", "Practice switching between knit and purl in the same row", "Learn to identify a dropped stitch and how to fix it"]'),
('10000000-0000-0000-0000-000000000007', 3, 'Simple Patterns & Shaping', 'Combine stitches into a real pattern and try basic shaping.', '["Knit a swatch in stockinette stitch (knit one row, purl one row)", "Try a simple ribbing pattern (knit 2, purl 2)", "Learn a basic increase and decrease"]'),
('10000000-0000-0000-0000-000000000007', 4, 'Your First Finished Project', 'Complete a small, satisfying project start to finish.', '["Start and finish a simple project like a dishcloth or small scarf", "Practice binding off cleanly", "Weave in all loose ends neatly"]');

insert into resources (hobby_id, type, category, title, url, source) values
('10000000-0000-0000-0000-000000000007', 'video', 'first_30_minutes', 'HOW TO KNIT for absolute beginners: the knitting basics/free tutorial.', 'https://www.youtube.com/watch?v=qeEaSvZ-Lds', 'YouTube — Hooks and Needles'),
('10000000-0000-0000-0000-000000000007', 'video', 'first_week', 'How to Knit: A Complete Introduction for Beginners Part 1', 'https://www.youtube.com/watch?v=Tff3ng-djtk', 'YouTube — KnittingHelp.com'),
('10000000-0000-0000-0000-000000000007', 'video', 'beginner_mistakes', 'Beginner Knitter 5 Common Knitting Mistakes and How to Avoid Them', 'https://www.youtube.com/watch?v=OWGHpsYYXEY', 'YouTube — WatchBarbaraKnit'),
('10000000-0000-0000-0000-000000000007', 'video', 'progression_story', 'My Knitting Journey: From Beginner to Advanced. | Plus Knitting Update', 'https://www.youtube.com/watch?v=JMo7fn7R0Ts', 'YouTube — KnitCheek');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000007', 'Comfortable with knit and purl', 'Can cast on and knit/purl evenly without dropping stitches constantly.', 'Month 1', 1),
('10000000-0000-0000-0000-000000000007', 'First finished project', 'Has completed and bound off a full small project like a dishcloth or scarf.', 'Month 3', 2),
('10000000-0000-0000-0000-000000000007', 'Reading simple patterns', 'Can follow a written pattern with basic increases and decreases without help.', 'Month 6', 3),
('10000000-0000-0000-0000-000000000007', 'Tackling bigger projects', 'Is working on a garment-level project (hat, sweater, etc.) with growing confidence.', 'Month 12', 4);

-- ═══════════════════════════════════════════════════════════════════════
-- PHYSICAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Running ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000002', 'Running shoes', true, 60, 150, 'https://www.amazon.com/s?k=running+shoes', 'Get fitted at a specialty running store if possible'),
('20000000-0000-0000-0000-000000000002', 'Moisture-wicking shirts and shorts', true, 20, 60, 'https://www.amazon.com/s?k=running+apparel', 'Old gym clothes are fine to start'),
('20000000-0000-0000-0000-000000000002', 'GPS running watch', false, 0, 250, 'https://www.amazon.com/s?k=gps+running+watch', 'Free phone apps like Strava or Nike Run Club work fine at first'),
('20000000-0000-0000-0000-000000000002', 'Handheld water bottle or hydration belt', false, 15, 40, 'https://www.amazon.com/s?k=running+hydration+belt', 'Only needed for runs over 45 minutes'),
('20000000-0000-0000-0000-000000000002', 'Reflective vest or headlamp', false, 15, 40, 'https://www.amazon.com/s?k=running+reflective+gear', 'Only essential if you run before dawn or after dusk');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000002', 1, 'Walk-Run Foundation', 'Build a base with a run-walk pattern so your joints and lungs adapt gradually.', '["Complete 3 run-walk sessions (e.g. 1 min run / 2 min walk x 8)", "Learn a proper warm-up routine", "Focus on relaxed, upright form"]'),
('20000000-0000-0000-0000-000000000002', 2, 'Building Continuous Running', 'Start stringing together longer stretches of running.', '["Increase run intervals to 3-5 minutes at a time", "Run 3 times this week", "Practice nasal breathing on easy efforts"]'),
('20000000-0000-0000-0000-000000000002', 3, 'Distance & Pacing', 'Learn to control your effort over a full run.', '["Run 1.5-2 miles without stopping", "Learn to identify an easy conversational pace", "Try one slightly hillier route"]'),
('20000000-0000-0000-0000-000000000002', 4, 'Building a Running Habit', 'Turn a month of trying it into a repeatable weekly routine.', '["Run 3-4 times this week", "Sign up for a local 5k or set a distance goal", "Plan next month''s weekly mileage"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000002', 'video', 'first_30_minutes', 'Complete Beginners Guide to Running', 'https://www.youtube.com/watch?v=YAon3vDZGx0', 'YouTube — Taren''s MōTTIV Method'),
('20000000-0000-0000-0000-000000000002', 'video', 'first_week', 'How To Start Running (and actually stick to it)', 'https://www.youtube.com/watch?v=flHEA1cv59I', 'YouTube — Sierra & Stephen IRL'),
('20000000-0000-0000-0000-000000000002', 'video', 'beginner_mistakes', '8 COMMON BEGINNER RUNNER MISTAKES (How To Fix Them)', 'https://www.youtube.com/watch?v=KPQ1L5OVJ9k', 'YouTube — The FOD Runner'),
('20000000-0000-0000-0000-000000000002', 'video', 'progression_story', 'How I Improved My Running in One Year', 'https://www.youtube.com/watch?v=LTFy-u1nweU', 'YouTube — Average Dom Slim');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000002', 'Continuous first mile', 'Runs 1 mile without stopping to walk.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000002', 'First 5k', 'Completes a 5k (3.1 miles) without stopping.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000002', 'Consistent weekly mileage', 'Runs 3x/week consistently and holds a sub-30-minute 5k pace.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000002', 'Long-distance comfort', 'Comfortable running 8-10+ miles or racing a half marathon.', 'Month 12', 4);

-- ─── Brazilian Jiu-Jitsu ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000003', 'Gi (kimono)', true, 80, 200, 'https://www.amazon.com/s?k=bjj+gi', 'Many gyms have loaner gis for your first few classes'),
('20000000-0000-0000-0000-000000000003', 'Mouthguard', true, 10, 25, 'https://www.amazon.com/s?k=mouthguard+bjj', 'Boil-and-bite is fine to start'),
('20000000-0000-0000-0000-000000000003', 'No-gi rashguard and grappling shorts', true, 40, 90, 'https://www.amazon.com/s?k=rashguard+grappling+shorts', 'Only needed once you start no-gi classes'),
('20000000-0000-0000-0000-000000000003', 'Gym membership', true, 100, 200, null, 'Most gyms offer a free or discounted trial week'),
('20000000-0000-0000-0000-000000000003', 'Flip-flops/sandals for the mat area', false, 5, 20, 'https://www.amazon.com/s?k=shower+sandals', 'Keeps the mats and locker room hygienic between rolls');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000003', 1, 'Orientation & Basic Positions', 'Learn gym etiquette and the core positions everything else builds on.', '["Attend a fundamentals or beginner-specific class", "Learn mount, guard, and side control basics", "Practice breakfalls and rolling safely"]'),
('20000000-0000-0000-0000-000000000003', 2, 'Surviving & Escaping', 'Focus on defense before offense.', '["Drill escaping mount and side control", "Do your first live positional sparring round", "Learn the tap-out rule and how to tap early"]'),
('20000000-0000-0000-0000-000000000003', 3, 'Basic Submissions & Guard Retention', 'Start adding a few reliable techniques.', '["Learn 2-3 fundamental submissions (armbar, rear-naked choke)", "Practice retaining closed guard", "Roll lightly with 2-3 different partners"]'),
('20000000-0000-0000-0000-000000000003', 4, 'Building a Training Habit', 'Turn a month of trying it into a consistent routine.', '["Train 2-3 times this week", "Ask a coach for feedback on your biggest weakness", "Set a goal for your first stripe"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000003', 'video', 'first_30_minutes', 'Brazilian Jiu-Jitsu for Beginners (The First 6 BJJ Techniques Everyone MUST Learn) with the Gracies', 'https://www.youtube.com/watch?v=bErptxD1jho', 'YouTube — GracieBreakdown'),
('20000000-0000-0000-0000-000000000003', 'video', 'first_week', 'Your First Brazilian Jiu-Jitsu Class: What to Expect & Tips for Beginners', 'https://www.youtube.com/watch?v=gvxJgX_kdbw', 'YouTube — Christopher Carpenter'),
('20000000-0000-0000-0000-000000000003', 'video', 'beginner_mistakes', 'The Most Common Mistakes BJJ White Belts Make (Avoid These!)', 'https://www.youtube.com/watch?v=FSvIcNo4V2A', 'YouTube — Gold BJJ'),
('20000000-0000-0000-0000-000000000003', 'video', 'progression_story', 'A White Belt''s 1st Year of BJJ Recap... In 7 minutes...', 'https://www.youtube.com/watch?v=aRHKrEkxnnM', 'YouTube — Carsahh');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000003', 'Comfortable surviving', 'Can survive and escape bottom positions against other beginners without panicking.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000003', 'First stripe', 'Earns first stripe on white belt; knows several escapes and 1-2 submissions.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000003', 'Rolling with control', 'Rolls 3x/week consistently and can defend most common submissions.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000003', 'Approaching blue belt', 'Has a small functional game and is being considered for a blue belt promotion.', 'Month 12', 4);

-- ─── Dance ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000004', 'Dance shoes (style-specific)', true, 30, 90, 'https://www.amazon.com/s?k=dance+shoes', 'Sneakers are fine for hip-hop; ballet/jazz styles need specific footwear'),
('20000000-0000-0000-0000-000000000004', 'Comfortable, flexible workout clothing', true, 20, 60, 'https://www.amazon.com/s?k=dance+workout+clothes', null),
('20000000-0000-0000-0000-000000000004', 'Studio drop-in class pass', true, 15, 25, null, 'Price per class; look for new-student intro packages'),
('20000000-0000-0000-0000-000000000004', 'Full-length mirror for home practice', false, 20, 60, 'https://www.amazon.com/s?k=full+length+mirror', 'Helps a lot with self-correction between classes'),
('20000000-0000-0000-0000-000000000004', 'Portable speaker', false, 20, 50, 'https://www.amazon.com/s?k=portable+bluetooth+speaker', 'Useful for practicing choreography at home');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000004', 1, 'Rhythm & Basic Footwork', 'Get comfortable moving to the beat and learn foundational steps.', '["Attend a beginner-level class in your chosen style", "Practice basic weight shifts and footwork for 10 min/day", "Learn to count music in 8-counts"]'),
('20000000-0000-0000-0000-000000000004', 2, 'Short Combinations', 'Start linking individual steps into short phrases.', '["Learn a short 8-16 count combo", "Practice in front of a mirror to self-correct", "Attend 2 classes this week"]'),
('20000000-0000-0000-0000-000000000004', 3, 'Musicality & Flow', 'Focus on making movement look and feel intentional.', '["Work on connecting combos smoothly without stopping", "Practice matching movement dynamics to the music", "Try freestyling for 1 minute to a song you like"]'),
('20000000-0000-0000-0000-000000000004', 4, 'Building a Practice Habit', 'Turn a month of trying it into a consistent routine.', '["Learn a full short routine start to finish", "Attend or film yourself for one self-review session", "Set a goal style or class level for next month"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000004', 'video', 'first_30_minutes', 'Easy Dance Moves (Tutorial For Beginners) | Learn How To Do', 'https://www.youtube.com/watch?v=twLdUGytIAQ', 'YouTube — Learn How To Dance'),
('20000000-0000-0000-0000-000000000004', 'video', 'first_week', 'What To Expect When You''re Taking Your First Dance Class – Beginner Guide', 'https://www.youtube.com/watch?v=PUMPJXt29DM', 'YouTube — The Confident Dancers'),
('20000000-0000-0000-0000-000000000004', 'video', 'beginner_mistakes', '3 Mistakes All Beginner Dancers Make | Dance Tips | STEEZY.CO', 'https://www.youtube.com/watch?v=bySVm-KqiYg', 'YouTube — STEEZY'),
('20000000-0000-0000-0000-000000000004', 'video', 'progression_story', 'Girl Learns to Dance in a Year (TIME LAPSE)', 'https://www.youtube.com/watch?v=daC2EPUh22w', 'YouTube — karenxcheng');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000004', 'Basic steps down', 'Comfortable with the fundamental steps and counts of a chosen style.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000004', 'Follows full choreography', 'Can learn and perform a full short routine in class.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000004', 'Comfortable improvising', 'Can freestyle or social dance confidently for a full song.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000004', 'Performance-ready', 'Confident performing a routine in front of others (showcase, social, or recital).', 'Month 12', 4);

-- ─── Surfing ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000005', 'Beginner foam soft-top board', true, 300, 600, 'https://www.amazon.com/s?k=beginner+foam+surfboard', 'Rent boards at a surf shop for your first several sessions'),
('20000000-0000-0000-0000-000000000005', 'Wetsuit', true, 100, 300, 'https://www.amazon.com/s?k=surfing+wetsuit', 'Only needed in cooler water; rentals are common at surf schools'),
('20000000-0000-0000-0000-000000000005', 'Surf leash', true, 20, 40, 'https://www.amazon.com/s?k=surfboard+leash', null),
('20000000-0000-0000-0000-000000000005', 'Surf wax or traction pad', true, 10, 25, 'https://www.amazon.com/s?k=surf+wax', null),
('20000000-0000-0000-0000-000000000005', 'Rash guard', false, 25, 50, 'https://www.amazon.com/s?k=surf+rash+guard', 'Protects against board rub and sun exposure');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000005', 1, 'Paddling & Pop-Up Basics', 'Build the core mechanics on land and in the whitewater.', '["Practice the pop-up motion on the beach 20+ times", "Take a lesson or go out with an experienced friend", "Catch and lie down on 5+ whitewater waves"]'),
('20000000-0000-0000-0000-000000000005', 2, 'Standing Up Consistently', 'Start standing up on the smaller broken waves.', '["Stand up on whitewater waves at least 3 times", "Practice paddling technique and duck-diving basics in calm water", "Learn basic surf etiquette and right-of-way rules"]'),
('20000000-0000-0000-0000-000000000005', 3, 'Reading Waves', 'Learn to identify and position for waves before they break.', '["Practice sitting in the lineup and judging wave sets", "Attempt catching an unbroken (green) wave", "Work on paddle timing to match wave speed"]'),
('20000000-0000-0000-0000-000000000005', 4, 'Building a Surfing Habit', 'Turn a month of trying it into a repeatable routine.', '["Surf 2-3 sessions this week", "Ride a green wave standing for a few seconds", "Research your local breaks and tide/swell conditions"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000005', 'video', 'first_30_minutes', 'The Complete Beginners Guide To Surfing', 'https://www.youtube.com/watch?v=9Ralave0cFg', 'YouTube — How to Rip'),
('20000000-0000-0000-0000-000000000005', 'video', 'first_week', 'Beginner to Surfer in One Week! Hailey''s First Surf Experience at Witch''s Rock Surf Camp', 'https://www.youtube.com/watch?v=J-tylnNtCV8', 'YouTube — Witch''s Rock Surf Camp'),
('20000000-0000-0000-0000-000000000005', 'video', 'beginner_mistakes', 'Top 7 Beginner Surfing Mistakes & How To Fix Them | Surfing Lesson', 'https://www.youtube.com/watch?v=e_UiYfLI7Sc', 'YouTube — Kale Brock'),
('20000000-0000-0000-0000-000000000005', 'video', 'progression_story', 'I Learned how to Surf in One Year', 'https://www.youtube.com/watch?v=mYfRlX0xoLE', 'YouTube — At');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000005', 'Standing in whitewater', 'Consistently stands up and rides whitewater waves to shore.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000005', 'Catching green waves', 'Can catch and briefly ride an unbroken (green) wave.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000005', 'Basic wave positioning', 'Reads the lineup well and can position for waves without help.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000005', 'Comfortable in varied conditions', 'Surfs confidently across different breaks and moderate conditions.', 'Month 12', 4);

-- ─── Yoga ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000006', 'Yoga mat', true, 20, 80, 'https://www.amazon.com/s?k=yoga+mat', 'Studios often have loaner mats for your first few classes'),
('20000000-0000-0000-0000-000000000006', 'Comfortable, stretchy clothing', true, 20, 60, 'https://www.amazon.com/s?k=yoga+clothing', 'Anything you can move freely in works to start'),
('20000000-0000-0000-0000-000000000006', 'Yoga blocks', true, 10, 25, 'https://www.amazon.com/s?k=yoga+blocks', 'Books can substitute in a pinch'),
('20000000-0000-0000-0000-000000000006', 'Yoga strap', false, 8, 15, 'https://www.amazon.com/s?k=yoga+strap', 'A bathrobe tie or belt works as a free substitute'),
('20000000-0000-0000-0000-000000000006', 'Studio class pass or app subscription', false, 0, 30, null, 'Many free routines exist on YouTube before paying for classes');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000006', 1, 'Foundational Poses & Breath', 'Learn the basic poses and breathing pattern everything else builds on.', '["Complete 3 short beginner yoga sessions (15-20 min)", "Learn basic breath (ujjayi) awareness", "Practice mountain pose, downward dog, and child''s pose"]'),
('20000000-0000-0000-0000-000000000006', 2, 'Building a Short Flow', 'Start linking poses together with breath.', '["Learn the sun salutation sequence", "Practice a 20-minute flow class 3 times", "Focus on alignment cues rather than depth"]'),
('20000000-0000-0000-0000-000000000006', 3, 'Balance & Core Work', 'Add balance and core-focused poses to your practice.', '["Practice tree pose and warrior poses for balance", "Try a class that includes core work (boat pose, plank variations)", "Attend one in-person or livestream class if you''ve only used pre-recorded videos"]'),
('20000000-0000-0000-0000-000000000006', 4, 'Building a Practice Habit', 'Turn a month of trying it into a consistent routine.', '["Practice yoga 3-4 times this week", "Try a slightly longer class (30-45 min)", "Set a goal style (vinyasa, hatha, yin) to explore next month"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000006', 'video', 'first_30_minutes', 'Yoga For Complete Beginners - 20 Minute Home Yoga Workout!', 'https://www.youtube.com/watch?v=v7AYKMP6rOE', 'YouTube — Yoga With Adriene'),
('20000000-0000-0000-0000-000000000006', 'video', 'first_week', 'Before You Start Yoga: What Every Beginner Should Know', 'https://www.youtube.com/watch?v=KvIZ5tg4yKA', 'YouTube — Heart & Bones Yoga - Anatomy & Mobility'),
('20000000-0000-0000-0000-000000000006', 'video', 'beginner_mistakes', 'Common Yoga Mistakes Beginners Make | Correct Alignment in Basic Asanas', 'https://www.youtube.com/watch?v=1l5cisi1bJA', 'YouTube — Yoga & You'),
('20000000-0000-0000-0000-000000000006', 'video', 'progression_story', 'I Did Yoga Every Day for a Year. It Changed My Life.', 'https://www.youtube.com/watch?v=bkKbShpMvf4', 'YouTube — Shervin Shares');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000006', 'Comfortable with basics', 'Knows the sun salutation sequence and basic poses by name.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000006', 'Follows a full flow class', 'Can keep up with a beginner/intermediate vinyasa flow class.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000006', 'Improved balance & flexibility', 'Holds balance poses steadily and notices visible flexibility gains.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000006', 'Consistent personal practice', 'Maintains a regular practice and can lead themselves through a routine.', 'Month 12', 4);

-- ─── Cycling ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('20000000-0000-0000-0000-000000000007', 'Bicycle (hybrid or entry-level road bike)', true, 300, 800, 'https://www.amazon.com/s?k=hybrid+bicycle', 'Buying used from a local shop is a great budget option'),
('20000000-0000-0000-0000-000000000007', 'Helmet', true, 40, 100, 'https://www.amazon.com/s?k=bike+helmet', null),
('20000000-0000-0000-0000-000000000007', 'Bike lock', true, 25, 60, 'https://www.amazon.com/s?k=bike+lock', null),
('20000000-0000-0000-0000-000000000007', 'Flat repair kit (spare tube, pump, tire levers)', true, 20, 40, 'https://www.amazon.com/s?k=bike+flat+repair+kit', 'Ask your local shop for a quick lesson on changing a flat'),
('20000000-0000-0000-0000-000000000007', 'Padded cycling shorts', false, 30, 70, 'https://www.amazon.com/s?k=padded+cycling+shorts', 'Makes a big difference in comfort on longer rides');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('20000000-0000-0000-0000-000000000007', 1, 'Comfort & Basic Handling', 'Get comfortable on the bike and confident with basic controls.', '["Get your bike fitted (seat height, brake reach)", "Practice starting, stopping, and signaling in a quiet area", "Ride 2-3 short rides (15-20 min) this week"]'),
('20000000-0000-0000-0000-000000000007', 2, 'Building Saddle Time', 'Increase time in the saddle and learn to use gears properly.', '["Learn when and how to shift gears smoothly", "Ride 3 times this week, gradually increasing distance", "Practice looking back over your shoulder without swerving"]'),
('20000000-0000-0000-0000-000000000007', 3, 'Road Awareness & Routes', 'Start riding in more real-world conditions.', '["Plan and ride a route with light traffic or a bike path", "Learn basic road rules and hand signals for your area", "Try a route with at least one moderate hill"]'),
('20000000-0000-0000-0000-000000000007', 4, 'Building a Riding Habit', 'Turn a month of trying it into a consistent weekly routine.', '["Ride 3-4 times this week", "Increase your longest ride by 20-30%", "Set a distance or route goal for next month"]');

insert into resources (hobby_id, type, category, title, url, source) values
('20000000-0000-0000-0000-000000000007', 'video', 'first_30_minutes', '4 Basic Skills For Beginner Cyclists', 'https://www.youtube.com/watch?v=4ssLDk1eX9w', 'YouTube — Global Cycling Network'),
('20000000-0000-0000-0000-000000000007', 'video', 'first_week', '10 Things I Wish I''d Known When I Started Cycling', 'https://www.youtube.com/watch?v=PsNFn2mmVNg', 'YouTube — road.cc'),
('20000000-0000-0000-0000-000000000007', 'video', 'beginner_mistakes', 'Stop Making These 10 Beginner Cycling Mistakes! (Ride Better Instantly)', 'https://www.youtube.com/watch?v=2vGJtEncEzw', 'YouTube — JOEL CHAVEZ'),
('20000000-0000-0000-0000-000000000007', 'video', 'progression_story', 'MY 1 YEAR CYCLING TRANSFORMATION!', 'https://www.youtube.com/watch?v=eT_cQkfEgL4', 'YouTube — Pedaler');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000007', 'Comfortable riding 5-10 miles', 'Rides confidently on quiet roads or paths for 5-10 miles.', 'Month 1', 1),
('20000000-0000-0000-0000-000000000007', 'Riding 20+ miles', 'Comfortable completing a 20+ mile ride, including some hills.', 'Month 3', 2),
('20000000-0000-0000-0000-000000000007', 'Consistent weekly rides', 'Rides consistently each week, including group rides or moderate climbs.', 'Month 6', 3),
('20000000-0000-0000-0000-000000000007', 'Long-distance ready', 'Comfortable attempting a metric century (100k) or multi-day tour.', 'Month 12', 4);

-- ═══════════════════════════════════════════════════════════════════════
-- TECHNICAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Robotics ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000002', 'Arduino Uno R3 board', true, 20, 30, 'https://www.amazon.com/s?k=arduino+uno+r3', null),
('30000000-0000-0000-0000-000000000002', 'Breadboard and jumper wire kit', true, 10, 15, 'https://www.amazon.com/s?k=breadboard+jumper+wire+kit', null),
('30000000-0000-0000-0000-000000000002', 'Beginner sensor and motor kit (servo, DC motors, ultrasonic sensor)', true, 25, 45, 'https://www.amazon.com/s?k=arduino+robot+sensor+motor+kit', null),
('30000000-0000-0000-0000-000000000002', 'Arduino IDE (free software)', true, 0, 0, 'https://www.arduino.cc/en/software', null),
('30000000-0000-0000-0000-000000000002', 'Digital multimeter', false, 15, 25, 'https://www.amazon.com/s?k=digital+multimeter', 'Handy for checking wiring, not required for your first robot');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000002', 1, 'Set Up Your First Robotics Toolkit', 'Get your board, editor, and basic circuit knowledge in place.', '["Unbox your Arduino kit and install the Arduino IDE", "Run the classic blink-an-LED sketch", "Learn the basics of voltage, current, and resistance"]'),
('30000000-0000-0000-0000-000000000002', 2, 'Motors & Sensors', 'Start moving things and sensing the world around your robot.', '["Wire up a DC motor through a motor driver (e.g. L298N)", "Add an ultrasonic sensor and read distance values", "Combine motor and sensor code in one sketch"]'),
('30000000-0000-0000-0000-000000000002', 3, 'Build a Simple Rover', 'Turn your parts into a real, moving robot.', '["Assemble a small chassis with motors and wheels", "Write obstacle-avoidance logic using your sensor", "Test, debug, and get your robot driving reliably"]'),
('30000000-0000-0000-0000-000000000002', 4, 'Add Autonomy & Share', 'Extend your rover and start showing your work.', '["Tune your obstacle-avoidance behavior", "Add remote control via Bluetooth or IR", "Document your build and share it online"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000002', 'video', 'first_30_minutes', '[First Step] Robotics Tutorial for Beginners | Top Tools you Need for Robotics', 'https://www.youtube.com/watch?v=o-JpETg0Xfg', 'YouTube — RootSaid'),
('30000000-0000-0000-0000-000000000002', 'video', 'first_week', 'How to start learning Robotics as an absolute Beginner - 3-Step Process', 'https://www.youtube.com/watch?v=wScPdKi4160', 'YouTube — Learn Robotics & AI'),
('30000000-0000-0000-0000-000000000002', 'video', 'beginner_mistakes', 'How to get started with Robotics? [MUST KNOW TIPS] Building Robots for Beginners', 'https://www.youtube.com/watch?v=NRj6gzah7JA', 'YouTube — RootSaid'),
('30000000-0000-0000-0000-000000000002', 'video', 'progression_story', 'How I started in Robotics? Getting started with Electronics and Robotics', 'https://www.youtube.com/watch?v=dSY50kRKic4', 'YouTube — RootSaid');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000002', 'Comfortable with basic circuits and code', 'Can wire a breadboard circuit and upload Arduino sketches without help.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000002', 'Built first moving robot', 'Has built and debugged a simple wheeled robot with sensor-based obstacle avoidance.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000002', 'Combines electronics and code independently', 'Can wire a new sensor or motor and write matching code without following a tutorial step by step.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000002', 'Ready to specialize', 'Can build an autonomous robot project end to end and is ready to specialize (competition robotics, drones, etc.).', 'Month 12', 4);

-- ─── 3D Printing ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000003', 'Entry-level FDM 3D printer', true, 200, 400, 'https://www.amazon.com/s?k=entry+level+fdm+3d+printer', null),
('30000000-0000-0000-0000-000000000003', 'PLA filament (starter spools)', true, 20, 30, 'https://www.amazon.com/s?k=pla+filament+1kg', null),
('30000000-0000-0000-0000-000000000003', 'Cura slicer software (free)', true, 0, 0, 'https://ultimaker.com/software/ultimaker-cura/', null),
('30000000-0000-0000-0000-000000000003', 'Print removal tool kit (scraper, tweezers, side cutters)', true, 10, 20, 'https://www.amazon.com/s?k=3d+print+removal+tool+kit', null),
('30000000-0000-0000-0000-000000000003', 'Digital calipers', false, 10, 20, 'https://www.amazon.com/s?k=digital+calipers', 'Useful once you start dialing in tolerances on your own designs');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000003', 1, 'Unbox & Calibrate', 'Get your printer assembled, leveled, and printing.', '["Assemble or unbox your printer and level the bed", "Install Cura and load your first model file", "Print a calibration cube successfully"]'),
('30000000-0000-0000-0000-000000000003', 2, 'Materials & Slicer Settings', 'Understand the settings that actually change your prints.', '["Learn the differences between PLA, PETG, and ABS", "Understand layer height, infill, and print speed", "Print 3 pre-made models from a site like Thingiverse"]'),
('30000000-0000-0000-0000-000000000003', 3, 'Troubleshooting & First Custom Print', 'Learn to diagnose problems instead of just restarting prints.', '["Diagnose and fix a failed print (stringing, warping, poor adhesion)", "Download and modify a simple existing model", "Successfully print a model that needs supports"]'),
('30000000-0000-0000-0000-000000000003', 4, 'Finishing & Sharing', 'Turn prints into finished, useful objects.', '["Learn post-processing basics (sanding, gluing, support removal)", "Print something functional you will actually use", "Share your prints online and get feedback"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000003', 'video', 'first_30_minutes', '3D Printing for ABSOLUTE Beginners: Step by Step Cura Tutorial', 'https://www.youtube.com/watch?v=Px_pwZKif8I', 'YouTube — Mark It Made'),
('30000000-0000-0000-0000-000000000003', 'video', 'first_week', 'A 3D printing checklist every beginner needs to know!', 'https://www.youtube.com/watch?v=rLoBMcxkVQM', 'YouTube — Maker''s Muse'),
('30000000-0000-0000-0000-000000000003', 'video', 'beginner_mistakes', '5 Beginner 3D Printing Mistakes (And How to AVOID Them!)', 'https://www.youtube.com/watch?v=psnoNQpAz-Y', 'YouTube — STLFLIX - 3D Printing'),
('30000000-0000-0000-0000-000000000003', 'video', 'progression_story', '1 year with a 3D printer - here''s what I learned.', 'https://www.youtube.com/watch?v=NmApjrWrE6Y', 'YouTube — Dylan Macintosh');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000003', 'Comfortable with slicer basics', 'Can level the bed, load filament, and slice/print a model without hand-holding.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000003', 'Printed several models successfully', 'Has completed multiple prints across different materials with few failures.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000003', 'Troubleshoots failed prints independently', 'Diagnoses warping, stringing, and adhesion issues and adjusts settings without outside help.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000003', 'Ready to design own models', 'Comfortable modifying or designing simple models in CAD and running multi-material or advanced prints.', 'Month 12', 4);

-- ─── Electronics ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000004', 'Breadboard and jumper wire kit', true, 10, 15, 'https://www.amazon.com/s?k=breadboard+jumper+wire+kit', null),
('30000000-0000-0000-0000-000000000004', 'Basic component kit (resistors, LEDs, capacitors, transistors)', true, 15, 25, 'https://www.amazon.com/s?k=electronics+component+starter+kit', null),
('30000000-0000-0000-0000-000000000004', 'Digital multimeter', true, 15, 30, 'https://www.amazon.com/s?k=digital+multimeter', null),
('30000000-0000-0000-0000-000000000004', 'Soldering iron kit', false, 20, 40, 'https://www.amazon.com/s?k=soldering+iron+kit', 'Not needed until you move past breadboard-only circuits'),
('30000000-0000-0000-0000-000000000004', 'Beginner microcontroller board (e.g. Arduino)', false, 15, 25, 'https://www.amazon.com/s?k=arduino+uno', 'Optional until you want to add programming to your circuits');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000004', 1, 'Circuits 101', 'Learn the core concepts every circuit depends on.', '["Learn voltage, current, resistance, and Ohm''s law", "Build your first LED circuit on a breadboard", "Learn to read a simple circuit schematic"]'),
('30000000-0000-0000-0000-000000000004', 2, 'Components & Multimeter', 'Get comfortable with the parts and the tool that measures them.', '["Learn resistors, capacitors, diodes, and transistors", "Practice using a multimeter to measure voltage and resistance", "Build a simple switch-controlled circuit"]'),
('30000000-0000-0000-0000-000000000004', 3, 'Bigger Circuits', 'Combine components into something more capable.', '["Build a circuit with multiple components (e.g. a 555 timer or transistor amplifier)", "Practice basic soldering on a scrap board", "Complete a small beginner electronics kit project"]'),
('30000000-0000-0000-0000-000000000004', 4, 'Programmable Electronics', 'Bring code into your circuits.', '["Connect a microcontroller to a breadboard circuit", "Write a simple program to control an LED or read a sensor", "Debug a non-working circuit using your multimeter"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000004', 'video', 'first_30_minutes', 'Beginner''s Guide to Electronics in 20 minutes!', 'https://www.youtube.com/watch?v=0ravzzdjVus', 'YouTube — The Tinkering Techie'),
('30000000-0000-0000-0000-000000000004', 'video', 'first_week', 'How to use a breadboard to build circuits! a cozy, beginner friendly intro', 'https://www.youtube.com/watch?v=kvnodnZvPX0', 'YouTube — jen foxbot'),
('30000000-0000-0000-0000-000000000004', 'video', 'beginner_mistakes', '10 Common Beginner Circuit Mistakes', 'https://www.youtube.com/watch?v=0Kdas77paY4', 'YouTube — Ben Finio'),
('30000000-0000-0000-0000-000000000004', 'video', 'progression_story', 'Starting to Teach Myself Electronics', 'https://www.youtube.com/watch?v=ymTwVM9Tiac', 'YouTube — ProjectMaria');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000004', 'Comfortable with basic circuits', 'Can build and read simple breadboard circuits with resistors, LEDs, and switches.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000004', 'Comfortable soldering and using a multimeter', 'Solders basic joints cleanly and diagnoses circuits using a multimeter.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000004', 'Builds small independent projects', 'Designs and builds small circuits (timers, sensor circuits) from scratch.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000004', 'Ready to specialize', 'Comfortable combining electronics with microcontrollers and code for custom projects.', 'Month 12', 4);

-- ─── Woodworking ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000005', 'Basic hand tool set (tape measure, square, chisel, hand saw)', true, 40, 70, 'https://www.amazon.com/s?k=beginner+woodworking+hand+tool+set', null),
('30000000-0000-0000-0000-000000000005', 'Cordless drill/driver', true, 60, 100, 'https://www.amazon.com/s?k=cordless+drill+driver', null),
('30000000-0000-0000-0000-000000000005', 'Random orbital sander', true, 40, 60, 'https://www.amazon.com/s?k=random+orbital+sander', null),
('30000000-0000-0000-0000-000000000005', 'Clamps (assorted pack)', true, 20, 40, 'https://www.amazon.com/s?k=woodworking+clamps+assorted', null),
('30000000-0000-0000-0000-000000000005', 'Circular saw or compact miter saw', false, 100, 200, 'https://www.amazon.com/s?k=compact+miter+saw', 'A hand saw and square get you through your first project; add power cutting tools once you catch the bug');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000005', 1, 'Tools & Safety', 'Learn your tools and how to use them without hurting yourself.', '["Learn the names and uses of core hand and power tools", "Learn safe workshop practices and required PPE (eye/ear protection)", "Practice measuring and marking accurately"]'),
('30000000-0000-0000-0000-000000000005', 2, 'Basic Joinery', 'Practice the cuts and joints behind almost every project.', '["Practice straight, accurate cuts with a saw", "Learn simple joints (butt joint, pocket hole)", "Build a simple practice piece (shelf or small box)"]'),
('30000000-0000-0000-0000-000000000005', 3, 'First Real Project', 'Take on a complete beginner-friendly build.', '["Select and plan a beginner project (stool, planter, or cutting board)", "Cut and assemble all the pieces", "Sand and prep the piece for finishing"]'),
('30000000-0000-0000-0000-000000000005', 4, 'Finishing & Beyond', 'Finish your first project and plan your next one.', '["Apply a wood finish (stain, oil, or polyurethane)", "Complete and evaluate your first project", "Plan a slightly harder second project"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000005', 'video', 'first_30_minutes', 'A Total Beginner''s Guide to Woodworking', 'https://www.youtube.com/watch?v=zCNgrOR8FEU', 'YouTube — Steve Ramsey - Woodworking for Mere Mortals'),
('30000000-0000-0000-0000-000000000005', 'video', 'first_week', 'First 13 Tools Every Beginner Woodworker Should Buy (in order)', 'https://www.youtube.com/watch?v=boQaig2rs9I', 'YouTube — 731 Woodworks'),
('30000000-0000-0000-0000-000000000005', 'video', 'beginner_mistakes', 'AVOID these 5 common BEGINNER woodworking MISTAKES', 'https://www.youtube.com/watch?v=YRz8UMdW7P4', 'YouTube — How I Do Things Woodworking'),
('30000000-0000-0000-0000-000000000005', 'video', 'progression_story', 'Don''t Find a Job, Make One: My First Year in Woodworking', 'https://www.youtube.com/watch?v=c9O_5kSnU5E', 'YouTube — cmyk studio');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000005', 'Comfortable with core tools', 'Uses hand and power tools safely and confidently for basic cuts.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000005', 'Completed first project', 'Has built and finished at least one small functional piece.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000005', 'Builds with proper joinery', 'Uses real joinery techniques (dados, pocket holes, mortise and tenon) confidently.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000005', 'Ready to design own projects', 'Plans and builds original furniture-scale projects independently.', 'Month 12', 4);

-- ─── PC Building ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000006', 'Anti-static wrist strap', true, 8, 12, 'https://www.amazon.com/s?k=anti+static+wrist+strap', null),
('30000000-0000-0000-0000-000000000006', 'Magnetic precision screwdriver set', true, 8, 15, 'https://www.amazon.com/s?k=magnetic+precision+screwdriver+set', null),
('30000000-0000-0000-0000-000000000006', 'Cable ties and cable management kit', true, 8, 15, 'https://www.amazon.com/s?k=cable+management+kit', null),
('30000000-0000-0000-0000-000000000006', 'Thermal paste', true, 8, 15, 'https://www.amazon.com/s?k=thermal+paste', 'Skip if your cooler already ships with paste pre-applied'),
('30000000-0000-0000-0000-000000000006', 'PC building mat / workspace tray', false, 15, 25, 'https://www.amazon.com/s?k=pc+building+mat', 'A towel on a clean table works fine to start');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000006', 1, 'Plan Your Build', 'Pick compatible parts before you spend a dollar.', '["Choose compatible parts: CPU, motherboard, RAM, storage, PSU, case", "Verify your parts list with a compatibility checker like PCPartPicker", "Set up a clean, static-safe workspace"]'),
('30000000-0000-0000-0000-000000000006', 2, 'Core Assembly', 'Get the heart of the build together.', '["Install the CPU, RAM, and M.2/SSD onto the motherboard", "Mount the motherboard in the case and install the PSU", "Install the cooler and apply thermal paste"]'),
('30000000-0000-0000-0000-000000000006', 3, 'Wiring & First Boot', 'Connect everything and see it come alive.', '["Connect all power and data cables", "Connect the front panel headers correctly", "Complete your first boot into the BIOS"]'),
('30000000-0000-0000-0000-000000000006', 4, 'OS & Optimization', 'Turn a booting PC into a finished, stable machine.', '["Install the OS and drivers", "Tidy up cable management", "Run a stress test/benchmark and confirm stability"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000006', 'video', 'first_30_minutes', 'How to Build a PC - Step by Step Beginners Guide 2026', 'https://www.youtube.com/watch?v=GJco1hgmOAw', 'YouTube — Christopher Flannigan'),
('30000000-0000-0000-0000-000000000006', 'video', 'first_week', 'How to Build a PC for Beginners Step by Step! Part 1: Parts Explained', 'https://www.youtube.com/watch?v=jLXL7BskZ5w', 'YouTube — Shannon Morse'),
('30000000-0000-0000-0000-000000000006', 'video', 'beginner_mistakes', 'Common PC Building Mistakes that Beginners Make!', 'https://www.youtube.com/watch?v=-8LMML_EiMg', 'YouTube — JayzTwoCents'),
('30000000-0000-0000-0000-000000000006', 'video', 'progression_story', 'i finally built my first gaming pc!!! (no experience)', 'https://www.youtube.com/watch?v=mmMj6P97O2s', 'YouTube — Gadgetsu');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000006', 'Comfortable identifying and handling parts', 'Recognizes core components and handles them safely with ESD awareness.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000006', 'Built first working PC', 'Has completed a full build that boots and passes stress tests.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000006', 'Troubleshoots issues independently', 'Diagnoses POST failures, driver issues, and thermal problems without outside help.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000006', 'Ready to build for others', 'Plans custom builds for specific budgets and use cases, and helps others build.', 'Month 12', 4);

-- ─── Home Automation ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('30000000-0000-0000-0000-000000000007', 'Smart speaker/hub (e.g. Echo or Google Home)', true, 30, 50, 'https://www.amazon.com/s?k=smart+speaker+hub', null),
('30000000-0000-0000-0000-000000000007', 'Smart plugs (2-pack)', true, 15, 25, 'https://www.amazon.com/s?k=smart+plug+2+pack', null),
('30000000-0000-0000-0000-000000000007', 'Smart bulbs (starter pack)', true, 20, 40, 'https://www.amazon.com/s?k=smart+bulb+starter+pack', null),
('30000000-0000-0000-0000-000000000007', 'Zigbee/Z-Wave hub or bridge', false, 30, 50, 'https://www.amazon.com/s?k=zigbee+z-wave+hub', 'Only needed once you add non-wifi smart devices'),
('30000000-0000-0000-0000-000000000007', 'Mini PC or Raspberry Pi for local automation server', false, 50, 100, 'https://www.amazon.com/s?k=raspberry+pi', 'Optional until you want local, privacy-focused control via Home Assistant');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('30000000-0000-0000-0000-000000000007', 1, 'First Devices', 'Get your first smart devices talking to your phone.', '["Set up a smart speaker/hub and its app", "Add your first smart plug and smart bulb", "Create a manual on/off routine for both"]'),
('30000000-0000-0000-0000-000000000007', 2, 'Automations 101', 'Learn the logic behind every automation.', '["Learn the trigger, condition, action automation model", "Build a simple time-based automation (lights on/off at set times)", "Build a simple event-based automation (motion-triggered light)"]'),
('30000000-0000-0000-0000-000000000007', 3, 'Expand Your Setup', 'Bring more devices and brands into one system.', '["Add a second device type (thermostat, sensor, or lock)", "Connect devices across brands using a single hub", "Back up your automation configuration"]'),
('30000000-0000-0000-0000-000000000007', 4, 'Reliability & Security', 'Make your smart home dependable and secure.', '["Explore Home Assistant for local, privacy-focused control (optional)", "Enable two-factor authentication and secure remote access", "Document your automations and overall system layout"]');

insert into resources (hobby_id, type, category, title, url, source) values
('30000000-0000-0000-0000-000000000007', 'video', 'first_30_minutes', 'Smart Home Automation: The Ultimate Beginner''s Guide', 'https://www.youtube.com/watch?v=iGUdMke-Ao4', 'YouTube — yoyoTech'),
('30000000-0000-0000-0000-000000000007', 'video', 'first_week', 'My Ultimate Beginner Smart Home Setup (2026 Edition)', 'https://www.youtube.com/watch?v=2kI83Q8gwj4', 'YouTube — Automate Your Life'),
('30000000-0000-0000-0000-000000000007', 'video', 'beginner_mistakes', '5 Home Assistant Beginner MISTAKES to Avoid!', 'https://www.youtube.com/watch?v=i1083cCR2CI', 'YouTube — Everything Smart Home'),
('30000000-0000-0000-0000-000000000007', 'video', 'progression_story', 'What 4 Years of Working On My Smart Home Looks Like', 'https://www.youtube.com/watch?v=rOOrkO_b4u4', 'YouTube — Jimmy Tries World');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000007', 'Comfortable with basic device setup', 'Sets up and controls several smart devices from a phone app.', 'Month 1', 1),
('30000000-0000-0000-0000-000000000007', 'Built working automations', 'Has built time-based and trigger-based automations across 2+ device types.', 'Month 3', 2),
('30000000-0000-0000-0000-000000000007', 'Runs a multi-brand connected system', 'Integrates devices from multiple brands under one hub or app reliably.', 'Month 6', 3),
('30000000-0000-0000-0000-000000000007', 'Ready for advanced local automation', 'Runs a self-hosted or advanced automation platform with backups and security best practices.', 'Month 12', 4);

-- ═══════════════════════════════════════════════════════════════════════
-- OUTDOOR hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Hiking ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000002', 'Hiking boots or trail running shoes', true, 60, 150, 'https://www.amazon.com/s?k=hiking+boots', null),
('40000000-0000-0000-0000-000000000002', 'Daypack (18-25L)', true, 30, 80, 'https://www.amazon.com/s?k=hiking+daypack', null),
('40000000-0000-0000-0000-000000000002', 'Water bottles or hydration reservoir', true, 15, 40, 'https://www.amazon.com/s?k=hydration+bladder+hiking', null),
('40000000-0000-0000-0000-000000000002', 'Moisture-wicking layers & packable rain shell', true, 30, 90, 'https://www.amazon.com/s?k=hiking+rain+jacket', null),
('40000000-0000-0000-0000-000000000002', 'Trekking poles', false, 20, 60, 'https://www.amazon.com/s?k=trekking+poles', 'Not required for flat, well-maintained trails');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000002', 1, 'Find Your First Trails', 'Get comfortable walking outdoors with the right basics.', '["Choose 2-3 easy, well-marked local trails under 3 miles", "Break in your shoes and pack a basic daypack", "Download a trail app (like AllTrails) and check conditions before heading out"]'),
('40000000-0000-0000-0000-000000000002', 2, 'Build Trail Habits', 'Learn to read trails and take care of your body on them.', '["Practice pacing and the 10% weekly mileage rule", "Learn to layer clothing for changing weather", "Pack the ''ten essentials'' (map, water, snacks, first aid, etc.)"]'),
('40000000-0000-0000-0000-000000000002', 3, 'Handle Tougher Terrain', 'Step up to trails with more elevation and distance.', '["Try a trail with real elevation gain", "Practice reading a map/compass or an offline GPS app", "Learn basic trail etiquette and Leave No Trace principles"]'),
('40000000-0000-0000-0000-000000000002', 4, 'Plan Bigger Adventures', 'Turn hiking into an ongoing habit.', '["Complete a hike of 5+ miles or a notable local landmark", "Plan a hike with a friend or local hiking group", "Set a goal for your next season (a peak, park, or distance)"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000002', 'video', 'first_30_minutes', 'HIKING TIPS for BEGINNERS | The ULTIMATE Guide on HOW TO START HIKING | Hiking 101', 'https://www.youtube.com/watch?v=oz_8XFA58Mc', 'YouTube — Jeanie Marie'),
('40000000-0000-0000-0000-000000000002', 'video', 'first_week', 'Watch this when you''re ready to get into hiking (a beginner''s guide)', 'https://www.youtube.com/watch?v=upj7N22EMZA', 'YouTube — Fareweld'),
('40000000-0000-0000-0000-000000000002', 'video', 'beginner_mistakes', '5 Mistakes Most Beginner Hikers Make (How to Avoid Them)', 'https://www.youtube.com/watch?v=l0DVzME1_2A', 'YouTube — Oscar Hikes'),
('40000000-0000-0000-0000-000000000002', 'video', 'progression_story', 'My Hiking Transformation Story', 'https://www.youtube.com/watch?v=SYEpDQ30RoA', 'YouTube — James Appleton');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000002', 'First trail completed', 'Finished a first easy, well-marked hike with a fully packed daypack.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000002', 'Comfortable with terrain', 'Comfortably hikes moderate trails with elevation gain and reads a map or GPS app.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000002', 'Tackles longer hikes', 'Regularly hikes 5+ mile trails and packs the ten essentials without a checklist.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000002', 'Plans own trips', 'Plans and leads multi-hour hikes; has explored multiple parks or regions.', 'Month 12', 4);

-- ─── Fishing ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000003', 'Spinning rod and reel combo', true, 30, 80, 'https://www.amazon.com/s?k=spinning+rod+reel+combo', null),
('40000000-0000-0000-0000-000000000003', 'Monofilament fishing line', true, 5, 15, 'https://www.amazon.com/s?k=monofilament+fishing+line', null),
('40000000-0000-0000-0000-000000000003', 'Tackle kit (hooks, weights, bobbers, swivels)', true, 15, 40, 'https://www.amazon.com/s?k=fishing+tackle+kit', null),
('40000000-0000-0000-0000-000000000003', 'Needle-nose pliers & line clippers', true, 10, 25, 'https://www.amazon.com/s?k=fishing+pliers+line+clippers', null),
('40000000-0000-0000-0000-000000000003', 'Landing net', false, 15, 35, 'https://www.amazon.com/s?k=fishing+landing+net', 'Handy but not required when starting out at a bank or dock');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000003', 1, 'Get Your License & Learn to Cast', 'Handle the legal and mechanical basics before your first outing.', '["Buy a state fishing license", "Learn to tie a basic improved clinch knot", "Practice casting a spinning combo in a yard or park"]'),
('40000000-0000-0000-0000-000000000003', 2, 'Catch Your First Fish', 'Get on the water and land your first catch.', '["Fish a stocked pond or easy local spot", "Learn to rig a simple bobber-and-worm setup", "Practice patience and reading where fish hold"]'),
('40000000-0000-0000-0000-000000000003', 3, 'Read the Water', 'Start understanding fish behavior and different techniques.', '["Try a different technique (lures, bait fishing, or basic fly casting)", "Learn to identify structure (drop-offs, weed lines, shade)", "Practice safe catch-and-release handling"]'),
('40000000-0000-0000-0000-000000000003', 4, 'Expand Your Skills', 'Build toward being a self-sufficient angler.', '["Try a new species or a new body of water", "Learn to read a local fishing report or forecast", "Set a personal goal (species, size, or number of trips)"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000003', 'video', 'first_30_minutes', 'How To Start Fishing - A guide to your first days fishing', 'https://www.youtube.com/watch?v=atd28n7CB-c', 'YouTube — Fishing Tutorials'),
('40000000-0000-0000-0000-000000000003', 'video', 'first_week', 'Everything You Need to Start Fishing (Beginner Checklist)', 'https://www.youtube.com/watch?v=Me8C95LKN1E', 'YouTube — Bearded Dad Fishing'),
('40000000-0000-0000-0000-000000000003', 'video', 'beginner_mistakes', '15 Beginner Fishing Mistakes RUINING Your Chances (Stop Doing These!)', 'https://www.youtube.com/watch?v=DR4stUQ_L3o', 'YouTube — Juran Angling'),
('40000000-0000-0000-0000-000000000003', 'video', 'progression_story', 'I Spent 30 Days Fishing With No Experience', 'https://www.youtube.com/watch?v=VYhm4KenbAE', 'YouTube — Ryan Goated Fishing');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000003', 'First catch', 'Landed a first fish and can rig a basic bobber setup unassisted.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000003', 'Comfortable casting', 'Casts confidently, ties basic knots, and fishes a couple of techniques.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000003', 'Reads the water', 'Identifies likely fish-holding structure and adapts bait/lures to conditions.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000003', 'Explores new waters', 'Fishes multiple locations and species, and helps mentor other beginners.', 'Month 12', 4);

-- ─── Bird Watching ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000004', 'Binoculars (8x42)', true, 60, 200, 'https://www.amazon.com/s?k=birding+binoculars+8x42', null),
('40000000-0000-0000-0000-000000000004', 'Regional bird field guide', true, 15, 30, 'https://www.amazon.com/s?k=bird+field+guide', null),
('40000000-0000-0000-0000-000000000004', 'Birding notebook or journal', true, 5, 15, 'https://www.amazon.com/s?k=birding+journal+notebook', null),
('40000000-0000-0000-0000-000000000004', 'Comfortable outdoor layers & hat', true, 20, 60, 'https://www.amazon.com/s?k=outdoor+birding+clothing', null),
('40000000-0000-0000-0000-000000000004', 'Spotting scope with tripod', false, 150, 400, 'https://www.amazon.com/s?k=spotting+scope+tripod', 'Only needed once you want detailed views of distant waterfowl or shorebirds');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000004', 1, 'Learn to See & Identify', 'Get comfortable with binoculars and basic ID.', '["Practice quickly finding birds in your binoculars", "Install a birding app (like Merlin Bird ID) for your area", "Identify 5 common backyard or park birds"]'),
('40000000-0000-0000-0000-000000000004', 2, 'Build a Birding Routine', 'Turn birding into a regular habit.', '["Visit the same local spot several times to learn its regulars", "Start a simple life list or journal", "Learn to notice size, shape, color, and behavior cues"]'),
('40000000-0000-0000-0000-000000000004', 3, 'Sharpen Your Ear & Eye', 'Add sound and habitat to your ID toolkit.', '["Learn 5-10 common bird calls", "Practice identifying birds by habitat and season", "Try birding at a new location (wetland, forest, or coastline)"]'),
('40000000-0000-0000-0000-000000000004', 4, 'Join the Birding Community', 'Connect with other birders and set new goals.', '["Join a local birding walk or Audubon chapter outing", "Log sightings on eBird", "Set a goal (a new species, new habitat, or a ''big day'')"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000004', 'video', 'first_30_minutes', 'A beginner''s guide to birdwatching', 'https://www.youtube.com/watch?v=22CzenMh5_k', 'YouTube — Countryside - Hampshire County Council'),
('40000000-0000-0000-0000-000000000004', 'video', 'first_week', 'Birdwatching 101: 10 Essential Tips for Beginners', 'https://www.youtube.com/watch?v=uuY_7i040ug', 'YouTube — Bright-Eyed Birding Learn'),
('40000000-0000-0000-0000-000000000004', 'video', 'beginner_mistakes', 'Beginning Birders Do These Things Wrong', 'https://www.youtube.com/watch?v=FZlFGqv_lZ4', 'YouTube — Bob Duchesne'),
('40000000-0000-0000-0000-000000000004', 'video', 'progression_story', 'LISTERS: A Glimpse Into Extreme Birdwatching (Official Movie Trailer)', 'https://www.youtube.com/watch?v=FLWCsw9CdcI', 'YouTube — Owen Reiser');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000004', 'Confident with binoculars', 'Quickly locates and follows birds through binoculars; knows 5+ common species.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000004', 'Growing life list', 'Keeps a running list of sightings and recognizes birds by call as well as sight.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000004', 'Explores new habitats', 'Birds regularly across multiple habitats and logs sightings on eBird.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000004', 'Active in the community', 'Participates in group birding outings and pursues a personal birding goal.', 'Month 12', 4);

-- ─── Camping ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000005', 'Tent (2-3 person)', true, 60, 200, 'https://www.amazon.com/s?k=camping+tent+2+person', null),
('40000000-0000-0000-0000-000000000005', 'Sleeping bag rated for the season', true, 30, 100, 'https://www.amazon.com/s?k=sleeping+bag', null),
('40000000-0000-0000-0000-000000000005', 'Sleeping pad', true, 20, 60, 'https://www.amazon.com/s?k=camping+sleeping+pad', null),
('40000000-0000-0000-0000-000000000005', 'Headlamp & basic fire-starting kit', true, 15, 35, 'https://www.amazon.com/s?k=headlamp+fire+starter+kit', null),
('40000000-0000-0000-0000-000000000005', 'Portable camp stove', false, 25, 70, 'https://www.amazon.com/s?k=camping+stove', 'Many first trips are fine with no-cook meals or a campground grill');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000005', 1, 'Practice at Home & Pack Smart', 'Get familiar with your gear before you''re in the field.', '["Set up your tent once in the yard or living room", "Build a packing checklist (shelter, sleep, food, safety)", "Pick a beginner-friendly campground close to home"]'),
('40000000-0000-0000-0000-000000000005', 2, 'Your First Overnight', 'Get through one full night comfortably.', '["Arrive at camp with daylight to spare and set up before dark", "Practice building and safely extinguishing a campfire", "Cook a simple no-fuss camp meal"]'),
('40000000-0000-0000-0000-000000000005', 3, 'Handle the Weather & Unknowns', 'Build confidence for less predictable conditions.', '["Camp through a cooler night or light rain", "Learn basic Leave No Trace and food storage practices", "Practice using a map or offline app to find your site"]'),
('40000000-0000-0000-0000-000000000005', 4, 'Expand Where & How You Camp', 'Move beyond the basics toward the trips you want to take.', '["Try a new location (state park, dispersed site, or with friends)", "Refine your gear list based on what you did and didn''t use", "Plan a longer or more remote trip"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000005', 'video', 'first_30_minutes', 'Your Complete Guide to Camping for Beginners! + Camping Tips and Advice', 'https://www.youtube.com/watch?v=DAVPFIosOck', 'YouTube — Izzythrills'),
('40000000-0000-0000-0000-000000000005', 'video', 'first_week', 'Beginner Camping Checklist 2026 | What You Actually Need for Your First Camping Trip', 'https://www.youtube.com/watch?v=Jah3JD7Obno', 'YouTube — Endless Pursuit Life'),
('40000000-0000-0000-0000-000000000005', 'video', 'beginner_mistakes', 'Don''t Make These 6 Camping MISTAKES', 'https://www.youtube.com/watch?v=x9LXPcKMDSE', 'YouTube — Be My Travel Muse'),
('40000000-0000-0000-0000-000000000005', 'video', 'progression_story', 'We Tried Our First Camping Holiday', 'https://www.youtube.com/watch?v=RN9hjBUIRXA', 'YouTube — Ash and Kels');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000005', 'First night camped', 'Successfully set up camp and slept through a full night outdoors.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000005', 'Handles the essentials', 'Builds a campfire safely and cooks simple meals at camp without help.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000005', 'Comfortable in conditions', 'Has camped through rain or cold and adjusted gear/plans accordingly.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000005', 'Plans own trips', 'Plans and packs for trips independently, including more remote or longer stays.', 'Month 12', 4);

-- ─── Stargazing ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000006', 'Binoculars (10x50)', true, 40, 100, 'https://www.amazon.com/s?k=astronomy+binoculars+10x50', null),
('40000000-0000-0000-0000-000000000006', 'Beginner telescope (tabletop or small Dobsonian)', false, 150, 350, 'https://www.amazon.com/s?k=beginner+telescope', 'Binoculars and the naked eye are enough to start; add a telescope once you know the sky a bit'),
('40000000-0000-0000-0000-000000000006', 'Red-light flashlight or headlamp', true, 10, 20, 'https://www.amazon.com/s?k=red+light+headlamp+astronomy', null),
('40000000-0000-0000-0000-000000000006', 'Star chart, planisphere, or stargazing app', true, 0, 15, 'https://www.amazon.com/s?k=planisphere+star+chart', null),
('40000000-0000-0000-0000-000000000006', 'Warm layers & reclining chair or blanket', true, 20, 60, 'https://www.amazon.com/s?k=camping+reclining+chair', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000006', 1, 'Learn the Sky With Your Eyes', 'Get oriented before adding any gear.', '["Download a sky map app (like Stellarium or SkyView)", "Find a nearby spot with lower light pollution", "Identify the Moon''s phase, one planet, and a major constellation"]'),
('40000000-0000-0000-0000-000000000006', 2, 'Add Binoculars', 'Start seeing more detail with basic gear.', '["Learn to steady binoculars and scan the Moon''s craters", "Find a bright deep-sky object like the Pleiades or Orion Nebula", "Track how the sky shifts night to night"]'),
('40000000-0000-0000-0000-000000000006', 3, 'Plan Around Conditions', 'Learn to work with (not against) weather and light.', '["Check a moon-phase and light-pollution forecast before heading out", "Practice dark adaptation and using a red light", "Try to spot a planet''s moons or rings with binoculars or a telescope"]'),
('40000000-0000-0000-0000-000000000006', 4, 'Go Deeper', 'Build toward a more serious hobby if you want one.', '["Attend a local astronomy club star party", "Try a beginner telescope if you haven''t already", "Set a goal (a meteor shower, an eclipse, or a short observing list)"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000006', 'video', 'first_30_minutes', 'Astronomy for Beginners - Getting Started Stargazing!', 'https://www.youtube.com/watch?v=XLgPe_f-QCc', 'YouTube — Orion Telescopes & Binoculars'),
('40000000-0000-0000-0000-000000000006', 'video', 'first_week', 'How To Use Any Telescope: From Setup To Stargazing', 'https://www.youtube.com/watch?v=eQ3IP60Fj9c', 'YouTube — LearnToStargaze'),
('40000000-0000-0000-0000-000000000006', 'video', 'beginner_mistakes', '7 Astrophotography MISTAKES Beginners Make', 'https://www.youtube.com/watch?v=6F5KY9skll8', 'YouTube — AstroBackyard'),
('40000000-0000-0000-0000-000000000006', 'video', 'progression_story', 'Astrophotography with a Beginner Telescope - Celestron Astromaster 130 - First Light', 'https://www.youtube.com/watch?v=tq2qkBpbRuM', 'YouTube — Ray''s Astrophotography');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000006', 'Learned the basics', 'Confidently finds the Moon, a planet, and major constellations unaided.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000006', 'Uses binoculars well', 'Regularly observes with binoculars and understands dark-sky planning.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000006', 'Explores with a telescope', 'Comfortable setting up and using a beginner telescope on multiple targets.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000006', 'Active stargazer', 'Attends star parties or events and tracks a personal observing list.', 'Month 12', 4);

-- ─── Foraging ─── --

insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('40000000-0000-0000-0000-000000000007', 'Regional foraging field guide', true, 15, 35, 'https://www.amazon.com/s?k=foraging+field+guide', null),
('40000000-0000-0000-0000-000000000007', 'Foraging knife or scissors', true, 10, 25, 'https://www.amazon.com/s?k=foraging+knife', null),
('40000000-0000-0000-0000-000000000007', 'Collection basket or breathable bag', true, 10, 25, 'https://www.amazon.com/s?k=foraging+basket', null),
('40000000-0000-0000-0000-000000000007', 'Gloves', true, 5, 15, 'https://www.amazon.com/s?k=gardening+foraging+gloves', null),
('40000000-0000-0000-0000-000000000007', 'Plant identification app subscription', false, 0, 30, 'https://www.amazon.com/s?k=plant+identification+app', 'Free versions cover most beginner needs');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('40000000-0000-0000-0000-000000000007', 1, 'Learn 2-3 Safe Plants', 'Start narrow and certain, not broad and risky.', '["Pick 2-3 common, easy-to-ID edibles with no dangerous lookalikes", "Study each plant''s key ID features and toxic lookalikes", "Join a local foraging walk or group if available"]'),
('40000000-0000-0000-0000-000000000007', 2, 'Forage Your First Harvest', 'Get hands-on with low-risk plants.', '["Identify and harvest a small amount of one plant with 100% certainty", "Practice sustainable harvesting (take only a small share of a patch)", "Try a simple recipe with your harvest"]'),
('40000000-0000-0000-0000-000000000007', 3, 'Expand Carefully', 'Add new species one at a time.', '["Learn one new plant per week using multiple ID sources", "Learn the toxic lookalikes for each new plant before harvesting it", "Note seasonal changes and where plants are found"]'),
('40000000-0000-0000-0000-000000000007', 4, 'Build Your Own Foraging Calendar', 'Turn foraging into a year-round habit.', '["Map out what''s in season locally over the next few months", "Try a new habitat (forest, coastline, or urban green space)", "Set a goal (a foraging class, a new plant family, or a seasonal dish)"]');

insert into resources (hobby_id, type, category, title, url, source) values
('40000000-0000-0000-0000-000000000007', 'video', 'first_30_minutes', 'How & What To know To Start Foraging For Wild Edibles - The Beginners Guide To Foraging', 'https://www.youtube.com/watch?v=TVUahL5P59E', 'YouTube — Home Is Where Our Heart Is'),
('40000000-0000-0000-0000-000000000007', 'video', 'first_week', 'Foraging for Beginners', 'https://www.youtube.com/watch?v=g9Ey7POtEeY', 'YouTube — Insteading'),
('40000000-0000-0000-0000-000000000007', 'video', 'beginner_mistakes', '10 Things I WISH I KNEW When Starting To Forage Wild Edibles & Medicinal Plants', 'https://www.youtube.com/watch?v=JXXrn7biqGY', 'YouTube — Trillium: Wild Edibles'),
('40000000-0000-0000-0000-000000000007', 'video', 'progression_story', 'The Year of Foraging - 2 Month Update', 'https://www.youtube.com/watch?v=8PMtULcmxXU', 'YouTube — Robin Greenfield');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000007', 'First safe harvest', 'Confidently identifies and harvests 2-3 common edible plants.', 'Month 1', 1),
('40000000-0000-0000-0000-000000000007', 'Growing plant knowledge', 'Knows 8-10 plants and their toxic lookalikes; forages sustainably.', 'Month 3', 2),
('40000000-0000-0000-0000-000000000007', 'Forages through seasons', 'Tracks seasonal changes and forages confidently across multiple habitats.', 'Month 6', 3),
('40000000-0000-0000-0000-000000000007', 'Builds a foraging calendar', 'Maintains a personal foraging calendar and helps mentor newer foragers.', 'Month 12', 4);

-- ═══════════════════════════════════════════════════════════════════════
-- SOCIAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- ─── Board Games ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000002', 'Core beginner-friendly board games (e.g. Ticket to Ride, Catan, Codenames)', true, 30, 60, 'https://www.amazon.com/s?k=beginner+board+games', null),
('50000000-0000-0000-0000-000000000002', 'Card sleeves for protecting components', false, 5, 15, 'https://www.amazon.com/s?k=card+sleeves+board+games', null),
('50000000-0000-0000-0000-000000000002', 'Dice tray or playmat', false, 10, 25, 'https://www.amazon.com/s?k=dice+tray', 'Optional but keeps small pieces contained'),
('50000000-0000-0000-0000-000000000002', 'Score pad, notepad, and pencils', true, 0, 5, 'https://www.amazon.com/s?k=notepad+and+pencils', 'Most households already have this'),
('50000000-0000-0000-0000-000000000002', 'Storage bins or shelving for game boxes', false, 15, 40, 'https://www.amazon.com/s?k=board+game+storage', null);

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000002', 1, 'Learn the Rules & Play Your First Game', 'Get comfortable with turn structure, basic strategy, and rules-reading.', '["Pick 1-2 approachable games (e.g. Ticket to Ride, Catan)", "Watch a rules-explanation video before playing", "Play a full game start to finish with friends or family"]'),
('50000000-0000-0000-0000-000000000002', 2, 'Explore Different Game Types', 'Sample the major categories to find what you enjoy most.', '["Try a cooperative game and a competitive game", "Try a party game with a larger group", "Note which mechanics you enjoyed (bluffing, deck-building, worker placement)"]'),
('50000000-0000-0000-0000-000000000002', 3, 'Host Your Own Game Night', 'Take ownership of organizing the session.', '["Invite 3-5 people for a game night", "Teach a game you''ve learned to a new player", "Plan a rotation of 2-3 games for the night"]'),
('50000000-0000-0000-0000-000000000002', 4, 'Build Your Starter Collection', 'Turn the hobby into an ongoing habit.', '["Pick 2-3 games to add to your own collection", "Join a local board game meetup or online community", "Schedule a recurring game night"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000002', 'video', 'first_30_minutes', 'The Absolute Beginner''s Guide to Board Games', 'https://www.youtube.com/watch?v=CzV5VoLaOsI', 'YouTube — RollingReggie'),
('50000000-0000-0000-0000-000000000002', 'video', 'first_week', 'How to Build a Board Game Collection You''ll ACTUALLY PLAY', 'https://www.youtube.com/watch?v=9Hg-ruK86-Q', 'YouTube — EZBoardGames'),
('50000000-0000-0000-0000-000000000002', 'video', 'beginner_mistakes', 'AVOID These Board Game Mistakes (I Learned the Hard Way!)', 'https://www.youtube.com/watch?v=oiCGbx7zKZQ', 'YouTube — Board With Steve'),
('50000000-0000-0000-0000-000000000002', 'video', 'progression_story', 'This Game LITERALLY Changed My Life! (And How I Got Into Board Games!)', 'https://www.youtube.com/watch?v=H0vgJ6nfo_c', 'YouTube — BoardGameDave');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000002', 'Comfortable teaching a game', 'Can read a rulebook independently and teach a simple game to new players.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000002', 'Has a go-to game night rotation', 'Owns or has access to a handful of favorites across different categories and hosts regularly.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000002', 'Explores deeper strategy games', 'Comfortable with medium-weight strategy games and understands core mechanics like worker placement or deck-building.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000002', 'Part of the hobby community', 'Has a personal collection of 15+ games, attends meetups or conventions, and helps others get into the hobby.', 'Month 12', 4);

-- ─── Volunteering ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000003', 'A local cause or organization to volunteer with', true, 0, 0, null, 'Find one through VolunteerMatch, Idealist, or a local nonprofit''s website'),
('50000000-0000-0000-0000-000000000003', 'Comfortable closed-toe shoes and weather-ready clothing', true, 0, 40, 'https://www.amazon.com/s?k=comfortable+work+shoes', 'Most people already own something suitable'),
('50000000-0000-0000-0000-000000000003', 'A reusable water bottle', true, 5, 15, 'https://www.amazon.com/s?k=reusable+water+bottle', null),
('50000000-0000-0000-0000-000000000003', 'A notebook to log hours and reflections', false, 0, 10, 'https://www.amazon.com/s?k=notebook', null),
('50000000-0000-0000-0000-000000000003', 'Work gloves for hands-on volunteering (cleanups, gardening, etc.)', false, 5, 15, 'https://www.amazon.com/s?k=work+gloves', 'Only needed for physical volunteer work');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000003', 1, 'Find Your Cause & Sign Up', 'Narrow down what kind of volunteering fits your interests and schedule.', '["List 2-3 causes you care about", "Research 3 local organizations or use VolunteerMatch/Idealist", "Sign up for an orientation or first shift"]'),
('50000000-0000-0000-0000-000000000003', 2, 'Complete Your First Shift', 'Get comfortable with the actual work and environment.', '["Attend orientation and complete your first shift", "Ask questions about expectations and safety", "Reflect on what you enjoyed and what felt hard"]'),
('50000000-0000-0000-0000-000000000003', 3, 'Build a Regular Rhythm', 'Turn a one-off shift into a repeatable habit.', '["Commit to a recurring schedule (weekly or biweekly)", "Get to know staff and other volunteers", "Identify a specific role or skill you can contribute"]'),
('50000000-0000-0000-0000-000000000003', 4, 'Deepen Your Involvement', 'Move from showing up to actively contributing.', '["Take on a bit more responsibility or a specialized task", "Invite a friend to join you", "Reflect on the impact you''re seeing so far"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000003', 'video', 'first_30_minutes', 'What it''s *actually* like volunteering in NYC (how to get started)', 'https://www.youtube.com/watch?v=kQIy5B1eNwk', 'YouTube — Chelsea Callahan'),
('50000000-0000-0000-0000-000000000003', 'video', 'first_week', 'How To Volunteer The Right Way', 'https://www.youtube.com/watch?v=G51K97fLYJs', 'YouTube — THEGLOBALTEMI'),
('50000000-0000-0000-0000-000000000003', 'video', 'beginner_mistakes', 'Avoiding Volunteer Burnout: Key Tips for Balancing Commitments', 'https://www.youtube.com/watch?v=wesFc1gsUKc', 'YouTube — Alces Flight'),
('50000000-0000-0000-0000-000000000003', 'video', 'progression_story', 'How volunteering changed my life: Darryl''s story', 'https://www.youtube.com/watch?v=nBUqdpd7CUA', 'YouTube — vinspired');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000003', 'Completed first volunteer shift', 'Attended orientation and completed at least one full volunteer shift.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000003', 'Has a regular volunteering rhythm', 'Volunteers on a recurring schedule and knows the staff and routines well.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000003', 'Trusted with more responsibility', 'Takes on specialized tasks or a semi-leadership role within the organization.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000003', 'A core part of the team', 'Recognized as a reliable regular, has tried multiple roles or organizations, and mentors newer volunteers.', 'Month 12', 4);

-- ─── Language Learning ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000004', 'A structured course or app (e.g. Duolingo, Babbel, Pimsleur)', true, 0, 15, null, 'Many have free tiers; paid tiers are optional'),
('50000000-0000-0000-0000-000000000004', 'A notebook for new vocabulary and notes', true, 0, 10, 'https://www.amazon.com/s?k=notebook', null),
('50000000-0000-0000-0000-000000000004', 'Physical flashcards', false, 5, 15, 'https://www.amazon.com/s?k=language+flashcards', null),
('50000000-0000-0000-0000-000000000004', 'A beginner grammar book or phrasebook', false, 10, 20, 'https://www.amazon.com/s?k=beginner+phrasebook', null),
('50000000-0000-0000-0000-000000000004', 'Headphones for listening practice', false, 20, 100, 'https://www.amazon.com/s?k=headphones', 'Most people already own a usable pair');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000004', 1, 'Learn the Foundations', 'Build the absolute basics: sounds, greetings, and simple phrases.', '["Learn the alphabet or pronunciation basics", "Master greetings and introductions", "Study 10-15 minutes daily with an app or course"]'),
('50000000-0000-0000-0000-000000000004', 2, 'Build Core Vocabulary', 'Expand your working vocabulary and start simple grammar.', '["Learn 100 of the most common words", "Practice basic sentence structure and pronouns", "Start a vocabulary notebook or flashcard deck"]'),
('50000000-0000-0000-0000-000000000004', 3, 'Start Listening & Speaking', 'Move from passive study to active use.', '["Watch a beginner-friendly video in the language", "Practice speaking out loud, even alone", "Try a short conversation with a language exchange partner or app"]'),
('50000000-0000-0000-0000-000000000004', 4, 'Create a Sustainable Routine', 'Lock in habits that will carry you past the beginner plateau.', '["Set a realistic weekly study schedule", "Track your progress in a journal or app", "Have a very basic conversation about yourself"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000004', 'video', 'first_30_minutes', 'The absolute easiest way to learn a language', 'https://www.youtube.com/watch?v=woj49RYxDMY', 'YouTube — Refold'),
('50000000-0000-0000-0000-000000000004', 'video', 'first_week', 'The 45-Minute Language Learning Routine That Makes You Fluent in 1 Year', 'https://www.youtube.com/watch?v=hmlMK8VG2BE', 'YouTube — Mikel | Hyperpolyglot'),
('50000000-0000-0000-0000-000000000004', 'video', 'beginner_mistakes', 'The Biggest Mistakes Language Learners Make (And How to Avoid Them)', 'https://www.youtube.com/watch?v=QE0kfPC-Yzg', 'YouTube — Tayari live - Swahili Learning'),
('50000000-0000-0000-0000-000000000004', 'video', 'progression_story', 'What progress actually looks like in language learning', 'https://www.youtube.com/watch?v=RF0TMh9EfE4', 'YouTube — Steve Kaufmann - lingosteve');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000004', 'Comfortable with the basics', 'Can introduce yourself and use common greetings and phrases confidently.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000004', 'Can hold simple conversations', 'Handles basic everyday conversations (ordering food, asking directions) with some hesitation.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000004', 'Conversational in familiar topics', 'Can discuss familiar topics and understand slower native speech.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000004', 'Comfortable in real conversations', 'Holds sustained conversations with native speakers and consumes native media with growing ease.', 'Month 12', 4);

-- ─── Improv & Acting ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000005', 'A local improv or acting class to join', true, 0, 0, null, 'Search for a comedy theater or community class near you'),
('50000000-0000-0000-0000-000000000005', 'Comfortable, easy-to-move-in clothing', true, 0, 30, 'https://www.amazon.com/s?k=comfortable+athletic+clothing', 'Most people already own something suitable'),
('50000000-0000-0000-0000-000000000005', 'A notebook for exercises, games, and reflections', false, 0, 10, 'https://www.amazon.com/s?k=notebook', null),
('50000000-0000-0000-0000-000000000005', 'Comfortable shoes for movement', false, 20, 60, 'https://www.amazon.com/s?k=comfortable+shoes', null),
('50000000-0000-0000-0000-000000000005', 'A phone or recorder to review scenes and performances', false, 0, 0, null, 'Most phones work fine for this');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000005', 1, 'Learn the Fundamentals', 'Get comfortable with the core mindset of improv.', '["Take or watch an intro improv class", "Practice ''Yes, and'' in daily conversation", "Do 2-3 warm-up exercises solo or with a friend"]'),
('50000000-0000-0000-0000-000000000005', 2, 'Play Basic Games & Scenes', 'Start building instincts through repetition.', '["Join a beginner improv class or workshop", "Practice simple two-person scene starts", "Focus on listening rather than planning your next line"]'),
('50000000-0000-0000-0000-000000000005', 3, 'Build Scene Confidence', 'Push past self-consciousness and commit to choices.', '["Perform in front of classmates or a small group", "Practice committing fully to a choice, even a ''bad'' one", "Watch a live improv show for inspiration"]'),
('50000000-0000-0000-0000-000000000005', 4, 'Perform & Reflect', 'Take the leap toward a real audience.', '["Participate in a class showcase or jam", "Get feedback from an instructor or peers", "Reflect on your growth and set a next goal"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000005', 'video', 'first_30_minutes', 'Improv Comedy for Beginners', 'https://www.youtube.com/watch?v=Qgz5fwDJgEo', 'YouTube — TakeLessons'),
('50000000-0000-0000-0000-000000000005', 'video', 'first_week', 'Introduction to Improv Comedy: Basics and Rules of Improv', 'https://www.youtube.com/watch?v=kIfP_9Xugak', 'YouTube — Manhattan Comedy School'),
('50000000-0000-0000-0000-000000000005', 'video', 'beginner_mistakes', 'Stop Trying to Be Funny (And 12 Other Improv Rules to Actually Be Funny)', 'https://www.youtube.com/watch?v=lhdC1yrrM4w', 'YouTube — PVImprov'),
('50000000-0000-0000-0000-000000000005', 'video', 'progression_story', 'Taking An Improv Class Will Change Your Life', 'https://www.youtube.com/watch?v=d-z9vMKXJoQ', 'YouTube — The List 2');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000005', 'Comfortable with core principles', 'Understands core improv principles like ''Yes, and'' and can participate in basic scenes without freezing up.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000005', 'Confident in scene work', 'Builds full scenes with a partner and commits to choices instead of blocking.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000005', 'Performs in front of an audience', 'Has performed in a class showcase or open jam and handles nerves well.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000005', 'Part of a team or troupe', 'Regularly performs with a team, has a personal comedic voice, and mentors newer students.', 'Month 12', 4);

-- ─── Wine & Spirits Tasting ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000006', 'A set of proper wine glasses', true, 15, 50, 'https://www.amazon.com/s?k=wine+glasses+set', null),
('50000000-0000-0000-0000-000000000006', 'A sampler selection of beginner-friendly wines and spirits', true, 20, 60, 'https://www.amazon.com/s?k=wine+sampler+set', null),
('50000000-0000-0000-0000-000000000006', 'A wine opener / corkscrew', true, 5, 20, 'https://www.amazon.com/s?k=corkscrew', null),
('50000000-0000-0000-0000-000000000006', 'A tasting journal or notebook', false, 0, 15, 'https://www.amazon.com/s?k=wine+tasting+journal', null),
('50000000-0000-0000-0000-000000000006', 'A spittoon or extra cups for tastings', false, 0, 15, 'https://www.amazon.com/s?k=wine+spittoon', 'Useful for sampling multiple pours without overindulging');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000006', 1, 'Learn to Taste', 'Understand the basic tasting process: see, swirl, smell, sip.', '["Learn the 5 S''s of tasting (see, swirl, smell, sip, savor)", "Taste 2-3 different wines side by side", "Start a simple tasting journal"]'),
('50000000-0000-0000-0000-000000000006', 2, 'Explore the Big Grapes & Styles', 'Get familiar with the core building blocks of flavor.', '["Taste 3 major red or white grape varieties", "Learn to identify basic flavor categories (fruit, oak, tannin, acidity)", "Try one spirit neat and note the differences vs. wine"]'),
('50000000-0000-0000-0000-000000000006', 3, 'Practice Comparative Tasting', 'Sharpen your palate through side-by-side comparisons.', '["Host or attend a small blind tasting with 3-4 samples", "Compare a budget and a mid-range bottle of the same style", "Pair one tasting with food"]'),
('50000000-0000-0000-0000-000000000006', 4, 'Share What You''ve Learned', 'Turn knowledge into a social occasion.', '["Host a tasting night for friends", "Explain your tasting notes out loud to others", "Pick 2-3 favorite styles to explore further"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000006', 'video', 'first_30_minutes', 'Wine Tasting for Beginners! 🍷 How to Taste Wine Step by Step', 'https://www.youtube.com/watch?v=QGSj_3PgEJY', 'YouTube — My Wine Diary'),
('50000000-0000-0000-0000-000000000006', 'video', 'first_week', 'Getting Into Wine: A Beginner''s Crash Course', 'https://www.youtube.com/watch?v=n1l_xjou-3E', 'YouTube — Wine Folly'),
('50000000-0000-0000-0000-000000000006', 'video', 'beginner_mistakes', 'Wine 101: 5 Beginner Mistakes to Avoid | Essential Wine Tips for Wine Lovers!', 'https://www.youtube.com/watch?v=-GZrsEJ8SlM', 'YouTube — My Wine Diary'),
('50000000-0000-0000-0000-000000000006', 'video', 'progression_story', 'From Beginner To Certified Sommelier: My Journey Into Wine', 'https://www.youtube.com/watch?v=aDKss5cWa_M', 'YouTube — The Story of Wine');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000006', 'Comfortable with tasting basics', 'Can describe a wine''s basic characteristics using proper tasting vocabulary.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000006', 'Recognizes major styles', 'Identifies common grape varieties and spirit categories by taste alone most of the time.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000006', 'Hosts confident tastings', 'Can host a themed tasting night and guide others through the process.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000006', 'Developing a refined palate', 'Detects subtle differences between regions and vintages and has a well-defined set of personal favorites.', 'Month 12', 4);

-- ─── Public Speaking ─── --
insert into equipment_items (hobby_id, name, is_essential, cost_min, cost_max, product_link, alt_note) values
('50000000-0000-0000-0000-000000000007', 'A local Toastmasters club or speaking group to join', true, 0, 0, null, 'Search toastmasters.org for a club near you'),
('50000000-0000-0000-0000-000000000007', 'A notebook for outlines and speech drafts', true, 0, 10, 'https://www.amazon.com/s?k=notebook', null),
('50000000-0000-0000-0000-000000000007', 'A phone tripod or stand for recording practice speeches', false, 10, 25, 'https://www.amazon.com/s?k=phone+tripod', null),
('50000000-0000-0000-0000-000000000007', 'A timer or stopwatch', false, 0, 10, 'https://www.amazon.com/s?k=stopwatch', 'Most phones already have one built in'),
('50000000-0000-0000-0000-000000000007', 'Presentation software (e.g. Google Slides, PowerPoint, Keynote)', false, 0, 0, null, 'Free with most existing accounts');

insert into roadmaps (hobby_id, week_number, title, description, goals) values
('50000000-0000-0000-0000-000000000007', 1, 'Learn the Basics', 'Understand what makes a speech work before writing one.', '["Watch 2-3 well-regarded speeches and note what works", "Learn a simple speech structure (opening, 3 points, closing)", "Write a 1-2 minute speech on a topic you know well"]'),
('50000000-0000-0000-0000-000000000007', 2, 'Practice Delivery', 'Focus on how you say it, not just what you say.', '["Record yourself giving your speech and watch it back", "Practice eliminating filler words like ''um'' and ''like''", "Practice pacing, pauses, and eye contact"]'),
('50000000-0000-0000-0000-000000000007', 3, 'Speak in Front of Others', 'Get real feedback in a low-stakes setting.', '["Give your speech to a friend, family member, or small group", "Attend a Toastmasters meeting as a guest", "Ask for specific feedback on delivery and content"]'),
('50000000-0000-0000-0000-000000000007', 4, 'Deliver a Real Speech', 'Take the leap to a more public setting.', '["Give a prepared speech at a club meeting or similar setting", "Try an impromptu speaking exercise like Table Topics", "Reflect on what you''d improve next time"]');

insert into resources (hobby_id, type, category, title, url, source) values
('50000000-0000-0000-0000-000000000007', 'video', 'first_30_minutes', '7 Public Speaking Tips for Beginners', 'https://www.youtube.com/watch?v=Ns_z4wEtdRM', 'YouTube — Alexander Lyon Communication Coach'),
('50000000-0000-0000-0000-000000000007', 'video', 'first_week', 'How to Practice a Speech', 'https://www.youtube.com/watch?v=BaH5qVXIzFU', 'YouTube — Alexander Lyon Communication Coach'),
('50000000-0000-0000-0000-000000000007', 'video', 'beginner_mistakes', 'Top Public Speaking Beginner Mistakes to Avoid', 'https://www.youtube.com/watch?v=2yUXP1PreUk', 'YouTube — Brian Guo'),
('50000000-0000-0000-0000-000000000007', 'video', 'progression_story', 'From a Shy to a Confident Speaker: A Toastmasters Success Story', 'https://www.youtube.com/watch?v=Z_u2H_Wcpa8', 'YouTube — Toastmasters International');

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000007', 'Comfortable giving a short prepared speech', 'Can deliver a 2-3 minute speech with a clear structure, with some nerves.', 'Month 1', 1),
('50000000-0000-0000-0000-000000000007', 'Reduces filler words and nerves', 'Speaks with fewer filler words and more natural pacing in front of a small group.', 'Month 3', 2),
('50000000-0000-0000-0000-000000000007', 'Confident in front of a group', 'Regularly speaks at a club or in front of a group and handles Q&A reasonably well.', 'Month 6', 3),
('50000000-0000-0000-0000-000000000007', 'A capable, engaging speaker', 'Delivers polished speeches, thinks well on their feet, and may mentor newer speakers.', 'Month 12', 4);

