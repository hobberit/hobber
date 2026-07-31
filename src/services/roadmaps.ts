import { supabase } from "@/lib/supabase";
import type { Roadmap } from "@/types";

/** The 4-week starter roadmap for a hobby, ordered week 1 -> 4. */
export async function listRoadmapForHobby(hobbyId: string): Promise<Roadmap[]> {
  const { data, error } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("hobby_id", hobbyId)
    .order("week_number");

  if (error) throw error;
  return data;
}
