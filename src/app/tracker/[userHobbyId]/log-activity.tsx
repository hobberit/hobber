import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DatePickerField } from "@/components/date-picker-field";
import { BottomTabInset, Fonts } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { toLocalISODate } from "@/lib/date";
import { addProgressLog, listActiveHobbies, uploadActivityPhoto, type ActiveHobby } from "@/services";

export default function LogActivityScreen() {
  const { userHobbyId, hobbyName } = useLocalSearchParams<{
    userHobbyId: string;
    hobbyName?: string;
  }>();
  const router = useRouter();
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [logDate, setLogDate] = useState(() => toLocalISODate(new Date()));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: BottomTabInset + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <SymbolView
              name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
              size={20}
              tintColor="#000000"
            />
          </Pressable>
          <Text style={styles.title}>Log An Activity</Text>
        </View>

        <Text style={styles.fieldLabel}>HOBBY</Text>
        <Pressable onPress={() => setIsHobbyPickerOpen(true)} style={styles.hobbyField}>
          <Text style={styles.hobbyFieldLabel}>{selectedHobbyName || "Select a hobby"}</Text>
          <SymbolView
            name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
            size={16}
            tintColor="#8A8D93"
          />
        </Pressable>

        <TextInput
          placeholder="Title (e.g. Morning practice)"
          placeholderTextColor="#A6A9AE"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, styles.spacedField]}
        />

        <View style={[styles.row, styles.spacedField]}>
          <DatePickerField value={logDate} onChange={setLogDate} />
          <View style={[styles.input, styles.rowField]}>
            <SymbolView
              name={{ ios: "clock", android: "schedule", web: "schedule" }}
              size={16}
              tintColor="#8A8D93"
            />
            <TextInput
              placeholder="Minutes spent"
              placeholderTextColor="#A6A9AE"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
              style={styles.rowFieldInput}
            />
          </View>
        </View>

        {photoUri ? (
          <View style={styles.spacedField}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <Pressable
              onPress={() => {
                setPhotoUri(null);
                setPhotoMimeType(null);
              }}>
              <Text style={styles.removePhotoLabel}>Remove photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={pickSessionPhoto} style={[styles.addPhotoRow, styles.spacedField]}>
            <SymbolView
              name={{ ios: "camera", android: "photo_camera", web: "photo_camera" }}
              size={18}
              tintColor="#000000"
            />
            <Text style={styles.addPhotoLabel}>Add a photo (optional)</Text>
          </Pressable>
        )}

        <TextInput
          placeholder="Description (optional)"
          placeholderTextColor="#A6A9AE"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={[styles.input, styles.notesInput, styles.spacedField]}
        />

        {formError && <Text style={styles.error}>{formError}</Text>}

        <Pressable
          style={styles.primaryButton}
          disabled={isSubmitting}
          onPress={handleAddSession}>
          <Text style={styles.primaryButtonLabel}>
            {isSubmitting ? "Saving..." : "Log Activity"}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isHobbyPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHobbyPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setIsHobbyPickerOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log to which hobby?</Text>
            <View style={styles.hobbyList}>
              {activeHobbies.map((activeHobby) => (
                <Pressable key={activeHobby.userHobby.id} onPress={() => selectHobby(activeHobby)}>
                  <View
                    style={[
                      styles.hobbyOption,
                      activeHobby.userHobby.id === selectedUserHobbyId &&
                        styles.hobbyOptionSelected,
                    ]}>
                    <Text style={styles.hobbyOptionLabel}>{activeHobby.hobby.name}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setIsHobbyPickerOpen(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelLabel}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    gap: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.26,
    lineHeight: 32,
  },
  fieldLabel: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: "#8A8D93",
  },
  hobbyField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F0F0F3",
    borderWidth: 1,
    borderColor: "#E5E5E8",
  },
  hobbyFieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
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
  spacedField: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 0,
  },
  rowFieldInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
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
  photoPreview: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  removePhotoLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#e0463f",
  },
  notesInput: {
    height: 76,
    textAlignVertical: "top",
  },
  error: {
    marginTop: 16,
    fontSize: 14,
    color: "#e0463f",
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  hobbyList: {
    gap: 8,
  },
  hobbyOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F0F0F3",
  },
  hobbyOptionSelected: {
    backgroundColor: "#E0E1E6",
  },
  hobbyOptionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  modalCancel: {
    alignItems: "center",
    marginTop: 16,
  },
  modalCancelLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
});
