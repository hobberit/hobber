import type { Timestamp, UUID } from "./common";
import type { IndoorOutdoor, SkillLevel, SoloSocial } from "./enums";

/** Free-form quiz answers captured during onboarding; shape evolves with the quiz. */
export type PersonalityProfile = Record<string, unknown>;

export type User = {
  id: UUID;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  auth_provider: string;
  personality_profile: PersonalityProfile | null;
  budget_range: CostBudgetRange | null;
  indoor_outdoor_pref: IndoorOutdoor | null;
  solo_social_pref: SoloSocial | null;
  skill_level: SkillLevel | null;
  free_time_hrs_week: number | null;
  onboarding_completed_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type CostBudgetRange = {
  min: number;
  max: number;
}
