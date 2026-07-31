// Deno edge function. Deploy via Supabase Dashboard (Edge Functions > Deploy
// a new function, paste this file) or `supabase functions deploy
// generate-hobby-suggestion` if you're using the CLI.
//
// No external API calls, no secrets required — every mode is computed
// entirely from the user's profile and the hobby catalog, so this runs at
// zero ongoing cost. SUPABASE_URL and SUPABASE_ANON_KEY are injected
// automatically by the platform.
//
// Runs with the CALLER's JWT (not service_role) so every read/write here is
// still subject to the RLS policies from 0002_auth_and_rls.sql — this
// function can only ever see/write the calling user's own data.

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type GeneratorMode =
  | "might_like"
  | "left_field"
  | "surprise_me"
  | "monthly_challenge";

interface HobbyRow {
  id: string;
  name: string;
  category: string;
  description: string;
  indoor_outdoor: string;
  solo_social: string;
  cost_tier: string;
  cost_min: number;
  cost_max: number;
  time_beginner_hrs_week: number;
  tags: string[];
  image_url: string | null;
}

interface UserProfileRow {
  personality_profile: {
    interests?: string[];
    current_hobbies?: string[];
  } | null;
  budget_range: { min: number; max: number } | null;
  indoor_outdoor_pref: string | null;
  solo_social_pref: string | null;
  free_time_hrs_week: number | null;
}

