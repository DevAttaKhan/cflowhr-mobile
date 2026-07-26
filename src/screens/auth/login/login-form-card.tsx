import { format } from "date-fns";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { Brand, Radii, Spacing } from "@/constants/theme";

type LoginFormCardProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  emailError?: string;
  passwordError?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export const LoginFormCard = ({
  email,
  password,
  isSubmitting,
  emailError,
  passwordError,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>
          {format(new Date(), "EEEE, MMM d")} · Sign in to continue
        </Text>
      </View>

      <View style={styles.demoChip}>
        <View style={styles.demoDot} />
        <Text style={styles.demoText}>Demo mode — mock employee session</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="you@company.com"
          placeholderTextColor={Brand.muted}
          style={[styles.input, emailError ? styles.inputError : null]}
          accessibilityLabel="Email"
          returnKeyType="next"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordRow,
            passwordError ? styles.inputError : null,
          ]}
        >
          <TextInput
            value={password}
            onChangeText={onPasswordChange}
            secureTextEntry={!showPassword}
            textContentType="password"
            autoComplete="password"
            placeholder="Enter password"
            placeholderTextColor={Brand.muted}
            style={styles.passwordInput}
            accessibilityLabel="Password"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          <Pressable
            onPress={() => setShowPassword((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}
      </View>

      <AppButton
        label={isSubmitting ? "Signing in…" : "Continue"}
        disabled={isSubmitting}
        onPress={onSubmit}
        style={styles.cta}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: Brand.border,
    gap: Spacing.three,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    color: Brand.muted,
    fontWeight: "500",
  },
  demoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    alignSelf: "flex-start",
    backgroundColor: Brand.canvasTint,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  demoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Brand.secondary,
  },
  demoText: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.inkSoft,
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  input: {
    height: 52,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingHorizontal: Spacing.four,
    backgroundColor: Brand.canvas,
    color: Brand.ink,
    fontSize: 15,
  },
  inputError: {
    borderColor: Brand.danger,
  },
  passwordRow: {
    height: 52,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.canvas,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.four,
    paddingRight: Spacing.two,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    color: Brand.ink,
    fontSize: 15,
    paddingVertical: 0,
  },
  toggle: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.secondary,
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
  },
  cta: {
    marginTop: Spacing.two,
  },
});
