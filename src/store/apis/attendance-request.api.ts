import { delay, mockAttendanceRequests } from "@/data/mocks/employee";
import type {
  AttendanceRequest,
  AttendanceRequestsQuery,
  CreateAttendanceRequestPayload,
} from "@/types/attendance-request";
import { apiSlice } from "../api";

export const attendanceRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRequests: builder.query<
      AttendanceRequest[],
      AttendanceRequestsQuery | void
    >({
      async queryFn(query) {
        await delay();
        let rows = [...mockAttendanceRequests];
        if (query?.status) {
          rows = rows.filter((row) => row.status === query.status);
        }
        return { data: rows };
      },
      providesTags: [{ type: "AttendanceRequests", id: "LIST" }],
    }),
    createAttendanceRequest: builder.mutation<
      AttendanceRequest,
      CreateAttendanceRequestPayload
    >({
      async queryFn(body) {
        await delay(400);
        const created: AttendanceRequest = {
          id: Date.now(),
          employeeId: 5,
          attendanceDate: body.attendanceDate,
          requestType: body.requestType,
          requestedCheckIn: body.requestedCheckIn ?? null,
          requestedCheckOut: body.requestedCheckOut ?? null,
          reason: body.reason,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
        mockAttendanceRequests.unshift(created);
        return { data: created };
      },
      invalidatesTags: [{ type: "AttendanceRequests", id: "LIST" }],
    }),
    cancelAttendanceRequest: builder.mutation<AttendanceRequest, number>({
      async queryFn(id) {
        await delay(300);
        const index = mockAttendanceRequests.findIndex((row) => row.id === id);
        if (index < 0) {
          return { error: { status: 404, data: "Not found" } };
        }
        const updated = {
          ...mockAttendanceRequests[index]!,
          status: "CANCELLED" as const,
        };
        mockAttendanceRequests[index] = updated;
        return { data: updated };
      },
      invalidatesTags: [{ type: "AttendanceRequests", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAttendanceRequestsQuery,
  useCreateAttendanceRequestMutation,
  useCancelAttendanceRequestMutation,
} = attendanceRequestApi;
