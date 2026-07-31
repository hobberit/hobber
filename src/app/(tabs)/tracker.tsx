import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/external-link";
import { HobbyCardImage } from "@/components/hobby-card-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractYouTubeVideoId } from "@/lib/youtube";
import {
  finishHobby,
  listActiveHobbies,
  listFinishedHobbies,
  listProgressionFeed,
  recordHobbyFeedback,
  resumeHobby,
  type ActiveHobby,
  type ProgressionFeedItem,
} from "@/services";

type ScreenState =
  | { kind: "loading" }
  | {
      kind: "loaded";
      activeHobbies: ActiveHobby[];
      finishedHobbies: ActiveHobby[];
      progressionFeed: ProgressionFeedItem[];
    }
  | { kind: "error"; message: string };

interface FeedbackPrompt {
  userHobbyId: string;
  hobbyName: string;
}

export default function TrackerScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [confirmingFinishId, setConfirmingFinishId] = useState<string | null>(null);
  const [feedbackPrompt, setFeedbackPrompt] = useState<FeedbackPrompt | null>(null);
  const [isActing, setIsActing] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const userId = session.user.id;

    try {
      const [activeHobbies, finishedHobbies] = await Promise.all([
        listActiveHobbies(userId),
        listFinishedHobbies(userId),
      ]);
      const progressionFeed = await listProgressionFeed(
        activeHobbies.map(({ hobby }) => hobby.id)
      );
      setState({ kind: "loaded", activeHobbies, finishedHobbies, progressionFeed });
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

  async function handleFinish(userHobbyId: string, hobbyName: string) {
    setIsActing(true);
    try {
      await finishHobby(userHobbyId);
      setConfirmingFinishId(null);
      await load();
      setFeedbackPrompt({ userHobbyId, hobbyName });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setIsActing(false);
    }
  }

  async function handleResume(userHobbyId: string) {
    setIsActing(true);
    try {
      await resumeHobby(userHobbyId);
      await load();
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    } finally {
      setIsActing(false);
    }
  }

  async function handleFeedback(enjoyed: boolean) {
    if (!feedbackPrompt) return;
    const { userHobbyId } = feedbackPrompt;
    setFeedbackPrompt(null);
    try {
      await recordHobbyFeedback(userHobbyId, enjoyed);
    } catch {
      // Non-critical — the hobby is already finished either way, just skip the bias input.
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
          <ThemedText type="title">Tracker</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subheading}>
            Hobbies you're working on, and ones you've finished but could pick back up.
          </ThemedText>

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary">Loading...</ThemedText>
          )}

          {state.kind === "error" && (
            <ThemedText style={styles.error}>{state.message}</ThemedText>
          )}

          {state.kind === "loaded" && (
            <ThemedView>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Current Hobbies
              </ThemedText>
              {state.activeHobbies.length === 0 ? (
                <ThemedText themeColor="textSecondary">
                  Nothing active yet — accept a suggestion from the Generate tab
                  to start tracking it here.
                </ThemedText>
              ) : (
                <ThemedView style={styles.list}>
                  {state.activeHobbies.map(({ userHobby, hobby }) => (
                    <ThemedView key={userHobby.id} type="backgroundElement" style={styles.imageCard}>
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/tracker/[userHobbyId]",
                            params: { userHobbyId: userHobby.id },
                          })
                        }>
                        <HobbyCardImage hobby={hobby} />
                      </Pressable>
                      <ThemedView style={styles.imageCardBody}>
                        <ThemedText themeColor="textSecondary" type="small">
                          Started{" "}
                          {userHobby.started_at
                            ? new Date(userHobby.started_at).toLocaleDateString()
                            : "recently"}
                        </ThemedText>
                        {confirmingFinishId === userHobby.id ? (
                          <ThemedView style={styles.confirmRow}>
                            <ThemedText type="small">Finish this hobby?</ThemedText>
                            <Pressable
                              disabled={isActing}
                              onPress={() => handleFinish(userHobby.id, hobby.name)}>
                              <ThemedText type="small" style={styles.finishConfirmLabel}>
                                {isActing ? "Finishing..." : "Yes, finish"}
                              </ThemedText>
                            </Pressable>
                            <Pressable onPress={() => setConfirmingFinishId(null)}>
                              <ThemedText type="link">Cancel</ThemedText>
                            </Pressable>
                          </ThemedView>
                        ) : (
                          <Pressable onPress={() => setConfirmingFinishId(userHobby.id)}>
                            <ThemedText type="small" style={styles.finishLabel}>
                              Finish
                            </ThemedText>
                          </Pressable>
                        )}
                      </ThemedView>
                    </ThemedView>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          )}

          {state.kind === "loaded" && state.finishedHobbies.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Finished Hobbies
              </ThemedText>
              <ThemedView style={styles.list}>
                {state.finishedHobbies.map(({ userHobby, hobby }) => (
                  <ThemedView key={userHobby.id} type="backgroundElement" style={styles.imageCard}>
                    <HobbyCardImage hobby={hobby} height={100} />
                    <ThemedView style={styles.imageCardBody}>
                      <ThemedText themeColor="textSecondary" type="small">
                        Finished {new Date(userHobby.updated_at).toLocaleDateString()}
                        {userHobby.feedback_enjoyed === true ? " · enjoyed it" : ""}
                        {userHobby.feedback_enjoyed === false ? " · not for them" : ""}
                      </ThemedText>
                      <Pressable disabled={isActing} onPress={() => handleResume(userHobby.id)}>
                        <ThemedText type="linkPrimary">
                          {isActing ? "Resuming..." : "Resume"}
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          )}

          {state.kind === "loaded" && state.progressionFeed.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Progression Stories
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small" style={styles.subheading}>
                See what real progress looks like for the hobbies you're tracking.
              </ThemedText>
              <ThemedView style={styles.list}>
                {state.progressionFeed.map(({ resource, hobbyId, hobbyName }) => {
                  const videoId = extractYouTubeVideoId(resource.url);
                  return (
                    <ThemedView key={hobbyId} type="backgroundElement" style={styles.card}>
                      <ThemedText themeColor="textSecondary" type="small">
                        {hobbyName}
                      </ThemedText>
                      {videoId && (
                        <ThemedView style={styles.embedWrapper}>
                          <YouTubeEmbed videoId={videoId} />
                        </ThemedView>
                      )}
                      <ExternalLink href={resource.url as `${string}:${string}`}>
                        <ThemedText type="linkPrimary">{resource.title}</ThemedText>
                      </ExternalLink>
                    </ThemedView>
                  );
                })}
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>

      <Modal
        visible={!!feedbackPrompt}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackPrompt(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackPrompt(null)}>
          <ThemedView type="background" style={styles.modalCard}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Did you enjoy {feedbackPrompt?.hobbyName}?
            </ThemedText>
            <ThemedText themeColor="textSecondary" type="small" style={styles.modalSubtitle}>
              This helps us suggest better hobbies for you going forward.
            </ThemedText>
            <ThemedView style={styles.modalActionsRow}>
              <Pressable style={styles.primaryButton} onPress={() => handleFeedback(true)}>
                <ThemedText style={styles.primaryButtonLabel}>Yes, I enjoyed it</ThemedText>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => handleFeedback(false)}>
                <ThemedText>Not really</ThemedText>
              </Pressable>
            </ThemedView>
            <Pressable onPress={() => setFeedbackPrompt(null)} style={styles.modalSkip}>
              <ThemedText themeColor="textSecondary" type="small">
                Skip
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Modal>
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
  error: {
    color: "#e0463f",
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
  },
  imageCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageCardBody: {
    padding: Spacing.three,
    gap: Spacing.half,
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  embedWrapper: {
    width: "100%",
    maxWidth: 480,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  finishLabel: {
    color: "#e0463f",
    marginTop: Spacing.one,
  },
  finishConfirmLabel: {
    color: "#e0463f",
    fontWeight: "700",
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
    maxWidth: 360,
    borderRadius: 16,
    padding: Spacing.four,
  },
  modalTitle: {
    marginBottom: Spacing.one,
  },
  modalSubtitle: {
    marginBottom: Spacing.three,
  },
  modalActionsRow: {
    gap: Spacing.two,
  },
  primaryButton: {
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
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8888",
  },
  modalSkip: {
    alignItems: "center",
    marginTop: Spacing.three,
  },
});
