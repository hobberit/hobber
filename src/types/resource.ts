import type { UUID } from "./common";
import type { ResourceCategory, ResourceType } from "./enums";

export type Resource = {
  id: UUID;
  hobby_id: UUID;
  type: ResourceType;
  category: ResourceCategory;
  title: string;
  url: string;
  source: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
}
