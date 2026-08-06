-- Rewrites milestone titles to short, domain-authentic achievement names
-- (the kind practitioners would actually recognize — grades, distances,
-- belts, techniques) instead of generic progress-report phrases, and
-- shortens descriptions to a single punchy clause. Does not touch hobby_id,
-- typical_timeframe, or order_index — only title/description content.
--
-- Note: 0005_additional_milestones.sql already expanded every hobby from 4
-- to 6 milestone rows (order_index 1-6: Week 2, Month 1, Month 3, Month 6,
-- Month 9, Month 12), so this migration updates all 6 rows per hobby
-- (210 total), not 4.

-- ═══════════════════════════════════════════════════════════════════════
-- CREATIVE
-- ═══════════════════════════════════════════════════════════════════════

-- Photography
update milestones set title = 'First Photo Walk', description = 'Shot a themed walk applying the rule of thirds.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 1;
update milestones set title = 'Manual Mode Unlocked', description = 'Shoots confidently in full manual.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 2;
update milestones set title = '50-Shot Portfolio', description = 'Built a folder of intentionally composed shots.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 3;
update milestones set title = 'Golden Hour Eye', description = 'Reads light instinctively and edits to a consistent look.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 4;
update milestones set title = 'Found Your Genre', description = 'Shoots consistently in one genre — portrait, street, or landscape.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 5;
update milestones set title = 'Portfolio Ready', description = 'Has a shareable portfolio in a chosen genre.' where hobby_id = '10000000-0000-0000-0000-000000000001' and order_index = 6;

-- Painting
update milestones set title = 'First Brushstrokes', description = 'Loads a brush and lays flat, even color.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 1;
update milestones set title = 'Color Wheel Mastery', description = 'Mixes any target hue from a basic palette.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 2;
update milestones set title = 'First Finished Canvas', description = 'Completed a painting start to finish.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 3;
update milestones set title = 'Wet-on-Wet Blending', description = 'Controls brushwork and blending with intention.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 4;
update milestones set title = 'Palette Knife Work', description = 'Experiments with texture and a second medium.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 5;
update milestones set title = '10-Painting Portfolio', description = 'Has a small body of work in a signature style.' where hobby_id = '10000000-0000-0000-0000-000000000002' and order_index = 6;

-- Guitar
update milestones set title = 'First Clean Chord', description = 'Frets an open chord without buzzing.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 1;
update milestones set title = 'Open Chord Fluency', description = 'Plays Em, Am, G, C, and D cleanly.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 2;
update milestones set title = 'Chord-to-Chord Switch', description = 'Changes chords in rhythm without stopping.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 3;
update milestones set title = 'First Full Song', description = 'Plays a complete song from memory.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 4;
update milestones set title = '5-Song Setlist', description = 'Has a setlist ready with strumming variations.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 5;
update milestones set title = 'Barre Chords', description = 'Jams along to recordings and tackles barre chords.' where hobby_id = '10000000-0000-0000-0000-000000000003' and order_index = 6;

-- Creative Writing
update milestones set title = 'First Five Pages', description = 'Written on five separate days.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 1;
update milestones set title = 'Daily Pages Habit', description = 'Writes most days, even in short bursts.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 2;
update milestones set title = 'First Draft Done', description = 'Finished and edited one complete piece.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 3;
update milestones set title = 'Workshopped Draft', description = 'Revised a piece based on real feedback.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 4;
update milestones set title = 'Self-Editing Eye', description = 'Revises independently without outside notes.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 5;
update milestones set title = 'Finished Portfolio', description = 'Has multiple finished pieces and a clear voice.' where hobby_id = '10000000-0000-0000-0000-000000000004' and order_index = 6;

