/**
 * Typed accessor for client-safe env vars. Expo inlines EXPO_PUBLIC_* vars
 * into the bundle at build time (see .env.example) — anything secret
 * (Anthropic key, service_role key) must never be read here.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required env var "${name}". Copy .env.example to .env and fill it in.`
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required(
    "EXPO_PUBLIC_SUPABASE_URL",
    process.env.EXPO_PUBLIC_SUPABASE_URL
  ),
  supabaseAnonKey: required(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ),
  posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY || undefined,
  posthogHost:
    process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
} as const;
