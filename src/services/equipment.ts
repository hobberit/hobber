import { supabase } from "@/lib/supabase";
import type { EquipmentItem } from "@/types";

export async function listEquipmentForHobby(
  hobbyId: string
): Promise<EquipmentItem[]> {
  const { data, error } = await supabase
    .from("equipment_items")
    .select("*")
    .eq("hobby_id", hobbyId)
    .order("is_essential", { ascending: false });

  if (error) throw error;
  return data;
}
