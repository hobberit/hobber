import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Fonts } from "@/constants/theme";
import { formatRelativeTimestamp } from "@/lib/date";
import type { EnrichedProgressLog } from "@/services/profileStats";

interface Poster {
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
}

interface RecentActivityListProps {
  logs: EnrichedProgressLog[];
  streak: number;
  poster: Poster;
  /** Caps the feed to the N most recent entries. Omit to show everything. */
  limit?: number;
}

/** Recent Activity, styled as condensed versions of the Recorded Activity post —
 * the user's own avatar + name + relative time, title, a hobby/Duration/Streak
 * stat line, and an optional photo — each tappable through to the full detail screen. */
export function RecentActivityList({ logs, streak, poster, limit }: RecentActivityListProps) {
  const sorted = [...logs].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const shown = limit ? sorted.slice(0, limit) : sorted;

  if (shown.length === 0) {
    return <Text style={styles.empty}>No activity logged yet.</Text>;
  }

  return (
    <View style={styles.list}>
      {shown.map((log, index) => (
        <RecentActivityCard
          key={log.id}
          log={log}
          streak={streak}
          poster={poster}
          isLast={index === shown.length - 1}
        />
      ))}
    </View>
  );
}

function RecentActivityCard({
  log,
  streak,
  poster,
  isLast,
}: {
  log: EnrichedProgressLog;
  streak: number;
  poster: Poster;
  isLast: boolean;
}) {
  const router = useRouter();
  const name = poster.displayName || poster.email;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/tracker/[userHobbyId]/activity/[logId]",
          params: { userHobbyId: log.user_hobby_id, logId: log.id },
        })
      }
      style={[styles.card, !isLast && styles.cardDivider]}>
      <View style={styles.header}>
        {poster.avatarUrl ? (
          <Image source={{ uri: poster.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.posterName}>{name}</Text>
          <Text style={styles.postedAt}>{formatRelativeTimestamp(log.created_at)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{log.title || "Logged activity"}</Text>

      <View style={styles.statRow}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Hobby</Text>
          <Text style={styles.statValue}>{log.hobbyName}</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{log.duration_minutes}m</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>🔥 {streak}</Text>
        </View>
      </View>

      {log.photo_url && <Image source={{ uri: log.photo_url }} style={styles.photo} />}
      {log.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {log.notes}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
  empty: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  card: {
    gap: 6,
    paddingVertical: 12,
  },
  cardDivider: {
    borderBottomWidth: 4,
    borderBottomColor: "#00000014",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666666",
  },
  headerText: {
    gap: 1,
  },
  posterName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#000000",
  },
  postedAt: {
    fontSize: 11.5,
    fontWeight: "500",
    color: "#666666",
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 2,
  },
  statColumn: {
    gap: 2,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
  },
  statValue: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
  },
  photo: {
    height: 140,
    borderRadius: 10,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#000000",
  },
});
