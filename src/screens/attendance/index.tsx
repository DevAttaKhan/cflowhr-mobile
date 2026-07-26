import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MonthlyBarsChart,
  WeekdayBarsChart,
  WeeklyLinesChart,
} from "@/components/charts/attendance-charts";
import { Screen } from "@/components/ui/screen";
import { StatusPill } from "@/components/ui/status-pill";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { Brand, Radii, Spacing } from "@/constants/theme";
import { useGetMyAttendanceInsightsQuery } from "@/store/apis/me-attendance.api";
import { formatMinutesAsHours } from "@/utils/format-minutes";

import {
  computeHighlights,
  useMonthKey,
} from "./compute-highlights";
import { HighlightsStrip } from "./highlights-strip";
import { MonthPicker } from "./month-picker";

export const AttendanceScreen = () => {
  const [monthKey, setMonthKey] = useState(() => format(new Date(), "yyyy-MM"));
  const [showWeekends, setShowWeekends] = useState(false);
  const range = useMonthKey(monthKey);

  const { data, isLoading, isError, refetch } =
    useGetMyAttendanceInsightsQuery(range);

  const highlights = useMemo(
    () => computeHighlights(data?.daily ?? [], data?.expectedMonthHours ?? 0),
    [data],
  );

  const detailDays = useMemo(() => {
    const daily = data?.daily ?? [];
    if (showWeekends) {
      return daily;
    }
    return daily.filter(
      (day) => day.status !== "WEEKEND" && day.status !== "HOLIDAY",
    );
  }, [data?.daily, showWeekends]);

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading insights…" />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <ErrorState onRetry={() => void refetch()} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View>
          <Text style={styles.title}>My attendance</Text>
          <Text style={styles.subtitle}>
            Hours, punctuality, and weekly trends
          </Text>
          <MonthPicker value={monthKey} onChange={setMonthKey} />
        </View>

        <View>
          <HighlightsStrip items={highlights} />
        </View>

        <View>
          <MonthlyBarsChart days={data.daily} />
        </View>

        <View>
          <WeeklyLinesChart weeks={data.weekly} />
        </View>

        <View>
          <WeekdayBarsChart days={data.daily} />
        </View>

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Day details</Text>
            <Pressable
              onPress={() => setShowWeekends((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Toggle weekends"
            >
              <Text style={styles.toggle}>
                {showWeekends ? "Hide weekends" : "Show weekends"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.dayList}>
            {detailDays.map((day) => (
              <View key={day.date} style={styles.dayRow}>
                <View style={styles.dayLeft}>
                  <Text style={styles.dayDate}>
                    {format(parseISO(day.date), "EEE d")}
                  </Text>
                  <StatusPill status={day.status} />
                </View>
                <View style={styles.dayRight}>
                  <Text style={styles.dayHours}>
                    {formatMinutesAsHours(day.workMinutes)}
                  </Text>
                  {day.lateMinutes > 0 ? (
                    <Text style={styles.late}>+{day.lateMinutes}m late</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.five,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Brand.ink,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    color: Brand.muted,
    marginBottom: Spacing.four,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Brand.ink,
  },
  toggle: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.secondary,
  },
  dayList: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: "hidden",
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  dayLeft: {
    gap: Spacing.two,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "700",
    color: Brand.ink,
  },
  dayRight: {
    alignItems: "flex-end",
  },
  dayHours: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  late: {
    fontSize: 11,
    color: Brand.warning,
    fontWeight: "600",
  },
});
