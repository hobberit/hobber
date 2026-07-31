import { supabase } from "@/lib/supabase";
import type { Database, HobbyCategory, IndoorOutdoor, SoloSocial } from "@/types";

type UsersUpdate = Database["public"]["Tables"]["users"]["Update"];

export interface OnboardingAnswers {
  current_hobbies: string[];
  interests: HobbyCategory[];
  /** Option value from quizConfig, e.g. "3.5" */
  free_time_hrs_week: string;
  /** Option value from quizConfig, e.g. "0-150" */
  budget_range: string;
  indoor_outdoor_pref: IndoorOutdoor;
  solo_social_pref: SoloSocial;
}

export async function completeOnboarding(
  userId: string,
  answers: OnboardingAnswers
): Promise<void> {
  const [budgetMin, budgetMax] = answers.budget_range.split("-").map(Number);

  const payload: UsersUpdate = {
    personality_profile: {
      current_hobbies: answers.current_hobbies,
      interests: answers.interests,
    },
    budget_range: { min: budgetMin, max: budgetMax },
    indoor_outdoor_pref: answers.indoor_outdoor_pref,
    solo_social_pref: answers.solo_social_pref,
    free_time_hrs_week: Number(answers.free_time_hrs_week),
    onboarding_completed_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId);

  if (error) throw error;
}
