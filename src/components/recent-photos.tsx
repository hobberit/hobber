import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { EnrichedProgressLog } from "@/services/profileStats";

interface RecentPhotosProps {
  logs: EnrichedProgressLog[];
  /** Caps the grid to the N most recent photos. */
  limit?: number;
}

/** A grid of the most recent activity photos, newest first. Renders nothing if no logs have a photo. */
export function RecentPhotos({ logs, limit = 6 }: RecentPhotosProps) {
  const router = useRouter();
  const withPhotos = logs
    .filter((log): log is EnrichedProgressLog & { photo_url: string } => !!log.photo_url)
    .sort((a, b) => b.log_date.localeCompare(a.log_date))
    .slice(0, limit);

  if (withPhotos.length === 0) return null;

  return (
    <ThemedView style={styles.grid}>
      {withPhotos.map((log) => (
        <Pressable
          key={log.id}
          onPress={() =>
            router.push({
              pathname: "/tracker/[userHobbyId]/activity/[logId]",
              params: { userHobbyId: log.user_hobby_id, logId: log.id },
            })
          }
          style={styles.thumbnailWrapper}>
          <Image source={{ uri: log.photo_url }} style={styles.thumbnail} />
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  thumbnailWrapper: {
    width: "31%",
    aspectRatio: 1,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
