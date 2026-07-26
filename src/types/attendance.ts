export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "ON_LEAVE"
  | "HOLIDAY"
  | "WEEKEND"
  | "WORK_FROM_HOME";

export type AttendanceEventType =
  | "CHECK_IN"
  | "CHECK_OUT"
  | "BREAK_IN"
  | "BREAK_OUT";

export type LocationVerificationStatus =
  | "VERIFIED"
  | "OUTSIDE_FENCE"
  | "MOCK_GPS_DETECTED"
  | "LOW_ACCURACY"
  | "WIFI_VERIFIED"
  | "UNVERIFIED";

export interface AttendanceEvent {
  id: number;
  timestamp: string;
  verification: LocationVerificationStatus | null;
  method: string | null;
}

export interface TodayShiftSummary {
  startTime: string;
  endTime: string;
  breakMinutes: number;
  expectedWorkMinutes: number;
}

export interface TodayAttendance {
  id: number;
  employeeId: number;
  date: string;
  status: AttendanceStatus;
  workMinutes: number | null;
  breakMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  checkedIn: boolean;
  checkedOut: boolean;
  onBreak: boolean;
  nextPunch: AttendanceEventType | null;
  shift: TodayShiftSummary | null;
  checkIn?: AttendanceEvent | null;
  checkOut?: AttendanceEvent | null;
  breakIn?: AttendanceEvent | null;
  breakOut?: AttendanceEvent | null;
}

export interface PunchAttendancePayload {
  type: AttendanceEventType;
  lat?: number;
  lng?: number;
  accuracyMeters?: number;
}

export interface MeWorkLocation {
  id: number;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  radiusMeters: number;
  isPrimary: boolean;
}

export interface AttendanceInsightDay {
  date: string;
  status: AttendanceStatus;
  workMinutes: number | null;
  lateMinutes: number;
  overtimeMinutes: number;
  breakMinutes: number;
  checkInAt: string | null;
  isSynthetic: boolean;
}

export interface AttendanceInsightWeek {
  week: string;
  workMinutes: number;
  workHours: number;
  expectedMinutes: number;
  expectedHours: number;
}

export interface AttendanceInsightMonth {
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  weekend: number;
  holiday: number;
  workFromHome: number;
  halfDay: number;
  totalWorkMinutes: number;
  totalWorkHours: number;
  avgWorkHours: number;
  workedDays: number;
}

export interface AttendanceInsights {
  daily: AttendanceInsightDay[];
  weekly: AttendanceInsightWeek[];
  month: AttendanceInsightMonth;
  expectedWeeklyHours: number;
  expectedMonthHours: number;
}

export interface AttendanceRangeQuery {
  from?: string;
  to?: string;
}