-- Pottery
update milestones set title = 'First Time Centering', description = 'Gets clay roughly centered on most attempts.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 1;
update milestones set title = 'Centers Every Time', description = 'Centers clay on the wheel without a fight.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 2;
update milestones set title = 'First Kiln-Fired Piece', description = 'Threw, trimmed, glazed, and fired a finished piece.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 3;
update milestones set title = 'Even-Walled Cylinders', description = 'Throws cylinders, bowls, and cups reliably.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 4;
update milestones set title = 'Signature Glaze', description = 'Repeats a preferred glaze and form intentionally.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 5;
update milestones set title = 'Full Shelf', description = 'Has a personal collection of finished pieces.' where hobby_id = '10000000-0000-0000-0000-000000000005' and order_index = 6;

-- Drawing & Sketching
update milestones set title = 'First Sketchbook Pages', description = 'Sketched daily for a week, shapes over detail.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 1;
update milestones set title = 'Value Scale Down', description = 'Shades with a clear light source.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 2;
update milestones set title = 'First Rendered Drawing', description = 'Completed a shaded drawing from reference.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 3;
update milestones set title = 'Accurate Proportions', description = 'Draws recognizable faces and figures.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 4;
update milestones set title = 'Draws From Memory', description = 'Sketches familiar subjects without reference.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 5;
update milestones set title = 'Signature Sketchbook', description = 'Has a full sketchbook and a recognizable style.' where hobby_id = '10000000-0000-0000-0000-000000000006' and order_index = 6;

-- Knitting
update milestones set title = 'First Cast-On', description = 'Casts on and knits a few rows unaided.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 1;
update milestones set title = 'Knit and Purl Fluent', description = 'Knits and purls evenly without dropped stitches.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 2;
update milestones set title = 'First Bind-Off', description = 'Finished and bound off a dishcloth or scarf.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 3;
update milestones set title = 'Reads a Pattern', description = 'Follows a written pattern with increases and decreases.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 4;
update milestones set title = 'First Cables', description = 'Picks up a technique beyond knit and purl.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 5;
update milestones set title = 'Garment-Level Project', description = 'Tackling a hat or sweater with confidence.' where hobby_id = '10000000-0000-0000-0000-000000000007' and order_index = 6;

-- ═══════════════════════════════════════════════════════════════════════
-- PHYSICAL
-- ═══════════════════════════════════════════════════════════════════════

-- Rock Climbing
update milestones set title = 'First Clean Climb', description = 'Tops an easy route with real footwork, no pulling.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 1;
update milestones set title = 'V0-V1 / 5.7-5.9', description = 'Top-ropes 5.7-5.9 and belays confidently.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 2;
update milestones set title = 'V2-V3 / 5.9-5.10', description = 'Climbs 5.9-5.10 and reads routes ahead.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 3;
update milestones set title = '3x-a-Week Regular', description = 'Visible finger and core strength gains.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 4;
update milestones set title = 'Training Weaknesses', description = 'Trains footwork, overhang, or endurance deliberately.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 5;
update milestones set title = 'V4-V5 / 5.10-5.11', description = 'Climbs 5.10-5.11 and is ready for outdoor routes.' where hobby_id = '20000000-0000-0000-0000-000000000001' and order_index = 6;

-- Running
update milestones set title = '10-Minute Nonstop', description = 'Runs continuously for 10+ minutes.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 1;
update milestones set title = 'First Mile', description = 'Runs a mile without walking.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 2;
update milestones set title = 'First 5K', description = 'Completes a 5K without stopping.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 3;
update milestones set title = 'Sub-30 5K', description = 'Runs 3x/week and holds a sub-30 5K pace.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 4;
update milestones set title = 'First 10K', description = 'Trained for and run a 10K.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 5;
update milestones set title = 'Half Marathon Ready', description = 'Comfortable running 8-10+ miles or racing a half.' where hobby_id = '20000000-0000-0000-0000-000000000002' and order_index = 6;

