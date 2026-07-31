import { supabase } from "@/lib/supabase";
import type { Hobby, SourceMode, UserHobby } from "@/types";

export type GeneratorMode = Exclude<SourceMode, "monthly_challenge">;

export interface GeneratedSuggestion {
  hobby: Hobby;
  rationale: string;
  userHobby: UserHobby;
}

/** Invokes the generate-hobby-suggestion edge function — see supabase/functions/. */
export async function generateHobbySuggestion(
  mode: GeneratorMode,
  excludeHobbyIds: string[] = []
): Promise<GeneratedSuggestion> {
  const { data, error } = await supabase.functions.invoke<GeneratedSuggestion>(
    "generate-hobby-suggestion",
    { body: { mode, excludeHobbyIds } }
  );

  if (error) throw error;
  if (!data) throw new Error("No suggestion returned");
  return data;
}

export interface MonthlyChallengePick {
  hobby: Hobby;
  rationale: string;
}

/**
 * Same edge function, "monthly_challenge" mode — picked with the same
 * rule-based scoring as "might_like", but doesn't touch user_hobbies (see
 * src/services/monthlyChallenge.ts for how the pick gets tracked/accepted).
 */
export async function generateMonthlyChallengeHobby(
  excludeHobbyIds: string[] = []
): Promise<MonthlyChallengePick> {
  const { data, error } = await supabase.functions.invoke<MonthlyChallengePick>(
    "generate-hobby-suggestion",
    { body: { mode: "monthly_challenge", excludeHobbyIds } }
  );

  if (error) throw error;
  if (!data) throw new Error("No suggestion returned");
  return data;
}
