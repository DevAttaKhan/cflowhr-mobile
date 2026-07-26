import { useMemo } from "react";

import type { AttendanceInsightDay } from "@/types/attendance";

export type AttendanceHighlight = {
  id: string;
  label: string;
  value: string;
  hint?: string;
};

export const computeHighlights = (
  daily: AttendanceInsightDay[],
  expectedMonthHours: number,
): AttendanceHighlight[] => {
  const worked = daily.filter((d) => (d.workMinutes ?? 0) > 0);
  const totalMinutes = worked.reduce((s, d) => s + (d.workMinutes ?? 0), 0);
  const lateDays = daily.filter((d) => d.lateMinutes > 0);
  const onTimeEligible = daily.filter(
    (d) =>
      d.status === "PRESENT" ||
      d.status === "LATE" ||
      d.status === "WORK_FROM_HOME",
  );
  const onTime = onTimeEligible.filter((d) => d.lateMinutes === 0).length;
  const punctuality =
    onTimeEligible.length === 0
      ? 100
      : Math.round((onTime / onTimeEligible.length) * 100);

  let streak = 0;
  for (let i = daily.length - 1; i >= 0; i -= 1) {
    const day = daily[i];
    if (!day || day.status === "WEEKEND" || day.status === "HOLIDAY") {
      continue;
    }
    if (day.lateMinutes === 0 && (day.workMinutes ?? 0) > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  const ot = daily.reduce((s, d) => s + d.overtimeMinutes, 0);
  const avgBreak =
    worked.length === 0
      ? 0
      : Math.round(
          worked.reduce((s, d) => s + d.breakMinutes, 0) / worked.length,
        );

  return [
    {
      id: "punctuality",
      label: "Punctuality",
      value: `${punctuality}%`,
      hint: `${lateDays.length} late day${lateDays.length === 1 ? "" : "s"}`,
    },
    {
      id: "hours",
      label: "Month hours",
      value: `${Math.round((totalMinutes / 60) * 10) / 10}h`,
      hint: `of ${expectedMonthHours}h expected`,
    },
    {
      id: "streak",
      label: "On-time streak",
      value: `${streak}d`,
    },
    {
      id: "ot",
      label: "Overtime",
      value: `${Math.round((ot / 60) * 10) / 10}h`,
    },
    {
      id: "break",
      label: "Avg break",
      value: `${avgBreak}m`,
    },
  ];
};

export const weekdayAverages = (daily: AttendanceInsightDay[]) => {
  const buckets = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
  for (const day of daily) {
    if (day.workMinutes == null) {
      continue;
    }
    const weekday = new Date(day.date).getUTCDay();
    const index = weekday === 0 ? 6 : weekday - 1;
    const bucket = buckets[index];
    if (!bucket) {
      continue;
    }
    bucket.sum += day.workMinutes;
    bucket.count += 1;
  }
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, index) => {
    const bucket = buckets[index]!;
    return {
      label,
      hours:
        bucket.count === 0
          ? 0
          : Math.round((bucket.sum / bucket.count / 60) * 10) / 10,
    };
  });
};

export const useMonthKey = (monthKey: string) =>
  useMemo(() => {
    const [y, m] = monthKey.split("-").map(Number);
    const from = `${monthKey}-01`;
    const last = new Date(Date.UTC(y!, m! - 1 + 1, 0)).getUTCDate();
    const to = `${monthKey}-${String(last).padStart(2, "0")}`;
    return { from, to };
  }, [monthKey]);
