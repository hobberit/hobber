import { useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityCalendar } from "@/components/activity-calendar";
import type { WeekBucket } from "@/components/duration-bar-chart";
import { HobbyActivityChart } from "@/components/hobby-activity-chart";
import { ProfileHeader } from "@/components/profile-header";
import { RecentActivityList } from "@/components/recent-activity-card";
import { RecentPhotos } from "@/components/recent-photos";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { getWeekStart, toLocalISODate } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import { computeWeekStreak } from "@/lib/streak";
import {
  listActiveHobbies,
  listAllProgressLogsForUser,
  updateUserProfile,
  uploadAvatar,
  type ActiveHobby,
  type EnrichedProgressLog,
} from "@/services";

const WEEKS_SHOWN = 8;

// Cycled by order of first appearance so each hobby gets a stable, distinct color.
const HOBBY_COLOR_PALETTE = [
  "#3c87f7",
  "#f76c5e",
  "#2e9e4f",
  "#f7b32b",
  "#9b59b6",
  "#1abc9c",
  "#e84393",
  "#636e72",
];

function buildHobbyColors(logs: EnrichedProgressLog[]): Record<string, string> {
  const colors: Record<string, string> = {};
  let i = 0;
  for (const log of logs) {
    if (!(log.hobbyId in colors)) {
      colors[log.hobbyId] = HOBBY_COLOR_PALETTE[i % HOBBY_COLOR_PALETTE.length];
      i++;
    }
  }
  return colors;
}

/** Includes every active hobby by name, not just ones with logged activity yet —
 * so a newly added hobby shows up as its own filter pill on the activity chart
 * immediately, before the user has logged a single session. */
function buildHobbyNames(activeHobbies: ActiveHobby[]): Record<string, string> {
  const names: Record<string, string> = {};
  for (const { hobby } of activeHobbies) names[hobby.id] = hobby.name;
  return names;
}

function buildWeekBuckets(logs: EnrichedProgressLog[]): WeekBucket[] {
  const currentWeekStart = getWeekStart(new Date());
  const buckets: WeekBucket[] = [];
  for (let i = WEEKS_SHOWN - 1; i >= 0; i--) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - i * 7);
    buckets.push({ weekStart: toLocalISODate(weekStart), segments: [] });
  }

  const indexByWeekStart = new Map(buckets.map((b, i) => [b.weekStart, i]));
  for (const log of logs) {
    const weekStart = toLocalISODate(getWeekStart(new Date(log.log_date)));
    const index = indexByWeekStart.get(weekStart);
    if (index === undefined) continue;

    const bucket = buckets[index];
    const existingSegment = bucket.segments.find((s) => s.hobbyId === log.hobbyId);
    if (existingSegment) {
      existingSegment.minutes += log.duration_minutes;
    } else {
      bucket.segments.push({ hobbyId: log.hobbyId, minutes: log.duration_minutes });
    }
  }
  return buckets;
}

function buildLogsByDate(logs: EnrichedProgressLog[]): Map<string, EnrichedProgressLog[]> {
  const map = new Map<string, EnrichedProgressLog[]>();
  for (const log of logs) {
    const existing = map.get(log.log_date);
    if (existing) {
      existing.push(log);
    } else {
      map.set(log.log_date, [log]);
    }
  }
  return map;
}

type ScreenState =
  | {
      kind: "loaded";
      logs: EnrichedProgressLog[];
      activeHobbies: ActiveHobby[];
    }
  | { kind: "loading" }
  | { kind: "error"; message: string };