-- Brazilian Jiu-Jitsu
update milestones set title = 'First Roll', description = 'Rolled live with a partner without panicking.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 1;
update milestones set title = 'Survives on Bottom', description = 'Escapes bottom positions without panicking.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 2;
update milestones set title = 'First Stripe', description = 'Earns first stripe; knows a few escapes and subs.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 3;
update milestones set title = '3x-a-Week Roller', description = 'Rolls consistently and defends common submissions.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 4;
update milestones set title = 'Go-To Game', description = 'Has 2-3 reliable escapes or submissions.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 5;
update milestones set title = 'Blue Belt Bound', description = 'Being considered for a blue belt promotion.' where hobby_id = '20000000-0000-0000-0000-000000000003' and order_index = 6;

-- Dance
update milestones set title = 'First Steps Down', description = 'Follows simple step patterns without watching feet.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 1;
update milestones set title = '8-Count Fluent', description = 'Comfortable with fundamental steps and counts.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 2;
update milestones set title = 'First Combo', description = 'Learns and performs a full short routine.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 3;
update milestones set title = 'Freestyles a Song', description = 'Freestyles or social dances a full song confidently.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 4;
update milestones set title = 'Social Floor Ready', description = 'Dances with new partners at a social event.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 5;
update milestones set title = 'Showcase Ready', description = 'Performs a routine in front of others.' where hobby_id = '20000000-0000-0000-0000-000000000004' and order_index = 6;

-- Surfing
update milestones set title = 'Paddles the Lineup', description = 'Paddles past the break and duck dives reasonably well.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 1;
update milestones set title = 'Whitewater Pop-Up', description = 'Stands and rides whitewater waves to shore.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 2;
update milestones set title = 'First Green Wave', description = 'Catches and briefly rides an unbroken wave.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 3;
update milestones set title = 'Reads the Lineup', description = 'Positions for waves in the lineup without help.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 4;
update milestones set title = 'First Turn', description = 'Turns or trims along an open face.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 5;
update milestones set title = 'Surfs Any Break', description = 'Surfs confidently across breaks and conditions.' where hobby_id = '20000000-0000-0000-0000-000000000005' and order_index = 6;

-- Yoga
update milestones set title = 'Breath-Linked Flow', description = 'Links breath to movement in simple poses.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 1;
update milestones set title = 'Sun Salutation', description = 'Knows the sun salutation and basic poses by name.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 2;
update milestones set title = 'Full Vinyasa Class', description = 'Keeps up with a beginner/intermediate flow class.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 3;
update milestones set title = 'Steady Tree Pose', description = 'Holds balance poses steadily; visible flexibility gains.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 4;
update milestones set title = 'First Arm Balance', description = 'Comfortable with inversions or a second style.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 5;
update milestones set title = 'Self-Led Practice', description = 'Leads themselves through a routine.' where hobby_id = '20000000-0000-0000-0000-000000000006' and order_index = 6;

-- Cycling
update milestones set title = 'Confident on the Road', description = 'Rides confidently around turns and hazards.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 1;
update milestones set title = '10-Mile Ride', description = 'Rides confidently for 5-10 miles.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 2;
update milestones set title = '20-Mile Ride', description = 'Completes a 20+ mile ride, including hills.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 3;
update milestones set title = 'Weekly Group Ride', description = 'Rides weekly, including group rides or climbs.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 4;
update milestones set title = 'Real Climbs', description = 'Rides routes with significant elevation gain.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 5;
update milestones set title = 'Century Ride Ready', description = 'Ready to attempt a metric century or multi-day tour.' where hobby_id = '20000000-0000-0000-0000-000000000007' and order_index = 6;

-- ═══════════════════════════════════════════════════════════════════════
-- TECHNICAL
-- ═══════════════════════════════════════════════════════════════════════

