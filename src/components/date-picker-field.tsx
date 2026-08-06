import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { toLocalISODate } from "@/lib/date";

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

/** Parses a YYYY-MM-DD string as a local date (avoids the UTC-parsing pitfall of `new Date(iso)`). */
function parseLocalISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

interface DatePickerFieldProps {
  value: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
}

/** A tappable field showing the selected date that opens a dropdown month calendar to pick a new one. */
export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewedMonth, setViewedMonth] = useState(() => {
    const selected = parseLocalISODate(value);
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });

  const selectedDate = parseLocalISODate(value);
  const monthLabel = viewedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const displayLabel = selectedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function open() {
    setViewedMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setIsOpen(true);
  }

  function selectDay(date: Date) {
    onChange(toLocalISODate(date));
    setIsOpen(false);
  }

  function goToPrevMonth() {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function goToNextMonth() {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  const cells = getMonthGrid(viewedMonth);

  return (
    <>
      <Pressable onPress={open} style={styles.field} accessibilityLabel="Choose a date">
        <SymbolView
          name={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          size={16}
          tintColor="#8A8D93"
        />
        <Text style={styles.fieldText}>{displayLabel}</Text>
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Pressable onPress={goToPrevMonth} hitSlop={8}>
                <Text style={styles.navArrow}>‹</Text>
              </Pressable>
              <Text style={styles.monthLabel}>{monthLabel}</Text>
              <Pressable onPress={goToNextMonth} hitSlop={8}>
                <Text style={styles.navArrow}>›</Text>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, i) => (
                <Text key={i} style={[styles.cell, styles.weekdayLabel]}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map(({ date, inCurrentMonth }) => {
                const iso = toLocalISODate(date);
                const isSelected = iso === value;
                return (
                  <Pressable key={iso} style={styles.cell} onPress={() => selectDay(date)}>
                    <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                      <Text
                        style={[
                          styles.dayText,
                          !inCurrentMonth && styles.fadedDayText,
                          isSelected && styles.selectedDayText,
                        ]}>
                        {date.getDate()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={() => setIsOpen(false)} style={styles.cancel}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E8",
  },
  fieldText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navArrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    paddingHorizontal: 8,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
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
    paddingVertical: 4,
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A8D93",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: "#3c87f7",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  fadedDayText: {
    opacity: 0.35,
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  cancel: {
    alignItems: "center",
    marginTop: 14,
  },
  cancelLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
});
