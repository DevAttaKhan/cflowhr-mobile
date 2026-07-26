import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getISOWeek,
  startOfMonth,
  subMonths,
} from "date-fns";

import type {
  AttendanceInsightDay,
  AttendanceInsights,
  AttendanceStatus,
  MeWorkLocation,
  TodayAttendance,
} from "@/types/attendance";
import type { AttendanceRequest } from "@/types/attendance-request";
import type { AuthUser } from "@/types/auth";
import type { LeaveRequest, LeaveType } from "@/types/leave";

export const MOCK_USER: AuthUser = {
  id: 10,
  email: "atta@cflowhr.com",
  fullName: "Atta Ur Rahman",
  employeeId: 5,
  employeeCode: "EMP-120",
};

const today = new Date();
const todayKey = format(today, "yyyy-MM-dd");

export let mockToday: TodayAttendance = {
  id: 1,
  employeeId: MOCK_USER.employeeId,
  date: todayKey,
  status: "PRESENT",
  workMinutes: 185,
  breakMinutes: 0,
  overtimeMinutes: 0,
  lateMinutes: 0,
  earlyLeaveMinutes: 0,
  checkedIn: true,
  checkedOut: false,
  onBreak: false,
  nextPunch: "BREAK_IN",
  shift: {
    startTime: "09:00",
    endTime: "18:00",
    breakMinutes: 60,
    expectedWorkMinutes: 480,
  },
  checkIn: {
    id: 1,
    timestamp: `${todayKey}T09:02:00.000Z`,
    verification: "VERIFIED",
    method: "MOBILE",
  },
  checkOut: null,
  breakIn: null,
  breakOut: null,
};

export const mockLocations: MeWorkLocation[] = [
  {
    id: 1,
    name: "HQ",
    address: "Blue Area, Islamabad",
    lat: 33.72,
    lng: 73.06,
    radiusMeters: 120,
    isPrimary: true,
  },
  {
    id: 2,
    name: "Satellite Office",
    address: "F-7 Markaz",
    lat: 33.72,
    lng: 73.05,
    radiusMeters: 80,
    isPrimary: false,
  },
];

const scenarioCycle: AttendanceStatus[] = [
  "PRESENT",
  "LATE",
  "PRESENT",
  "WORK_FROM_HOME",
  "HALF_DAY",
  "ABSENT",
  "ON_LEAVE",
  "PRESENT",
  "LATE",
  "PRESENT",
];

const buildInsightsForMonth = (monthDate: Date): AttendanceInsights => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start, end });
  const daily: AttendanceInsightDay[] = [];
  const weekMap = new Map<string, { work: number; expected: number }>();

  for (const day of days) {
    const weekday = day.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const key = format(day, "yyyy-MM-dd");
    let status: AttendanceStatus = "WEEKEND";
    let workMinutes: number | null = null;
    let lateMinutes = 0;
    let overtimeMinutes = 0;
    let breakMinutes = 0;
    let checkInAt: string | null = null;

    if (!isWeekend) {
      status = scenarioCycle[day.getDate() % scenarioCycle.length] ?? "PRESENT";
      if (status === "ABSENT" || status === "ON_LEAVE" || status === "HOLIDAY") {
        workMinutes = null;
      } else if (status === "HALF_DAY") {
        workMinutes = 240;
        breakMinutes = 0;
        checkInAt = `${key}T09:00:00.000Z`;
      } else if (status === "LATE") {
        workMinutes = 450;
        lateMinutes = 25;
        breakMinutes = 60;
        overtimeMinutes = 0;
        checkInAt = `${key}T09:25:00.000Z`;
      } else {
        workMinutes = 480 + (day.getDate() % 3 === 0 ? 75 : 0);
        breakMinutes = 60;
        overtimeMinutes = day.getDate() % 3 === 0 ? 75 : 0;
        checkInAt = `${key}T09:0${day.getDate() % 5}:00.000Z`;
      }

      const weekKey = `W${getISOWeek(day)}`;
      const bucket = weekMap.get(weekKey) ?? { work: 0, expected: 480 };
      bucket.expected += 480;
      bucket.work += workMinutes ?? 0;
      weekMap.set(weekKey, bucket);
    }

    daily.push({
      date: key,
      status,
      workMinutes,
      lateMinutes,
      overtimeMinutes,
      breakMinutes,
      checkInAt,
      isSynthetic: false,
    });
  }

  const weekly = Array.from(weekMap.entries()).map(([week, value]) => ({
    week,
    workMinutes: value.work,
    workHours: Math.round((value.work / 60) * 10) / 10,
    expectedMinutes: value.expected,
    expectedHours: Math.round((value.expected / 60) * 10) / 10,
  }));

  const worked = daily.filter((d) => (d.workMinutes ?? 0) > 0);
  const totalWork = worked.reduce((sum, d) => sum + (d.workMinutes ?? 0), 0);

  return {
    daily,
    weekly,
    month: {
      present: daily.filter((d) => d.status === "PRESENT").length,
      late: daily.filter((d) => d.status === "LATE").length,
      absent: daily.filter((d) => d.status === "ABSENT").length,
      onLeave: daily.filter((d) => d.status === "ON_LEAVE").length,
      weekend: daily.filter((d) => d.status === "WEEKEND").length,
      holiday: daily.filter((d) => d.status === "HOLIDAY").length,
      workFromHome: daily.filter((d) => d.status === "WORK_FROM_HOME").length,
      halfDay: daily.filter((d) => d.status === "HALF_DAY").length,
      totalWorkMinutes: totalWork,
      totalWorkHours: Math.round((totalWork / 60) * 10) / 10,
      avgWorkHours:
        worked.length === 0
          ? 0
          : Math.round((totalWork / worked.length / 60) * 10) / 10,
      workedDays: worked.length,
    },
    expectedWeeklyHours: 40,
    expectedMonthHours: Math.round((weekly.reduce((s, w) => s + w.expectedMinutes, 0) / 60) * 10) / 10,
  };
};

