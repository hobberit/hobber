import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/hooks/use-theme";
import { toLocalISODate } from "@/lib/date";
import { addProgressLog, listActiveHobbies, uploadActivityPhoto, type ActiveHobby } from "@/services";

const MOOD_OPTIONS = [1, 2, 3, 4, 5];

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

export default function LogActivityScreen() {
  const { userHobbyId, hobbyName } = useLocalSearchParams<{
    userHobbyId: string;
    hobbyName?: string;
  }>();
  const router = useRouter();
  const { session } = useAuth();
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [logDate, setLogDate] = useState(() => toLocalISODate(new Date()));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeHobbies, setActiveHobbies] = useState<ActiveHobby[]>([]);
  const [selectedUserHobbyId, setSelectedUserHobbyId] = useState(userHobbyId);
  const [selectedHobbyName, setSelectedHobbyName] = useState(hobbyName ?? "");
  const [isHobbyPickerOpen, setIsHobbyPickerOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    listActiveHobbies(session.user.id)
      .then((hobbies) => {
        setActiveHobbies(hobbies);
        if (!selectedHobbyName) {
          const current = hobbies.find((h) => h.userHobby.id === selectedUserHobbyId);
          if (current) setSelectedHobbyName(current.hobby.name);
        }
      })
      .catch(() => {
        // Non-critical — the hobby picker just won't have other options to switch to.
      });
  }, [session?.user]);

  function selectHobby(hobby: ActiveHobby) {
    setSelectedUserHobbyId(hobby.userHobby.id);
    setSelectedHobbyName(hobby.hobby.name);
    setIsHobbyPickerOpen(false);
  }

  async function pickSessionPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError("Photo library permission is required to attach a photo.");
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
    setPhotoUri(asset.uri);
    setPhotoMimeType(asset.mimeType ?? "image/jpeg");
  }

  async function handleAddSession() {
    if (title.trim() === "") {
      setFormError("Give this session a title.");
      return;
    }
    if (!isValidDateString(logDate)) {
      setFormError("Enter a valid date (YYYY-MM-DD).");
      return;
    }
    const minutes = Number(duration);
    if (!minutes || minutes <= 0) {
      setFormError("Enter how many minutes you spent.");
      return;
    }
    if (!session?.user) {
      setFormError("Something went wrong.");
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      let photoUrl: string | undefined;
      if (photoUri && photoMimeType) {
        photoUrl = await uploadActivityPhoto(session.user.id, photoUri, photoMimeType);
      }
      await addProgressLog(selectedUserHobbyId, {
        title: title.trim(),
        log_date: logDate,
        duration_minutes: minutes,
        notes: notes || undefined,
        mood_rating: mood ?? undefined,
        photo_url: photoUrl,
      });
      router.back();
    } catch (e) {
      console.error("Failed to log activity:", e);
      setFormError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Log An Activity</ThemedText>

      <ThemedView style={styles.form}>
        <ThemedText themeColor="textSecondary" type="small" style={styles.hobbyLabel}>
          Hobby
        </ThemedText>
        <Pressable onPress={() => setIsHobbyPickerOpen(true)}>
          <ThemedView type="backgroundElement" style={[styles.hobbyField, { borderColor: theme.textSecondary }]}>
            <ThemedText style={styles.hobbyFieldLabel}>
              {selectedHobbyName || "Select a hobby"}
            </ThemedText>
            <SymbolView
              name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
              size={16}
              tintColor={theme.textSecondary}
            />
          </ThemedView>
        </Pressable>
        <ThemedTextInput
          placeholder="Title (e.g. Morning practice)"
          value={title}
          onChangeText={setTitle}
          style={styles.notesInput}
        />
        <ThemedTextInput
          placeholder="Date (YYYY-MM-DD)"
          value={logDate}
          onChangeText={setLogDate}
          style={styles.notesInput}
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
        {photoUri ? (
          <ThemedView style={styles.photoPreviewRow}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <Pressable
              onPress={() => {
                setPhotoUri(null);
                setPhotoMimeType(null);
              }}>
              <ThemedText type="small" style={styles.deleteLabel}>
                Remove photo
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <Pressable onPress={pickSessionPhoto} style={styles.addPhotoButton}>
            <SymbolView
              name={{ ios: "camera", android: "photo_camera", web: "photo_camera" }}
              size={16}
              tintColor={theme.textSecondary}
            />
            <ThemedText themeColor="textSecondary" type="small">
              Add a photo (optional)
            </ThemedText>
          </Pressable>
        )}
        {formError && <ThemedText style={styles.error}>{formError}</ThemedText>}
        <Pressable style={styles.primaryButton} disabled={isSubmitting} onPress={handleAddSession}>
          <ThemedText style={styles.primaryButtonLabel}>
            {isSubmitting ? "Saving..." : "Log Activity"}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <Modal
        visible={isHobbyPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHobbyPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setIsHobbyPickerOpen(false)}>
          <ThemedView type="background" style={styles.modalCard}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Log to which hobby?
            </ThemedText>
            <ThemedView style={styles.hobbyList}>
              {activeHobbies.map((activeHobby) => (
                <Pressable key={activeHobby.userHobby.id} onPress={() => selectHobby(activeHobby)}>
                  <ThemedView
                    type={
                      activeHobby.userHobby.id === selectedUserHobbyId
                        ? "backgroundSelected"
                        : "backgroundElement"
                    }
                    style={styles.hobbyOption}>
                    <ThemedText>{activeHobby.hobby.name}</ThemedText>
                  </ThemedView>
                </Pressable>
              ))}
            </ThemedView>
            <Pressable onPress={() => setIsHobbyPickerOpen(false)} style={styles.modalCancel}>
              <ThemedText themeColor="textSecondary" type="small">
                Cancel
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  form: {
    gap: 0,
    marginTop: Spacing.two,
  },
  error: {
    color: "#e0463f",
    marginTop: Spacing.two,
  },
  hobbyLabel: {
    marginBottom: Spacing.one,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  hobbyField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
    borderWidth: 1,
  },
  hobbyFieldLabel: {
    fontWeight: "600",
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
  deleteLabel: {
    color: "#e0463f",
    marginTop: Spacing.two,
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
    marginBottom: Spacing.three,
  },
  hobbyList: {
    gap: Spacing.two,
  },
  hobbyOption: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
  },
  modalCancel: {
    alignItems: "center",
    marginTop: Spacing.three,
  },
});
