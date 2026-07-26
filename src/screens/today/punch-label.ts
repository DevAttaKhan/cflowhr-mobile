import type { AttendanceEventType } from "@/types/attendance";

const punchLabel = (type: AttendanceEventType): string => {
  switch (type) {
    case "CHECK_IN":
      return "Check In";
    case "BREAK_IN":
      return "Break";
    case "BREAK_OUT":
      return "Resume";
    case "CHECK_OUT":
      return "Check Out";
    default:
      return "Punch";
  }
};

export { punchLabel };
