import { SymbolView } from "expo-symbols";
import Svg, { Circle } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const RING_SIZE = 128;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface StreakTrackerProps {
  activeDays: boolean[]; // 7 entries, Sun-Sat
  todayIndex: number;
}

export function StreakTracker({ activeDays, todayIndex }: StreakTrackerProps) {
  const daysActiveThisWeek = activeDays.filter(Boolean).length;
  const progress = daysActiveThisWeek / 7;

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="#3c87f71a"
            strokeWidth={RING_STROKE}
            fill="none"
          />
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="#3c87f7"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            fill="none"
            rotation={-90}
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <ThemedText type="title">{daysActiveThisWeek}</ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            {daysActiveThisWeek === 1 ? "Day" : "Days"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((label, i) => {
          const active = activeDays[i];
          const isToday = i === todayIndex;
          return (
            <View key={i} style={styles.dayColumn}>
              <View
                style={[
                  styles.dayCircle,
                  active && styles.dayCircleActive,
                  !active && isToday && styles.dayCircleToday,
                ]}>
                {active && (
                  <SymbolView
                    name={{ ios: "checkmark", android: "check", web: "check" }}
                    size={12}
                    tintColor="#ffffff"
                  />
                )}
              </View>
              <ThemedText themeColor="textSecondary" type="small">
                {label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  weekRow: {
    flexDirection: "row",
    gap: 10,
  },
  dayColumn: {
    alignItems: "center",
    gap: 4,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3c87f71a",
  },
  dayCircleActive: {
    backgroundColor: "#3c87f7",
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: "#3c87f7",
  },
});
