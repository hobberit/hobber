import { supabase } from "@/lib/supabase";
import type { MonthlyChallenge, UserHobby } from "@/types";

/** The current month's challenge for this user, if one's already been generated. `month` is YYYY-MM-01. */
export async function getMonthlyChallenge(
  userId: string,
  month: string
): Promise<MonthlyChallenge | null> {
  const { data, error } = await supabase
    .from("monthly_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMonthlyChallenge(
  userId: string,
  month: string,
  hobbyId: string
): Promise<MonthlyChallenge> {
  const { data, error } = await supabase
    .from("monthly_challenges")
    .insert({ user_id: userId, month, hobby_id: hobbyId, status: "pending" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Swaps in a different hobby for this month's challenge — "Try Another". */
export async function regenerateMonthlyChallenge(
  challengeId: string,
  hobbyId: string
): Promise<MonthlyChallenge> {
  const { data, error } = await supabase
    .from("monthly_challenges")
    .update({ hobby_id: hobbyId, status: "generated_another" })
    .eq("id", challengeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function skipMonthlyChallenge(challengeId: string): Promise<void> {
  const { error } = await supabase
    .from("monthly_challenges")
    .update({ status: "skipped" })
    .eq("id", challengeId);

  if (error) throw error;
}

/** Accepting creates the user_hobbies row (monthly challenges don't get one until now) and marks the challenge accepted. */
export async function acceptMonthlyChallenge(
  challenge: MonthlyChallenge,
  userId: string
): Promise<UserHobby> {
  const { data: userHobby, error: insertError } = await supabase
    .from("user_hobbies")
    .insert({
      user_id: userId,
      hobby_id: challenge.hobby_id,
      source_mode: "monthly_challenge",
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("monthly_challenges")
    .update({ status: "accepted" })
    .eq("id", challenge.id);

  if (updateError) throw updateError;
  return userHobby;
}
