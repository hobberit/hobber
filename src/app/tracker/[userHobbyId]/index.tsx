import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { MilestoneMountain } from "@/components/milestone-mountain";
import { RecentActivityList } from "@/components/recent-activity-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { computeWeekStreak } from "@/lib/streak";
import {
  finishHobby,
  getTrackerDetail,
  listAllProgressLogsForUser,
  markMilestoneAchieved,
  recordHobbyFeedback,
  resumeHobby,
  type TrackerDetail,
} from "@/services";

const JOURNAL_PREVIEW_COUNT = 3;

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; detail: TrackerDetail }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

export default function TrackerDetailScreen() {
  const { userHobbyId } = useLocalSearchParams<{ userHobbyId: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [weekStreak, setWeekStreak] = useState(0);
  const [confirmingFinish, setConfirmingFinish] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [feedbackPromptOpen, setFeedbackPromptOpen] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    try {
      const [detail, allLogs] = await Promise.all([
        getTrackerDetail(userHobbyId),
        listAllProgressLogsForUser(session.user.id),
      ]);
      setState(detail ? { kind: "loaded", detail } : { kind: "not_found" });
      setWeekStreak(computeWeekStreak(new Set(allLogs.map((l) => l.log_date))));
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }, [userHobbyId, session?.user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleFinish() {
    setIsActing(true);
    try {
      await finishHobby(userHobbyId);
      setConfirmingFinish(false);
      await load();
      setFeedbackPromptOpen(true);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsActing(false);
    }
  }

  async function handleResume() {
    setIsActing(true);
    try {
      await resumeHobby(userHobbyId);
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsActing(false);
    }
  }

  async function handleFeedback(enjoyed: boolean) {
    setFeedbackPromptOpen(false);
    try {
      await recordHobbyFeedback(userHobbyId, enjoyed);
    } catch {
      // Non-critical — the hobby is already finished either way, just skip the bias input.
    }
  }

  async function handleMarkAchieved(milestoneId: string) {
    try {
      await markMilestoneAchieved(userHobbyId, milestoneId);
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (state.kind === "loading") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Loading...</ThemedText>
      </ThemedView>
    );
  }
  if (state.kind === "not_found") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Not found.</ThemedText>
      </ThemedView>
    );
  }
  if (state.kind === "error") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.error}>{state.message}</ThemedText>
      </ThemedView>
    );
  }

  const { hobby, userHobby, logs, milestones, userMilestones } = state.detail;
  const achievedMilestoneIds = new Set(
    userMilestones.filter((m) => m.achieved_at).map((m) => m.milestone_id)
  );

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>{hobby.name}</ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.startedAt}>
        Started{" "}
        {userHobby.started_at
          ? new Date(userHobby.started_at).toLocaleDateString()
          : "recently"}
      </ThemedText>

      <Pressable
        style={styles.logActivityButton}
        onPress={() =>
          router.push({
            pathname: "/tracker/[userHobbyId]/log-activity",
            params: { userHobbyId, hobbyName: hobby.name },
          })
        }>
        <ThemedText style={styles.primaryButtonLabel}>Log An Activity</ThemedText>
      </Pressable>

      <Pressable
        style={styles.starterGuideButton}
        onPress={() => router.push({ pathname: "/hobby/[id]", params: { id: hobby.id } })}>
        <ThemedText style={styles.starterGuideButtonLabel}>Starter Guide</ThemedText>
      </Pressable>

      {userHobby.status === "completed" ? (
        <Pressable style={styles.resumeButton} disabled={isActing} onPress={handleResume}>
          <ThemedText style={styles.resumeButtonLabel}>
            {isActing ? "Resuming..." : "Resume Hobby"}
          </ThemedText>
        </Pressable>
      ) : confirmingFinish ? (
        <ThemedView style={styles.finishConfirmRow}>
          <ThemedText type="small" style={styles.finishConfirmPrompt}>
            Finish this hobby?
          </ThemedText>
          <Pressable disabled={isActing} onPress={handleFinish}>
            <ThemedText type="small" style={styles.finishConfirmLabel}>
              {isActing ? "Finishing..." : "Yes, finish"}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => setConfirmingFinish(false)}>
            <ThemedText type="link">Cancel</ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        <Pressable style={styles.finishButton} onPress={() => setConfirmingFinish(true)}>
          <ThemedText style={styles.finishButtonLabel}>Finish Hobby</ThemedText>
        </Pressable>
      )}

      {actionError && <ThemedText style={styles.error}>{actionError}</ThemedText>}

      <Section title="Journal">
        {logs.length === 0 ? (
          <ThemedText themeColor="textSecondary" type="small">
            No sessions logged yet.
          </ThemedText>
        ) : (
          <RecentActivityList
            logs={logs.map((log) => ({ ...log, hobbyId: hobby.id, hobbyName: hobby.name }))}
            streak={weekStreak}
            limit={JOURNAL_PREVIEW_COUNT}
            poster={{
              displayName: profile?.display_name ?? null,
              avatarUrl: profile?.avatar_url ?? null,
              email: session?.user.email ?? "",
            }}
          />
        )}
        {logs.length > JOURNAL_PREVIEW_COUNT && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/tracker/[userHobbyId]/journal",
                params: { userHobbyId },
              })
            }>
            <ThemedText type="linkPrimary">See More</ThemedText>
          </Pressable>
        )}
      </Section>

      <Section title="Milestones">
        {milestones.length === 0 ? (
          <ThemedText themeColor="textSecondary" type="small">
            Milestone timeline coming soon for this hobby.
          </ThemedText>
        ) : (
          <MilestoneMountain
            milestones={milestones}
            achievedMilestoneIds={achievedMilestoneIds}
            onMarkCurrentAchieved={handleMarkAchieved}
          />
        )}
      </Section>
    </ScrollView>

    <Modal
      visible={feedbackPromptOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setFeedbackPromptOpen(false)}>
      <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackPromptOpen(false)}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Did you enjoy {hobby.name}?</Text>
          <Text style={styles.modalSubtitle}>
            This helps us suggest better hobbies for you going forward.
          </Text>
          <Pressable style={styles.feedbackYesButton} onPress={() => handleFeedback(true)}>
            <Text style={styles.feedbackYesButtonLabel}>Yes, I enjoyed it</Text>
          </Pressable>
          <Pressable style={styles.feedbackNotReallyButton} onPress={() => handleFeedback(false)}>
            <Text style={styles.feedbackNotReallyButtonLabel}>Not really</Text>
          </Pressable>
          <Pressable onPress={() => setFeedbackPromptOpen(false)} style={styles.modalSkip}>
            <Text style={styles.modalSkipLabel}>Skip</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  error: {
    color: "#e0463f",
  },
  startedAt: {
    marginTop: Spacing.half,
  },
  logActivityButton: {
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.three,
  },
  finishButton: {
    borderWidth: 1.5,
    borderColor: "#e0463f",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.half,
  },
  finishButtonLabel: {
    color: "#e0463f",
    fontWeight: "600",
  },
  finishConfirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.half,
  },
  finishConfirmPrompt: {
    flex: 1,
  },
  finishConfirmLabel: {
    color: "#e0463f",
    fontWeight: "700",
  },
  resumeButton: {
    borderWidth: 1.5,
    borderColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.half,
  },
  resumeButtonLabel: {
    color: "#3c87f7",
    fontWeight: "600",
  },
  starterGuideButton: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.half,
  },
  starterGuideButtonLabel: {
    color: "#000000",
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  modalCard: {
    width: "100%",
    maxWidth: 342,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    color: "#000000",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: "#666666",
    marginBottom: 20,
  },
  feedbackYesButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  feedbackYesButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
    color: "#ffffff",
  },
  feedbackNotReallyButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
  },
  feedbackNotReallyButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    color: "#000000",
  },
  modalSkip: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  modalSkipLabel: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
    color: "#666666",
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: Spacing.one,
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
