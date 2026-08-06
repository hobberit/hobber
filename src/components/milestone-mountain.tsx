import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, { Path, Polygon } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { Milestone } from "@/types";

// Design-space dimensions the trail/mountain are laid out in. Actual render
// size is scaled down to fit narrower screens so markers never spill past
// the device edge — see `scale` in the component below.
const WIDTH = 342;
const HEIGHT = 655;
const CIRCLE_SIZE = 28;
const CURRENT_CIRCLE_SIZE = 34;

interface MilestoneMountainProps {
  /** Must be sorted ascending by order_index. */
  milestones: Milestone[];
  achievedMilestoneIds: Set<string>;
  onMarkCurrentAchieved: (milestoneId: string) => void;
}

interface Point {
  x: number;
  y: number;
}

/** Lays milestones out along a switchback trail, base to summit, evenly spaced by order — never by date. */
function computeTrailPositions(count: number): Point[] {
  if (count === 0) return [];
  const topMargin = 66;
  const bottomMargin = 72;
  const usableHeight = HEIGHT - topMargin - bottomMargin;
  const midX = WIDTH / 2;
  const amplitude = 78;

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 1 : i / (count - 1);
    const y = HEIGHT - bottomMargin - t * usableHeight;
    const isSummit = i === count - 1;
    const side = i % 2 === 0 ? -1 : 1;
    const taper = 1 - t * 0.55;
    const x = isSummit ? midX : midX + side * amplitude * taper;
    return { x, y };
  });
}

/** Visualizes hobby milestones as markers along a mountain trail instead of a time-based list —
 * so reaching a milestone late never reads as "behind schedule." */
export function MilestoneMountain({
  milestones,
  achievedMilestoneIds,
  onMarkCurrentAchieved,
}: MilestoneMountainProps) {
  const { width: windowWidth } = useWindowDimensions();
  // Screens narrower than the design width (e.g. iPhone SE, small Android
  // phones) get the whole scene scaled down so nothing renders past the edge.
  const renderWidth = Math.min(WIDTH, windowWidth - Spacing.four * 2);
  const scale = renderWidth / WIDTH;
  const renderHeight = HEIGHT * scale;

  const points = computeTrailPositions(milestones.length);
  const currentIndex = milestones.findIndex((m) => !achievedMilestoneIds.has(m.id));
  const current = currentIndex >= 0 ? milestones[currentIndex] : null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.scene, { width: renderWidth, height: renderHeight }]}>
        <Svg
          width={renderWidth}
          height={renderHeight}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={StyleSheet.absoluteFill}>
          <Polygon points="155,155 342,688 148,688" fill="#4a5f52" />
          <Polygon points="171,58 298,688 44,688" fill="#25342c" />
          <Polygon points="171,58 203,169 139,169" fill="#ffffff" />
          <Polygon points="155,155 268,238 226,238" fill="#eef4f8" />
          {points.length > 1 && (
            <Path
              d={points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="2 10"
              opacity={0.85}
            />
          )}
        </Svg>

        {milestones.map((milestone, i) => {
          const point = points[i];
          const x = point.x * scale;
          const y = point.y * scale;
          const achieved = achievedMilestoneIds.has(milestone.id);
          const isCurrent = current?.id === milestone.id;
          const size = isCurrent ? CURRENT_CIRCLE_SIZE : CIRCLE_SIZE;
          const side = point.x < WIDTH / 2 - 4 ? "left" : point.x > WIDTH / 2 + 4 ? "right" : "summit";

          if (side === "summit") {
            return (
              <View
                key={milestone.id}
                style={[styles.summitMarker, { left: x - 70, top: y - size / 2 }]}>
                <MilestoneCircle achieved={achieved} isCurrent={isCurrent} size={size} />
                <View style={styles.summitLabelPill}>
                  <Text
                    style={[styles.labelText, !achieved && !isCurrent && styles.mutedLabelText]}
                    numberOfLines={2}>
                    {milestone.title}
                  </Text>
                </View>
              </View>
            );
          }

          return (
            <View
              key={milestone.id}
              style={[
                styles.marker,
                side === "left" ? styles.markerFacingRight : styles.markerFacingLeft,
                { left: x - size / 2, top: y - size / 2 },
              ]}>
              <MilestoneCircle achieved={achieved} isCurrent={isCurrent} size={size} />
              <View style={styles.labelPill}>
                {isCurrent && <Text style={styles.upNextText}>UP NEXT</Text>}
                <Text
                  style={[styles.labelText, !achieved && !isCurrent && styles.mutedLabelText]}
                  numberOfLines={2}>
                  {milestone.title}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {current ? (
        <ThemedView type="backgroundElement" style={styles.currentCard}>
          <ThemedText type="small" style={styles.currentEyebrow}>
            Up next
          </ThemedText>
          <ThemedText type="smallBold">{current.title}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            {current.description}
          </ThemedText>
          <Pressable style={styles.achieveButton} onPress={() => onMarkCurrentAchieved(current.id)}>
            <ThemedText style={styles.achieveButtonLabel}>Mark as achieved</ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        milestones.length > 0 && (
          <ThemedView type="backgroundElement" style={styles.currentCard}>
            <ThemedText type="smallBold">Summit reached</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              You&apos;ve completed every milestone for this hobby.
            </ThemedText>
          </ThemedView>
        )
      )}
    </View>
  );
}

function MilestoneCircle({
  achieved,
  isCurrent,
  size,
}: {
  achieved: boolean;
  isCurrent: boolean;
  size: number;
}) {
  const circleSizeStyle = { width: size, height: size, borderRadius: size / 2 };

  if (achieved) {
    return (
      <View style={[styles.circle, styles.circleAchieved, circleSizeStyle]}>
        <SymbolView
          name={{ ios: "checkmark", android: "check", web: "check" }}
          size={14}
          tintColor="#ffffff"
        />
      </View>
    );
  }
  if (isCurrent) {
    return (
      <View style={[styles.circle, styles.circleCurrent, circleSizeStyle]}>
        <View style={styles.currentDot} />
      </View>
    );
  }
  return <View style={[styles.circle, styles.circleUpcoming, circleSizeStyle]} />;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.three,
  },
  scene: {
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eaf3fb",
  },
  marker: {
    position: "absolute",
    alignItems: "center",
    gap: 8,
  },
  markerFacingRight: {
    flexDirection: "row",
  },
  markerFacingLeft: {
    flexDirection: "row-reverse",
  },
  summitMarker: {
    position: "absolute",
    width: 140,
    alignItems: "center",
    gap: 4,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  circleAchieved: {
    backgroundColor: "#3c87f7",
  },
  circleCurrent: {
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#3c87f7",
  },
  circleUpcoming: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 2,
    borderColor: "#b7c4bd",
  },
  currentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3c87f7",
  },
  labelPill: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 118,
  },
  summitLabelPill: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 118,
    alignItems: "center",
  },
  labelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  mutedLabelText: {
    color: "#6b7a72",
    fontWeight: "500",
  },
  upNextText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
    color: "#3c87f7",
  },
  currentCard: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  currentEyebrow: {
    color: "#3c87f7",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: 11,
  },
  achieveButton: {
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.two,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  achieveButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
