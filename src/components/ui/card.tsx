import { StyleSheet, Text, View, type ViewProps } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type CardProps = ViewProps & {
  title?: string;
  subtitle?: string;
};

export const Card = ({ title, subtitle, children, style, ...props }: CardProps) => (
  <View style={[styles.card, style]} {...props}>
    {title ? <Text style={styles.title}>{title}</Text> : null}
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.lg,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Brand.ink,
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 13,
    color: Brand.muted,
    marginBottom: Spacing.three,
  },
});
