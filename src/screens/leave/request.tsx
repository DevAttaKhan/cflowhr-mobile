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
  useGetMyLeaveBalancesQuery,
} from "@/store/apis/leave.api";

export const LeaveRequestScreen = () => {
  const { data: types = [] } = useGetLeaveTypesQuery();
  const { data: balances = [] } = useGetMyLeaveBalancesQuery();
  const [create, { isLoading }] = useCreateLeaveRequestMutation();
  const [leaveTypeId, setLeaveTypeId] = useState(types[0]?.id ?? 1);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reason, setReason] = useState("");
  const [halfDay, setHalfDay] = useState(false);

  const selectedBalance = balances.find(
    (row) => row.leaveTypeId === leaveTypeId,
  );

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
      <View style={styles.hero}>
        <Text style={styles.title}>Request leave</Text>
        <Text style={styles.subtitle}>Your approver will be notified.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Leave type</Text>
        <View style={styles.types}>
          {types.map((type) => {
            const active = leaveTypeId === type.id;
            const balance = balances.find((row) => row.leaveTypeId === type.id);
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
                  {type.name.replace(" Leave", "")}
                </Text>
                {balance ? (
                  <Text
                    style={[
                      styles.typeBalance,
                      active && styles.typeBalanceActive,
                    ]}
                  >
                    {balance.remaining} left
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {selectedBalance ? (
          <Text style={styles.balanceHint}>
            {selectedBalance.remaining} of {selectedBalance.allocated} days
            remaining
            {selectedBalance.pending > 0
              ? ` · ${selectedBalance.pending} pending`
              : ""}
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Start date</Text>
        <TextInput
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          autoCapitalize="none"
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Brand.muted}
          accessibilityLabel="Start date"
        />

        <Text style={[styles.label, styles.labelSpaced]}>End date</Text>
        <TextInput
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
          autoCapitalize="none"
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Brand.muted}
          accessibilityLabel="End date"
        />

        <Pressable
          onPress={() => setHalfDay((value) => !value)}
          style={styles.toggleRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: halfDay }}
        >
          <View style={[styles.checkbox, halfDay && styles.checkboxOn]}>
            {halfDay ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <View style={styles.toggleCopy}>
            <Text style={styles.toggleLabel}>Half day</Text>
            <Text style={styles.toggleHint}>Counts as 0.5 day</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.card}>
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
      </View>

      <AppButton
        label={isLoading ? "Submitting…" : "Submit request"}
        disabled={isLoading || !reason.trim()}
        onPress={() => void handleSubmit()}
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
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  hero: {
    gap: 2,
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
  },
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: Spacing.five,
    gap: Spacing.two,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
    marginBottom: Spacing.one,
  },
  labelSpaced: {
    marginTop: Spacing.three,
  },
  types: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  typeChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.canvas,
    minWidth: "30%",
    flexGrow: 1,
  },
  typeChipActive: {
    backgroundColor: Brand.primaryMuted,
    borderColor: Brand.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  typeTextActive: {
    color: Brand.ink,
  },
  typeBalance: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.muted,
    marginTop: 2,
  },
  typeBalanceActive: {
    color: Brand.inkSoft,
  },
  balanceHint: {
    fontSize: 12,
    color: Brand.muted,
    fontWeight: "500",
    marginTop: Spacing.two,
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
  textarea: {
    minHeight: 110,
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
});
