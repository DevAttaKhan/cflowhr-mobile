import { NativeTabs } from "expo-router/unstable-native-tabs";

import { Brand } from "@/constants/theme";
import { useGetAttendanceRequestsQuery } from "@/store/apis/attendance-request.api";
import { useGetLeaveRequestsQuery } from "@/store/apis/leave.api";

const formatBadge = (count: number): string | undefined => {
  if (count <= 0) {
    return undefined;
  }
  if (count > 9) {
    return "9+";
  }
  return String(count);
};

export default function EmployeeTabsLayout() {
  const { data: attendanceRequests = [] } = useGetAttendanceRequestsQuery();
  const { data: leaveRequests = [] } = useGetLeaveRequestsQuery();

  const pendingRequests = attendanceRequests.filter(
    (row) => row.status === "PENDING",
  ).length;
  const pendingLeave = leaveRequests.filter(
    (row) => row.status === "PENDING",
  ).length;

  const requestsBadge = formatBadge(pendingRequests);
  const leaveBadge = formatBadge(pendingLeave);

  return (
    <NativeTabs
      backgroundColor={Brand.surface}
      tintColor={Brand.secondary}
      iconColor={{
        default: Brand.muted,
        selected: Brand.secondary,
      }}
      labelStyle={{
        default: {
          color: Brand.muted,
          fontSize: 11,
          fontWeight: "500",
        },
        selected: {
          color: Brand.ink,
          fontSize: 11,
          fontWeight: "700",
        },
      }}
      indicatorColor={Brand.canvasTint}
      rippleColor={Brand.secondaryMuted}
      badgeBackgroundColor={Brand.danger}
      badgeTextColor={Brand.surface}
      labelVisibilityMode="labeled"
      disableTransparentOnScrollEdge
      backBehavior="history"
    >
      <NativeTabs.Trigger name="today" accessibilityLabel="Today">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "sun.max", selected: "sun.max.fill" }}
          md={{ default: "schedule", selected: "schedule" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="attendance" accessibilityLabel="Attendance">
        <NativeTabs.Trigger.Label>Attendance</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          md={{ default: "bar_chart", selected: "monitoring" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="leave" accessibilityLabel="Leave">
        <NativeTabs.Trigger.Label>Leave</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "airplane", selected: "airplane.departure" }}
          md={{ default: "flight_takeoff", selected: "flight" }}
        />
        {leaveBadge ? (
          <NativeTabs.Trigger.Badge>{leaveBadge}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="requests" accessibilityLabel="Requests">
        <NativeTabs.Trigger.Label>Requests</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "doc.text", selected: "doc.text.fill" }}
          md={{ default: "description", selected: "description" }}
        />
        {requestsBadge ? (
          <NativeTabs.Trigger.Badge>{requestsBadge}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
