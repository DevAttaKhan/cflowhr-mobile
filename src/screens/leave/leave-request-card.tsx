import { format, parseISO } from "date-fns";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { LeaveRequest, LeaveStatus } from "@/types/leave";

type LeaveRequestCardProps = {
  request: LeaveRequest;
  onCancel: (id: number) => void;
};

const STATUS_COLOR: Record<LeaveStatus, string> = {
  PENDING: Brand.warning,
  APPROVED: Brand.secondary,
  REJECTED: Brand.danger,
  CANCELLED: Brand.muted,
};

const formatStatus = (status: LeaveStatus): string =>
  status.charAt(0) + status.slice(1).toLowerCase();

export const LeaveRequestCard = ({
  request,
  onCancel,
}: LeaveRequestCardProps) => {
  const statusColor = STATUS_COLOR[request.status];
  const start = parseISO(request.startDate);
  const end = parseISO(request.endDate);
  const sameDay = request.startDate === request.endDate;
  const duration = request.halfDay
    ? "Half day"
    : `${request.days} day${request.days === 1 ? "" : "s"}`;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.dateBlock}>
          <Text style={styles.month}>{format(start, "MMM")}</Text>
          <Text style={styles.day}>{format(start, "d")}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.type}>
            {request.leaveType?.name ?? "Leave"}
          </Text>
          <Text style={styles.dates}>
            {sameDay
              ? format(start, "EEE, MMM d")
              : `${format(start, "MMM d")} – ${format(end, "MMM d")}`}
            {" · "}
            {duration}
          </Text>
          {request.reason ? (
            <Text style={styles.reason} numberOfLines={2}>
              {request.reason}
            </Text>
          ) : null}
        </View>

        <View style={styles.status}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{formatStatus(request.status)}</Text>
        </View>
      </View>

      {request.status === "PENDING" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel leave request"
          onPress={() => onCancel(request.id)}
          style={({ pressed }) => [
            styles.cancelBtn,
            pressed && styles.cancelPressed,
          ]}
        >
          <Text style={styles.cancelText}>Cancel request</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  dateBlock: {
    width: 44,
    alignItems: "center",
    paddingTop: 2,
  },
  month: {
    fontSize: 11,
    fontWeight: "700",
    color: Brand.muted,
    textTransform: "uppercase",
  },
  day: {
    fontSize: 20,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.5,
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  type: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  dates: {
    fontSize: 12,
    fontWeight: "500",
    color: Brand.muted,
  },
  reason: {
    fontSize: 13,
    color: Brand.inkSoft,
    marginTop: 2,
    lineHeight: 18,
  },
  status: {
    alignItems: "flex-end",
    gap: 4,
    paddingTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
  cancelBtn: {
    alignSelf: "flex-start",
    marginLeft: 56,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.full,
    backgroundColor: "#FEE2E2",
  },
  cancelPressed: {
    opacity: 0.85,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.danger,
  },
});
