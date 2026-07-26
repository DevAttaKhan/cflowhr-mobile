import { format } from "date-fns";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import {
  MonthlyBarsChart,
  WeeklyLinesChart,
} from "@/components/charts/attendance-charts";
import { Screen } from "@/components/ui/screen";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { Spacing } from "@/constants/theme";
import { useGetMyAttendanceInsightsQuery } from "@/store/apis/me-attendance.api";
import { useGetMyLeaveBalancesQuery } from "@/store/apis/leave.api";

import { AttendanceHeader } from "./attendance-header";
import { useMonthKey } from "./compute-highlights";
import { DayDetailsList } from "./day-details-list";
import { LeaveBalanceCard } from "./leave-balance-card";
import { MonthSummaryCard } from "./month-summary-card";

export const AttendanceScreen = () => {
  const [monthKey, setMonthKey] = useState(() => format(new Date(), "yyyy-MM"));
  const [showWeekends, setShowWeekends] = useState(false);
  const range = useMonthKey(monthKey);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetMyAttendanceInsightsQuery(range);
  const { data: leaveBalances = [] } = useGetMyLeaveBalancesQuery();

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
        <AttendanceHeader monthKey={monthKey} onMonthChange={setMonthKey} />

        <MonthSummaryCard
          daily={data.daily}
          expectedMonthHours={data.expectedMonthHours ?? 0}
        />

        {leaveBalances.length > 0 ? (
          <LeaveBalanceCard balances={leaveBalances} />
        ) : null}

        <MonthlyBarsChart days={data.daily} />
        <WeeklyLinesChart weeks={data.weekly} />

        <DayDetailsList
          days={detailDays}
          showWeekends={showWeekends}
          onToggleWeekends={() => setShowWeekends((value) => !value)}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.seven,
    gap: Spacing.four,
  },
});