export default function ProfileScreen() {
  const { session, profile, refreshProfile } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      let isMounted = true;

      Promise.all([
        listAllProgressLogsForUser(session.user.id),
        listActiveHobbies(session.user.id),
      ])
        .then(([logs, activeHobbies]) => {
          if (isMounted) setState({ kind: "loaded", logs, activeHobbies });
        })
        .catch((e) => {
          if (isMounted) {
            setState({
              kind: "error",
              message: e instanceof Error ? e.message : "Something went wrong.",
            });
          }
        });

      return () => {
        isMounted = false;
      };
    }, [session?.user])
  );

  async function handlePickAvatar() {
    if (!session?.user) return;
    setAvatarError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setAvatarError("Photo library permission is required to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(
        session.user.id,
        asset.uri,
        asset.mimeType ?? "image/jpeg"
      );
      await updateUserProfile(session.user.id, { avatar_url: url });
      await refreshProfile();
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSaveDisplayName(name: string) {
    if (!session?.user) return;
    await updateUserProfile(session.user.id, { display_name: name || null });
    await refreshProfile();
  }

  async function handleSaveBio(bio: string) {
    if (!session?.user) return;
    setBioError(null);
    try {
      await updateUserProfile(session.user.id, { bio: bio || null });
      await refreshProfile();
    } catch (e) {
      setBioError(getErrorMessage(e));
      throw e;
    }
  }

  const headerStats =
    state.kind === "loaded"
      ? {
          activities: state.logs.length,
          weekStreak: computeWeekStreak(new Set(state.logs.map((l) => l.log_date))),
        }
      : { activities: 0, weekStreak: 0 };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}
          keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>Profile</ThemedText>

          {state.kind === "loaded" && state.logs.some((log) => log.photo_url) && (
            <ThemedView style={styles.recentPhotos}>
              <RecentPhotos logs={state.logs} />
            </ThemedView>
          )}

          {profile && session?.user && (
            <ThemedView style={styles.headerSection}>
              <ProfileHeader
                displayName={profile.display_name}
                email={session.user.email ?? ""}
                avatarUrl={profile.avatar_url}
                bio={profile.bio}
                stats={headerStats}
                isUploadingAvatar={isUploadingAvatar}
                onPickAvatar={handlePickAvatar}
                onSaveDisplayName={handleSaveDisplayName}
                onSaveBio={handleSaveBio}
              />
              {avatarError && <ThemedText style={styles.error}>{avatarError}</ThemedText>}
              {bioError && <ThemedText style={styles.error}>{bioError}</ThemedText>}
            </ThemedView>
          )}

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary">Loading...</ThemedText>
          )}

          {state.kind === "error" && (
            <ThemedText style={styles.error}>{state.message}</ThemedText>
          )}

          {state.kind === "loaded" &&
            (() => {
              const hobbyColors = buildHobbyColors(state.logs);
              const hobbyNames = buildHobbyNames(state.activeHobbies);
              return (
                <ThemedView style={styles.sections}>
                  <ThemedView style={styles.divider} />

                  <ThemedView style={[styles.card, styles.fullBleedCard]}>
                    {state.activeHobbies.length === 0 ? (
                      <ThemedText themeColor="textSecondary" type="small">
                        No active hobbies yet.
                      </ThemedText>
                    ) : (
                      <HobbyActivityChart
                        buckets={buildWeekBuckets(state.logs)}
                        hobbyIds={state.activeHobbies.map((h) => h.hobby.id)}
                        hobbyNames={hobbyNames}
                      />
                    )}

                    <ThemedView style={[styles.divider, styles.dividerSpaced]} />

                    <ThemedView style={styles.calendarSpacing}>
                      <ActivityCalendar
                        logsByDate={buildLogsByDate(state.logs)}
                        hobbyColors={hobbyColors}
                      />
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.divider} />

                  <ThemedView style={[styles.card, styles.fullBleedCard]}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      Activities
                    </ThemedText>
                    <RecentActivityList
                      logs={state.logs}
                      streak={headerStats.weekStreak}
                      poster={{
                        displayName: profile?.display_name ?? null,
                        avatarUrl: profile?.avatar_url ?? null,
                        email: session?.user.email ?? "",
                      }}
                    />
                  </ThemedView>
                </ThemedView>
              );
            })()}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  scrollContent: {
    paddingTop: Platform.select({ web: Spacing.six, default: Spacing.four }),
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  subheading: {
    marginTop: Spacing.half,
    marginBottom: Spacing.three,
  },
  headerSection: {
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  recentPhotos: {
    marginTop: Spacing.three,
  },
  error: {
    color: "#e0463f",
  },
  sections: {
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
  },
  fullBleedCard: {
    marginHorizontal: -Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: 0,
  },
  cardTitle: {
    fontSize: 21,
    lineHeight: 26,
    marginBottom: Spacing.two,
  },
  calendarSpacing: {
    marginTop: Spacing.three,
  },
  divider: {
    height: 4,
    backgroundColor: "#00000014",
  },
  dividerSpaced: {
    marginTop: Spacing.three,
  },
});