-- Coding
update milestones set title = 'No-Tutorial Solve', description = 'Solved an exercise using fundamentals, few lookups.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 1;
update milestones set title = 'Fundamentals Down', description = 'Writes scripts with variables, loops, functions.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 2;
update milestones set title = 'Shipped to GitHub', description = 'Built and shared 2-3 small projects on GitHub.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 3;
update milestones set title = 'Debugs Solo', description = 'Debugs independently and reads unfamiliar docs.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 4;
update milestones set title = 'First Framework App', description = 'Built something real with a framework or library.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 5;
update milestones set title = 'Full-Stack Build', description = 'Builds an app end-to-end and is ready to specialize.' where hobby_id = '30000000-0000-0000-0000-000000000001' and order_index = 6;

-- Robotics
update milestones set title = 'First Uploaded Sketch', description = 'Wired a circuit and ran code reacting to input.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 1;
update milestones set title = 'Circuits + Code', description = 'Wires a breadboard and uploads sketches unaided.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 2;
update milestones set title = 'First Rolling Robot', description = 'Built a wheeled robot with obstacle avoidance.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 3;
update milestones set title = 'Sensor Integration', description = 'Wires and codes a new sensor without a tutorial.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 4;
update milestones set title = 'Hardware-or-Code Diagnosis', description = 'Diagnoses electrical vs. code issues confidently.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 5;
update milestones set title = 'Autonomous Build', description = 'Builds an autonomous robot end-to-end.' where hobby_id = '30000000-0000-0000-0000-000000000002' and order_index = 6;

-- 3D Printing
update milestones set title = 'First Clean Print', description = 'Completed a downloaded model print with no failures.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 1;
update milestones set title = 'Slicer Basics', description = 'Levels the bed, loads filament, and slices unaided.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 2;
update milestones set title = 'Multi-Material Prints', description = 'Completed prints across different materials.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 3;
update milestones set title = 'Fixes Failed Prints', description = 'Diagnoses warping and adhesion issues solo.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 4;
update milestones set title = 'First Model Remix', description = 'Resizes or edits an existing model in CAD.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 5;
update milestones set title = 'Original CAD Design', description = 'Designs simple models and runs advanced prints.' where hobby_id = '30000000-0000-0000-0000-000000000003' and order_index = 6;

-- Electronics
update milestones set title = 'First Lit LED', description = 'Lit an LED from a breadboard diagram.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 1;
update milestones set title = 'Breadboard Basics', description = 'Reads simple circuits with resistors and switches.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 2;
update milestones set title = 'First Solder Joint', description = 'Solders cleanly and diagnoses with a multimeter.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 3;
update milestones set title = 'From-Scratch Circuit', description = 'Designs and builds a small circuit from scratch.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 4;
update milestones set title = 'Own Circuit Design', description = 'Sketches and builds a circuit idea unaided.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 5;
update milestones set title = 'Microcontroller Projects', description = 'Combines electronics with code for custom builds.' where hobby_id = '30000000-0000-0000-0000-000000000004' and order_index = 6;

-- Woodworking
update milestones set title = 'First Clean Cut', description = 'Measures and cuts a straight line safely.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 1;
update milestones set title = 'Core Tools Down', description = 'Uses hand and power tools confidently.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 2;
update milestones set title = 'First Build', description = 'Built and finished a small functional piece.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 3;
update milestones set title = 'Real Joinery', description = 'Uses dados, pocket holes, or mortise and tenon.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 4;
update milestones set title = 'Clean Finish Coat', description = 'Applies stain or finish cleanly.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 5;
update milestones set title = 'Original Furniture Build', description = 'Plans and builds furniture-scale projects.' where hobby_id = '30000000-0000-0000-0000-000000000005' and order_index = 6;

-- PC Building
update milestones set title = 'First BIOS Boot', description = 'Confirms component detection and tidies cables.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 1;
update milestones set title = 'Parts ID''d Safely', description = 'Handles components safely with ESD awareness.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 2;
update milestones set title = 'First Boot', description = 'Completed a build that boots and passes stress tests.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 3;
update milestones set title = 'Solo Troubleshooting', description = 'Diagnoses POST failures and thermal issues.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 4;
update milestones set title = 'XMP Tuned', description = 'Adjusts fan curves and memory profiles safely.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 5;
update milestones set title = 'Builds for Others', description = 'Plans custom builds for specific budgets.' where hobby_id = '30000000-0000-0000-0000-000000000006' and order_index = 6;

