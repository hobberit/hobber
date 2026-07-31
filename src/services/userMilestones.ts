import { supabase } from "@/lib/supabase";
import type { UserMilestone } from "@/types";

export async function listUserMilestones(userHobbyId: string): Promise<UserMilestone[]> {
  const { data, error } = await supabase
    .from("user_milestones")
    .select("*")
    .eq("user_hobby_id", userHobbyId);

  if (error) throw error;
  return data;
}

/** Upserts so re-marking an already-achieved milestone is a no-op rather than a duplicate row. */
export async function markMilestoneAchieved(
  userHobbyId: string,
  milestoneId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_milestones")
    .upsert(
      {
        user_hobby_id: userHobbyId,
        milestone_id: milestoneId,
        achieved_at: new Date().toISOString(),
      },
      { onConflict: "user_hobby_id,milestone_id" }
    );

  if (error) throw error;
}
