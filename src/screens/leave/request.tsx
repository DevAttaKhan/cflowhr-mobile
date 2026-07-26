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
import {
  useCreateLeaveRequestMutation,
  useGetLeaveTypesQuery,
} from "@/store/apis/leave.api";

export const LeaveRequestScreen = () => {
  const { data: types = [] } = useGetLeaveTypesQuery();
  const [create, { isLoading }] = useCreateLeaveRequestMutation();
  const [leaveTypeId, setLeaveTypeId] = useState(1);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reason, setReason] = useState("");
  const [halfDay, setHalfDay] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }
    await create({
      leaveTypeId,
      startDate,
      endDate,
      halfDay,
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
      <Text style={styles.title}>Request leave</Text>
      <Text style={styles.subtitle}>We’ll notify your approver.</Text>

      <Text style={styles.label}>Leave type</Text>
      <View style={styles.types}>
        {types.map((type) => {
          const active = leaveTypeId === type.id;
          return (
            <Pressable
              key={type.id}
              onPress={() => setLeaveTypeId(type.id)}
              style={[styles.typeChip, active && styles.typeChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.typeText, active && styles.typeTextActive]}
              >
                {type.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Start date (YYYY-MM-DD)</Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        style={styles.input}
        autoCapitalize="none"
        accessibilityLabel="Start date"
      />

      <Text style={styles.label}>End date (YYYY-MM-DD)</Text>
      <TextInput
        value={endDate}
        onChangeText={setEndDate}
        style={styles.input}
        autoCapitalize="none"
        accessibilityLabel="End date"
      />

      <Pressable
        onPress={() => setHalfDay((v) => !v)}
        style={styles.toggleRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: halfDay }}
      >
        <View style={[styles.checkbox, halfDay && styles.checkboxOn]} />
        <Text style={styles.toggleLabel}>Half day</Text>
      </Pressable>

      <Text style={styles.label}>Reason</Text>
      <TextInput
        value={reason}
        onChangeText={setReason}
        style={[styles.input, styles.textarea]}
        multiline
        placeholder="Why do you need time off?"
        placeholderTextColor={Brand.muted}
        accessibilityLabel="Reason"
      />

      <AppButton
        label={isLoading ? "Submitting…" : "Submit request"}
        disabled={isLoading || !reason.trim()}
        onPress={() => void handleSubmit()}
        style={styles.submit}
      />
      <AppButton
        label="Cancel"
        variant="ghost"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.canvas,
  },
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
    backgroundColor: Brand.secondaryMuted,
    borderColor: Brand.secondary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.muted,
  },
  typeTextActive: {
    color: Brand.ink,
  },
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  checkboxOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Brand.ink,
  },
  submit: {
    marginTop: Spacing.five,
  },
});
