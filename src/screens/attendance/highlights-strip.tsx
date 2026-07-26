import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

import type { AttendanceHighlight } from "./compute-highlights";

type HighlightsStripProps = {
  items: AttendanceHighlight[];
};

export const HighlightsStrip = ({ items }: HighlightsStripProps) => (
  <View style={styles.grid}>
    {items.map((item) => (
      <View key={item.id} style={styles.card}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.value}</Text>
        {item.hint ? <Text style={styles.hint}>{item.hint}</Text> : null}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  card: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: Brand.surface,
    borderRadius: Radii.md,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  label: {
    fontSize: 12,
    color: Brand.muted,
    fontWeight: "600",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: Brand.ink,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  hint: {
    fontSize: 11,
    color: Brand.muted,
    marginTop: 2,
  },
});
