import { supabase } from "@/lib/supabase";

/** Uploads to the "activity-photos" bucket under "<user_id>/<timestamp>.<ext>" —
 * the path shape the storage RLS policies (0008_activity_photos.sql) key off of. */
export async function uploadActivityPhoto(
  userId: string,
  uri: string,
  mimeType: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const extension = mimeType.split("/")[1] ?? "jpg";
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("activity-photos")
    .upload(path, blob, { contentType: mimeType });
  if (error) throw error;

  const { data } = supabase.storage.from("activity-photos").getPublicUrl(path);
  return data.publicUrl;
}
