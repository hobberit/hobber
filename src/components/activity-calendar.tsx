import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { toLocalISODate } from "@/lib/date";
import type { EnrichedProgressLog } from "@/services/profileStats";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getMonthGrid(viewedMonth: Date): { date: Date; inCurrentMonth: boolean }[] {
  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; inCurrentMonth: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const next = new Date(cells[cells.length - 1].date);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inCurrentMonth: false });
  }
  return cells;
}

interface ActivityCalendarProps {
  logsByDate: Map<string, EnrichedProgressLog[]>;
  hobbyColors: Record<string, string>;
}

export function ActivityCalendar({ logsByDate, hobbyColors }: ActivityCalendarProps) {
  const router = useRouter();
  const [viewedMonth, setViewedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const cells = getMonthGrid(viewedMonth);
  const monthLabel = viewedMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const selectedLogs = selectedDate ? logsByDate.get(selectedDate) ?? [] : [];

  function goToPrevMonth() {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    setSelectedDate(null);
  }
  function goToNextMonth() {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
    setSelectedDate(null);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={goToPrevMonth} hitSlop={8}>
          <ThemedText type="smallBold">‹</ThemedText>
        </Pressable>
        <ThemedText type="smallBold">{monthLabel}</ThemedText>
        <Pressable onPress={goToNextMonth} hitSlop={8}>
          <ThemedText type="smallBold">›</ThemedText>
        </Pressable>
      </ThemedView>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, i) => (
          <ThemedText key={i} themeColor="textSecondary" type="small" style={styles.cell}>
            {label}
          </ThemedText>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map(({ date, inCurrentMonth }) => {
          const iso = toLocalISODate(date);
          const dayLogs = logsByDate.get(iso) ?? [];
          const active = dayLogs.length > 0;
          const selected = selectedDate === iso;
          return (
            <Pressable key={iso} style={styles.cell} onPress={() => setSelectedDate(iso)}>
              <View
                style={[
                  styles.dayCircle,
                  active && styles.dayCircleActive,
                  selected && styles.dayCircleSelected,
                ]}>
                <ThemedText
                  type="small"
                  themeColor={!inCurrentMonth ? "textSecondary" : "text"}
                  style={[
                    active && styles.activeText,
                    !inCurrentMonth && styles.fadedText,
                  ]}>
                  {date.getDate()}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {selectedDate && (
        <ThemedView style={styles.detailPanel}>
          <ThemedText type="smallBold">
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </ThemedText>
          {selectedLogs.length === 0 ? (
            <ThemedText themeColor="textSecondary" type="small">
              No activity logged on this day.
            </ThemedText>
          ) : (
            selectedLogs.map((log, index) => (
              <Pressable
                key={log.id}
                onPress={() =>
                  router.push({
                    pathname: "/tracker/[userHobbyId]/activity/[logId]",
                    params: { userHobbyId: log.user_hobby_id, logId: log.id },
                  })
                }
                style={[styles.detailRow, index < selectedLogs.length - 1 && styles.detailRowDivider]}>
                <View
                  style={[
                    styles.detailSwatch,
                    { backgroundColor: hobbyColors[log.hobbyId] ?? "#3c87f7" },
                  ]}
                />
                <ThemedView style={styles.detailText}>
                  <ThemedText type="small">
                    {log.hobbyName} · {log.duration_minutes} min
                  </ThemedText>
                  <ThemedText themeColor="textSecondary" type="small">
                    {log.title || "Logged activity"}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weekdayRow: {
    flexDirection: "row",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: Spacing.half,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    backgroundColor: "#3c87f7",
  },
  dayCircleSelected: {
    borderWidth: 2,
    borderColor: "#1c4f9c",
  },
  activeText: {
    color: "#ffffff",
  },
  fadedText: {
    opacity: 0.4,
  },
  detailPanel: {
    marginHorizontal: -Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  detailRowDivider: {
    borderBottomWidth: 4,
    borderBottomColor: "#00000014",
  },
  detailSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginTop: 5,
  },
  detailText: {
    flex: 1,
    gap: Spacing.half,
  },
});
