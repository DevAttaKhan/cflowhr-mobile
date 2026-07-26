import { format, startOfDay } from "date-fns";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Brand, Radii, Spacing } from "@/constants/theme";
import {
  useCreateLeaveRequestMutation,
  useGetLeaveTypesQuery,
  useGetMyLeaveBalancesQuery,
} from "@/store/apis/leave.api";

import { LeaveTypePicker } from "./leave-type-picker";
import {
  clampEndDate,
  computeLeaveDays,
  hasLeaveFormErrors,
  toDateKey,
  validateLeaveRequest,
  type LeaveRequestFormErrors,
} from "./validate-leave-request";

export const LeaveRequestScreen = () => {
  const { data: types = [] } = useGetLeaveTypesQuery();
  const { data: balances = [] } = useGetMyLeaveBalancesQuery();
  const [create, { isLoading }] = useCreateLeaveRequestMutation();

  const [leaveTypeId, setLeaveTypeId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()));
  const [endDate, setEndDate] = useState(() => startOfDay(new Date()));
  const [reason, setReason] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (leaveTypeId == null && types[0]) {
      setLeaveTypeId(types[0].id);
    }
  }, [leaveTypeId, types]);

  const selectedBalance = balances.find(
    (row) => row.leaveTypeId === leaveTypeId,
  );

  const values = useMemo(
    () => ({
      leaveTypeId,
      startDate,
      endDate,
      halfDay,
      reason,
    }),
    [endDate, halfDay, leaveTypeId, reason, startDate],
  );

  const errors: LeaveRequestFormErrors = useMemo(
    () => validateLeaveRequest(values, selectedBalance),
    [selectedBalance, values],
  );

  const showErrors = touched;
  const days = computeLeaveDays(startDate, endDate, halfDay);

  const handleStartChange = (date: Date) => {
    const nextStart = startOfDay(date);
    setStartDate(nextStart);
    setEndDate((current) =>
      halfDay ? nextStart : clampEndDate(nextStart, current),
    );
  };

  const handleEndChange = (date: Date) => {
    const nextEnd = startOfDay(date);
    setEndDate(clampEndDate(startDate, nextEnd));
    if (halfDay && toDateKey(nextEnd) !== toDateKey(startDate)) {
      setHalfDay(false);
    }
  };

  const handleHalfDayToggle = () => {
    setHalfDay((current) => {
      const next = !current;
      if (next) {
        setEndDate(startDate);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setTouched(true);
    setSubmitError(null);
    const nextErrors = validateLeaveRequest(values, selectedBalance);
    if (hasLeaveFormErrors(nextErrors)) {
      return;
    }
    if (!leaveTypeId) {
      return;
    }

    try {
      await create({
        leaveTypeId,
        startDate: toDateKey(startDate),
        endDate: toDateKey(endDate),
        halfDay,
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
          <Text style={styles.title}>Request leave</Text>
          <Text style={styles.subtitle}>
            Pick dates and share a short reason for your approver.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>
            {halfDay ? "0.5" : days}
            <Text style={styles.summaryUnit}>
              {" "}
              day{days === 1 && !halfDay ? "" : "s"}
            </Text>
          </Text>
          <Text style={styles.summaryRange}>
            {format(startDate, "MMM d")}
            {toDateKey(startDate) !== toDateKey(endDate)
              ? ` – ${format(endDate, "MMM d")}`
              : ""}
            {selectedBalance
              ? ` · ${selectedBalance.remaining} remaining`
              : ""}
          </Text>
          {showErrors && errors.days ? (
            <Text style={styles.error}>{errors.days}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <LeaveTypePicker
            types={types}
            balances={balances}
            value={leaveTypeId}
            onChange={setLeaveTypeId}
            error={showErrors ? errors.leaveTypeId : undefined}
          />
          {selectedBalance ? (
            <Text style={styles.balanceHint}>
              {selectedBalance.remaining} of {selectedBalance.allocated} days
              left
              {selectedBalance.pending > 0
                ? ` · ${selectedBalance.pending} pending`
                : ""}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <DatePickerField
            label="Start date"
            value={startDate}
            onChange={handleStartChange}
            minimumDate={startOfDay(new Date())}
            error={showErrors ? errors.startDate : undefined}
          />

          <View style={styles.fieldGap} />

          <DatePickerField
            label="End date"
            value={endDate}
            onChange={handleEndChange}
            minimumDate={startDate}
            error={showErrors ? errors.endDate : undefined}
            disabled={halfDay}
          />

          <Pressable
            onPress={handleHalfDayToggle}
            style={styles.toggleRow}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: halfDay }}
          >
            <View style={[styles.checkbox, halfDay && styles.checkboxOn]}>
              {halfDay ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <View style={styles.toggleCopy}>
              <Text style={styles.toggleLabel}>Half day</Text>
              <Text style={styles.toggleHint}>
                Uses a single date and counts as 0.5 day
              </Text>
            </View>
          </Pressable>
          {showErrors && errors.halfDay ? (
            <Text style={styles.error}>{errors.halfDay}</Text>
          ) : null}
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
            placeholder="Why do you need time off?"
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
  summaryCard: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -1,
  },
  summaryUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: Brand.muted,
  },
  summaryRange: {
    fontSize: 13,
    color: Brand.inkSoft,
    fontWeight: "500",
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
    gap: Spacing.two,
  },
  balanceHint: {
    fontSize: 12,
    color: Brand.muted,
    fontWeight: "500",
    marginTop: Spacing.one,
  },
  fieldGap: {
    height: Spacing.three,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  reasonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.one,
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: "800",
    color: Brand.ink,
  },
  toggleCopy: {
    flex: 1,
    gap: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Brand.ink,
  },
  toggleHint: {
    fontSize: 12,
    color: Brand.muted,
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
    marginTop: Spacing.one,
  },
});
