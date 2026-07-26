import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";
import type { LeaveBalance, LeaveType } from "@/types/leave";

type LeaveTypePickerProps = {
  types: LeaveType[];
  balances: LeaveBalance[];
  value: number | null;
  onChange: (id: number) => void;
  error?: string;
};

export const LeaveTypePicker = ({
  types,
  balances,
  value,
  onChange,
  error,
}: LeaveTypePickerProps) => (
  <View style={styles.wrap}>
    <Text style={styles.label}>Leave type</Text>
    <View style={styles.types}>
      {types.map((type) => {
        const active = value === type.id;
        const balance = balances.find((row) => row.leaveTypeId === type.id);
        return (
          <Pressable
            key={type.id}
            onPress={() => onChange(type.id)}
            style={[styles.typeChip, active && styles.typeChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={type.name}
          >
            <Text style={[styles.typeText, active && styles.typeTextActive]}>
              {type.name.replace(" Leave", "")}
            </Text>
            {balance ? (
              <Text
                style={[styles.typeBalance, active && styles.typeBalanceActive]}
              >
                {balance.remaining} left
              </Text>
            ) : null}
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
  typeChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.canvas,
    minWidth: "30%",
    flexGrow: 1,
  },
  typeChipActive: {
    backgroundColor: Brand.primaryMuted,
    borderColor: Brand.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  typeTextActive: {
    color: Brand.ink,
  },
  typeBalance: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.muted,
    marginTop: 2,
  },
  typeBalanceActive: {
    color: Brand.inkSoft,
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
  },
});
