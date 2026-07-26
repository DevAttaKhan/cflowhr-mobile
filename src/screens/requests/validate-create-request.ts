import {
  isAfter,
  isBefore,
  startOfDay,
  subDays,
} from "date-fns";

import type { AttendanceRequestType } from "@/types/attendance-request";

export type CreateRequestFormValues = {
  requestType: AttendanceRequestType | null;
  attendanceDate: Date;
  reason: string;
};

export type CreateRequestFormErrors = {
  requestType?: string;
  attendanceDate?: string;
  reason?: string;
};

export const validateCreateRequest = (
  values: CreateRequestFormValues,
): CreateRequestFormErrors => {
  const errors: CreateRequestFormErrors = {};
  const today = startOfDay(new Date());
  const date = startOfDay(values.attendanceDate);
  const earliest = subDays(today, 60);

  if (!values.requestType) {
    errors.requestType = "Select a request type";
  }

  if (isAfter(date, today)) {
    errors.attendanceDate = "Date can’t be in the future";
  } else if (isBefore(date, earliest)) {
    errors.attendanceDate = "Date must be within the last 60 days";
  }

  const reason = values.reason.trim();
  if (!reason) {
    errors.reason = "Reason is required";
  } else if (reason.length < 5) {
    errors.reason = "Reason must be at least 5 characters";
  } else if (reason.length > 280) {
    errors.reason = "Reason must be under 280 characters";
  }

  return errors;
};

export const hasCreateRequestErrors = (
  errors: CreateRequestFormErrors,
): boolean => Object.keys(errors).length > 0;
