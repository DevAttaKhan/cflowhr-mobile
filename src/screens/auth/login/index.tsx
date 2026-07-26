import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { Screen } from "@/components/ui/screen";
import { Brand, Spacing } from "@/constants/theme";
import { MOCK_USER } from "@/data/mocks/employee";
import { loginMock } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/store";

import { LoginFormCard } from "./login-form-card";
import { LoginHero } from "./login-hero";

type LoginErrors = {
  email?: string;
  password?: string;
};

const validateLogin = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 4) {
    errors.password = "Password must be at least 4 characters";
  }

  return errors;
};

export const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(MOCK_USER.email);
  const [password, setPassword] = useState("demo1234");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validateLogin(email, password);
  const showErrors = touched;

  const handleContinue = () => {
    setTouched(true);
    const nextErrors = validateLogin(email, password);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    // Mock auth delay for a clearer sign-in moment.
    setTimeout(() => {
      dispatch(
        loginMock({
          ...MOCK_USER,
          email: email.trim().toLowerCase(),
        }),
      );
      router.replace("/(employee)/today");
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <Screen style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LoginHero />
          <LoginFormCard
            email={email}
            password={password}
            isSubmitting={isSubmitting}
            emailError={showErrors ? errors.email : undefined}
            passwordError={showErrors ? errors.password : undefined}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleContinue}
          />
          <Text style={styles.footer}>
            By continuing you agree to use this demo for product exploration.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    paddingHorizontal: 0,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    justifyContent: "center",
    gap: Spacing.five,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: Brand.muted,
    paddingHorizontal: Spacing.four,
  },
});