-- Home Automation
update milestones set title = 'First Trigger Fired', description = 'Set up one working schedule or trigger.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 1;
update milestones set title = 'Devices Connected', description = 'Sets up and controls devices from a phone app.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 2;
update milestones set title = 'Multi-Device Automation', description = 'Built time and trigger-based automations.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 3;
update milestones set title = 'Cross-Brand Hub', description = 'Integrates multiple brands under one hub.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 4;
update milestones set title = 'Solo System Fix', description = 'Diagnoses a misfired automation without a reset.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 5;
update milestones set title = 'Self-Hosted Setup', description = 'Runs an advanced local automation platform.' where hobby_id = '30000000-0000-0000-0000-000000000007' and order_index = 6;

-- ═══════════════════════════════════════════════════════════════════════
-- OUTDOOR
-- ═══════════════════════════════════════════════════════════════════════

-- Gardening
update milestones set title = 'First Two Weeks', description = 'Kept plants alive on a consistent watering schedule.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 1;
update milestones set title = 'Plants Established', description = 'Living plants with a consistent watering routine.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 2;
update milestones set title = 'First Harvest', description = 'Successfully harvested or bloomed first plants.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 3;
update milestones set title = 'Multi-Plant Garden', description = 'Manages several plants with minimal loss.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 4;
update milestones set title = 'Second Season', description = 'Planted for a new season, lessons applied.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 5;
update milestones set title = 'Seasonal Planner', description = 'Plans planting cycles and has expanded the garden.' where hobby_id = '40000000-0000-0000-0000-000000000001' and order_index = 6;

-- Hiking
update milestones set title = 'Packed Without a List', description = 'Assembles a basic daypack from memory.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 1;
update milestones set title = 'First Trail', description = 'Finished an easy, well-marked hike.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 2;
update milestones set title = 'Elevation Comfortable', description = 'Hikes moderate trails and reads a map or GPS.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 3;
update milestones set title = '5-Mile Regular', description = 'Hikes 5+ mile trails, packs the ten essentials.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 4;
update milestones set title = 'Technical Terrain', description = 'Hikes real elevation gain or technical footing.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 5;
update milestones set title = 'Trip Leader', description = 'Plans and leads multi-hour hikes across regions.' where hobby_id = '40000000-0000-0000-0000-000000000002' and order_index = 6;

-- Fishing
update milestones set title = 'First Rig Tied', description = 'Ties a basic knot and rigs a line unaided.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 1;
update milestones set title = 'First Catch', description = 'Landed a first fish with a basic bobber setup.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 2;
update milestones set title = 'Confident Cast', description = 'Casts confidently and ties basic knots.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 3;
update milestones set title = 'Reads the Water', description = 'Identifies fish-holding structure and adapts.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 4;
update milestones set title = 'Second Technique', description = 'Tries a new method — fly, lure, or species-specific.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 5;
update milestones set title = 'Multi-Species Angler', description = 'Fishes multiple waters and mentors beginners.' where hobby_id = '40000000-0000-0000-0000-000000000003' and order_index = 6;

-- Bird Watching
update milestones set title = 'First 3 IDs', description = 'Identified and logged three species unaided.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 1;
update milestones set title = 'Binoculars Down', description = 'Locates and follows birds quickly through binoculars.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 2;
update milestones set title = 'Growing Life List', description = 'Keeps a running list; recognizes birds by call.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 3;
update milestones set title = 'eBird Regular', description = 'Birds across habitats and logs sightings on eBird.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 4;
update milestones set title = 'Solo Outing', description = 'Plans and goes on a birding outing independently.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 5;
update milestones set title = 'Group Birder', description = 'Joins group outings and pursues a personal goal.' where hobby_id = '40000000-0000-0000-0000-000000000004' and order_index = 6;

