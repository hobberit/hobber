import type { UUID } from "./common";

export type EquipmentItem = {
  id: UUID;
  hobby_id: UUID;
  name: string;
  is_essential: boolean;
  cost_min: number;
  cost_max: number;
  product_link: string | null;
  alt_note: string | null;
}
