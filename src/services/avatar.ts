import { supabase } from "@/lib/supabase";

/** Uploads to the "avatars" bucket under "<user_id>/avatar.<ext>" — the path
 * shape the storage RLS policies (0003_avatars.sql) key off of. */
export async function uploadAvatar(
  userId: string,
  uri: string,
  mimeType: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const extension = mimeType.split("/")[1] ?? "jpg";
  const path = `${userId}/avatar.${extension}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, { contentType: mimeType, upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
