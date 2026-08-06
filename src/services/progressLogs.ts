import { supabase } from "@/lib/supabase";
import type { ProgressLog } from "@/types";

export async function listProgressLogs(userHobbyId: string): Promise<ProgressLog[]> {
  const { data, error } = await supabase
    .from("progress_logs")
    .select("*")
    .eq("user_hobby_id", userHobbyId)
    .order("log_date", { ascending: false });

  if (error) throw error;
  return data;
}

export interface NewProgressLog {
  title: string;
  log_date: string;
  duration_minutes: number;
  notes?: string;
  photo_url?: string;
}

export async function addProgressLog(
  userHobbyId: string,
  log: NewProgressLog
): Promise<ProgressLog> {
  const { data, error } = await supabase
    .from("progress_logs")
    .insert({ user_hobby_id: userHobbyId, ...log })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export interface ProgressLogUpdate {
  title?: string;
  log_date?: string;
  duration_minutes?: number;
  notes?: string | null;
  photo_url?: string | null;
}

export async function updateProgressLog(
  logId: string,
  updates: ProgressLogUpdate
): Promise<ProgressLog> {
  const { data, error } = await supabase
    .from("progress_logs")
    .update(updates)
    .eq("id", logId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProgressLog(logId: string): Promise<void> {
  const { error } = await supabase.from("progress_logs").delete().eq("id", logId);

  if (error) throw error;
}
