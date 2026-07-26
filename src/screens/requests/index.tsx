import { format, parseISO } from "date-fns";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { Screen } from "@/components/ui/screen";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { Brand, Radii, Spacing } from "@/constants/theme";
import {
  useCancelAttendanceRequestMutation,
  useGetAttendanceRequestsQuery,
} from "@/store/apis/attendance-request.api";
import type { AttendanceRequestStatus } from "@/types/attendance-request";
import { formatStatusLabel } from "@/utils/format-minutes";

const FILTERS: { id: AttendanceRequestStatus | ""; label: string }[] = [
  { id: "", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "CANCELLED", label: "Cancelled" },
];

export const RequestsScreen = () => {
  const [status, setStatus] = useState<AttendanceRequestStatus | "">("");
  const query = useMemo(
    () => (status ? { status } : undefined),
    [status],
  );
  const { data = [], isLoading, isError, refetch } =
    useGetAttendanceRequestsQuery(query);
  const [cancelRequest] = useCancelAttendanceRequestMutation();

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
        <LoadingState />
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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Requests</Text>
            <Text style={styles.subtitle}>Attendance corrections</Text>
          </View>
          <AppButton
            label="New"
            onPress={() => router.push("/(employee)/requests/create")}
            style={styles.newBtn}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((filter) => {
            const active = status === filter.id;
            return (
              <Pressable
                key={filter.label}
                onPress={() => setStatus(filter.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {data.length === 0 ? (
          <EmptyState
            title="No correction requests"
            subtitle="Submit a fix for a missing or wrong punch."
            actionLabel="New request"
            onAction={() => router.push("/(employee)/requests/create")}
          />
        ) : (
          <View style={styles.list}>
            {data.map((row) => (
              <View key={row.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.type}>
                    {formatStatusLabel(row.requestType)}
                  </Text>
                  <StatusPill status={row.status} />
                </View>
                <Text style={styles.dates}>
                  {format(parseISO(row.attendanceDate), "MMM d, yyyy")}
                </Text>
                <Text style={styles.reason} numberOfLines={3}>
                  {row.reason}
                </Text>
                {row.status === "PENDING" ? (
                  <AppButton
                    label="Cancel request"
                    variant="danger"
                    onPress={() => handleCancel(row.id)}
                    style={styles.cancel}
                  />
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.four,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    marginTop: 2,
  },
  newBtn: {
    minHeight: 42,
    paddingHorizontal: Spacing.four,
  },
  chips: { gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radii.full,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  chipActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.muted,
  },
  chipTextActive: { color: Brand.ink },
  list: { gap: Spacing.three },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 16,
    fontWeight: "700",
    color: Brand.ink,
    flex: 1,
    paddingRight: Spacing.two,
  },
  dates: {
    fontSize: 13,
    color: Brand.inkSoft,
    fontWeight: "600",
  },
  reason: {
    fontSize: 13,
    color: Brand.muted,
  },
  cancel: {
    marginTop: Spacing.two,
    minHeight: 40,
  },
});
