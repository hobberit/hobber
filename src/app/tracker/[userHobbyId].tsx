import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { toLocalISODate } from "@/lib/date";
import {
  addProgressLog,
  deleteProgressLog,
  getTrackerDetail,
  markMilestoneAchieved,
  updateProgressLog,
  type TrackerDetail,
} from "@/services";
import type { ProgressLog } from "@/types";

const NORTH_STAR_WEEKS_GOAL = 3;
const MOOD_OPTIONS = [1, 2, 3, 4, 5];

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; detail: TrackerDetail }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

/** Distinct ISO-week buckets that have at least one log, for the North Star metric. */
function countDistinctWeeksLogged(logDates: string[]): number {
  const weekKeys = new Set(
    logDates.map((d) => {
      const date = new Date(d);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(
        ((date.getTime() - firstDayOfYear.getTime()) / 86400000 + firstDayOfYear.getDay() + 1) / 7
      );
      return `${date.getFullYear()}-${weekNumber}`;
    })
  );
  return weekKeys.size;
}

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
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const [logDate, setLogDate] = useState(() => toLocalISODate(new Date()));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editMood, setEditMood] = useState<number | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();

  async function load() {
    try {
      const detail = await getTrackerDetail(userHobbyId);
      setState(detail ? { kind: "loaded", detail } : { kind: "not_found" });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }

  useEffect(() => {
    setState({ kind: "loading" });
    load();
  }, [userHobbyId]);

  async function handleLogProgress() {
    if (!isValidDateString(logDate)) {
      setFormError("Enter a valid date (YYYY-MM-DD).");
      return;
    }
    const minutes = Number(duration);
    if (!minutes || minutes <= 0) {
      setFormError("Enter how many minutes you spent.");
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await addProgressLog(userHobbyId, {
        log_date: logDate,
        duration_minutes: minutes,
        notes: notes || undefined,
        mood_rating: mood ?? undefined,
      });
      setLogDate(toLocalISODate(new Date()));
      setDuration("");
      setNotes("");
      setMood(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMarkAchieved(milestoneId: string) {
    try {
      await markMilestoneAchieved(userHobbyId, milestoneId);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  function startEditingLog(log: ProgressLog) {
    setEditingLogId(log.id);
    setEditDate(log.log_date);
    setEditDuration(String(log.duration_minutes));
    setEditNotes(log.notes ?? "");
    setEditMood(log.mood_rating ?? null);
    setEditError(null);
    setConfirmingDeleteId(null);
  }

  function cancelEditingLog() {
    setEditingLogId(null);
    setEditError(null);
    setConfirmingDeleteId(null);
  }

  async function handleSaveEditedLog() {
    if (!editingLogId) return;
    if (!isValidDateString(editDate)) {
      setEditError("Enter a valid date (YYYY-MM-DD).");
      return;
    }
    const minutes = Number(editDuration);
    if (!minutes || minutes <= 0) {
      setEditError("Enter how many minutes you spent.");
      return;
    }
    setEditError(null);
    setIsSavingEdit(true);
    try {
      await updateProgressLog(editingLogId, {
        log_date: editDate,
        duration_minutes: minutes,
        notes: editNotes.trim() === "" ? null : editNotes,
        mood_rating: editMood,
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
  const weeksLogged = countDistinctWeeksLogged(logs.map((l) => l.log_date));
  const achievedMilestoneIds = new Set(
    userMilestones.filter((m) => m.achieved_at).map((m) => m.milestone_id)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">{hobby.name}</ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.startedAt}>
        Started{" "}
        {userHobby.started_at
          ? new Date(userHobby.started_at).toLocaleDateString()
          : "recently"}
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.northStarCard}>
        <ThemedText type="smallBold">
          {Math.min(weeksLogged, NORTH_STAR_WEEKS_GOAL)} of {NORTH_STAR_WEEKS_GOAL} weeks logged
        </ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {weeksLogged >= NORTH_STAR_WEEKS_GOAL
            ? "You've hit a Successful Hobby Start — nice work!"
            : "Log activity across 3 different weeks to count as a Successful Hobby Start."}
        </ThemedText>
      </ThemedView>

      <Section title="Log Progress">
        <ThemedTextInput
          placeholder="Date (YYYY-MM-DD)"
          value={logDate}
          onChangeText={setLogDate}
        />
        <ThemedTextInput
          placeholder="Minutes spent"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          style={styles.notesInput}
        />
        <ThemedTextInput
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          style={styles.notesInput}
        />
        <ThemedView style={styles.moodRow}>
          {MOOD_OPTIONS.map((m) => (
            <Pressable key={m} onPress={() => setMood(mood === m ? null : m)}>
              <ThemedView
                type={mood === m ? "backgroundSelected" : "backgroundElement"}
                style={styles.moodPill}>
                <ThemedText type="small">{m}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>
        {formError && <ThemedText style={styles.error}>{formError}</ThemedText>}
        <Pressable
          style={styles.primaryButton}
          disabled={isSubmitting}
          onPress={handleLogProgress}>
          <ThemedText style={styles.primaryButtonLabel}>
            {isSubmitting ? "Saving..." : "Log Progress"}
          </ThemedText>
        </Pressable>
      </Section>

      <Section title="History">
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
                    placeholder="Date (YYYY-MM-DD)"
                    value={editDate}
                    onChangeText={setEditDate}
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
                    <ThemedText type="smallBold">
                      {new Date(log.log_date).toLocaleDateString()} · {log.duration_minutes} min
                      {log.mood_rating ? ` · mood ${log.mood_rating}/5` : ""}
                    </ThemedText>
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
                  <ThemedText type="smallBold">{milestone.title}</ThemedText>
                  <ThemedText type="small">{milestone.description}</ThemedText>
                  {achieved ? (
                    <ThemedText type="small" style={styles.achievedLabel}>
                      ✓ Achieved
                    </ThemedText>
                  ) : (
                    <Pressable onPress={() => handleMarkAchieved(milestone.id)}>
                      <ThemedText type="linkPrimary">Mark as achieved</ThemedText>
                    </Pressable>
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        )}
      </Section>
    </ScrollView>
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
  northStarCard: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
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
  achievedLabel: {
    color: "#2e9e4f",
  },
  logHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
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
