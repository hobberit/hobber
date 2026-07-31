-- Hobber seed data. Apply after db/migrations/0007_hobby_images.sql: run via
-- Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- One real, verified, free Unsplash background photo per hobby (all 35),
-- used as the card background on the Tracker tab and the Generate/Home
-- "accept a suggestion" cards. Every URL was found via Unsplash search and
-- verified with a curl HEAD request (HTTP 200 + Content-Length) before
-- being included here -- not fabricated. Premium/Unsplash+ photos
-- (plus.unsplash.com) were explicitly excluded; all links are free to use.

-- ═══════════════════════════════════════════════════════════════════════
-- CREATIVE hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- Photo: woman holding DSLR camera — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000001';

-- Photo: woman holding a bunch of paint brushes — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1633887091273-a3bd71efddde?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000002';

-- Photo: man playing acoustic guitar — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000003';

-- Photo: person holding red pen while writing on book — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1550592704-6c76defa9985?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000004';

-- Photo: person making clay pot on pottery wheel — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1609881583302-61548332039c?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000005';

-- Photo: man drawing portrait of man — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1569154076682-4c0466623ec2?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000006';

-- Photo: woman knitting a piece of fabric — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1632649027900-389e810204e6?auto=format&fit=crop&w=800&q=80' where id = '10000000-0000-0000-0000-000000000007';

-- ═══════════════════════════════════════════════════════════════════════
-- PHYSICAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- Photo: woman rock climbing inside building — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000001';

-- Photo: person jogging near park during daytime — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1513378628213-b8f36d8c2878?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000002';

-- Photo: two people grappling in a martial arts match — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1747331796135-0e2354a712e4?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000003';

-- Photo: ballet dancers perform on a stage with spotlights — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1760542941224-0287bfad7db7?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000004';

-- Photo: man surfing on ocean wave during daytime — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000005';

-- Photo: a person standing on a yoga mat on the floor — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1637157216470-d92cd2edb2e8?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000006';

-- Photo: man and woman riding road bikes at the road near shore — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80' where id = '20000000-0000-0000-0000-000000000007';

-- ═══════════════════════════════════════════════════════════════════════
-- TECHNICAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- Photo: laptop screen displaying colorful code — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000001';

-- Photo: Robotic arm with pincers in a dusty environment — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1774229637247-3cd45219826c?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000002';

-- Photo: a small 3d printer sitting on top of a table — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1702863361902-93c51bfbd923?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000003';

-- Photo: a close up of a circuit board with some electronic components — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1675602488453-c3897a475af5?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000004';

-- Photo: person using chisel while curving wood — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1497219055242-93359eeed651?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000005';

-- Photo: black computer tower on white table — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1591238372338-22d30c883a86?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000006';

-- Photo: turned-on charcoal Google Home Mini and smartphone — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?auto=format&fit=crop&w=800&q=80' where id = '30000000-0000-0000-0000-000000000007';

-- ═══════════════════════════════════════════════════════════════════════
-- OUTDOOR hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- Photo: person planting seedlings in raised bed — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1621460248083-6271cc4437a8?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000001';

-- Photo: man in black jacket with hiking backpack standing on mountain — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1586022045497-31fcf76fa6cc?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000002';

-- Photo: a man and a boy fishing on a dock — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1688991710857-f9339ae9fa5f?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000003';

-- Photo: a man looking through binoculars in the woods — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1675246198306-9ba2a1aee6de?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000004';

-- Photo: man sitting near bonfire and green tent in forest — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1520918998343-a33f59b7c079?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000005';

-- Photo: a telescope on a tripod in a field with the night sky in the background — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1717228359912-e2f6401df18f?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000006';

-- Photo: a group of mushrooms growing in the woods — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1665138322353-10027b2190fa?auto=format&fit=crop&w=800&q=80' where id = '40000000-0000-0000-0000-000000000007';

-- ═══════════════════════════════════════════════════════════════════════
-- SOCIAL hobbies
-- ═══════════════════════════════════════════════════════════════════════

-- Photo: a group of people preparing food in a kitchen — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1683105693841-8c81235be472?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000001';

-- Photo: two men playing a game of monopoly on a table — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1677188010559-0667a1ed33a0?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000002';

-- Photo: three men wearing yellow Volunteers shirts — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1560220604-1985ebfe28b1?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000003';

-- Photo: a wooden table topped with scrabble tiles spelling learn languages — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1673515335463-cb1c196e2efa?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000004';

-- Photo: group of people standing on stage — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1630050525402-06c617847d27?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000005';

-- Photo: person pouring wine on clear wine glass — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1561461056-77634126673a?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000006';

-- Photo: low light stage microphone photography — Unsplash
update hobbies set image_url = 'https://images.unsplash.com/photo-1507676385008-e7fb562d11f8?auto=format&fit=crop&w=800&q=80' where id = '50000000-0000-0000-0000-000000000007';

