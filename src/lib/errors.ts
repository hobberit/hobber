/** Extracts a human-readable message from any thrown value.
 *
 * Supabase's client throws PostgrestError/AuthError — plain objects with a
 * `message` field, not real `Error` instances — so `e instanceof Error`
 * misses them and falls back to a useless generic message. This checks for
 * a `message` string on any object first, so real failure reasons (a
 * missing column, an RLS policy, a network error) actually reach the user. */
export function getErrorMessage(e: unknown, fallback = "Something went wrong."): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e) {
    const message = (e as { message: unknown }).message;
    if (typeof message === "string" && message.trim() !== "") return message;
  }
  return fallback;
}
