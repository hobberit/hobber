import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { WeekBucket } from "@/components/duration-bar-chart";
import { formatDuration } from "@/components/duration-bar-chart";

const CHART_HEIGHT = 90;
const MIN_BAR_HEIGHT = 3;

function formatWeekLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function bucketMinutes(bucket: WeekBucket, hobbyId: string | null): number {
  if (hobbyId === null) return bucket.segments.reduce((sum, s) => sum + s.minutes, 0);
  return bucket.segments.find((s) => s.hobbyId === hobbyId)?.minutes ?? 0;
}

interface HobbyActivityChartProps {
  buckets: WeekBucket[];
  /** Hobbies to offer as filter pills, most active first. */
  hobbyIds: string[];
  hobbyNames: Record<string, string>;
}

/** "Total / <hobby> / <hobby>..." filter pills above a bar chart — tapping a pill
 * re-filters the chart to that hobby's minutes per week instead of the combined total. */
export function HobbyActivityChart({ buckets, hobbyIds, hobbyNames }: HobbyActivityChartProps) {
  const [selectedHobbyId, setSelectedHobbyId] = useState<string | null>(null);

  const values = buckets.map((b) => bucketMinutes(b, selectedHobbyId));
  // Scale is always set from the Total column, not the filtered selection, so every
  // hobby's bars share the same baseline — a quiet hobby reads as short bars instead
  // of being re-stretched to fill the chart like it was just as active as everything else.
  const totalValues = buckets.map((b) => bucketMinutes(b, null));
  const max = Math.max(1, ...totalValues);
  const thisWeekMinutes = values.length > 0 ? values[values.length - 1] : 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.totalLabel}>
        {formatDuration(thisWeekMinutes)}{" "}
        <ThemedText themeColor="textSecondary" type="small">
          this week
        </ThemedText>
      </ThemedText>

      <View style={styles.pillRow}>
        <Pressable onPress={() => setSelectedHobbyId(null)}>
          <ThemedView
            type={selectedHobbyId === null ? undefined : "backgroundSelected"}
            style={[styles.pill, selectedHobbyId === null && styles.pillSelected]}>
            <ThemedText
              type="small"
              style={selectedHobbyId === null ? styles.pillLabelSelected : styles.pillLabel}>
              Total
            </ThemedText>
          </ThemedView>
        </Pressable>
        {hobbyIds.map((hobbyId) => {
          const selected = selectedHobbyId === hobbyId;
          return (
            <Pressable key={hobbyId} onPress={() => setSelectedHobbyId(hobbyId)}>
              <ThemedView
                type={selected ? undefined : "backgroundSelected"}
                style={[styles.pill, selected && styles.pillSelected]}>
                <ThemedText type="small" style={selected ? styles.pillLabelSelected : styles.pillLabel}>
                  {hobbyNames[hobbyId] ?? "Unknown"}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chartRow}>
        {buckets.map((bucket, i) => {
          const value = values[i];
          const isLast = i === buckets.length - 1;
          // Count "every other" backward from the most recent week, so the current
          // week's label is never one of an accidental adjacent pair — it's always
          // the anchor the pattern counts from, not just a forced exception to it.
          const showLabel = (buckets.length - 1 - i) % 2 === 0;
          const barHeight = Math.max(MIN_BAR_HEIGHT, (value / max) * CHART_HEIGHT);
          return (
            <View key={bucket.weekStart} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.bar, { height: barHeight }, isLast && styles.barCurrent]}
                />
              </View>
              <ThemedText
                themeColor="textSecondary"
                type="small"
                numberOfLines={1}
                style={[
                  styles.barLabel,
                  !showLabel && styles.hiddenLabel,
                  isLast && styles.barLabelCurrent,
                ]}>
                {formatWeekLabel(bucket.weekStart)}
              </ThemedText>
            </View>
          );
        })}
      </View>
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
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  pillSelected: {
    backgroundColor: "#000000",
  },
  pillLabel: {
    fontWeight: "600",
  },
  pillLabelSelected: {
    fontWeight: "600",
    color: "#ffffff",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: CHART_HEIGHT + 24,
    gap: Spacing.half,
    marginTop: Spacing.one,
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
  bar: {
    width: "60%",
    borderRadius: 4,
    backgroundColor: "#ECECEF",
  },
  barCurrent: {
    backgroundColor: "#000000",
  },
  barLabel: {
    marginTop: Spacing.half,
    fontSize: 10,
    width: 42,
    textAlign: "center",
    flexShrink: 0,
  },
  barLabelCurrent: {
    fontWeight: "700",
    opacity: 1,
  },
  hiddenLabel: {
    opacity: 0,
  },
});
