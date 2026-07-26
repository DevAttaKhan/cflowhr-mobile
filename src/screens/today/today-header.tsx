import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type TodayHeaderProps = {
  fullName: string;
};

const greetingForHour = (hour: number): string => {
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
};

export const TodayHeader = ({ fullName }: TodayHeaderProps) => {
  const firstName = fullName.split(" ")[0] ?? "there";
  const greeting = greetingForHour(new Date().getHours());
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials || "CF"}</Text>
        </View>
        <View style={styles.copy}>
          <Text style={styles.greeting} numberOfLines={1}>
            {greeting}, {firstName}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        style={styles.bell}
      >
        <View style={styles.bellIcon}>
          <View style={styles.bellBody} />
          <View style={styles.bellClapper} />
        </View>
        <View style={styles.bellDot} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.ink,
  },
  copy: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.3,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  bellBody: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Brand.inkSoft,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bellClapper: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Brand.inkSoft,
    marginTop: 1,
  },
  bellDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Brand.danger,
  },
});
