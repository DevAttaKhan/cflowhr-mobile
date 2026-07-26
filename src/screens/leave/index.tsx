import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

import { LeaveBalanceCard } from "@/components/leave/leave-balance-card";
import { Screen } from "@/components/ui/screen";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { Spacing } from "@/constants/theme";
import {
  useCancelLeaveRequestMutation,
  useGetLeaveRequestsQuery,
  useGetMyLeaveBalancesQuery,
} from "@/store/apis/leave.api";
import type { LeaveStatus } from "@/types/leave";

import { LeaveHeader } from "./leave-header";
import { LeaveRequestCard } from "./leave-request-card";
import { LeaveStatusFilter } from "./leave-status-filter";

export const LeaveScreen = () => {
  const [status, setStatus] = useState<LeaveStatus | "">("");
  const query = useMemo(
    () => (status ? { status } : undefined),
    [status],
  );

  const { data = [], isLoading, isError, refetch } =
    useGetLeaveRequestsQuery(query);
  const { data: balances = [] } = useGetMyLeaveBalancesQuery();
  const [cancelLeave] = useCancelLeaveRequestMutation();

  const handleRequest = () => {
    router.push("/(employee)/leave/request");
  };

  const handleCancel = (id: number) => {
    Alert.alert("Cancel leave?", "This will mark the request as cancelled.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel leave",
        style: "destructive",
        onPress: () => void cancelLeave(id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading leave…" />
      </Screen>
    );
  }

  if (isError) {
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
        <LeaveHeader onRequest={handleRequest} />

        {balances.length > 0 ? (
          <LeaveBalanceCard balances={balances} />
        ) : null}

        <LeaveStatusFilter value={status} onChange={setStatus} />

        {data.length === 0 ? (
          <EmptyState
            title="No leave requests"
            subtitle="Tap Request to submit time off."
            actionLabel="Request leave"
            onAction={handleRequest}
          />
        ) : (
          <>
            {data.map((row) => (
              <LeaveRequestCard
                key={row.id}
                request={row}
                onCancel={handleCancel}
              />
            ))}
          </>
        )}
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.seven,
    gap: Spacing.four,
    flexGrow: 1,
  },
});
