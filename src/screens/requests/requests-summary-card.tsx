import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { AttendanceRequest } from "@/types/attendance-request";

type RequestsSummaryCardProps = {
  requests: AttendanceRequest[];
};

export const RequestsSummaryCard = ({ requests }: RequestsSummaryCardProps) => {
  const pending = requests.filter((row) => row.status === "PENDING").length;
  const approved = requests.filter((row) => row.status === "APPROVED").length;
  const rejected = requests.filter((row) => row.status === "REJECTED").length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{approved}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{rejected}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
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
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flex: 1,
    gap: 3,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Brand.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Brand.muted,
  },
});
