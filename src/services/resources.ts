import { supabase } from "@/lib/supabase";
import type { Resource, ResourceCategory } from "@/types";

export async function listResourcesForHobby(
  hobbyId: string,
  category?: ResourceCategory
): Promise<Resource[]> {
  let query = supabase.from("resources").select("*").eq("hobby_id", hobbyId);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export interface ProgressionFeedItem {
  resource: Resource;
  hobbyId: string;
  hobbyName: string;
}

/** One "progression_story" resource per hobby, for the hobbies a user is actively tracking. */
export async function listProgressionFeed(hobbyIds: string[]): Promise<ProgressionFeedItem[]> {
  if (hobbyIds.length === 0) return [];

  const [{ data: resources, error: resourcesError }, { data: hobbies, error: hobbiesError }] =
    await Promise.all([
      supabase
        .from("resources")
        .select("*")
        .eq("category", "progression_story")
        .in("hobby_id", hobbyIds),
      supabase.from("hobbies").select("id, name").in("id", hobbyIds),
    ]);

  if (resourcesError) throw resourcesError;
  if (hobbiesError) throw hobbiesError;

  const hobbyNameById = new Map(hobbies.map((h) => [h.id, h.name]));

  return resources.map((resource) => ({
    resource,
    hobbyId: resource.hobby_id,
    hobbyName: hobbyNameById.get(resource.hobby_id) ?? "Unknown hobby",
  }));
}
