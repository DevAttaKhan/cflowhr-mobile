import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing, StatusColors } from "@/constants/theme";
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

  return (
    <View style={styles.chartBox}>
      <Text style={styles.title}>Weekly progress</Text>
      <View style={styles.weekRows}>
        {weeks.map((week, index) => {
          const expected = Math.max(week.expectedHours, 0.1);
          const progress = Math.min(1, week.workHours / expected);
          const remaining = Math.max(0, week.expectedHours - week.workHours);

          return (
            <View key={week.week} style={styles.weekRow}>
              <View style={styles.weekTop}>
                <Text style={styles.weekLabel}>Week {index + 1}</Text>
                <Text style={styles.weekValue}>
                  {week.workHours}h
                  <Text style={styles.weekOf}> / {week.expectedHours}h</Text>
                </Text>
              </View>
              <View style={styles.weekTrack}>
                <View
                  style={[
                    styles.weekFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor:
                        progress >= 1 ? Brand.secondary : Brand.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.weekHint}>
                {remaining > 0
                  ? `${Math.round(remaining * 10) / 10}h left`
                  : "Goal met"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartBox: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
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
  weekRows: {
    gap: Spacing.four,
  },
  weekRow: {
    gap: Spacing.two,
  },
  weekTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  weekLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
  weekValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.ink,
  },
  weekOf: {
    fontWeight: "500",
    color: Brand.muted,
  },
  weekTrack: {
    height: 6,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvasTint,
    overflow: "hidden",
  },
  weekFill: {
    height: "100%",
    borderRadius: Radii.full,
  },
  weekHint: {
    fontSize: 11,
    fontWeight: "500",
    color: Brand.muted,
  },
  empty: {
    color: Brand.muted,
    padding: Spacing.four,
  },
});
