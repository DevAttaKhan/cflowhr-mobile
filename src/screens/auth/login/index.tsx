import { format } from "date-fns";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { Screen } from "@/components/ui/screen";
import { Brand, Radii, Spacing } from "@/constants/theme";
import { MOCK_USER } from "@/data/mocks/employee";
import { loginMock } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/store";

export const LoginScreen = () => {
  const dispatch = useAppDispatch();

  const handleContinue = () => {
    dispatch(loginMock(MOCK_USER));
    router.replace("/(employee)/today");
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.hero}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>cf</Text>
          </View>
          <Text style={styles.brand}>cflowHR</Text>
          <Text style={styles.tagline}>Your workday, beautifully simple.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>
            {format(new Date(), "EEEE, MMM d")} · Demo employee session
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={MOCK_USER.email}
            editable={false}
            style={styles.input}
            accessibilityLabel="Email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value="••••••••"
            editable={false}
            secureTextEntry
            style={styles.input}
            accessibilityLabel="Password"
          />

          <AppButton
            label="Continue to app"
            onPress={handleContinue}
            style={styles.cta}
          />
          <Text style={styles.hint}>Mock login — API wiring comes next.</Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    justifyContent: "space-between",
    paddingBottom: Spacing.six,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  logoMark: {
    width: 84,
    height: 84,
    borderRadius: Radii.xl,
    backgroundColor: Brand.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: Brand.ink,
  },
  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: Brand.ink,
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize: 15,
    color: Brand.muted,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: Brand.border,
    gap: Spacing.two,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
  },
  cardSub: {
    fontSize: 13,
    color: Brand.muted,
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.inkSoft,
    marginTop: Spacing.two,
  },
  input: {
    height: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingHorizontal: Spacing.four,
    backgroundColor: Brand.canvas,
    color: Brand.ink,
    fontSize: 15,
  },
  cta: {
    marginTop: Spacing.four,
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: Brand.muted,
    marginTop: Spacing.two,
  },
});
