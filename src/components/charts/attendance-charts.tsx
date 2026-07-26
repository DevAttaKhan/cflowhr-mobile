import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing, StatusColors } from "@/constants/theme";
import { weekdayAverages } from "@/screens/attendance/compute-highlights";
import type {
  AttendanceInsightDay,
  AttendanceInsightWeek,
} from "@/types/attendance";

const CHART_HEIGHT = 140;

type BarItem = {
  key: string;
  label: string;
  value: number;
  color: string;
};

const ViewBarChart = ({
  title,
  items,
  maxValue,
}: {
  title: string;
  items: BarItem[];
  maxValue: number;
}) => {
  const ceiling = Math.max(maxValue, 1);

  return (
    <View style={styles.chartBox}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.barsRow}
      >
        {items.map((item) => {
          const height = Math.max(4, (item.value / ceiling) * CHART_HEIGHT);
          return (
            <View key={item.key} style={styles.barCol}>
              <Text style={styles.barValue}>
                {item.value > 0
                  ? item.value.toFixed(item.value < 10 ? 1 : 0)
                  : ""}
              </Text>
              <View style={[styles.barTrack, { height: CHART_HEIGHT }]}>
                <View
                  style={[
                    styles.barFill,
                    { height, backgroundColor: item.color },
                  ]}
                />
              </View>
              <Text style={styles.barLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

type MonthlyBarsProps = {
  days: AttendanceInsightDay[];
};

export const MonthlyBarsChart = ({ days }: MonthlyBarsProps) => {
  const items = days
    .filter((d) => d.status !== "WEEKEND" && d.status !== "HOLIDAY")
    .map((d) => ({
      key: d.date,
      label: String(Number(d.date.slice(8, 10))),
      value: Math.round(((d.workMinutes ?? 0) / 60) * 10) / 10,
      color: StatusColors[d.status] ?? Brand.secondary,
    }));

  if (items.length === 0) {
    return <Text style={styles.empty}>No working days in this month</Text>;
  }

  return (
    <ViewBarChart
      title="Daily hours"
      items={items}
      maxValue={Math.max(...items.map((i) => i.value), 8)}
    />
  );
};

type WeeklyLinesProps = {
  weeks: AttendanceInsightWeek[];
};

export const WeeklyLinesChart = ({ weeks }: WeeklyLinesProps) => {
  if (weeks.length === 0) {
    return <Text style={styles.empty}>No weekly data</Text>;
  }

  const maxValue = Math.max(
    ...weeks.flatMap((w) => [w.workHours, w.expectedHours]),
    8,
  );

  return (
    <View style={styles.chartBox}>
      <Text style={styles.title}>Weekly needed vs logged</Text>
      <View style={styles.legend}>
        <Text style={styles.legendItem}>
          <Text style={{ color: Brand.secondary }}>●</Text> Logged
        </Text>
        <Text style={styles.legendItem}>
          <Text style={{ color: Brand.primary }}>●</Text> Needed
        </Text>
      </View>
      <View style={styles.weekRows}>
        {weeks.map((week, index) => {
          const loggedPct = Math.min(100, (week.workHours / maxValue) * 100);
          const neededPct = Math.min(100, (week.expectedHours / maxValue) * 100);
          return (
            <View key={week.week} style={styles.weekRow}>
              <Text style={styles.weekLabel}>W{index + 1}</Text>
              <View style={styles.weekBars}>
                <View style={styles.weekTrack}>
                  <View
                    style={[
                      styles.weekFill,
                      {
                        width: `${neededPct}%`,
                        backgroundColor: Brand.primary,
                        opacity: 0.55,
                      },
                    ]}
                  />
                </View>
                <View style={styles.weekTrack}>
                  <View
                    style={[
                      styles.weekFill,
                      {
                        width: `${loggedPct}%`,
                        backgroundColor: Brand.secondary,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.weekValue}>{week.workHours}h</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

type WeekdayBarsProps = {
  days: AttendanceInsightDay[];
};

export const WeekdayBarsChart = ({ days }: WeekdayBarsProps) => {
  const items = weekdayAverages(days).map((row) => ({
    key: row.label,
    label: row.label.slice(0, 3),
    value: row.hours,
    color: Brand.primary,
  }));

  return (
    <ViewBarChart
      title="Avg hours by weekday"
      items={items}
      maxValue={Math.max(...items.map((i) => i.value), 8)}
    />
  );
};

const styles = StyleSheet.create({
  chartBox: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingTop: Spacing.two,
    minHeight: CHART_HEIGHT + 40,
  },
  barCol: {
    width: 22,
    alignItems: "center",
    gap: 4,
  },
  barValue: {
    fontSize: 9,
    color: Brand.muted,
    fontWeight: "600",
    height: 12,
  },
  barTrack: {
    width: 14,
    justifyContent: "flex-end",
    backgroundColor: Brand.canvas,
    borderRadius: Radii.sm,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 9,
    color: Brand.muted,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    gap: Spacing.four,
  },
  legendItem: {
    fontSize: 12,
    color: Brand.muted,
    fontWeight: "600",
  },
  weekRows: {
    gap: Spacing.three,
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  weekLabel: {
    width: 28,
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  weekBars: {
    flex: 1,
    gap: 4,
  },
  weekTrack: {
    height: 8,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvas,
    overflow: "hidden",
  },
  weekFill: {
    height: "100%",
    borderRadius: Radii.full,
  },
  weekValue: {
    width: 36,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    color: Brand.ink,
  },
  empty: {
    color: Brand.muted,
    padding: Spacing.four,
  },
});
