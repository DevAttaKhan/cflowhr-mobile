import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<
  ButtonVariant,
  { bg: string; text: string; border?: string }
> = {
  primary: { bg: Brand.primary, text: Brand.ink },
  secondary: { bg: Brand.secondary, text: Brand.ink },
  ghost: { bg: "transparent", text: Brand.ink, border: Brand.border },
  danger: { bg: "#FEE2E2", text: Brand.danger },
};

export const AppButton = ({
  label,
  variant = "primary",
  style,
  disabled,
  ...props
}: AppButtonProps) => {
  const colors = variantStyles[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border ?? "transparent",
          borderWidth: colors.border ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.five,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
