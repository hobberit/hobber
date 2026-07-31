import { supabase } from "@/lib/supabase";
import type { ProgressLog } from "@/types";

export interface EnrichedProgressLog extends ProgressLog {
  hobbyId: string;
  hobbyName: string;
}

/** Every logged session across every one of the user's hobbies (any status), tagged with which hobby it belongs to. */
export async function listAllProgressLogsForUser(
  userId: string
): Promise<EnrichedProgressLog[]> {
  const { data: userHobbies, error } = await supabase
    .from("user_hobbies")
    .select("id, hobby_id")
    .eq("user_id", userId);

  if (error) throw error;
  if (userHobbies.length === 0) return [];

  const hobbyIdByUserHobbyId = new Map(userHobbies.map((uh) => [uh.id, uh.hobby_id]));
  const hobbyIds = [...new Set(userHobbies.map((uh) => uh.hobby_id))];

  const [{ data: logs, error: logsError }, { data: hobbies, error: hobbiesError }] =
    await Promise.all([
      supabase
        .from("progress_logs")
        .select("*")
        .in("user_hobby_id", userHobbies.map((uh) => uh.id))
        .order("log_date", { ascending: true }),
      supabase.from("hobbies").select("id, name").in("id", hobbyIds),
    ]);

  if (logsError) throw logsError;
  if (hobbiesError) throw hobbiesError;

  const hobbyNameById = new Map(hobbies.map((h) => [h.id, h.name]));

  return logs.map((log) => {
    const hobbyId = hobbyIdByUserHobbyId.get(log.user_hobby_id)!;
    return { ...log, hobbyId, hobbyName: hobbyNameById.get(hobbyId) ?? "Unknown hobby" };
  });
}
