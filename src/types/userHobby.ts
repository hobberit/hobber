import type { Timestamp, UUID } from "./common";
import type { SourceMode, UserHobbyStatus } from "./enums";

/**
 * Core enrollment/tracking entity: one row per user-hobby pairing. Drives the
 * North Star metric — status transitions to "active" once accepted, and
 * "Successful Hobby Start" is active + >=3 weeks of progress_logs.
 */
export type UserHobby = {
  id: UUID;
  user_id: UUID;
  hobby_id: UUID;
  status: UserHobbyStatus;
  source_mode: SourceMode;
  current_week: number | null;
  started_at: Timestamp | null;
  last_logged_at: Timestamp | null;
  /** Set when finishing a hobby — did the user enjoy it? Biases future "might_like" suggestions toward/away from similar hobbies. */
  feedback_enjoyed: boolean | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}
