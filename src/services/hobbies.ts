import { supabase } from "@/lib/supabase";
import type {
  CostTier,
  Hobby,
  HobbyCategory,
  IndoorOutdoor,
  SoloSocial,
} from "@/types";

export interface HobbyFilters {
  category?: HobbyCategory;
  indoorOutdoor?: IndoorOutdoor;
  soloSocial?: SoloSocial;
  costTier?: CostTier;
}

export async function listHobbies(filters: HobbyFilters = {}): Promise<Hobby[]> {
  let query = supabase.from("hobbies").select("*");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.indoorOutdoor)
    query = query.eq("indoor_outdoor", filters.indoorOutdoor);
  if (filters.soloSocial) query = query.eq("solo_social", filters.soloSocial);
  if (filters.costTier) query = query.eq("cost_tier", filters.costTier);

  const { data, error } = await query.order("name");
  if (error) throw error;
  return data;
}

export async function getHobbyById(hobbyId: string): Promise<Hobby | null> {
  const { data, error } = await supabase
    .from("hobbies")
    .select("*")
    .eq("id", hobbyId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
