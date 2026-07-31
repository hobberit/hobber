import type { Timestamp, UUID } from "./common";

/** Template milestone for a hobby (e.g. "Month 1: hold a basic chord shape"). */
export type Milestone = {
  id: UUID;
  hobby_id: UUID;
  title: string;
  description: string;
  typical_timeframe: string;
  order_index: number;
}

/** A user's progress against a given hobby's template milestones. */
export type UserMilestone = {
  id: UUID;
  user_hobby_id: UUID;
  milestone_id: UUID;
  achieved_at: Timestamp | null;
}
