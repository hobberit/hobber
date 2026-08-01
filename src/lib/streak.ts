import { getWeekStart, toLocalISODate } from "@/lib/date";

/** Which days of the current Sun-Sat week have a logged activity, and which index is today. */
export function computeWeekActivity(
  logDates: Set<string>,
  today: Date = new Date()
): { activeDays: boolean[]; todayIndex: number } {
  const weekStart = getWeekStart(today);
  const activeDays: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    activeDays.push(logDates.has(toLocalISODate(day)));
  }
  const todayIndex = Math.floor(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      weekStart.getTime()) /
      86400000
  );
  return { activeDays, todayIndex };
}

function weekHasLog(logDates: Set<string>, weekStart: Date): boolean {
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    if (logDates.has(toLocalISODate(day))) return true;
  }
  return false;
}

/** Consecutive Sun-Sat weeks with at least one logged activity, counting back from this week.
 * This week doesn't need a log yet for the streak to still be "alive" — only a fully-elapsed
 * week with zero activity breaks it, so it doesn't zero out mid-week before you've had a chance. */
export function computeWeekStreak(logDates: Set<string>, today: Date = new Date()): number {
  let cursor = getWeekStart(today);
  if (!weekHasLog(logDates, cursor)) {
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 7);
  }

  let streak = 0;
  while (weekHasLog(logDates, cursor)) {
    streak++;
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}
