import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  fields: Partial<Pick<User, "display_name" | "avatar_url">>
): Promise<void> {
  const { error } = await supabase.from("users").update(fields).eq("id", userId);
  if (error) throw error;
}
