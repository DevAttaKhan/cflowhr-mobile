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
  useCancelLeaveRequestMutation,
  useGetLeaveRequestsQuery,
} from "@/store/apis/leave.api";
import type { LeaveStatus } from "@/types/leave";

const FILTERS: { id: LeaveStatus | ""; label: string }[] = [
  { id: "", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "CANCELLED", label: "Cancelled" },
];

export const LeaveScreen = () => {
  const [status, setStatus] = useState<LeaveStatus | "">("");
  const query = useMemo(
    () => (status ? { status } : undefined),
    [status],
  );
  const { data = [], isLoading, isError, refetch } =
    useGetLeaveRequestsQuery(query);
  const [cancelLeave] = useCancelLeaveRequestMutation();

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
        <View>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Leave</Text>
              <Text style={styles.subtitle}>Request time off and track status</Text>
            </View>
            <AppButton
              label="Request"
              onPress={() => router.push("/(employee)/leave/request")}
              style={styles.requestBtn}
            />
          </View>
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
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
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
            title="No leave requests"
            subtitle="Tap Request to submit time off."
            actionLabel="Request leave"
            onAction={() => router.push("/(employee)/leave/request")}
          />
        ) : (
          <View style={styles.list}>
            {data.map((row) => (
              <View key={row.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.type}>
                    {row.leaveType?.name ?? "Leave"}
                  </Text>
                  <StatusPill status={row.status} />
                </View>
                <Text style={styles.dates}>
                  {format(parseISO(row.startDate), "MMM d")}
                  {row.startDate !== row.endDate
                    ? ` – ${format(parseISO(row.endDate), "MMM d")}`
                    : ""}
                  {" · "}
                  {row.halfDay ? "Half day" : `${row.days} day${row.days === 1 ? "" : "s"}`}
                </Text>
                {row.reason ? (
                  <Text style={styles.reason} numberOfLines={2}>
                    {row.reason}
                  </Text>
                ) : null}
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
    gap: Spacing.three,
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
  requestBtn: {
    paddingHorizontal: Spacing.four,
    minHeight: 42,
  },
  chips: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
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
  chipTextActive: {
    color: Brand.ink,
  },
  list: {
    gap: Spacing.three,
  },
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