interface FinishedFeedback {
  hobby_id: string;
  feedback_enjoyed: boolean;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Same bucketing used when the catalog was seeded — see db/seed/0001_hobbies_seed.sql.
function costTierRank(tier: string): number {
  return { free: 0, low: 1, medium: 2, high: 3 }[tier] ?? 3;
}

function budgetTierRank(maxBudget: number | undefined): number {
  if (maxBudget === undefined) return 3;
  if (maxBudget <= 0) return 0;
  if (maxBudget <= 150) return 1;
  if (maxBudget <= 500) return 2;
  return 3;
}

/** Budget, indoor/outdoor, and solo/social are hard constraints — a hobby that
 * violates any of them is excluded outright, for both "might like" and
 * "left field" modes. Taste (interests, current hobbies) is soft and is what
 * distinguishes the two modes. */
function passesHardConstraints(hobby: HobbyRow, profile: UserProfileRow): boolean {
  const { indoor_outdoor_pref, solo_social_pref, budget_range } = profile;

  if (
    indoor_outdoor_pref &&
    indoor_outdoor_pref !== "both" &&
    hobby.indoor_outdoor !== "both" &&
    hobby.indoor_outdoor !== indoor_outdoor_pref
  ) {
    return false;
  }

  if (
    solo_social_pref &&
    solo_social_pref !== "both" &&
    hobby.solo_social !== "both" &&
    hobby.solo_social !== solo_social_pref
  ) {
    return false;
  }

  if (budget_range && costTierRank(hobby.cost_tier) > budgetTierRank(budget_range.max)) {
    return false;
  }

  return true;
}

/** How much a candidate hobby resembles hobbies the user has already finished — same
 * category counts most, shared tags add a smaller amount. Only meaningful relative to
 * other candidates, not an absolute score. */
function similarity(a: HobbyRow, b: HobbyRow): number {
  if (a.id === b.id) return 0;
  const sameCategory = a.category === b.category ? 1.5 : 0;
  const sharedTags = a.tags.filter((t) => b.tags.includes(t)).length;
  return sameCategory + sharedTags * 0.4;
}

/** Positive for hobbies like ones the user enjoyed, negative for hobbies like ones
 * they didn't — accumulates across every piece of feedback given, not just the latest. */
function feedbackBias(
  hobby: HobbyRow,
  finishedFeedback: FinishedFeedback[],
  hobbyById: Map<string, HobbyRow>
): number {
  let bias = 0;
  for (const feedback of finishedFeedback) {
    const finishedHobby = hobbyById.get(feedback.hobby_id);
    if (!finishedHobby) continue;
    const sim = similarity(hobby, finishedHobby);
    bias += feedback.feedback_enjoyed ? sim : -sim;
  }
  return bias;
}

function affinityScore(hobby: HobbyRow, profile: UserProfileRow, feedbackBiasScore: number): number {
  let score = 0;
  const interests = profile.personality_profile?.interests ?? [];
  const currentHobbies = (profile.personality_profile?.current_hobbies ?? []).map(
    (h) => h.toLowerCase()
  );

  if (interests.includes(hobby.category)) score += 2;

  const hobbyText = `${hobby.name} ${hobby.tags.join(" ")}`.toLowerCase();
  for (const h of currentHobbies) {
    if (hobbyText.includes(h) || h.includes(hobby.name.toLowerCase())) score += 1;
  }

  if (
    profile.free_time_hrs_week != null &&
    hobby.time_beginner_hrs_week <= profile.free_time_hrs_week
  ) {
    score += 1;
  }

  score += feedbackBiasScore;

  // Small jitter so ties (common with a 35-hobby catalog) don't always
  // resolve to the same hobby.
  score += Math.random() * 0.5;

  return score;
}

function buildRationale(
  mode: Exclude<GeneratorMode, "surprise_me">,
  hobby: HobbyRow,
  profile: UserProfileRow,
  feedbackBiasScore: number
): string {
  const interests = profile.personality_profile?.interests ?? [];

  if (mode === "monthly_challenge" || mode === "might_like") {
    const lead = mode === "monthly_challenge" ? "This month's challenge" : "This";

    if (feedbackBiasScore >= 1.5) {
      return `${lead} is similar to a hobby you told us you enjoyed, and it fits your budget and schedule too — worth another shot at something in that vein.`;
    }
    if (interests.includes(hobby.category)) {
      return `${lead} lines up with your interest in ${hobby.category} activities, and it fits your budget and time commitment — a solid place to start.`;
    }
    return `${lead} fits your budget, schedule, and ${hobby.indoor_outdoor}/${hobby.solo_social} preferences well, even if it's not exactly what you listed as an interest.`;
  }

  return `This is a departure from your usual ${
    interests.length ? interests.join("/") : "interests"
  } — a deliberate curveball that still fits your budget and schedule. Sometimes the best hobbies are the ones you wouldn't have picked yourself.`;
}

/** monthly_challenge scores the same way as might_like — a best-fit pick, not a curveball.
 * Past-hobby feedback only nudges might_like/monthly_challenge — left_field is deliberately
 * about departing from taste, so it stays feedback-agnostic. */
function pickWithRules(
  mode: Exclude<GeneratorMode, "surprise_me">,
  profile: UserProfileRow,
  catalog: HobbyRow[],
  hobbyById: Map<string, HobbyRow>,
  finishedFeedback: FinishedFeedback[]
): { hobby_id: string; rationale: string } {
  const constrained = catalog.filter((h) => passesHardConstraints(h, profile));
  const pool = constrained.length > 0 ? constrained : catalog;
  const applyFeedback = mode === "might_like" || mode === "monthly_challenge";

  const scored = pool
    .map((hobby) => {
      const bias = applyFeedback ? feedbackBias(hobby, finishedFeedback, hobbyById) : 0;
      return { hobby, bias, score: affinityScore(hobby, profile, bias) };
    })
    .sort((a, b) => (mode === "left_field" ? a.score - b.score : b.score - a.score));

  const chosen = scored[0];
  return {
    hobby_id: chosen.hobby.id,
    rationale: buildRationale(mode, chosen.hobby, profile, chosen.bias),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode as GeneratorMode;
    const excludeHobbyIds: string[] = Array.isArray(body.excludeHobbyIds)
      ? body.excludeHobbyIds
      : [];

    if (
      !["might_like", "left_field", "surprise_me", "monthly_challenge"].includes(mode)
    ) {
      return jsonResponse({ error: "Invalid mode" }, 400);
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError || !profile) {
      return jsonResponse({ error: "Profile not found" }, 404);
    }

    const { data: hobbies, error: hobbiesError } = await supabase
      .from("hobbies")
      .select(
        "id, name, category, description, indoor_outdoor, solo_social, cost_tier, cost_min, cost_max, time_beginner_hrs_week, tags, image_url"
      );
    if (hobbiesError || !hobbies) {
      return jsonResponse({ error: "Failed to load hobby catalog" }, 500);
    }

    // Never re-suggest a hobby the user is currently doing or has already
    // finished — regardless of mode. This is server-side (not just the
    // client's session-local excludeHobbyIds) so it holds across app
    // restarts and every generator mode, including monthly_challenge.
    const { data: ownedHobbies, error: ownedError } = await supabase
      .from("user_hobbies")
      .select("hobby_id")
      .eq("user_id", user.id)
      .in("status", ["active", "completed"]);
    if (ownedError) {
      return jsonResponse({ error: "Failed to load current/finished hobbies" }, 500);
    }
    const ownedHobbyIds = ownedHobbies.map((h) => h.hobby_id as string);

    const eligible = (hobbies as HobbyRow[]).filter(
      (h) => !excludeHobbyIds.includes(h.id) && !ownedHobbyIds.includes(h.id)
    );
    if (eligible.length === 0) {
      return jsonResponse(
        {
          error:
            "No more hobbies to suggest — you're already tracking or have finished everything left in the catalog!",
        },
        404
      );
    }

    let picked: { hobby_id: string; rationale: string };
    if (mode === "surprise_me") {
      const random = eligible[Math.floor(Math.random() * eligible.length)];
      picked = {
        hobby_id: random.id,
        rationale:
          "Every hobby deserves a shot — here's a wildcard pick just for the fun of it.",
      };
    } else {
      const { data: finishedFeedback, error: feedbackError } = await supabase
        .from("user_hobbies")
        .select("hobby_id, feedback_enjoyed")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .not("feedback_enjoyed", "is", null);
      if (feedbackError) {
        return jsonResponse({ error: "Failed to load hobby feedback" }, 500);
      }

      const hobbyById = new Map((hobbies as HobbyRow[]).map((h) => [h.id, h]));
      picked = pickWithRules(
        mode,
        profile as UserProfileRow,
        eligible,
        hobbyById,
        finishedFeedback as FinishedFeedback[]
      );
    }

    const hobby = eligible.find((h) => h.id === picked.hobby_id);
    if (!hobby) {
      return jsonResponse(
        { error: "Picker returned a hobby id outside the catalog" },
        502
      );
    }

    // monthly_challenge is tracked in the monthly_challenges table (client-side,
    // see src/services/monthlyChallenge.ts) rather than user_hobbies — a
    // user_hobbies row only gets created once the challenge is actually accepted.
    if (mode === "monthly_challenge") {
      return jsonResponse({ hobby, rationale: picked.rationale });
    }

    const { data: userHobby, error: insertError } = await supabase
      .from("user_hobbies")
      .insert({
        user_id: user.id,
        hobby_id: hobby.id,
        source_mode: mode,
        status: "suggested",
      })
      .select()
      .single();
    if (insertError || !userHobby) {
      return jsonResponse(
        { error: insertError?.message ?? "Failed to save suggestion" },
        500
      );
    }

    return jsonResponse({ hobby, rationale: picked.rationale, userHobby });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
