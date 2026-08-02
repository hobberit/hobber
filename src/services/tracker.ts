import { supabase } from "@/lib/supabase";
import { getHobbyById } from "@/services/hobbies";
import { listMilestonesForHobby } from "@/services/milestones";
import { listProgressLogs } from "@/services/progressLogs";
import { listUserMilestones } from "@/services/userMilestones";
import type {
  Hobby,
  Milestone,
  ProgressLog,
  UserHobby,
  UserHobbyStatus,
  UserMilestone,
} from "@/types";

export interface ActiveHobby {
  userHobby: UserHobby;
  hobby: Hobby;
}

async function listHobbiesByStatus(
  userId: string,
  status: UserHobbyStatus,
  orderBy: "started_at" | "updated_at"
): Promise<ActiveHobby[]> {
  const { data: userHobbies, error } = await supabase
    .from("user_hobbies")
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .order(orderBy, { ascending: false });

  if (error) throw error;
  if (userHobbies.length === 0) return [];

  const hobbyIds = userHobbies.map((uh) => uh.hobby_id);
  const { data: hobbies, error: hobbiesError } = await supabase
    .from("hobbies")
    .select("*")
    .in("id", hobbyIds);

  if (hobbiesError) throw hobbiesError;
  const hobbyById = new Map(hobbies.map((h) => [h.id, h]));

  return userHobbies
    .map((userHobby) => {
      const hobby = hobbyById.get(userHobby.hobby_id);
      return hobby ? { userHobby, hobby } : null;
    })
    .filter((x): x is ActiveHobby => x !== null);
}

/** Hobbies the user has accepted and is actively tracking. */
export async function listActiveHobbies(userId: string): Promise<ActiveHobby[]> {
  return listHobbiesByStatus(userId, "active", "started_at");
}

/** Hobbies the user has finished — shown as "Finished Hobbies", resumable at any time. */
export async function listFinishedHobbies(userId: string): Promise<ActiveHobby[]> {
  return listHobbiesByStatus(userId, "completed", "updated_at");
}

export interface ActiveHobbyProgress extends ActiveHobby {
  sessionsLogged: number;
  milestonesAchieved: number;
  milestonesTotal: number;
}

/** Adds session counts and milestone progress to a list of hobbies, e.g. for the
 * "Milestone 2 of 4 · 8 sessions logged" caption on My Hobbies cards. Fetches in
 * three bulk queries (not one per hobby) to stay flat regardless of list size. */
export async function withProgressSummary(hobbies: ActiveHobby[]): Promise<ActiveHobbyProgress[]> {
  if (hobbies.length === 0) return [];

  const userHobbyIds = hobbies.map((h) => h.userHobby.id);
  const hobbyIds = [...new Set(hobbies.map((h) => h.hobby.id))];

  const [logsResult, milestonesResult, userMilestonesResult] = await Promise.all([
    supabase.from("progress_logs").select("user_hobby_id").in("user_hobby_id", userHobbyIds),
    supabase.from("milestones").select("hobby_id").in("hobby_id", hobbyIds),
    supabase
      .from("user_milestones")
      .select("user_hobby_id")
      .in("user_hobby_id", userHobbyIds)
      .not("achieved_at", "is", null),
  ]);

  if (logsResult.error) throw logsResult.error;
  if (milestonesResult.error) throw milestonesResult.error;
  if (userMilestonesResult.error) throw userMilestonesResult.error;

  const sessionsByHobby = countBy(logsResult.data, (r) => r.user_hobby_id);
  const milestonesByHobby = countBy(milestonesResult.data, (r) => r.hobby_id);
  const achievedByHobby = countBy(userMilestonesResult.data, (r) => r.user_hobby_id);

  return hobbies.map((h) => ({
    ...h,
    sessionsLogged: sessionsByHobby.get(h.userHobby.id) ?? 0,
    milestonesAchieved: achievedByHobby.get(h.userHobby.id) ?? 0,
    milestonesTotal: milestonesByHobby.get(h.hobby.id) ?? 0,
  }));
}

function countBy<T>(rows: T[], key: (row: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

export interface TrackerDetail {
  userHobby: UserHobby;
  hobby: Hobby;
  logs: ProgressLog[];
  milestones: Milestone[];
  userMilestones: UserMilestone[];
}

/** Everything the tracker detail screen needs for one active hobby, fetched in parallel. */
export async function getTrackerDetail(userHobbyId: string): Promise<TrackerDetail | null> {
  const { data: userHobby, error } = await supabase
    .from("user_hobbies")
    .select("*")
    .eq("id", userHobbyId)
    .maybeSingle();

  if (error) throw error;
  if (!userHobby) return null;

  const [hobby, logs, milestones, userMilestones] = await Promise.all([
    getHobbyById(userHobby.hobby_id),
    listProgressLogs(userHobbyId),
    listMilestonesForHobby(userHobby.hobby_id),
    listUserMilestones(userHobbyId),
  ]);

  if (!hobby) return null;
  return { userHobby, hobby, logs, milestones, userMilestones };
}
