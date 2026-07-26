import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { AttendanceRequestStatus } from "@/types/attendance-request";

type RequestsStatusFilterProps = {
  value: AttendanceRequestStatus | "";
  onChange: (value: AttendanceRequestStatus | "") => void;
};

const FILTERS: { id: AttendanceRequestStatus | ""; label: string }[] = [
  { id: "", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "CANCELLED", label: "Cancelled" },
];

export const RequestsStatusFilter = ({
  value,
  onChange,
}: RequestsStatusFilterProps) => (
  <View style={styles.wrap}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {FILTERS.map((filter) => {
        const active = value === filter.id;
        return (
          <Pressable
            key={filter.label}
            onPress={() => onChange(filter.id)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter ${filter.label}`}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    height: 40,
  },
  scroll: {
    flexGrow: 0,
  },
  row: {
    alignItems: "center",
    gap: Spacing.two,
    paddingRight: Spacing.two,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.four,
    borderRadius: Radii.full,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: "center",
    justifyContent: "center",
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
});