-- Camping
update milestones set title = 'Solo Camp Setup', description = 'Pitches a tent and sets up a sleep system alone.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 1;
update milestones set title = 'First Night Out', description = 'Set up camp and slept through a full night.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 2;
update milestones set title = 'Campfire Cook', description = 'Builds a fire safely and cooks simple meals.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 3;
update milestones set title = 'Weathered a Storm', description = 'Camped through rain or cold and adjusted gear.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 4;
update milestones set title = 'Multi-Night Trip', description = 'Camped 2+ nights, managing food and water.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 5;
update milestones set title = 'Independent Trip Planner', description = 'Plans and packs for remote or longer stays.' where hobby_id = '40000000-0000-0000-0000-000000000005' and order_index = 6;

-- Stargazing
update milestones set title = '3 Constellations Found', description = 'Locates constellations unaided with a chart.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 1;
update milestones set title = 'Naked-Eye Basics', description = 'Finds the Moon, a planet, and major constellations.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 2;
update milestones set title = 'Binocular Observer', description = 'Observes regularly and plans around dark skies.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 3;
update milestones set title = 'First Scope Session', description = 'Sets up and uses a beginner telescope confidently.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 4;
update milestones set title = 'First Deep-Sky Object', description = 'Found a nebula, cluster, or galaxy.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 5;
update milestones set title = 'Star Party Regular', description = 'Attends star parties and tracks an observing list.' where hobby_id = '40000000-0000-0000-0000-000000000006' and order_index = 6;

-- Foraging
update milestones set title = 'First Confident ID', description = 'IDs one edible plant and its toxic lookalike.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 1;
update milestones set title = 'First Safe Harvest', description = 'Confidently identifies and harvests 2-3 edibles.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 2;
update milestones set title = '10-Plant Knowledge', description = 'Knows 8-10 plants and their lookalikes.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 3;
update milestones set title = 'Seasonal Forager', description = 'Tracks seasonal changes across habitats.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 4;
update milestones set title = 'New Habitat Forage', description = 'Forages successfully in an unfamiliar habitat.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 5;
update milestones set title = 'Personal Foraging Calendar', description = 'Maintains a calendar and mentors newer foragers.' where hobby_id = '40000000-0000-0000-0000-000000000007' and order_index = 6;

-- ═══════════════════════════════════════════════════════════════════════
-- SOCIAL
-- ═══════════════════════════════════════════════════════════════════════

-- Cooking Classes
update milestones set title = 'First Solo Meal', description = 'Cooked a full recipe at home, no class.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 1;
update milestones set title = 'Knife Skills Down', description = 'Cooks 5 simple recipes from memory.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 2;
update milestones set title = 'Recipe Confident', description = 'Cooks from a recipe and balances seasoning.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 3;
update milestones set title = 'First Hosted Dinner', description = 'Cooks a full meal for guests and improvises.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 4;
update milestones set title = 'Recipe Remix', description = 'Substitutes ingredients or scales a recipe.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 5;
update milestones set title = '15-Recipe Repertoire', description = 'Has 15+ reliable recipes across cuisines.' where hobby_id = '50000000-0000-0000-0000-000000000001' and order_index = 6;

-- Board Games
update milestones set title = 'First Game Night', description = 'Organized a full game night with a new player.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 1;
update milestones set title = 'Rules Explainer', description = 'Reads a rulebook and teaches a game to others.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 2;
update milestones set title = 'Go-To Rotation', description = 'Has a handful of favorites and hosts regularly.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 3;
update milestones set title = 'Medium-Weight Gamer', description = 'Comfortable with worker placement or deck-building.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 4;
update milestones set title = 'Heavy-Euro Player', description = 'Plays and enjoys a heavy-weight strategy game.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 5;
update milestones set title = '15-Game Collection', description = 'Has 15+ games, attends meetups, mentors others.' where hobby_id = '50000000-0000-0000-0000-000000000002' and order_index = 6;

