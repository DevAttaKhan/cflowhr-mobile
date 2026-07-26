import { format } from "date-fns";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { Brand, Radii, Spacing } from "@/constants/theme";
import { useCreateAttendanceRequestMutation } from "@/store/apis/attendance-request.api";
import type { AttendanceRequestType } from "@/types/attendance-request";
import { formatStatusLabel } from "@/utils/format-minutes";

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
  const [attendanceDate, setAttendanceDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }
    await create({
      attendanceDate,
      requestType,
      reason: reason.trim(),
    }).unwrap();
    router.back();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>New attendance request</Text>
      <Text style={styles.subtitle}>
        Explain the correction you need for a past day.
      </Text>

      <Text style={styles.label}>Type</Text>
      <View style={styles.types}>
        {TYPES.map((type) => {
          const active = requestType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setRequestType(type)}
              style={[styles.typeChip, active && styles.typeChipActive]}
            >
              <Text style={[styles.typeText, active && styles.typeTextActive]}>
                {formatStatusLabel(type)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Attendance date (YYYY-MM-DD)</Text>
      <TextInput
        value={attendanceDate}
        onChangeText={setAttendanceDate}
        style={styles.input}
        autoCapitalize="none"
        accessibilityLabel="Attendance date"
      />

      <Text style={styles.label}>Reason</Text>
      <TextInput
        value={reason}
        onChangeText={setReason}
        style={[styles.input, styles.textarea]}
        multiline
        placeholder="What happened?"
        placeholderTextColor={Brand.muted}
        accessibilityLabel="Reason"
      />

      <AppButton
        label={isLoading ? "Submitting…" : "Submit request"}
        disabled={isLoading || !reason.trim()}
        onPress={() => void handleSubmit()}
        style={styles.submit}
      />
      <AppButton label="Cancel" variant="ghost" onPress={() => router.back()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.canvas },
  content: {
    padding: Spacing.five,
    gap: Spacing.two,
    paddingBottom: Spacing.seven,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Brand.ink,
  },
  subtitle: {
    fontSize: 14,
    color: Brand.muted,
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
    marginTop: Spacing.three,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  typeChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  typeChipActive: {
    backgroundColor: Brand.primaryMuted,
    borderColor: Brand.primary,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
  typeTextActive: { color: Brand.ink },
  input: {
    minHeight: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingHorizontal: Spacing.four,
    backgroundColor: Brand.surface,
    color: Brand.ink,
    fontSize: 15,
  },
  textarea: {
    minHeight: 110,
    paddingTop: Spacing.three,
    textAlignVertical: "top",
  },
  submit: { marginTop: Spacing.five },
});