export const getMockInsights = (from?: string, to?: string): AttendanceInsights => {
  const base = from ? new Date(from) : today;
  return buildInsightsForMonth(base);
};

// Keep previous month available for picker demos
void subMonths;
void addDays;

export const mockLeaveTypes: LeaveType[] = [
  { id: 1, name: "Annual Leave", code: "ANNUAL", isPaid: true },
  { id: 2, name: "Sick Leave", code: "SICK", isPaid: true },
  { id: 3, name: "Casual Leave", code: "CASUAL", isPaid: true },
];

export let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeId: MOCK_USER.employeeId,
    leaveTypeId: 1,
    startDate: format(addDays(today, 5), "yyyy-MM-dd"),
    endDate: format(addDays(today, 7), "yyyy-MM-dd"),
    days: 3,
    halfDay: false,
    reason: "Family trip",
    status: "PENDING",
    createdAt: today.toISOString(),
    leaveType: mockLeaveTypes[0],
  },
  {
    id: 2,
    employeeId: MOCK_USER.employeeId,
    leaveTypeId: 2,
    startDate: format(subMonths(today, 1), "yyyy-MM-dd"),
    endDate: format(subMonths(today, 1), "yyyy-MM-dd"),
    days: 1,
    halfDay: false,
    reason: "Fever",
    status: "APPROVED",
    createdAt: subMonths(today, 1).toISOString(),
    leaveType: mockLeaveTypes[1],
  },
  {
    id: 3,
    employeeId: MOCK_USER.employeeId,
    leaveTypeId: 3,
    startDate: format(addDays(today, -12), "yyyy-MM-dd"),
    endDate: format(addDays(today, -12), "yyyy-MM-dd"),
    days: 1,
    halfDay: true,
    reason: "Personal errand",
    status: "CANCELLED",
    createdAt: addDays(today, -14).toISOString(),
    leaveType: mockLeaveTypes[2],
  },
];

export let mockAttendanceRequests: AttendanceRequest[] = [
  {
    id: 1,
    employeeId: MOCK_USER.employeeId,
    attendanceDate: format(addDays(today, -3), "yyyy-MM-dd"),
    requestType: "MISSING_CHECKOUT",
    requestedCheckIn: null,
    requestedCheckOut: `${format(addDays(today, -3), "yyyy-MM-dd")}T18:05:00.000Z`,
    reason: "Forgot to check out after standup",
    status: "PENDING",
    createdAt: addDays(today, -2).toISOString(),
  },
  {
    id: 2,
    employeeId: MOCK_USER.employeeId,
    attendanceDate: format(addDays(today, -8), "yyyy-MM-dd"),
    requestType: "WORK_FROM_HOME",
    requestedCheckIn: `${format(addDays(today, -8), "yyyy-MM-dd")}T09:10:00.000Z`,
    requestedCheckOut: `${format(addDays(today, -8), "yyyy-MM-dd")}T18:00:00.000Z`,
    reason: "Internet outage at office",
    status: "APPROVED",
    createdAt: addDays(today, -7).toISOString(),
  },
];

export const delay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));
