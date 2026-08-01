-- Adds two milestones per hobby to all 35 hobbies in the catalog, on top of the
-- existing Month 1 / 3 / 6 / 12 set from 0001_hobbies_seed.sql and
-- 0003_deepen_non_flagship_hobbies.sql:
--   - "Week 2"  (order_index 1) — an early quick-win, since today there's
--     nothing between "just started" and a full month in.
--   - "Month 9" (order_index 5) — bridges the biggest existing gap, between
--     Month 6 and Month 12.
-- Apply via Supabase Dashboard → SQL Editor → New query → Run, after
-- 0001-0004 have already been applied.

-- ─── Step 1: shift order_index on the existing 4 milestones per hobby ─────
-- Safe as a single global update — every hobby in the catalog uses exactly
-- these four typical_timeframe labels (verified: 35 hobbies × 4 rows, no
-- variants like "Month 1-2").

update milestones set order_index = case typical_timeframe
  when 'Month 1' then 2
  when 'Month 3' then 3
  when 'Month 6' then 4
  when 'Month 12' then 6
end
where typical_timeframe in ('Month 1', 'Month 3', 'Month 6', 'Month 12');

-- ─── Step 2: insert the new Week 2 / Month 9 milestones ───────────────────

-- Creative

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('10000000-0000-0000-0000-000000000001', 'Took a first intentional photo walk', 'Completed a themed photo walk applying framing and the rule of thirds, not just pointing and shooting.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000001', 'Comfortable in a specific genre', 'Has picked a genre (portrait, street, landscape) and shoots toward it consistently, editing in a repeatable style.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000002', 'Comfortable with basic brush handling', 'Can load a brush and apply flat, even color without heavy hesitation.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000002', 'Experimenting with technique', 'Comfortably experiments with layering, blending, or a second medium beyond the first.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000003', 'First chord shapes without buzzing', 'Can fret 2-3 open chords individually, even if switching between them is still slow.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000003', 'Comfortable with a small setlist', 'Has 5+ songs ready to play and is starting to add strumming variations or fingerpicking.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000004', 'Established a writing routine', 'Has written on at least 5 separate days, even if just in short bursts.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000004', 'Comfortable revising independently', 'Identifies weak spots in a draft and revises without needing outside notes first.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000005', 'Comfortable at the wheel', 'Can sit at the wheel and get clay roughly centered on most attempts, even if not perfect.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000005', 'Developing a signature glaze or form', 'Has a preferred glaze combination or form and repeats it intentionally.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000006', 'Filled first pages of a sketchbook', 'Has sketched daily or near-daily for a week, focused on shapes over detail.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000006', 'Draws from imagination', 'Can sketch familiar subjects from memory, not just from reference.', 'Month 9', 5),
('10000000-0000-0000-0000-000000000007', 'Cast on without help', 'Can cast on and complete a few rows of knit stitch unaided.', 'Week 2', 1),
('10000000-0000-0000-0000-000000000007', 'Comfortable with a new technique', 'Has learned a technique beyond basic knit/purl, like cables or colorwork.', 'Month 9', 5);

-- Physical

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('20000000-0000-0000-0000-000000000001', 'First unassisted climb', 'Completes an easy top-rope route with proper footwork, without hand-over-hand pulling.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000001', 'Climbing with intention', 'Trains specific weaknesses (footwork, overhang, endurance) rather than just climbing whatever''s set.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000002', 'First real run without stopping', 'Runs continuously for 10+ minutes without walking.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000002', 'Comfortable racing', 'Has run or trained for a 10k and recovers well between sessions.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000003', 'First live roll', 'Has rolled live with a partner, even briefly, and survived without panicking.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000003', 'Building a functional game', 'Has 2-3 reliable escapes or submissions they go to instinctively.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000004', 'Comfortable with basic footwork', 'Can follow simple step patterns without watching their feet the whole time.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000004', 'Dances socially with confidence', 'Comfortable dancing with new partners or at a social event, not just in class.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000005', 'Comfortable paddling out', 'Can paddle out past the break and duck dive or turtle roll reasonably well.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000005', 'Linking basic maneuvers', 'Can turn or trim along an open face, not just ride straight to shore.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000006', 'Comfortable with breath and basic poses', 'Links breath to movement in simple poses without needing constant cueing.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000006', 'Exploring deeper practice', 'Comfortable with inversions, arm balances, or a second style (yin, power) beyond the original.', 'Month 9', 5),
('20000000-0000-0000-0000-000000000007', 'Comfortable riding in traffic or on trails', 'Rides confidently around turns, signals, and basic road or trail hazards.', 'Week 2', 1),
('20000000-0000-0000-0000-000000000007', 'Tackles real climbs', 'Comfortable riding routes with significant elevation gain or keeping pace on group rides.', 'Month 9', 5);

