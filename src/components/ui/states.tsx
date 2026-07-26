import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Brand, Spacing } from "@/constants/theme";
import { AppButton } from "./app-button";

type LoadingStateProps = {
  message?: string;
};

export const LoadingState = ({ message = "Loading…" }: LoadingStateProps) => (
  <View style={styles.center}>
    <ActivityIndicator color={Brand.secondary} size="large" />
    <Text style={styles.text}>{message}</Text>
  </View>
);

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <View style={styles.center}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.text}>{subtitle}</Text> : null}
    {actionLabel && onAction ? (
      <AppButton
        label={actionLabel}
        onPress={onAction}
        style={{ marginTop: Spacing.four }}
      />
    ) : null}
  </View>
);

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) => (
  <View style={styles.center}>
    <Text style={styles.title}>{message}</Text>
    {onRetry ? (
      <AppButton
        label="Try again"
        variant="ghost"
        onPress={onRetry}
        style={{ marginTop: Spacing.four }}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.six,
    gap: Spacing.two,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: Brand.ink,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: Brand.muted,
    textAlign: "center",
  },
});
