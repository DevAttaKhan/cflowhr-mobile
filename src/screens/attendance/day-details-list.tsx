import { format, parseISO } from "date-fns";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radii, Spacing, StatusColors } from "@/constants/theme";
import type { AttendanceInsightDay } from "@/types/attendance";
import {
  formatMinutesAsHours,
  formatStatusLabel,
} from "@/utils/format-minutes";

type DayDetailsListProps = {
  days: AttendanceInsightDay[];
  showWeekends: boolean;
  onToggleWeekends: () => void;
};

const expectedDayMinutes = 480;

export const DayDetailsList = ({
  days,
  showWeekends,
  onToggleWeekends,
}: DayDetailsListProps) => (
  <View style={styles.wrap}>
    <View style={styles.header}>
      <Text style={styles.title}>Day details</Text>
      <Pressable
        onPress={onToggleWeekends}
        accessibilityRole="button"
        accessibilityLabel="Toggle weekends"
      >
        <Text style={styles.toggle}>
          {showWeekends ? "Hide weekends" : "Show weekends"}
        </Text>
      </Pressable>
    </View>

    <View style={styles.list}>
      {days.map((day, index) => {
        const statusColor = StatusColors[day.status] ?? Brand.muted;
        const workMinutes = day.workMinutes ?? 0;
        const progress =
          day.status === "WEEKEND" || day.status === "HOLIDAY"
            ? 0
            : Math.min(1, workMinutes / expectedDayMinutes);
        const checkIn = day.checkInAt
          ? format(new Date(day.checkInAt), "h:mm a")
          : null;

        return (
          <View
            key={day.date}
            style={[styles.row, index < days.length - 1 && styles.rowBorder]}
          >
            <View style={styles.main}>
              <View style={styles.top}>
                <View style={styles.dateBlock}>
                  <Text style={styles.weekday}>
                    {format(parseISO(day.date), "EEE")}
                  </Text>
                  <Text style={styles.dayNum}>
                    {format(parseISO(day.date), "d")}
                  </Text>
                </View>

                <View style={styles.meta}>
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: statusColor }]}
                    />
                    <Text style={styles.statusLabel}>
                      {formatStatusLabel(day.status)}
                    </Text>
                  </View>
                  <Text style={styles.subMeta}>
                    {checkIn ? `In ${checkIn}` : "No check-in"}
                    {day.breakMinutes > 0
                      ? ` · Break ${formatMinutesAsHours(day.breakMinutes)}`
                      : ""}
                  </Text>
                </View>

                <View style={styles.hoursBlock}>
                  <Text style={styles.hours}>
                    {formatMinutesAsHours(day.workMinutes)}
                  </Text>
                  {day.lateMinutes > 0 ? (
                    <Text style={styles.late}>+{day.lateMinutes}m</Text>
                  ) : day.overtimeMinutes > 0 ? (
                    <Text style={styles.ot}>
                      OT {formatMinutesAsHours(day.overtimeMinutes)}
                    </Text>
                  ) : null}
                </View>
              </View>

              {day.status !== "WEEKEND" && day.status !== "HOLIDAY" ? (
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${progress * 100}%`,
                        backgroundColor: statusColor,
                      },
                    ]}
                  />
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Brand.ink,
  },
  toggle: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.secondary,
  },
  list: {
    backgroundColor: Brand.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  main: {
    gap: Spacing.three,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  dateBlock: {
    width: 40,
    alignItems: "center",
  },
  weekday: {
    fontSize: 11,
    fontWeight: "600",
    color: Brand.muted,
    textTransform: "uppercase",
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "700",
    color: Brand.ink,
    letterSpacing: -0.4,
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Brand.ink,
  },
  subMeta: {
    fontSize: 12,
    color: Brand.muted,
    fontWeight: "500",
  },
  hoursBlock: {
    alignItems: "flex-end",
    minWidth: 52,
  },
  hours: {
    fontSize: 14,
    fontWeight: "700",
    color: Brand.ink,
  },
  late: {
    fontSize: 11,
    color: Brand.warning,
    fontWeight: "600",
    marginTop: 2,
  },
  ot: {
    fontSize: 11,
    color: Brand.secondary,
    fontWeight: "600",
    marginTop: 2,
  },
  track: {
    height: 3,
    borderRadius: Radii.full,
    backgroundColor: Brand.canvasTint,
    overflow: "hidden",
    marginLeft: 52,
  },
  fill: {
    height: "100%",
    borderRadius: Radii.full,
  },
});
