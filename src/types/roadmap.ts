import type { UUID } from "./common";

/** One week of a hobby's 4-week starter roadmap. Template-level, shared across all users of a hobby. */
export type Roadmap = {
  id: UUID;
  hobby_id: UUID;
  week_number: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  goals: string[];
}
