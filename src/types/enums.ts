// Mirrors the Postgres enum types defined in db/migrations. Keep these two in sync.

export type HobbyCategory =
  | "creative"
  | "physical"
  | "technical"
  | "outdoor"
  | "social";

export type CostTier = "free" | "low" | "medium" | "high";

export type IndoorOutdoor = "indoor" | "outdoor" | "both";

export type SoloSocial = "solo" | "social" | "both";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type UserHobbyStatus =
  | "suggested"
  | "accepted"
  | "skipped"
  | "saved_for_later"
  | "active"
  | "paused"
  | "completed"
  | "abandoned";

export type SourceMode =
  | "might_like"
  | "left_field"
  | "surprise_me"
  | "monthly_challenge";

export type ResourceType = "video" | "article" | "product_link";

export type ResourceCategory =
  | "first_30_minutes"
  | "first_week"
  | "beginner_mistakes"
  | "progression_story";

export type MonthlyChallengeStatus =
  | "pending"
  | "accepted"
  | "skipped"
  | "generated_another";
