import { StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

export const LoginHero = () => (
  <View style={styles.hero}>
    <View style={styles.logoMark}>
      <Text style={styles.logoText}>cf</Text>
    </View>
    <Text style={styles.brand}>cflowHR</Text>
    <Text style={styles.tagline}>
      Punch in, track hours, and manage leave — all in one calm place.
    </Text>

    <View style={styles.pills}>
      <View style={styles.pill}>
        <View style={[styles.pillDot, { backgroundColor: Brand.secondary }]} />
        <Text style={styles.pillText}>Attendance</Text>
      </View>
      <View style={styles.pill}>
        <View style={[styles.pillDot, { backgroundColor: Brand.primary }]} />
        <Text style={styles.pillText}>Leave</Text>
      </View>
      <View style={styles.pill}>
        <View style={[styles.pillDot, { backgroundColor: Brand.inkSoft }]} />
        <Text style={styles.pillText}>Requests</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: Radii.xl,
    backgroundColor: Brand.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: Brand.ink,
    letterSpacing: -0.5,
  },
  brand: {
    fontSize: 36,
    fontWeight: "800",
    color: Brand.ink,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
    color: Brand.muted,
    textAlign: "center",
    maxWidth: 280,
    fontWeight: "500",
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
});
