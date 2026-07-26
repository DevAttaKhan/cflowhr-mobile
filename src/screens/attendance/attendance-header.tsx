import { StyleSheet, Text, View } from "react-native";

import { Brand, Spacing } from "@/constants/theme";

import { MonthPicker } from "./month-picker";

type AttendanceHeaderProps = {
  monthKey: string;
  onMonthChange: (monthKey: string) => void;
};

export const AttendanceHeader = ({
  monthKey,
  onMonthChange,
}: AttendanceHeaderProps) => (
  <View style={styles.wrap}>
    <View style={styles.copy}>
      <Text style={styles.title}>Attendance</Text>
      <Text style={styles.sub}>Hours and trends this month</Text>
    </View>
    <MonthPicker value={monthKey} onChange={onMonthChange} />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.four,
  },
  copy: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 13,
    color: Brand.muted,
    fontWeight: "500",
  },
});
