import type { Timestamp, UUID } from "./common";
import type { CostTier, HobbyCategory, IndoorOutdoor, SoloSocial } from "./enums";

export type Hobby = {
  id: UUID;
  name: string;
  category: HobbyCategory;
  description: string;
  indoor_outdoor: IndoorOutdoor;
  solo_social: SoloSocial;
  cost_tier: CostTier;
  cost_min: number;
  cost_max: number;
  time_beginner_hrs_week: number;
  time_intermediate_hrs_week: number;
  tags: string[];
  image_url: string | null;
  created_at: Timestamp;
}