-- Technical

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('30000000-0000-0000-0000-000000000001', 'Solved something without a tutorial', 'Solved a small exercise using fundamentals learned so far, with only occasional reference lookups.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000001', 'Comfortable with a real framework', 'Has used a framework or library (React, Django, etc.) to build something beyond toy scripts.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000002', 'Uploaded first working sketch', 'Has wired a basic circuit and run code that reacts to input from a button or sensor.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000002', 'Debugs hardware and code together', 'Diagnoses whether an issue is electrical or in code without guessing.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000003', 'First successful print', 'Completed a simple downloaded model print start to finish with no failed attempts.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000003', 'Comfortable modifying existing models', 'Can resize, combine, or lightly edit an existing model in a slicer or basic CAD tool.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000004', 'Built first working circuit', 'Lit an LED or built a simple switch circuit on a breadboard from a diagram.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000004', 'Comfortable designing from a concept', 'Sketches a simple circuit idea and builds it without following a pre-made diagram.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000005', 'Made first clean cuts', 'Comfortable measuring, marking, and cutting a straight line safely with a hand or power saw.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000005', 'Comfortable with finishing', 'Applies stain or finish cleanly and is picking up a second joinery technique.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000006', 'Comfortable with cable management and BIOS', 'Has entered BIOS, confirmed component detection, and tidied cable routing.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000006', 'Comfortable tuning performance', 'Adjusts fan curves, XMP/EXPO profiles, or light overclocking safely.', 'Month 9', 5),
('30000000-0000-0000-0000-000000000007', 'First automation triggered successfully', 'Set up one working automation, like a schedule or trigger, beyond just manual app control.', 'Week 2', 1),
('30000000-0000-0000-0000-000000000007', 'Troubleshoots the whole system', 'Diagnoses why an automation didn''t fire without restarting everything.', 'Month 9', 5);

-- Outdoor

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('40000000-0000-0000-0000-000000000001', 'First watering routine stuck', 'Has kept the initial planting alive and watered on a consistent schedule for two weeks.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000001', 'Comfortable with a second growing season', 'Has prepped or planted for a new season and applies lessons learned from the first.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000002', 'Packed and hiked without a checklist', 'Comfortable assembling a basic daypack (water, snacks, layers) without re-reading a list each time.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000002', 'Comfortable with harder terrain', 'Has hiked a trail with real elevation gain or technical footing and adjusted pace accordingly.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000003', 'Comfortable rigging their own line', 'Ties a basic knot and rigs bait or a lure without help each time.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000003', 'Comfortable trying new techniques', 'Has tried a second method (fly, lure type, species-specific technique) beyond the first.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000004', 'First identified sighting logged', 'Has identified and logged at least 3 species without help from an app or guide.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000004', 'Comfortable birding solo', 'Plans and goes on a birding outing independently, checking conditions or hotspots in advance.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000005', 'Comfortable setting up camp solo', 'Can pitch a tent and set up a sleep system without a partner walking them through it.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000005', 'Comfortable with a multi-night trip', 'Has camped 2+ consecutive nights and managed food and water for the full stay.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000006', 'Comfortable using a star chart or app', 'Locates 3+ constellations unaided, using a chart or app as reference only.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000006', 'Comfortable with deep-sky objects', 'Has found and observed a nebula, cluster, or galaxy beyond the Moon and planets.', 'Month 9', 5),
('40000000-0000-0000-0000-000000000007', 'Confidently IDs first plant', 'Can identify one edible plant and its toxic lookalike with full confidence, unaided.', 'Week 2', 1),
('40000000-0000-0000-0000-000000000007', 'Comfortable foraging a new habitat', 'Has foraged successfully in a habitat type different from where they started.', 'Month 9', 5);

-- Social

insert into milestones (hobby_id, title, description, typical_timeframe, order_index) values
('50000000-0000-0000-0000-000000000001', 'Cooked first meal without a class', 'Successfully cooked a full recipe at home solo, applying a technique learned in class.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000001', 'Comfortable adapting recipes', 'Confidently substitutes ingredients or scales a recipe without it falling apart.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000002', 'Hosted first game night', 'Has organized and run a full game night with at least one new player.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000002', 'Comfortable with heavier games', 'Plays and enjoys at least one heavy-weight strategy game regularly.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000003', 'Comfortable with the routine', 'No longer needs a staff member walking them through basic tasks each shift.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000003', 'Recognized by the organization', 'Has been asked to take on a specific responsibility or train a newer volunteer.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000004', 'Comfortable with a daily practice habit', 'Has practiced most days for two weeks straight, via app, flashcards, or class.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000004', 'Comfortable with unscripted conversation', 'Can handle an unexpected question or tangent in conversation, not just rehearsed phrases.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000005', 'Said yes-and without freezing', 'Has participated in multiple scenes in class without blocking or going silent.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000005', 'Comfortable taking creative risks', 'Initiates scenes and makes bold choices instead of waiting to be led.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000006', 'Comfortable describing what they taste', 'Can name 2-3 characteristics (fruit, tannin, body) out loud during a tasting, not just "good" or "bad".', 'Week 2', 1),
('50000000-0000-0000-0000-000000000006', 'Comfortable pairing food and drink', 'Confidently suggests a pairing for a meal or occasion.', 'Month 9', 5),
('50000000-0000-0000-0000-000000000007', 'Gave first impromptu response', 'Has answered a surprise or impromptu prompt in front of the group, even briefly.', 'Week 2', 1),
('50000000-0000-0000-0000-000000000007', 'Comfortable with Q&A and pushback', 'Handles unexpected or challenging audience questions without losing composure.', 'Month 9', 5);
