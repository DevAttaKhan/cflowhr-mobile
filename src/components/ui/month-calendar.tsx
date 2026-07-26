import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing } from "@/constants/theme";

type MonthCalendarProps = {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  month: Date;
  onMonthChange: (month: Date) => void;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_SIZE = 36;

export const MonthCalendar = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  month,
  onMonthChange,
}: MonthCalendarProps) => {
  const min = minimumDate ? startOfDay(minimumDate) : undefined;
  const max = maximumDate ? startOfDay(maximumDate) : undefined;
  const selected = startOfDay(value);

  const monthStart = startOfMonth(month);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(endOfMonth(monthStart));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const handleSelect = (day: Date) => {
    const next = startOfDay(day);
    if (min && isBefore(next, min)) {
      return;
    }
    if (max && isBefore(max, next)) {
      return;
    }
    onChange(next);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => onMonthChange(subMonths(month, 1))}
          style={styles.navBtn}
        >
          <Text style={styles.navText}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{format(month, "MMMM yyyy")}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => onMonthChange(addMonths(month, 1))}
          style={styles.navBtn}
        >
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((label) => (
          <Text key={label} style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthStart);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());
          const disabled =
            (min ? isBefore(startOfDay(day), min) : false) ||
            (max ? isBefore(max, startOfDay(day)) : false);

          return (
            <Pressable
              key={day.toISOString()}
              disabled={disabled}
              onPress={() => handleSelect(day)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
              accessibilityLabel={format(day, "MMMM d, yyyy")}
              style={[styles.dayCell, disabled && styles.dayDisabled]}
            >
              <View
                style={[
                  styles.dayBubble,
                  isSelected && styles.daySelected,
                  isToday && !isSelected && styles.dayToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    !inMonth && styles.dayOutside,
                    isSelected && styles.dayTextSelected,
                    disabled && styles.dayTextDisabled,
                  ]}
                >
                  {format(day, "d")}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 22,
    color: Brand.inkSoft,
    lineHeight: 26,
    textAlign: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Brand.ink,
  },
  weekRow: {
    flexDirection: "row",
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: Brand.muted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.2857%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBubble: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: Brand.primary,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: Brand.secondary,
  },
  dayDisabled: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: Brand.ink,
    textAlign: "center",
    lineHeight: 16,
    includeFontPadding: false,
  },
  dayOutside: {
    color: Brand.muted,
  },
  dayTextSelected: {
    color: Brand.ink,
    fontWeight: "800",
  },
  dayTextDisabled: {
    color: Brand.muted,
  },
});
