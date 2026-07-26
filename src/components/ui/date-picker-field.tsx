import { format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MonthCalendar } from "@/components/ui/month-calendar";
import { Brand, Radii, Spacing } from "@/constants/theme";

type DatePickerFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
  disabled?: boolean;
};

export const DatePickerField = ({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  error,
  disabled = false,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [month, setMonth] = useState(startOfMonth(value));

  useEffect(() => {
    if (open) {
      setDraft(value);
      setMonth(startOfMonth(value));
    }
  }, [open, value]);

  const handleConfirm = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${format(value, "MMMM d, yyyy")}`}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          error ? styles.fieldError : null,
          disabled && styles.fieldDisabled,
          pressed && !disabled && styles.fieldPressed,
        ]}
      >
        <Text style={styles.fieldValue}>{format(value, "EEE, MMM d, yyyy")}</Text>
        <Text style={styles.fieldHint}>Calendar</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close calendar"
        >
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <MonthCalendar
              value={draft}
              onChange={setDraft}
              month={month}
              onMonthChange={setMonth}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
            <View style={styles.actions}>
              <Pressable
                onPress={() => setOpen(false)}
                style={styles.secondaryBtn}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={styles.primaryBtn}
                accessibilityRole="button"
                accessibilityLabel="Confirm date"
              >
                <Text style={styles.primaryText}>Confirm</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  field: {
    minHeight: 52,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.canvas,
    paddingHorizontal: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  fieldError: {
    borderColor: Brand.danger,
  },
  fieldDisabled: {
    opacity: 0.55,
  },
  fieldPressed: {
    opacity: 0.9,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Brand.ink,
  },
  fieldHint: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.secondary,
  },
  error: {
    fontSize: 12,
    fontWeight: "600",
    color: Brand.danger,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(18, 20, 26, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Brand.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.five,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Brand.ink,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.inkSoft,
  },
  primaryBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radii.md,
    backgroundColor: Brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
});
