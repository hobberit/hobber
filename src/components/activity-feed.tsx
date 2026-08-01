import { Image, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { EnrichedProgressLog } from "@/services/profileStats";

interface ActivityFeedProps {
  logs: EnrichedProgressLog[];
  /** Caps the feed to the N most recent entries. Omit to show everything. */
  limit?: number;
}

/** Every individually logged session across all of a user's hobbies, newest first. */
export function ActivityFeed({ logs, limit }: ActivityFeedProps) {
  const sorted = [...logs].sort((a, b) => b.log_date.localeCompare(a.log_date));
  const shown = limit ? sorted.slice(0, limit) : sorted;

  if (shown.length === 0) {
    return (
      <ThemedText themeColor="textSecondary" type="small">
        No activity logged yet.
      </ThemedText>
    );
  }

  return (
    <ThemedView style={styles.list}>
      {shown.map((log) => (
        <ThemedView key={log.id} style={styles.row}>
          {log.photo_url && <Image source={{ uri: log.photo_url }} style={styles.thumbnail} />}
          <ThemedView style={styles.rowText}>
            <ThemedText type="smallBold">{log.title || log.hobbyName}</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {log.hobbyName} · {log.duration_minutes} min ·{" "}
              {new Date(log.log_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              {log.mood_rating ? ` · mood ${log.mood_rating}/5` : ""}
            </ThemedText>
            {log.notes && <ThemedText type="small">{log.notes}</ThemedText>}
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
