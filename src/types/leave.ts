export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveType {
  id: number;
  name: string;
  code: string;
  isPaid: boolean;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  days: number;
  halfDay: boolean;
  reason: string | null;
  status: LeaveStatus;
  createdAt: string;
  leaveType?: LeaveType;
}

export interface CreateLeaveRequestPayload {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  halfDay?: boolean;
  reason?: string | null;
}

export interface LeaveRequestsQuery {
  status?: LeaveStatus;
  employeeId?: number;
}

export interface LeaveBalance {
  leaveTypeId: number;
  leaveTypeName: string;
  leaveTypeCode: string;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}
