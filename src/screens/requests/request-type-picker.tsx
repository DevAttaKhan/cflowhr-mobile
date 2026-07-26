import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { AttendanceRequestType } from "@/types/attendance-request";
import { formatStatusLabel } from "@/utils/format-minutes";

type RequestTypePickerProps = {
  types: AttendanceRequestType[];
  value: AttendanceRequestType | null;
  onChange: (type: AttendanceRequestType) => void;
  error?: string;
};

export const RequestTypePicker = ({
  types,
  value,
  onChange,
  error,
}: RequestTypePickerProps) => (
  <View style={styles.wrap}>
    <Text style={styles.label}>Request type</Text>
    <View style={styles.types}>
      {types.map((type) => {
        const active = value === type;
        return (
          <Pressable
            key={type}
            onPress={() => onChange(type)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={formatStatusLabel(type)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {formatStatusLabel(type)}
            </Text>
          </Pressable>
        );
      })}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.canvas,
  },
  chipActive: {
    backgroundColor: Brand.primaryMuted,
    borderColor: Brand.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
  chipTextActive: {
    color: Brand.ink,
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
  },
});
