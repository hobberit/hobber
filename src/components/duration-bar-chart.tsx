import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

export interface HobbySegment {
  hobbyId: string;
  minutes: number;
}

export interface WeekBucket {
  /** ISO date (week start), used for the axis label. */
  weekStart: string;
  segments: HobbySegment[];
}

const CHART_HEIGHT = 140;
const MIN_BAR_HEIGHT = 3;

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function formatWeekLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function bucketTotal(bucket: WeekBucket): number {
  return bucket.segments.reduce((sum, s) => sum + s.minutes, 0);
}

interface DurationBarChartProps {
  buckets: WeekBucket[];
  hobbyNames: Record<string, string>;
  hobbyColors: Record<string, string>;
}

export function DurationBarChart({ buckets, hobbyNames, hobbyColors }: DurationBarChartProps) {
  const max = Math.max(1, ...buckets.map(bucketTotal));
  const thisWeekMinutes = buckets.length > 0 ? bucketTotal(buckets[buckets.length - 1]) : 0;

  const hobbyIdsPresent = [
    ...new Set(buckets.flatMap((b) => b.segments.map((s) => s.hobbyId))),
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.totalLabel}>
        {formatDuration(thisWeekMinutes)}{" "}
        <ThemedText themeColor="textSecondary" type="small">
          this week
        </ThemedText>
      </ThemedText>

      <View style={styles.chartRow}>
        {buckets.map((bucket, i) => {
          const total = bucketTotal(bucket);
          const barHeight = Math.max(MIN_BAR_HEIGHT, (total / max) * CHART_HEIGHT);
          return (
            <View key={bucket.weekStart} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.barStack, { height: barHeight }]}>
                  {bucket.segments.map((segment) => (
                    <View
                      key={segment.hobbyId}
                      style={{
                        height: total > 0 ? (segment.minutes / total) * barHeight : 0,
                        backgroundColor: hobbyColors[segment.hobbyId] ?? "#3c87f7",
                      }}
                    />
                  ))}
                </View>
              </View>
              <ThemedText
                themeColor="textSecondary"
                type="small"
                style={[styles.barLabel, i % 2 !== 0 && styles.hiddenLabel]}>
                {formatWeekLabel(bucket.weekStart)}
              </ThemedText>
            </View>
          );
        })}
      </View>

      {hobbyIdsPresent.length > 0 && (
        <View style={styles.legend}>
          {hobbyIdsPresent.map((hobbyId) => (
            <View key={hobbyId} style={styles.legendItem}>
              <View
                style={[styles.legendSwatch, { backgroundColor: hobbyColors[hobbyId] ?? "#3c87f7" }]}
              />
              <ThemedText type="small">{hobbyNames[hobbyId] ?? "Unknown"}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  totalLabel: {
    fontSize: 24,
    lineHeight: 30,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: CHART_HEIGHT + 24,
    gap: Spacing.half,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    height: CHART_HEIGHT,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barStack: {
    width: "60%",
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "column-reverse",
  },
  barLabel: {
    marginTop: Spacing.half,
    fontSize: 10,
  },
  hiddenLabel: {
    opacity: 0,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.half,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
