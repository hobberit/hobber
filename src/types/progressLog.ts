import type { Timestamp, UUID } from "./common";

export type ProgressLog = {
  id: UUID;
  user_hobby_id: UUID;
  log_date: string; // date-only, YYYY-MM-DD
  duration_minutes: number;
  notes: string | null;
  mood_rating: number | null; // e.g. 1-5
  photo_url: string | null;
  created_at: Timestamp;
}
