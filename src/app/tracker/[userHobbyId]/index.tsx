import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Fonts, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/hooks/use-theme";
import {
  deleteProgressLog,
  finishHobby,
  getTrackerDetail,
  markMilestoneAchieved,
  recordHobbyFeedback,
  resumeHobby,
  updateProgressLog,
  uploadActivityPhoto,
  type TrackerDetail,
} from "@/services";
import type { ProgressLog } from "@/types";

const MOOD_OPTIONS = [1, 2, 3, 4, 5];

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; detail: TrackerDetail }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

/** Accepts only well-formed, real calendar dates in YYYY-MM-DD (no timezone round-trip). */
function isValidDateString(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export default function TrackerDetailScreen() {
  const { userHobbyId } = useLocalSearchParams<{ userHobbyId: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editMood, setEditMood] = useState<number | null>(null);
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | null>(null);
  const [editPhotoUri, setEditPhotoUri] = useState<string | null>(null);
  const [editPhotoMimeType, setEditPhotoMimeType] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmingFinish, setConfirmingFinish] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [feedbackPromptOpen, setFeedbackPromptOpen] = useState(false);
  const theme = useTheme();

  const load = useCallback(async () => {
    try {
      const detail = await getTrackerDetail(userHobbyId);
      setState(detail ? { kind: "loaded", detail } : { kind: "not_found" });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }, [userHobbyId]);

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
      setEditError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  function startEditingLog(log: ProgressLog) {
    setEditingLogId(log.id);
    setEditTitle(log.title ?? "");
    setEditDate(log.log_date);
    setEditDuration(String(log.duration_minutes));
    setEditNotes(log.notes ?? "");
    setEditMood(log.mood_rating ?? null);
    setEditPhotoUrl(log.photo_url);
    setEditPhotoUri(null);
    setEditPhotoMimeType(null);
    setEditError(null);
    setConfirmingDeleteId(null);
  }

  function cancelEditingLog() {
    setEditingLogId(null);
    setEditError(null);
    setConfirmingDeleteId(null);
  }

  async function pickEditSessionPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setEditError("Photo library permission is required to attach a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setEditPhotoUri(asset.uri);
    setEditPhotoMimeType(asset.mimeType ?? "image/jpeg");
  }

  function removeEditSessionPhoto() {
    setEditPhotoUrl(null);
    setEditPhotoUri(null);
    setEditPhotoMimeType(null);
  }

  async function handleSaveEditedLog() {
    if (!editingLogId) return;
    if (editTitle.trim() === "") {
      setEditError("Give this session a title.");
      return;
    }
    if (!isValidDateString(editDate)) {
      setEditError("Enter a valid date (YYYY-MM-DD).");
      return;
    }
    const minutes = Number(editDuration);
    if (!minutes || minutes <= 0) {
      setEditError("Enter how many minutes you spent.");
      return;
    }
    if (editPhotoUri && !session?.user) {
      setEditError("Something went wrong.");
      return;
    }
    setEditError(null);
    setIsSavingEdit(true);
    try {
      let photoUrl = editPhotoUrl;
      if (editPhotoUri && editPhotoMimeType && session?.user) {
        photoUrl = await uploadActivityPhoto(session.user.id, editPhotoUri, editPhotoMimeType);
      }
      await updateProgressLog(editingLogId, {
        title: editTitle.trim(),
        log_date: editDate,
        duration_minutes: minutes,
        notes: editNotes.trim() === "" ? null : editNotes,
        mood_rating: editMood,
        photo_url: photoUrl,
      });
      cancelEditingLog();
      await load();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDeleteLog(logId: string) {
    setIsDeleting(true);
    try {
      await deleteProgressLog(logId);
      cancelEditingLog();
      await load();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsDeleting(false);
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
      <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">{hobby.name}</ThemedText>
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

      <Pressable
        style={styles.starterGuideButton}
        onPress={() => router.push({ pathname: "/hobby/[id]", params: { id: hobby.id } })}>
        <ThemedText style={styles.starterGuideButtonLabel}>Starter Guide</ThemedText>
      </Pressable>

      {actionError && <ThemedText style={styles.error}>{actionError}</ThemedText>}

      <Section title="Journal">
        {logs.length === 0 ? (
          <ThemedText themeColor="textSecondary" type="small">
            No sessions logged yet.
          </ThemedText>
        ) : (
          <ThemedView style={styles.list}>
            {logs.map((log) =>
              editingLogId === log.id ? (
                <ThemedView key={log.id} type="backgroundElement" style={styles.card}>
                  <ThemedTextInput
                    placeholder="Title (e.g. Morning practice)"
                    value={editTitle}
                    onChangeText={setEditTitle}
                  />
                  <ThemedTextInput
                    placeholder="Date (YYYY-MM-DD)"
                    value={editDate}
                    onChangeText={setEditDate}
                    style={styles.notesInput}
                  />
                  <ThemedTextInput
                    placeholder="Minutes spent"
                    keyboardType="numeric"
                    value={editDuration}
                    onChangeText={setEditDuration}
                    style={styles.notesInput}
                  />
                  <ThemedTextInput
                    placeholder="Notes (optional)"
                    value={editNotes}
                    onChangeText={setEditNotes}
                    style={styles.notesInput}
                  />
                  <ThemedView style={styles.moodRow}>
                    {MOOD_OPTIONS.map((m) => (
                      <Pressable key={m} onPress={() => setEditMood(editMood === m ? null : m)}>
                        <ThemedView
                          type={editMood === m ? "backgroundSelected" : "backgroundElement"}
                          style={styles.moodPill}>
                          <ThemedText type="small">{m}</ThemedText>
                        </ThemedView>
                      </Pressable>
                    ))}
                  </ThemedView>
                  {editPhotoUri || editPhotoUrl ? (
                    <ThemedView style={styles.photoPreviewRow}>
                      <Image source={{ uri: editPhotoUri ?? editPhotoUrl ?? "" }} style={styles.photoPreview} />
                      <Pressable onPress={removeEditSessionPhoto}>
                        <ThemedText type="small" style={styles.deleteLabel}>
                          Remove photo
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  ) : (
                    <Pressable onPress={pickEditSessionPhoto} style={styles.addPhotoButton}>
                      <SymbolView
                        name={{ ios: "camera", android: "photo_camera", web: "photo_camera" }}
                        size={16}
                        tintColor={theme.textSecondary}
                      />
                      <ThemedText themeColor="textSecondary" type="small">
                        Add a photo
                      </ThemedText>
                    </Pressable>
                  )}
                  {editError && <ThemedText style={styles.error}>{editError}</ThemedText>}
                  <ThemedView style={styles.editActionsRow}>
                    <Pressable
                      style={styles.primaryButton}
                      disabled={isSavingEdit}
                      onPress={handleSaveEditedLog}>
                      <ThemedText style={styles.primaryButtonLabel}>
                        {isSavingEdit ? "Saving..." : "Save"}
                      </ThemedText>
                    </Pressable>
                    <Pressable onPress={cancelEditingLog}>
                      <ThemedText type="link">Cancel</ThemedText>
                    </Pressable>
                  </ThemedView>
                  {confirmingDeleteId === log.id ? (
                    <ThemedView style={styles.deleteConfirmRow}>
                      <ThemedText type="small">Delete this entry?</ThemedText>
                      <Pressable disabled={isDeleting} onPress={() => handleDeleteLog(log.id)}>
                        <ThemedText type="small" style={styles.deleteConfirmLabel}>
                          {isDeleting ? "Deleting..." : "Yes, delete"}
                        </ThemedText>
                      </Pressable>
                      <Pressable onPress={() => setConfirmingDeleteId(null)}>
                        <ThemedText type="link">Cancel</ThemedText>
                      </Pressable>
                    </ThemedView>
                  ) : (
                    <Pressable onPress={() => setConfirmingDeleteId(log.id)}>
                      <ThemedText type="small" style={styles.deleteLabel}>
                        Delete activity
                      </ThemedText>
                    </Pressable>
                  )}
                </ThemedView>
              ) : (
                <ThemedView key={log.id} type="backgroundElement" style={styles.card}>
                  <ThemedView style={styles.logHeaderRow}>
                    <Pressable
                      style={styles.logHeaderText}
                      onPress={() =>
                        router.push({
                          pathname: "/tracker/[userHobbyId]/activity/[logId]",
                          params: { userHobbyId, logId: log.id },
                        })
                      }>
                      {log.title && <ThemedText type="smallBold">{log.title}</ThemedText>}
                      <ThemedText themeColor="textSecondary" type="small">
                        {new Date(log.log_date).toLocaleDateString()} · {log.duration_minutes} min
                        {log.mood_rating ? ` · mood ${log.mood_rating}/5` : ""}
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => startEditingLog(log)}
                      hitSlop={8}
                      accessibilityLabel="Edit activity">
                      <SymbolView
                        name={{ ios: "pencil", android: "edit", web: "edit" }}
                        size={16}
                        tintColor={theme.textSecondary}
                      />
                    </Pressable>
                  </ThemedView>
                  {log.photo_url && (
                    <Image source={{ uri: log.photo_url }} style={styles.photoPreview} />
                  )}
                  {log.notes && <ThemedText type="small">{log.notes}</ThemedText>}
                </ThemedView>
              )
            )}
          </ThemedView>
        )}
      </Section>

      <Section title="Milestones">
        {milestones.length === 0 ? (
          <ThemedText themeColor="textSecondary" type="small">
            Milestone timeline coming soon for this hobby.
          </ThemedText>
        ) : (
          <ThemedView style={styles.list}>
            {milestones.map((milestone) => {
              const achieved = achievedMilestoneIds.has(milestone.id);
              return (
                <ThemedView key={milestone.id} type="backgroundElement" style={styles.card}>
                  <ThemedText themeColor="textSecondary" type="small">
                    {milestone.typical_timeframe}
                  </ThemedText>
                  <ThemedView style={styles.milestoneTitleRow}>
                    <Pressable
                      disabled={achieved}
                      onPress={() => handleMarkAchieved(milestone.id)}
                      hitSlop={8}
                      accessibilityLabel={
                        achieved ? "Milestone achieved" : "Mark milestone as achieved"
                      }>
                      <ThemedView style={[styles.checkbox, achieved && styles.checkboxChecked]}>
                        {achieved && (
                          <SymbolView
                            name={{ ios: "checkmark", android: "check", web: "check" }}
                            size={12}
                            tintColor="#ffffff"
                          />
                        )}
                      </ThemedView>
                    </Pressable>
                    <ThemedText type="smallBold" style={styles.milestoneTitle}>
                      {milestone.title}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText type="small">{milestone.description}</ThemedText>
                </ThemedView>
              );
            })}
          </ThemedView>
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
  container: {
    padding: Spacing.four,
    gap: Spacing.four,
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
    marginTop: Spacing.two,
  },
  finishButtonLabel: {
    color: "#e0463f",
    fontWeight: "600",
  },
  finishConfirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
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
    marginTop: Spacing.two,
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
    marginTop: Spacing.two,
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
    marginBottom: Spacing.one,
  },
  notesInput: {
    marginTop: Spacing.two,
  },
  moodRow: {
    flexDirection: "row",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  moodPill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  photoPreviewRow: {
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  photoPreview: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
  },
  milestoneTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  milestoneTitle: {
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2e9e4f",
    borderColor: "#2e9e4f",
  },
  logHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  logHeaderText: {
    flex: 1,
    gap: 2,
  },
  editActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  deleteLabel: {
    color: "#e0463f",
    marginTop: Spacing.two,
  },
  deleteConfirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  deleteConfirmLabel: {
    color: "#e0463f",
    fontWeight: "700",
  },
});
