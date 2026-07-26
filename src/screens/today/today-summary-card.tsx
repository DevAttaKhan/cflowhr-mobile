import { format } from "date-fns";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { TodayAttendance } from "@/types/attendance";
import {
  formatMinutesAsHours,
  formatStatusLabel,
} from "@/utils/format-minutes";

type TodaySummaryCardProps = {
  today: TodayAttendance;
};

const pad2 = (value: number): string => String(value).padStart(2, "0");

const formatElapsed = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

const getElapsedSeconds = (today: TodayAttendance, nowMs: number): number => {
  const checkInAt = today.checkIn?.timestamp;
  if (!checkInAt) {
    return 0;
  }

  const startMs = new Date(checkInAt).getTime();
  const endMs = today.checkOut?.timestamp
    ? new Date(today.checkOut.timestamp).getTime()
    : nowMs;

  let elapsedMs = Math.max(0, endMs - startMs);

  // Exclude completed break duration from the live session clock.
  if (today.breakMinutes > 0) {
    elapsedMs -= today.breakMinutes * 60_000;
  }

  // If currently on break, also exclude time since break started.
  if (today.onBreak && today.breakIn?.timestamp && !today.breakOut) {
    const breakStartMs = new Date(today.breakIn.timestamp).getTime();
    elapsedMs -= Math.max(0, nowMs - breakStartMs);
  }

  return Math.max(0, elapsedMs / 1000);
};

export const TodaySummaryCard = ({ today }: TodaySummaryCardProps) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Keep ticking only while a session is active (checked in, not checked out).
    if (!today.checkIn || today.checkOut) {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [today.checkIn, today.checkOut]);

  const expected = today.shift?.expectedWorkMinutes ?? 480;
  const workMinutes = today.workMinutes ?? 0;
  const progress = Math.min(1, expected > 0 ? workMinutes / expected : 0);
  const checkIn = today.checkIn?.timestamp
    ? format(new Date(today.checkIn.timestamp), "h:mm a")
    : "—";
  const breakLabel =
    today.breakMinutes > 0 ? formatMinutesAsHours(today.breakMinutes) : "—";
  const elapsed = formatElapsed(getElapsedSeconds(today, now));

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              today.onBreak && { backgroundColor: Brand.warning },
            ]}
          />
          <Text style={styles.statusText}>
            {today.onBreak ? "On break" : formatStatusLabel(today.status)}
          </Text>
        </View>
        <Text style={styles.goal}>
          {formatMinutesAsHours(workMinutes)}
          <Text style={styles.goalMuted}> / {formatMinutesAsHours(expected)}</Text>
        </Text>
      </View>

      <Text style={styles.clock}>{elapsed}</Text>
      <Text style={styles.date}>{format(new Date(now), "EEEE, MMMM d")}</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Shift</Text>
          <Text style={styles.statValue}>
            {today.shift?.startTime ?? "09:00"}–{today.shift?.endTime ?? "18:00"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Check in</Text>
          <Text style={styles.statValue}>{checkIn}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Break</Text>
          <Text style={styles.statValue}>{breakLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Brand.secondary,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
  goal: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.ink,
  },
  goalMuted: {
    fontWeight: "500",
    color: Brand.muted,
  },
  clock: {
    fontSize: 44,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -1.4,
    fontVariant: ["tabular-nums"],
  },
  date: {
    fontSize: 14,
    color: Brand.muted,
    marginTop: 4,
    marginBottom: Spacing.four,
  },
  track: {
    height: 4,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvasTint,
    overflow: "hidden",
    marginBottom: Spacing.five,
  },
  fill: {
    height: "100%",
    borderRadius: Radii.full,
    backgroundColor: Brand.secondary,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flex: 1,
    gap: 3,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Brand.border,
    marginHorizontal: Spacing.two,
  },
  statLabel: {
    fontSize: 11,
    color: Brand.muted,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 13,
    color: Brand.ink,
    fontWeight: "600",
  },
});
