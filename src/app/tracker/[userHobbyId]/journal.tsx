import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RecentActivityList } from "@/components/recent-activity-card";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { computeWeekStreak } from "@/lib/streak";
import { getTrackerDetail, listAllProgressLogsForUser, type TrackerDetail } from "@/services";

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; detail: TrackerDetail; weekStreak: number }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

export default function JournalScreen() {
  const { userHobbyId } = useLocalSearchParams<{ userHobbyId: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      let isMounted = true;
      Promise.all([getTrackerDetail(userHobbyId), listAllProgressLogsForUser(session.user.id)])
        .then(([detail, allLogs]) => {
          if (!isMounted) return;
          if (!detail) {
            setState({ kind: "not_found" });
            return;
          }
          const weekStreak = computeWeekStreak(new Set(allLogs.map((l) => l.log_date)));
          setState({ kind: "loaded", detail, weekStreak });
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
    }, [userHobbyId, session?.user])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <SymbolView
            name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
            size={20}
            tintColor="#000000"
          />
        </Pressable>
      </View>

      {state.kind === "loading" && <Text style={styles.status}>Loading...</Text>}
      {state.kind === "not_found" && <Text style={styles.status}>Not found.</Text>}
      {state.kind === "error" && <Text style={styles.error}>{state.message}</Text>}

      {state.kind === "loaded" && (
        <>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.subtitle}>{state.detail.hobby.name}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <RecentActivityList
              logs={state.detail.logs.map((log) => ({
                ...log,
                hobbyId: state.detail.hobby.id,
                hobbyName: state.detail.hobby.name,
              }))}
              streak={state.weekStreak}
              poster={{
                displayName: profile?.display_name ?? null,
                avatarUrl: profile?.avatar_url ?? null,
                email: session?.user.email ?? "",
              }}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  status: {
    padding: Spacing.four,
    color: "#60646C",
  },
  error: {
    padding: Spacing.four,
    color: "#e0463f",
  },
  titleBlock: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: 2,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "600",
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#60646C",
  },
  scrollContent: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
  },
});
