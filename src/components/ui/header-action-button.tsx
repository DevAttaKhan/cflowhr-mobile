import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type HeaderActionButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export const HeaderActionButton = ({
  label,
  onPress,
  accessibilityLabel,
}: HeaderActionButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? label}
    onPress={onPress}
    style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
  >
    <View style={styles.content}>
      <SymbolView
        name={{
          ios: "plus",
          android: "add",
          web: "add",
        }}
        size={14}
        tintColor={Brand.ink}
        weight="bold"
        fallback={<Text style={styles.plusFallback}>+</Text>}
      />
      <Text style={styles.ctaText}>{label}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: Brand.ink,
  },
  plusFallback: {
    fontSize: 16,
    fontWeight: "700",
    color: Brand.ink,
    lineHeight: 16,
  },
});
