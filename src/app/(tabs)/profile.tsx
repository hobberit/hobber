import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityCalendar } from "@/components/activity-calendar";
import { ActivityFeed } from "@/components/activity-feed";
import type { WeekBucket } from "@/components/duration-bar-chart";
import { HobbyActivityChart } from "@/components/hobby-activity-chart";
import { ProfileHeader } from "@/components/profile-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { getWeekStart, toLocalISODate } from "@/lib/date";
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

function buildHobbyNames(logs: EnrichedProgressLog[]): Record<string, string> {
  const names: Record<string, string> = {};
  for (const log of logs) names[log.hobbyId] = log.hobbyName;
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

interface ActivitySummary {
  hobbyId: string;
  hobbyName: string;
  sessionCount: number;
  totalMinutes: number;
}

function summarizeActivities(logs: EnrichedProgressLog[]): ActivitySummary[] {
  const byHobby = new Map<string, ActivitySummary>();
  for (const log of logs) {
    const existing = byHobby.get(log.hobbyId);
    if (existing) {
      existing.sessionCount += 1;
      existing.totalMinutes += log.duration_minutes;
    } else {
      byHobby.set(log.hobbyId, {
        hobbyId: log.hobbyId,
        hobbyName: log.hobbyName,
        sessionCount: 1,
        totalMinutes: log.duration_minutes,
      });
    }
  }
  return [...byHobby.values()].sort((a, b) => b.totalMinutes - a.totalMinutes);
}

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; logs: EnrichedProgressLog[]; activeHobbies: ActiveHobby[] }
  | { kind: "error"; message: string };

export default function ProfileScreen() {
  const router = useRouter();
  const { session, profile, refreshProfile } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}>
          <ThemedText type="title">Profile</ThemedText>

          {profile && session?.user && (
            <ThemedView style={styles.headerSection}>
              <ProfileHeader
                displayName={profile.display_name}
                email={session.user.email ?? ""}
                avatarUrl={profile.avatar_url}
                isUploadingAvatar={isUploadingAvatar}
                onPickAvatar={handlePickAvatar}
                onSaveDisplayName={handleSaveDisplayName}
              />
              {avatarError && <ThemedText style={styles.error}>{avatarError}</ThemedText>}
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
              const hobbyNames = buildHobbyNames(state.logs);
              const activitySummaries = summarizeActivities(state.logs);
              const activeHobbyIds = new Set(state.activeHobbies.map((h) => h.hobby.id));
              const weekStreak = computeWeekStreak(new Set(state.logs.map((l) => l.log_date)));
              return (
                <ThemedView style={styles.sections}>
                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      Streak
                    </ThemedText>
                    <ThemedText type="title">
                      {weekStreak} {weekStreak === 1 ? "week" : "weeks"}
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" type="small">
                      {weekStreak > 0
                        ? "Log at least one activity a week to keep it going."
                        : "Log an activity this week to start a new streak."}
                    </ThemedText>
                  </ThemedView>

                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      Current Hobbies
                    </ThemedText>
                    {state.activeHobbies.length === 0 ? (
                      <ThemedText themeColor="textSecondary" type="small">
                        Nothing active yet — tap the + on My Hobbies to generate a suggestion.
                      </ThemedText>
                    ) : (
                      <ThemedView style={styles.list}>
                        {state.activeHobbies.map(({ userHobby, hobby }) => (
                          <Pressable
                            key={userHobby.id}
                            onPress={() =>
                              router.push({
                                pathname: "/tracker/[userHobbyId]",
                                params: { userHobbyId: userHobby.id },
                              })
                            }>
                            <ThemedView style={styles.hobbyChip}>
                              <ThemedText type="small">{hobby.name}</ThemedText>
                            </ThemedView>
                          </Pressable>
                        ))}
                      </ThemedView>
                    )}
                  </ThemedView>

                  <ThemedView type="backgroundElement" style={styles.card}>
                    {activitySummaries.length === 0 ? (
                      <ThemedText themeColor="textSecondary" type="small">
                        No sessions logged yet.
                      </ThemedText>
                    ) : (
                      <HobbyActivityChart
                        buckets={buildWeekBuckets(state.logs)}
                        hobbyIds={activitySummaries
                          .map((s) => s.hobbyId)
                          .filter((hobbyId) => activeHobbyIds.has(hobbyId))}
                        hobbyNames={hobbyNames}
                      />
                    )}
                  </ThemedView>

                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      All Activities
                    </ThemedText>
                    <ActivityFeed logs={state.logs} />
                  </ThemedView>

                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      Calendar
                    </ThemedText>
                    <ActivityCalendar
                      logsByDate={buildLogsByDate(state.logs)}
                      hobbyColors={hobbyColors}
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
  subheading: {
    marginTop: Spacing.half,
    marginBottom: Spacing.three,
  },
  headerSection: {
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    gap: Spacing.two,
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
  cardTitle: {
    marginBottom: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  hobbyChip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    backgroundColor: "#3c87f71a",
    alignSelf: "flex-start",
  },
});