-- Volunteering
update milestones set title = 'Routine Down', description = 'No longer needs a staff member walking them through.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 1;
update milestones set title = 'First Shift Done', description = 'Attended orientation and completed a full shift.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 2;
update milestones set title = 'Regular Rhythm', description = 'Volunteers on a recurring schedule.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 3;
update milestones set title = 'Trusted With More', description = 'Takes on specialized or semi-leadership tasks.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 4;
update milestones set title = 'Recognized Regular', description = 'Asked to take on a specific responsibility or train others.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 5;
update milestones set title = 'Core Team Member', description = 'A reliable regular who mentors newer volunteers.' where hobby_id = '50000000-0000-0000-0000-000000000003' and order_index = 6;

-- Language Learning
update milestones set title = '14-Day Streak', description = 'Practiced most days for two weeks straight.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 1;
update milestones set title = 'Greetings Down', description = 'Introduces yourself with common phrases.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 2;
update milestones set title = 'Basic Conversations', description = 'Orders food and asks directions with some hesitation.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 3;
update milestones set title = 'Conversational Level', description = 'Discusses familiar topics; understands slower speech.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 4;
update milestones set title = 'Unscripted Conversation', description = 'Handles an unexpected question without a script.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 5;
update milestones set title = 'Native Media Comfortable', description = 'Holds sustained conversations and consumes native media.' where hobby_id = '50000000-0000-0000-0000-000000000004' and order_index = 6;

-- Improv & Acting
update milestones set title = 'First ''Yes, And''', description = 'Played multiple scenes without blocking or freezing.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 1;
update milestones set title = 'Core Principles Down', description = 'Participates in basic scenes without freezing up.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 2;
update milestones set title = 'Full Scene Partner', description = 'Builds full scenes and commits to choices.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 3;
update milestones set title = 'First Showcase', description = 'Performed in a class showcase or open jam.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 4;
update milestones set title = 'Bold Scene Initiator', description = 'Initiates scenes and makes bold choices.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 5;
update milestones set title = 'Troupe Regular', description = 'Performs with a team and mentors newer students.' where hobby_id = '50000000-0000-0000-0000-000000000005' and order_index = 6;

-- Wine & Spirits Tasting
update milestones set title = 'First Tasting Notes', description = 'Names 2-3 characteristics out loud during a tasting.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 1;
update milestones set title = 'Tasting Vocabulary', description = 'Describes a wine''s characteristics with proper terms.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 2;
update milestones set title = 'Blind ID by Style', description = 'Identifies grape varieties or spirit categories by taste.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 3;
update milestones set title = 'First Hosted Tasting', description = 'Hosts a themed tasting and guides others through it.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 4;
update milestones set title = 'Confident Pairing', description = 'Suggests a pairing for a meal or occasion.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 5;
update milestones set title = 'Refined Palate', description = 'Detects subtle differences between regions and vintages.' where hobby_id = '50000000-0000-0000-0000-000000000006' and order_index = 6;

-- Public Speaking
update milestones set title = 'First Impromptu Answer', description = 'Answered a surprise prompt in front of the group.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 1;
update milestones set title = 'First Prepared Speech', description = 'Delivers a 2-3 minute speech with clear structure.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 2;
update milestones set title = 'Fewer Filler Words', description = 'Speaks with natural pacing in front of a small group.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 3;
update milestones set title = 'Club Regular Speaker', description = 'Speaks regularly at a club and handles Q&A.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 4;
update milestones set title = 'Handles Pushback', description = 'Handles challenging audience questions with composure.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 5;
update milestones set title = 'Mentor Speaker', description = 'Delivers polished speeches and mentors newer speakers.' where hobby_id = '50000000-0000-0000-0000-000000000007' and order_index = 6;
