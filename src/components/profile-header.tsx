import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

const AVATAR_SIZE = 72;

interface ProfileHeaderProps {
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  isUploadingAvatar: boolean;
  onPickAvatar: () => void;
  onSaveDisplayName: (name: string) => Promise<void>;
}

export function ProfileHeader({
  displayName,
  email,
  avatarUrl,
  isUploadingAvatar,
  onPickAvatar,
  onSaveDisplayName,
}: ProfileHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName ?? "");
  const [isSaving, setIsSaving] = useState(false);

  function startEditing() {
    setDraftName(displayName ?? "");
    setIsEditingName(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSaveDisplayName(draftName.trim());
      setIsEditingName(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={onPickAvatar} style={styles.avatarWrapper}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <ThemedView type="backgroundElement" style={styles.avatarPlaceholder}>
            <ThemedText type="subtitle">
              {(displayName || email || "?").charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
        )}
        {isUploadingAvatar && (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator color="#ffffff" />
          </View>
        )}
        <View style={styles.editBadge}>
          <ThemedText type="small" style={styles.editBadgeText}>
            edit
          </ThemedText>
        </View>
      </Pressable>

      <ThemedView style={styles.info}>
        {isEditingName ? (
          <ThemedView style={styles.editRow}>
            <ThemedTextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Your name"
              style={styles.nameInput}
              autoFocus
            />
            <Pressable onPress={handleSave} disabled={isSaving} hitSlop={8}>
              <ThemedText type="linkPrimary">{isSaving ? "..." : "Save"}</ThemedText>
            </Pressable>
            <Pressable onPress={() => setIsEditingName(false)} hitSlop={8}>
              <ThemedText themeColor="textSecondary" type="small">
                Cancel
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <Pressable onPress={startEditing}>
            <ThemedText type="subtitle">
              {displayName || "Add your name"}
            </ThemedText>
          </Pressable>
        )}
        <ThemedText themeColor="textSecondary" type="small">
          {email}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    alignSelf: "center",
    backgroundColor: "#3c87f7",
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  editBadgeText: {
    color: "#ffffff",
    fontSize: 10,
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  nameInput: {
    flex: 1,
  },
});
