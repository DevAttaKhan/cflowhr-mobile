import {
  differenceInCalendarDays,
  format,
  isBefore,
  startOfDay,
} from "date-fns";

import type { LeaveBalance } from "@/types/leave";

export type LeaveRequestFormValues = {
  leaveTypeId: number | null;
  startDate: Date;
  endDate: Date;
  halfDay: boolean;
  reason: string;
};

export type LeaveRequestFormErrors = {
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  halfDay?: string;
  reason?: string;
  days?: string;
};

export const computeLeaveDays = (
  startDate: Date,
  endDate: Date,
  halfDay: boolean,
): number => {
  if (halfDay) {
    return 0.5;
  }
  return differenceInCalendarDays(endDate, startDate) + 1;
};

export const validateLeaveRequest = (
  values: LeaveRequestFormValues,
  balance?: LeaveBalance,
): LeaveRequestFormErrors => {
  const errors: LeaveRequestFormErrors = {};
  const today = startOfDay(new Date());
  const start = startOfDay(values.startDate);
  const end = startOfDay(values.endDate);

  if (!values.leaveTypeId) {
    errors.leaveTypeId = "Select a leave type";
  }

  if (isBefore(start, today)) {
    errors.startDate = "Start date can’t be in the past";
  }

  if (isBefore(end, start)) {
    errors.endDate = "End date must be on or after start date";
  }

  if (values.halfDay && differenceInCalendarDays(end, start) !== 0) {
    errors.halfDay = "Half day is only for a single date";
  }

  const reason = values.reason.trim();
  if (!reason) {
    errors.reason = "Reason is required";
  } else if (reason.length < 5) {
    errors.reason = "Reason must be at least 5 characters";
  } else if (reason.length > 280) {
    errors.reason = "Reason must be under 280 characters";
  }

  const days = computeLeaveDays(start, end, values.halfDay);
  if (balance && days > balance.remaining) {
    errors.days = `Only ${balance.remaining} day${balance.remaining === 1 ? "" : "s"} remaining for this type`;
  }

  if (days <= 0) {
    errors.days = "Select a valid date range";
  }

  return errors;
};

export const hasLeaveFormErrors = (errors: LeaveRequestFormErrors): boolean =>
  Object.keys(errors).length > 0;

export const toDateKey = (date: Date): string => format(date, "yyyy-MM-dd");

export const clampEndDate = (startDate: Date, endDate: Date): Date =>
  isBefore(endDate, startDate) ? startDate : endDate;
