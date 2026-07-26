import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type LeaveHeaderProps = {
  onRequest: () => void;
};

export const LeaveHeader = ({ onRequest }: LeaveHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.copy}>
      <Text style={styles.title}>Leave</Text>
      <Text style={styles.sub}>Balances and requests</Text>
    </View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Request leave"
      onPress={onRequest}
      style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
    >
      <Text style={styles.ctaText}>Request</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
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
  cta: {
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radii.full,
  },
  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: Brand.ink,
  },
});
