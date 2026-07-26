import { Pressable, StyleSheet, Text, View } from "react-native";
import { format, parse } from "date-fns";

import { Brand, Radii, Spacing } from "@/constants/theme";

type MonthPickerProps = {
  value: string;
  onChange: (monthKey: string) => void;
};

export const MonthPicker = ({ value, onChange }: MonthPickerProps) => {
  const date = parse(`${value}-01`, "yyyy-MM-dd", new Date());

  const handleShift = (delta: number) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + delta);
    onChange(format(next, "yyyy-MM"));
  };

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => handleShift(-1)}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        style={styles.chevron}
      >
        <Text style={styles.chevronText}>‹</Text>
      </Pressable>
      <Text style={styles.label}>{format(date, "MMMM yyyy")}</Text>
      <Pressable
        onPress={() => handleShift(1)}
        accessibilityRole="button"
        accessibilityLabel="Next month"
        style={styles.chevron}
      >
        <Text style={styles.chevronText}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Brand.surface,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Brand.ink,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Brand.canvas,
  },
  chevronText: {
    fontSize: 24,
    color: Brand.inkSoft,
    lineHeight: 28,
  },
});
