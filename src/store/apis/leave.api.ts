import {
  delay,
  mockLeaveBalances,
  mockLeaveRequests,
  mockLeaveTypes,
} from "@/data/mocks/employee";
import type {
  CreateLeaveRequestPayload,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestsQuery,
  LeaveType,
} from "@/types/leave";
import { apiSlice } from "../api";

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveTypes: builder.query<LeaveType[], void>({
      async queryFn() {
        await delay(200);
        return { data: mockLeaveTypes };
      },
      providesTags: [{ type: "LeaveTypes", id: "LIST" }],
    }),
    getMyLeaveBalances: builder.query<LeaveBalance[], void>({
      async queryFn() {
        await delay(180);
        return { data: mockLeaveBalances };
      },
      providesTags: [{ type: "LeaveBalances", id: "LIST" }],
    }),
    getLeaveRequests: builder.query<LeaveRequest[], LeaveRequestsQuery | void>({
      async queryFn(query) {
        await delay();
        let rows = [...mockLeaveRequests];
        if (query?.status) {
          rows = rows.filter((row) => row.status === query.status);
        }
        return { data: rows };
      },
      providesTags: [{ type: "LeaveRequests", id: "LIST" }],
    }),
    createLeaveRequest: builder.mutation<LeaveRequest, CreateLeaveRequestPayload>({
      async queryFn(body) {
        await delay(400);
        const leaveType = mockLeaveTypes.find((t) => t.id === body.leaveTypeId);
        const created: LeaveRequest = {
          id: Date.now(),
          employeeId: 5,
          leaveTypeId: body.leaveTypeId,
          startDate: body.startDate,
          endDate: body.endDate,
          days:
            body.startDate === body.endDate ? (body.halfDay ? 0.5 : 1) : 2,
          halfDay: Boolean(body.halfDay),
          reason: body.reason ?? null,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          leaveType,
        };
        mockLeaveRequests.unshift(created);
        return { data: created };
      },
      invalidatesTags: [
        { type: "LeaveRequests", id: "LIST" },
        { type: "LeaveBalances", id: "LIST" },
      ],
    }),
    cancelLeaveRequest: builder.mutation<LeaveRequest, number>({
      async queryFn(id) {
        await delay(300);
        const index = mockLeaveRequests.findIndex((row) => row.id === id);
        if (index < 0) {
          return { error: { status: 404, data: "Not found" } };
        }
        const updated = {
          ...mockLeaveRequests[index]!,
          status: "CANCELLED" as const,
        };
        mockLeaveRequests[index] = updated;
        return { data: updated };
      },
      invalidatesTags: [
        { type: "LeaveRequests", id: "LIST" },
        { type: "LeaveBalances", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useGetMyLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useCancelLeaveRequestMutation,
} = leaveApi;
