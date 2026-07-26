import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { LeaveBalance } from "@/types/leave";

type LeaveBalanceCardProps = {
  balances: LeaveBalance[];
};

const formatDays = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
};

export const LeaveBalanceCard = ({ balances }: LeaveBalanceCardProps) => {
  const totalRemaining = balances.reduce((sum, row) => sum + row.remaining, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Remaining leave</Text>
        <Text style={styles.total}>
          {formatDays(totalRemaining)}
          <Text style={styles.totalUnit}> days</Text>
        </Text>
      </View>

      <View style={styles.list}>
        {balances.map((row) => {
          const usedRatio =
            row.allocated > 0
              ? Math.min(1, (row.used + row.pending) / row.allocated)
              : 0;

          return (
            <View key={row.leaveTypeId} style={styles.row}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{row.leaveTypeName}</Text>
                <Text style={styles.remaining}>
                  {formatDays(row.remaining)}
                  <Text style={styles.remainingOf}>
                    {" "}
                    / {formatDays(row.allocated)}
                  </Text>
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[styles.fill, { width: `${(1 - usedRatio) * 100}%` }]}
                />
              </View>
              {row.pending > 0 ? (
                <Text style={styles.pending}>
                  {formatDays(row.pending)}d pending
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
    gap: Spacing.four,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  total: {
    fontSize: 18,
    fontWeight: "800",
    color: Brand.secondary,
  },
  totalUnit: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
  list: {
    gap: Spacing.four,
  },
  row: {
    gap: Spacing.two,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
  remaining: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.ink,
  },
  remainingOf: {
    fontWeight: "500",
    color: Brand.muted,
  },
  track: {
    height: 4,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvasTint,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radii.full,
    backgroundColor: Brand.primary,
  },
  pending: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.warning,
  },
});
