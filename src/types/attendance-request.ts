export type AttendanceRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type AttendanceRequestType =
  | "MISSING_CHECKIN"
  | "MISSING_CHECKOUT"
  | "WRONG_TIME"
  | "FULL_DAY_ABSENT"
  | "WORK_FROM_HOME";

export interface AttendanceRequest {
  id: number;
  employeeId: number;
  attendanceDate: string;
  requestType: AttendanceRequestType;
  requestedCheckIn: string | null;
  requestedCheckOut: string | null;
  reason: string;
  status: AttendanceRequestStatus;
  createdAt: string;
}

export interface CreateAttendanceRequestPayload {
  attendanceDate: string;
  requestType: AttendanceRequestType;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
}

export interface AttendanceRequestsQuery {
  status?: AttendanceRequestStatus;
  employeeId?: number;
}
