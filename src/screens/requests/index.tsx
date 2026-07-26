import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

import { Screen } from "@/components/ui/screen";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { Spacing } from "@/constants/theme";
import {
  useCancelAttendanceRequestMutation,
  useGetAttendanceRequestsQuery,
} from "@/store/apis/attendance-request.api";
import type { AttendanceRequestStatus } from "@/types/attendance-request";

import { AttendanceRequestCard } from "./attendance-request-card";
import { RequestsHeader } from "./requests-header";
import { RequestsStatusFilter } from "./requests-status-filter";
import { RequestsSummaryCard } from "./requests-summary-card";

export const RequestsScreen = () => {
  const [status, setStatus] = useState<AttendanceRequestStatus | "">("");
  const query = useMemo(
    () => (status ? { status } : undefined),
    [status],
  );

  const { data = [], isLoading, isError, refetch } =
    useGetAttendanceRequestsQuery(query);
  const { data: allRequests = [] } = useGetAttendanceRequestsQuery();
  const [cancelRequest] = useCancelAttendanceRequestMutation();

  const handleCreate = () => {
    router.push("/(employee)/requests/create");
  };

  const handleCancel = (id: number) => {
    Alert.alert("Cancel request?", "This cannot be undone from the app.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel",
        style: "destructive",
        onPress: () => void cancelRequest(id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading requests…" />
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
        <RequestsHeader onCreate={handleCreate} />
        <RequestsSummaryCard requests={allRequests} />
        <RequestsStatusFilter value={status} onChange={setStatus} />

        {data.length === 0 ? (
          <EmptyState
            title="No correction requests"
            subtitle="Submit a fix for a missing or wrong punch."
            actionLabel="New request"
            onAction={handleCreate}
          />
        ) : (
          <>
            {data.map((row) => (
              <AttendanceRequestCard
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
