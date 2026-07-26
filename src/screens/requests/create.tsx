import { format, startOfDay, subDays } from "date-fns";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Brand, Radii, Spacing } from "@/constants/theme";
import { useCreateAttendanceRequestMutation } from "@/store/apis/attendance-request.api";
import type { AttendanceRequestType } from "@/types/attendance-request";

import { RequestTypePicker } from "./request-type-picker";
import {
  hasCreateRequestErrors,
  validateCreateRequest,
} from "./validate-create-request";

const TYPES: AttendanceRequestType[] = [
  "MISSING_CHECKIN",
  "MISSING_CHECKOUT",
  "WRONG_TIME",
  "FULL_DAY_ABSENT",
  "WORK_FROM_HOME",
];

export const CreateRequestScreen = () => {
  const [create, { isLoading }] = useCreateAttendanceRequestMutation();
  const [requestType, setRequestType] =
    useState<AttendanceRequestType>("MISSING_CHECKOUT");
  const [attendanceDate, setAttendanceDate] = useState(() =>
    startOfDay(new Date()),
  );
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const values = useMemo(
    () => ({
      requestType,
      attendanceDate,
      reason,
    }),
    [attendanceDate, reason, requestType],
  );

  const errors = useMemo(() => validateCreateRequest(values), [values]);
  const showErrors = touched;

  const handleSubmit = async () => {
    setTouched(true);
    setSubmitError(null);
    const nextErrors = validateCreateRequest(values);
    if (hasCreateRequestErrors(nextErrors) || !requestType) {
      return;
    }

    try {
      await create({
        attendanceDate: format(attendanceDate, "yyyy-MM-dd"),
        requestType,
        reason: reason.trim(),
      }).unwrap();
      router.back();
    } catch {
      setSubmitError("Couldn’t submit your request. Try again.");
      Alert.alert("Request failed", "Please try again in a moment.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>New request</Text>
          <Text style={styles.subtitle}>
            Correct a missing punch or wrong attendance day.
          </Text>
        </View>

        <View style={styles.card}>
          <RequestTypePicker
            types={TYPES}
            value={requestType}
            onChange={setRequestType}
            error={showErrors ? errors.requestType : undefined}
          />
        </View>

        <View style={styles.card}>
          <DatePickerField
            label="Attendance date"
            value={attendanceDate}
            onChange={(date) => setAttendanceDate(startOfDay(date))}
            minimumDate={subDays(startOfDay(new Date()), 60)}
            maximumDate={startOfDay(new Date())}
            error={showErrors ? errors.attendanceDate : undefined}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.reasonHeader}>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.counter}>{reason.trim().length}/280</Text>
          </View>
          <TextInput
            value={reason}
            onChangeText={setReason}
            style={[
              styles.input,
              styles.textarea,
              showErrors && errors.reason ? styles.inputError : null,
            ]}
            multiline
            maxLength={280}
            placeholder="What happened?"
            placeholderTextColor={Brand.muted}
            accessibilityLabel="Reason"
          />
          {showErrors && errors.reason ? (
            <Text style={styles.error}>{errors.reason}</Text>
          ) : null}
        </View>

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

        <AppButton
          label={isLoading ? "Submitting…" : "Submit request"}
          disabled={isLoading}
          onPress={() => void handleSubmit()}
        />
        <AppButton
          label="Cancel"
          variant="ghost"
          onPress={() => router.back()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: Brand.canvas,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  hero: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: Brand.muted,
    fontWeight: "500",
    lineHeight: 18,
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
    gap: Spacing.two,
  },
  reasonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  counter: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.muted,
  },
  input: {
    minHeight: 48,
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
  textarea: {
    minHeight: 120,
    paddingTop: Spacing.three,
    textAlignVertical: "top",
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
    marginTop: Spacing.one,
  },
});
