import type { Timestamp, UUID } from "./common";

export type ProgressLog = {
  id: UUID;
  user_hobby_id: UUID;
  title: string | null;
  log_date: string; // date-only, YYYY-MM-DD
  duration_minutes: number;
  notes: string | null;
  photo_url: string | null;
  created_at: Timestamp;
}
