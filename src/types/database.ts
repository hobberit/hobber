/**
 * Hand-authored counterpart to `supabase gen types typescript`, kept in sync
 * with db/migrations/*.sql by hand until a live project exists to generate
 * this from directly. Row types reuse the entity types in ./*.ts since those
 * already mirror the DB columns 1:1.
 *
 * IMPORTANT — every entity type in ./*.ts must be declared with `type X = {}`,
 * not `interface X {}`. Verified empirically: supabase-js's generic
 * constraints require each table's Row to structurally satisfy
 * `Record<string, unknown>`, and TypeScript's conditional-type `extends`
 * check (unlike plain assignment) does not grant `interface` declarations an
 * implicit index signature the way it does for `type` object literals. An
 * interface-typed Row silently fails that check, which collapses
 * `.select()`/`.insert()`/`.update()` inference to `never` for that table —
 * with no compile error until you try to assign a concrete payload into an
 * `.update()`/`.insert()` call (reads silently accept `never` since it's
 * assignable to anything, which is why this can go unnoticed for a while).
 *
 * `Relationships: []` and the empty `Views`/`Functions` are required to
 * structurally satisfy supabase-js's GenericSchema constraint.
 */
import type { EquipmentItem } from "./equipmentItem";
import type { Hobby } from "./hobby";
import type { Milestone, UserMilestone } from "./milestone";
import type { MonthlyChallenge } from "./monthlyChallenge";
import type { ProgressLog } from "./progressLog";
import type { Resource } from "./resource";
import type { Roadmap } from "./roadmap";
import type { User } from "./user";
import type { UserHobby } from "./userHobby";
import type {
  CostTier,
  HobbyCategory,
  IndoorOutdoor,
  MonthlyChallengeStatus,
  ResourceCategory,
  ResourceType,
  SkillLevel,
  SoloSocial,
  SourceMode,
  UserHobbyStatus,
} from "./enums";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Pick<User, "id" | "email"> &
          Partial<Omit<User, "id" | "email">>;
        Update: Partial<
          Pick<User, "id" | "email"> & Partial<Omit<User, "id" | "email">>
        >;
        Relationships: [];
      };
      hobbies: {
        Row: Hobby;
        Insert: Pick<
          Hobby,
          | "name"
          | "category"
          | "description"
          | "indoor_outdoor"
          | "solo_social"
          | "cost_tier"
          | "time_beginner_hrs_week"
          | "time_intermediate_hrs_week"
        > &
          Partial<
            Omit<
              Hobby,
              | "name"
              | "category"
              | "description"
              | "indoor_outdoor"
              | "solo_social"
              | "cost_tier"
              | "time_beginner_hrs_week"
              | "time_intermediate_hrs_week"
            >
          >;
        Update: Partial<Hobby>;
        Relationships: [];
      };
      equipment_items: {
        Row: EquipmentItem;
        Insert: Pick<EquipmentItem, "hobby_id" | "name"> &
          Partial<Omit<EquipmentItem, "hobby_id" | "name">>;
        Update: Partial<EquipmentItem>;
        Relationships: [];
      };
      roadmaps: {
        Row: Roadmap;
        Insert: Pick<
          Roadmap,
          "hobby_id" | "week_number" | "title" | "description"
        > &
          Partial<
            Omit<Roadmap, "hobby_id" | "week_number" | "title" | "description">
          >;
        Update: Partial<Roadmap>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Pick<
          Resource,
          "hobby_id" | "type" | "category" | "title" | "url"
        > &
          Partial<
            Omit<Resource, "hobby_id" | "type" | "category" | "title" | "url">
          >;
        Update: Partial<Resource>;
        Relationships: [];
      };
      milestones: {
        Row: Milestone;
        Insert: Pick<
          Milestone,
          "hobby_id" | "title" | "description" | "typical_timeframe"
        > &
          Partial<
            Omit<
              Milestone,
              "hobby_id" | "title" | "description" | "typical_timeframe"
            >
          >;
        Update: Partial<Milestone>;
        Relationships: [];
      };
      user_hobbies: {
        Row: UserHobby;
        Insert: Pick<UserHobby, "user_id" | "hobby_id" | "source_mode"> &
          Partial<Omit<UserHobby, "user_id" | "hobby_id" | "source_mode">>;
        Update: Partial<UserHobby>;
        Relationships: [];
      };
      user_milestones: {
        Row: UserMilestone;
        Insert: Pick<UserMilestone, "user_hobby_id" | "milestone_id"> &
          Partial<Omit<UserMilestone, "user_hobby_id" | "milestone_id">>;
        Update: Partial<UserMilestone>;
        Relationships: [];
      };
      progress_logs: {
        Row: ProgressLog;
        Insert: Pick<
          ProgressLog,
          "user_hobby_id" | "log_date" | "duration_minutes"
        > &
          Partial<
            Omit<ProgressLog, "user_hobby_id" | "log_date" | "duration_minutes">
          >;
        Update: Partial<ProgressLog>;
        Relationships: [];
      };
      monthly_challenges: {
        Row: MonthlyChallenge;
        Insert: Pick<MonthlyChallenge, "user_id" | "hobby_id" | "month"> &
          Partial<Omit<MonthlyChallenge, "user_id" | "hobby_id" | "month">>;
        Update: Partial<MonthlyChallenge>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      hobby_category: HobbyCategory;
      cost_tier: CostTier;
      indoor_outdoor: IndoorOutdoor;
      solo_social: SoloSocial;
      skill_level: SkillLevel;
      resource_type: ResourceType;
      resource_category: ResourceCategory;
      user_hobby_status: UserHobbyStatus;
      source_mode: SourceMode;
      monthly_challenge_status: MonthlyChallengeStatus;
    };
  };
};
