import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Fonts } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { formatRelativeTimestamp } from "@/lib/date";
import { computeWeekStreak } from "@/lib/streak";
import {
  getTrackerDetail,
  listAllProgressLogsForUser,
  updateProgressLog,
  uploadActivityPhoto,
} from "@/services";
import type { Hobby, ProgressLog } from "@/types";

const MOOD_OPTIONS = [1, 2, 3, 4, 5];

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; hobby: Hobby; log: ProgressLog; streak: number }
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

export default function RecordedActivityScreen() {
  const { userHobbyId, logId } = useLocalSearchParams<{ userHobbyId: string; logId: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });
  const posterName = profile?.display_name || session?.user.email || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editMood, setEditMood] = useState<number | null>(null);
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | null>(null);
  const [editPhotoUri, setEditPhotoUri] = useState<string | null>(null);
  const [editPhotoMimeType, setEditPhotoMimeType] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function load() {
    if (!session?.user) return;
    getTrackerDetail(userHobbyId)
      .then(async (detail) => {
        const allLogs = await listAllProgressLogsForUser(session.user.id);
        const log = detail?.logs.find((l) => l.id === logId);
        if (!detail || !log) {
          setState({ kind: "not_found" });
          return;
        }
        const streak = computeWeekStreak(new Set(allLogs.map((l) => l.log_date)));
        setState({ kind: "loaded", hobby: detail.hobby, log, streak });
      })
      .catch((e) => {
        setState({ kind: "error", message: e instanceof Error ? e.message : "Something went wrong." });
      });
  }

  useEffect(load, [userHobbyId, logId, session?.user]);

  function startEditing(log: ProgressLog) {
    setEditTitle(log.title ?? "");
    setEditDate(log.log_date);
    setEditDuration(String(log.duration_minutes));
    setEditNotes(log.notes ?? "");
    setEditMood(log.mood_rating ?? null);
    setEditPhotoUrl(log.photo_url);
    setEditPhotoUri(null);
    setEditPhotoMimeType(null);
    setEditError(null);
    setIsEditing(true);
  }

  async function pickEditPhoto() {
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

  async function handleSaveEdit() {
    if (state.kind !== "loaded") return;
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
    setIsSaving(true);
    try {
      let photoUrl = editPhotoUrl;
      if (editPhotoUri && editPhotoMimeType && session?.user) {
        photoUrl = await uploadActivityPhoto(session.user.id, editPhotoUri, editPhotoMimeType);
      }
      await updateProgressLog(state.log.id, {
        title: editTitle.trim(),
        log_date: editDate,
        duration_minutes: minutes,
        notes: editNotes.trim() === "" ? null : editNotes,
        mood_rating: editMood,
        photo_url: photoUrl,
      });
      setIsEditing(false);
      load();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        {state.kind === "not_found" && <Text style={styles.status}>Activity not found.</Text>}
        {state.kind === "error" && <Text style={styles.error}>{state.message}</Text>}

        {state.kind === "loaded" && !isEditing && (
          <>
            <View style={styles.postHeader}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{posterName.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View style={styles.posterTextGroup}>
                <View style={styles.posterNameRow}>
                  <Text style={styles.hobbyName}>{posterName}</Text>
                  {!isEditing && (
                    <Pressable onPress={() => startEditing(state.log)} hitSlop={8}>
                      <Text style={styles.editButtonLabel}>Edit</Text>
                    </Pressable>
                  )}
                </View>
                <Text style={styles.postedAt}>{formatRelativeTimestamp(state.log.created_at)}</Text>
              </View>
            </View>

            <Text style={styles.title}>{state.log.title || "Logged activity"}</Text>

            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Hobby</Text>
                <Text style={styles.statValue}>{state.hobby.name}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{state.log.duration_minutes} min</Text>
              </View>
              {state.log.mood_rating != null && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Mood</Text>
                  <Text style={styles.statValue}>{state.log.mood_rating} / 5</Text>
                </View>
              )}
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Streak</Text>
                <View style={styles.streakValueRow}>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.statValue}>{state.streak}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {state.log.photo_url && (
              <Image source={{ uri: state.log.photo_url }} style={styles.photo} />
            )}

            {state.log.notes && <Text style={styles.notes}>{state.log.notes}</Text>}
          </>
        )}

        {state.kind === "loaded" && isEditing && (
          <View style={styles.editForm}>
            <TextInput
              placeholder="Title (e.g. Morning practice)"
              placeholderTextColor="#A6A9AE"
              value={editTitle}
              onChangeText={setEditTitle}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="Date (YYYY-MM-DD)"
                placeholderTextColor="#A6A9AE"
                value={editDate}
                onChangeText={setEditDate}
                style={[styles.input, styles.rowField]}
              />
              <TextInput
                placeholder="Minutes"
                placeholderTextColor="#A6A9AE"
                keyboardType="numeric"
                value={editDuration}
                onChangeText={setEditDuration}
                style={[styles.input, styles.rowField]}
              />
            </View>
            <TextInput
              placeholder="Notes (optional)"
              placeholderTextColor="#A6A9AE"
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
              style={[styles.input, styles.notesInput]}
            />

            <Text style={styles.fieldLabel}>MOOD</Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setEditMood(editMood === m ? null : m)}
                  style={[styles.moodPill, editMood === m && styles.moodPillSelected]}>
                  <Text style={[styles.moodPillLabel, editMood === m && styles.moodPillLabelSelected]}>
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>

            {editPhotoUri || editPhotoUrl ? (
              <View style={styles.photoPreviewRow}>
                <Image source={{ uri: editPhotoUri ?? editPhotoUrl ?? "" }} style={styles.photo} />
                <Pressable
                  onPress={() => {
                    setEditPhotoUrl(null);
                    setEditPhotoUri(null);
                  }}>
                  <Text style={styles.removePhotoLabel}>Remove photo</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={pickEditPhoto} style={styles.addPhotoRow}>
                <SymbolView
                  name={{ ios: "camera", android: "photo_camera", web: "photo_camera" }}
                  size={18}
                  tintColor="#000000"
                />
                <Text style={styles.addPhotoLabel}>Add a photo</Text>
              </Pressable>
            )}

            {editError && <Text style={styles.error}>{editError}</Text>}

            <View style={styles.editActionsRow}>
              <Pressable style={styles.primaryButton} disabled={isSaving} onPress={handleSaveEdit}>
                <Text style={styles.primaryButtonLabel}>{isSaving ? "Saving..." : "Save"}</Text>
              </Pressable>
              <Pressable onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonLabel}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  editButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3c87f7",
  },
  status: {
    marginTop: 16,
    marginHorizontal: 20,
    fontSize: 15,
    color: "#666666",
  },
  error: {
    marginTop: 16,
    marginHorizontal: 20,
    fontSize: 15,
    color: "#e0463f",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  posterTextGroup: {
    flex: 1,
  },
  posterNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarInitial: {
    fontSize: 17,
    fontWeight: "700",
    color: "#666666",
  },
  hobbyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 18,
  },
  postedAt: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#666666",
    lineHeight: 16,
    marginTop: 1,
  },
  title: {
    fontFamily: Fonts.sans,
    marginTop: 14,
    paddingHorizontal: 20,
    fontSize: 21,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 26,
  },
  statRow: {
    flexDirection: "row",
    gap: 28,
    marginTop: 14,
    paddingHorizontal: 20,
  },
  stat: {
    gap: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  streakValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  streakEmoji: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 14,
    marginHorizontal: 20,
  },
  photo: {
    height: 220,
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  notes: {
    marginTop: 14,
    marginHorizontal: 20,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: "500",
    color: "#000000",
  },
  editForm: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowField: {
    flex: 1,
  },
  input: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E8",
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
  },
  notesInput: {
    height: 76,
    textAlignVertical: "top",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: "#8A8D93",
  },
  moodRow: {
    flexDirection: "row",
    gap: 8,
  },
  moodPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F3",
  },
  moodPillSelected: {
    backgroundColor: "#E0E1E6",
  },
  moodPillLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  moodPillLabelSelected: {
    fontWeight: "700",
  },
  addPhotoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addPhotoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  photoPreviewRow: {
    gap: 8,
  },
  removePhotoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e0463f",
  },
  editActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  cancelButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
});
