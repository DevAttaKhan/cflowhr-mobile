import type { AttendanceEventType, MeWorkLocation, TodayAttendance } from "@/types/attendance";
import {
  delay,
  mockLocations,
  mockToday,
  getMockInsights,
} from "@/data/mocks/employee";
import { apiSlice } from "../api";

const applyPunch = (
  current: TodayAttendance,
  type: AttendanceEventType,
): TodayAttendance => {
  const now = new Date().toISOString();
  const next = { ...current };

  if (type === "CHECK_IN") {
    next.checkedIn = true;
    next.checkedOut = false;
    next.onBreak = false;
    next.nextPunch = "BREAK_IN";
    next.status = "PRESENT";
    next.checkIn = {
      id: Date.now(),
      timestamp: now,
      verification: "VERIFIED",
      method: "MOBILE",
    };
  } else if (type === "BREAK_IN") {
    next.onBreak = true;
    next.nextPunch = "BREAK_OUT";
    next.breakIn = {
      id: Date.now(),
      timestamp: now,
      verification: "VERIFIED",
      method: "MOBILE",
    };
  } else if (type === "BREAK_OUT") {
    next.onBreak = false;
    next.nextPunch = "CHECK_OUT";
    next.breakOut = {
      id: Date.now(),
      timestamp: now,
      verification: "VERIFIED",
      method: "MOBILE",
    };
    next.breakMinutes = Math.max(next.breakMinutes, 15);
  } else if (type === "CHECK_OUT") {
    next.checkedOut = true;
    next.onBreak = false;
    next.nextPunch = null;
    next.checkOut = {
      id: Date.now(),
      timestamp: now,
      verification: "VERIFIED",
      method: "MOBILE",
    };
    next.workMinutes = Math.max(next.workMinutes ?? 0, 420);
  }

  Object.assign(mockToday, next);
  return { ...mockToday };
};

export const meAttendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAttendanceToday: builder.query<TodayAttendance, void>({
      async queryFn() {
        await delay();
        return { data: { ...mockToday } };
      },
      providesTags: [{ type: "MeAttendance", id: "TODAY" }],
    }),
    punchMyAttendance: builder.mutation<
      TodayAttendance,
      { type: AttendanceEventType }
    >({
      async queryFn({ type }) {
        await delay(280);
        return { data: applyPunch(mockToday, type) };
      },
      invalidatesTags: [{ type: "MeAttendance", id: "TODAY" }],
    }),
    getMyAttendanceInsights: builder.query<
      ReturnType<typeof getMockInsights>,
      { from: string; to: string }
    >({
      async queryFn({ from, to }) {
        await delay();
        return { data: getMockInsights(from, to) };
      },
      providesTags: [{ type: "MeAttendance", id: "INSIGHTS" }],
    }),
    getMyWorkLocations: builder.query<MeWorkLocation[], void>({
      async queryFn() {
        await delay(200);
        return { data: mockLocations };
      },
      providesTags: [{ type: "MeAttendance", id: "LOCATIONS" }],
    }),
  }),
});

export const {
  useGetMyAttendanceTodayQuery,
  usePunchMyAttendanceMutation,
  useGetMyAttendanceInsightsQuery,
  useGetMyWorkLocationsQuery,
} = meAttendanceApi;
