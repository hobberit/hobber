import type { Timestamp, UUID } from "./common";
import type { MonthlyChallengeStatus } from "./enums";

export type MonthlyChallenge = {
  id: UUID;
  user_id: UUID;
  hobby_id: UUID;
  month: string; // date-only, first of month, YYYY-MM-DD
  status: MonthlyChallengeStatus;
  created_at: Timestamp;
}
