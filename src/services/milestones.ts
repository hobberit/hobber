import { supabase } from "@/lib/supabase";
import type { Milestone } from "@/types";

export async function listMilestonesForHobby(
  hobbyId: string
): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from("milestones")
    .select("*")
    .eq("hobby_id", hobbyId)
    .order("order_index");

  if (error) throw error;
  return data;
}
