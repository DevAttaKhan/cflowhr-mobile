import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing, StatusColors } from "@/constants/theme";
import { formatStatusLabel } from "@/utils/format-minutes";

type StatusPillProps = {
  status: string;
};

export const StatusPill = ({ status }: StatusPillProps) => {
  const color = StatusColors[status] ?? Brand.muted;
  return (
    <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: Brand.inkSoft }]}>
        {formatStatusLabel(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radii.full,
    alignSelf: "flex-start",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
