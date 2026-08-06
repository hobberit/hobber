import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

const AVATAR_SIZE = 72;
const BIO_MAX_LENGTH = 240;

interface ProfileHeaderStats {
  activities: number;
  weekStreak: number;
}

interface ProfileHeaderProps {
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  stats: ProfileHeaderStats;
  isUploadingAvatar: boolean;
  onPickAvatar: () => void;
  onSaveDisplayName: (name: string) => Promise<void>;
  onSaveBio: (bio: string) => Promise<void>;
}

export function ProfileHeader({
  displayName,
  email,
  avatarUrl,
  bio,
  stats,
  isUploadingAvatar,
  onPickAvatar,
  onSaveDisplayName,
  onSaveBio,
}: ProfileHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName ?? "");
  const [isSavingName, setIsSavingName] = useState(false);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState(bio ?? "");
  const [isSavingBio, setIsSavingBio] = useState(false);

  function startEditingName() {
    setDraftName(displayName ?? "");
    setIsEditingName(true);
  }

  async function handleSaveName() {
    setIsSavingName(true);
    try {
      await onSaveDisplayName(draftName.trim());
      setIsEditingName(false);
    } finally {
      setIsSavingName(false);
    }
  }

  function startEditingBio() {
    setDraftBio(bio ?? "");
    setIsEditingBio(true);
  }

  async function handleSaveBio() {
    setIsSavingBio(true);
    try {
      await onSaveBio(draftBio.trim());
      setIsEditingBio(false);
    } catch {
      // Non-critical here — the parent screen surfaces the error message; this just
      // keeps the edit form open so the user can retry instead of losing their draft.
    } finally {
      setIsSavingBio(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.topRow}>
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
              <Pressable onPress={handleSaveName} disabled={isSavingName} hitSlop={8}>
                <ThemedText type="linkPrimary">{isSavingName ? "..." : "Save"}</ThemedText>
              </Pressable>
              <Pressable onPress={() => setIsEditingName(false)} hitSlop={8}>
                <ThemedText themeColor="textSecondary" type="small">
                  Cancel
                </ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            <Pressable onPress={startEditingName}>
              <ThemedText type="subtitle">
                {displayName || "Add your name"}
              </ThemedText>
            </Pressable>
          )}

          <View style={styles.statsRow}>
            <StatColumn value={stats.activities} label="Activities" />
            <StatColumn value={stats.weekStreak} label="Streak" />
          </View>
        </ThemedView>
      </ThemedView>

      {isEditingBio ? (
        <ThemedView style={styles.bioEditBlock}>
          <ThemedTextInput
            value={draftBio}
            onChangeText={setDraftBio}
            placeholder="Tell people a bit about yourself"
            multiline
            numberOfLines={3}
            maxLength={BIO_MAX_LENGTH}
            style={styles.bioInput}
            autoFocus
          />
          <ThemedView style={styles.bioEditActionsRow}>
            <Pressable onPress={handleSaveBio} disabled={isSavingBio} hitSlop={8}>
              <ThemedText type="linkPrimary">{isSavingBio ? "..." : "Save"}</ThemedText>
            </Pressable>
            <Pressable onPress={() => setIsEditingBio(false)} hitSlop={8}>
              <ThemedText themeColor="textSecondary" type="small">
                Cancel
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      ) : (
        <Pressable onPress={startEditingBio}>
          {bio ? (
            <ThemedText type="small" style={styles.bioText}>
              {bio}
            </ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary" type="small">
              Add a bio
            </ThemedText>
          )}
        </Pressable>
      )}
    </ThemedView>
  );
}

function StatColumn({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statColumn}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  topRow: {
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
  statsRow: {
    flexDirection: "row",
    gap: Spacing.four,
    marginTop: Spacing.one,
  },
  statColumn: {
    alignItems: "flex-start",
    gap: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3c87f7",
  },
  bioText: {
    lineHeight: 20,
  },
  bioEditBlock: {
    gap: Spacing.two,
  },
  bioInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  bioEditActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
});
