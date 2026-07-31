import { supabase } from "@/lib/supabase";
import type { UserHobbyStatus } from "@/types";

export async function updateUserHobbyStatus(
  userHobbyId: string,
  status: UserHobbyStatus,
  extra: Partial<{ started_at: string }> = {}
): Promise<void> {
  const { error } = await supabase
    .from("user_hobbies")
    .update({ status, ...extra })
    .eq("id", userHobbyId);

  if (error) throw error;
}

export async function acceptHobby(userHobbyId: string): Promise<void> {
  await updateUserHobbyStatus(userHobbyId, "active", {
    started_at: new Date().toISOString(),
  });
}

export async function skipHobby(userHobbyId: string): Promise<void> {
  await updateUserHobbyStatus(userHobbyId, "skipped");
}

export async function saveHobbyForLater(userHobbyId: string): Promise<void> {
  await updateUserHobbyStatus(userHobbyId, "saved_for_later");
}

/** Finishing a hobby marks it completed — it can still be resumed later. Pair with recordHobbyFeedback(). */
export async function finishHobby(userHobbyId: string): Promise<void> {
  await updateUserHobbyStatus(userHobbyId, "completed");
}

export async function resumeHobby(userHobbyId: string): Promise<void> {
  await updateUserHobbyStatus(userHobbyId, "active");
}

/** Whether the user enjoyed a finished hobby — feeds the generator's "might_like" scoring for similar hobbies. */
export async function recordHobbyFeedback(
  userHobbyId: string,
  enjoyed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("user_hobbies")
    .update({ feedback_enjoyed: enjoyed })
    .eq("id", userHobbyId);

  if (error) throw error;
}
