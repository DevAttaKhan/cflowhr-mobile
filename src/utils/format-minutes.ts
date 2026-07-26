export const formatMinutesAsHours = (
  minutes: number | null | undefined,
): string => {
  if (minutes == null || Number.isNaN(minutes)) {
    return "—";
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

export const formatStatusLabel = (status: string): string =>
  status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
