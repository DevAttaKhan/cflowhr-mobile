import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { Spacing } from "@/constants/theme";
import {
  useGetMyAttendanceTodayQuery,
  usePunchMyAttendanceMutation,
} from "@/store/apis/me-attendance.api";
import { useAppSelector } from "@/store/store";
import type { AttendanceEventType } from "@/types/attendance";

import { PunchFab } from "./punch-fab";
import { TodayHeader } from "./today-header";
import { TodaySummaryCard } from "./today-summary-card";

export const TodayScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: today, isLoading, isError, refetch } =
    useGetMyAttendanceTodayQuery();
  const [punch, { isLoading: isPunching }] = usePunchMyAttendanceMutation();

  const handlePunch = (type: AttendanceEventType) => {
    void punch({ type });
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading your day…" />
      </Screen>
    );
  }

  if (isError || !today) {
    return (
      <Screen>
        <ErrorState onRetry={() => void refetch()} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <TodayHeader fullName={user?.fullName ?? "Team member"} />
        <TodaySummaryCard today={today} />
        <View style={styles.fabArea}>
          <PunchFab
            nextPunch={today.nextPunch}
            isPunching={isPunching}
            onPunch={handlePunch}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.five,
  },
  fabArea: {
    flex: 1,
    justifyContent: "center",
    minHeight: 160,
  },
});
