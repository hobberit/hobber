import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HobbyCardImage } from "@/components/hobby-card-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { getMonthStart, toLocalISODate } from "@/lib/date";
import {
  acceptMonthlyChallenge,
  createMonthlyChallenge,
  generateMonthlyChallengeHobby,
  getHobbyById,
  getMonthlyChallenge,
  regenerateMonthlyChallenge,
  skipMonthlyChallenge,
  type MonthlyChallengePick,
} from "@/services";
import type { Hobby, MonthlyChallenge } from "@/types";

type ScreenState =
  | { kind: "loading" }
  | { kind: "ready"; challenge: MonthlyChallenge; hobby: Hobby; rationale: string | null }
  | { kind: "resolved"; status: "accepted" | "skipped"; hobbyName: string }
  | { kind: "error"; message: string };

function currentMonth(): string {
  return toLocalISODate(getMonthStart(new Date()));
}

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [isActing, setIsActing] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const userId = session.user.id;
    const month = currentMonth();

    try {
      let challenge = await getMonthlyChallenge(userId, month);
      let pick: MonthlyChallengePick | null = null;

      if (!challenge) {
        pick = await generateMonthlyChallengeHobby([]);
        challenge = await createMonthlyChallenge(userId, month, pick.hobby.id);
      }

      if (challenge.status === "accepted" || challenge.status === "skipped") {
        const hobby = await getHobbyById(challenge.hobby_id);
        setState({
          kind: "resolved",
          status: challenge.status,
          hobbyName: hobby?.name ?? "This month's challenge",
        });
        return;
      }

      const hobby = pick?.hobby ?? (await getHobbyById(challenge.hobby_id));
      if (!hobby) {
        setState({ kind: "error", message: "That challenge's hobby couldn't be found." });
        return;
      }

      setState({ kind: "ready", challenge, hobby, rationale: pick?.rationale ?? null });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }, [session?.user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleAccept() {
    if (state.kind !== "ready" || !session?.user) return;
    setIsActing(true);
    try {
      await acceptMonthlyChallenge(state.challenge, session.user.id);
      setState({ kind: "resolved", status: "accepted", hobbyName: state.hobby.name });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setIsActing(false);
    }
  }

  async function handleSkip() {
    if (state.kind !== "ready") return;
    setIsActing(true);
    try {
      await skipMonthlyChallenge(state.challenge.id);
      setState({ kind: "resolved", status: "skipped", hobbyName: state.hobby.name });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setIsActing(false);
    }
  }

  async function handleTryAnother() {
    if (state.kind !== "ready") return;
    setIsActing(true);
    try {
      const pick = await generateMonthlyChallengeHobby([state.hobby.id]);
      const challenge = await regenerateMonthlyChallenge(state.challenge.id, pick.hobby.id);
      setState({ kind: "ready", challenge, hobby: pick.hobby, rationale: pick.rationale });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setIsActing(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}>
          <ThemedText type="title">This Month's Challenge</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subheading}>
            One fresh hobby idea, picked for you every month.
          </ThemedText>

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary">Loading...</ThemedText>
          )}

          {state.kind === "error" && <ThemedText style={styles.error}>{state.message}</ThemedText>}

          {state.kind === "resolved" && (
            <ThemedView type="backgroundElement" style={styles.statusCard}>
              <ThemedText type="smallBold">
                {state.status === "accepted"
                  ? `${state.hobbyName} is this month's challenge.`
                  : `You skipped ${state.hobbyName} this month.`}
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                {state.status === "accepted"
                  ? "Check it out on your Tracker tab."
                  : "A new challenge will be waiting for you next month."}
              </ThemedText>
            </ThemedView>
          )}

          {state.kind === "ready" && (
            <ThemedView style={styles.resultCard}>
              <HobbyCardImage hobby={state.hobby} />
              <ThemedText style={styles.description}>{state.hobby.description}</ThemedText>

              <ThemedView style={styles.metaRow}>
                <MetaPill label={`${capitalize(state.hobby.cost_tier)} cost`} />
                <MetaPill label={`$${state.hobby.cost_min}-$${state.hobby.cost_max}`} />
                <MetaPill label={`~${state.hobby.time_beginner_hrs_week} hrs/wk`} />
                <MetaPill label={capitalize(state.hobby.indoor_outdoor)} />
              </ThemedView>

              {state.rationale && (
                <ThemedView type="backgroundElement" style={styles.rationaleBox}>
                  <ThemedText type="small">{state.rationale}</ThemedText>
                </ThemedView>
              )}

              <Pressable
                onPress={() =>
                  router.push({ pathname: "/hobby/[id]", params: { id: state.hobby.id } })
                }>
                <ThemedText type="linkPrimary">View full starter guide →</ThemedText>
              </Pressable>

              <ThemedView style={styles.actionsRow}>
                <Pressable
                  style={styles.primaryButton}
                  disabled={isActing}
                  onPress={handleAccept}>
                  <ThemedText style={styles.primaryButtonLabel}>Accept</ThemedText>
                </Pressable>
                <Pressable style={styles.secondaryButton} disabled={isActing} onPress={handleSkip}>
                  <ThemedText>Skip</ThemedText>
                </Pressable>
              </ThemedView>
              <Pressable
                style={styles.secondaryButton}
                disabled={isActing}
                onPress={handleTryAnother}>
                <ThemedText>Try Another</ThemedText>
              </Pressable>
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.pill}>
      <ThemedText type="small">{label}</ThemedText>
    </ThemedView>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
  error: {
    color: "#e0463f",
  },
  statusCard: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
  },
  resultCard: {
    gap: Spacing.two,
  },
  description: {
    marginTop: Spacing.one,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  pill: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  rationaleBox: {
    padding: Spacing.three,
    borderRadius: 12,
    marginTop: Spacing.two,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8888",
  },
});
