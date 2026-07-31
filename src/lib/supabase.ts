import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

import { env } from "@/config/env";
import type { Database } from "@/types/database";

// Expo Router's web output prerenders on Node (app.json: web.output "static"),
// where `window`/`localStorage` don't exist. Supabase Auth eagerly reads
// persisted-session storage on client creation, which crashes that render
// pass unless persistence is disabled outside a real browser.
const isBrowser = typeof window !== "undefined";

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: isBrowser,
      persistSession: isBrowser,
      // Only relevant for web OAuth redirect callbacks — revisit once social
      // login is wired up.
      detectSessionInUrl: false,
    },
  }
);

if (isBrowser) {
  // Supabase's token auto-refresh timer keeps running in the background even
  // when the app isn't foregrounded, wasting battery/requests. Tie it to
  // AppState so it only runs while the app is active — see
  // https://supabase.com/docs/reference/javascript/auth-startautorefresh
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
