import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { AttendanceInsightDay } from "@/types/attendance";

type MonthSummaryCardProps = {
  daily: AttendanceInsightDay[];
  expectedMonthHours: number;
};

const formatHours = (minutes: number): string => {
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours}h`;
};

export const MonthSummaryCard = ({
  daily,
  expectedMonthHours,
}: MonthSummaryCardProps) => {
  const worked = daily.filter((d) => (d.workMinutes ?? 0) > 0);
  const totalMinutes = worked.reduce((s, d) => s + (d.workMinutes ?? 0), 0);
  const expectedMinutes = expectedMonthHours * 60;
  const progress = Math.min(
    1,
    expectedMinutes > 0 ? totalMinutes / expectedMinutes : 0,
  );

  const onTimeEligible = daily.filter(
    (d) =>
      d.status === "PRESENT" ||
      d.status === "LATE" ||
      d.status === "WORK_FROM_HOME",
  );
  const onTime = onTimeEligible.filter((d) => d.lateMinutes === 0).length;
  const punctuality =
    onTimeEligible.length === 0
      ? 100
      : Math.round((onTime / onTimeEligible.length) * 100);

  let streak = 0;
  for (let i = daily.length - 1; i >= 0; i -= 1) {
    const day = daily[i];
    if (!day || day.status === "WEEKEND" || day.status === "HOLIDAY") {
      continue;
    }
    if (day.lateMinutes === 0 && (day.workMinutes ?? 0) > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  const overtimeMinutes = daily.reduce((s, d) => s + d.overtimeMinutes, 0);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>This month</Text>
        <Text style={styles.goal}>
          {formatHours(totalMinutes)}
          <Text style={styles.goalMuted}> / {expectedMonthHours}h</Text>
        </Text>
      </View>

      <Text style={styles.hero}>{formatHours(totalMinutes)}</Text>
      <Text style={styles.caption}>Hours logged</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Punctuality</Text>
          <Text style={styles.statValue}>{punctuality}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>On-time streak</Text>
          <Text style={styles.statValue}>{streak}d</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Overtime</Text>
          <Text style={styles.statValue}>{formatHours(overtimeMinutes)}</Text>
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
    marginBottom: Spacing.three,
  },
  eyebrow: {
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
  hero: {
    fontSize: 40,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -1.2,
  },
  caption: {
    fontSize: 14,
    color: Brand.muted,
    marginTop: 2,
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
