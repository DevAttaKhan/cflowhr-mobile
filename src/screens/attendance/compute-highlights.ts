import { useMemo } from "react";

export const useMonthKey = (monthKey: string) =>
  useMemo(() => {
    const [y, m] = monthKey.split("-").map(Number);
    const from = `${monthKey}-01`;
    const last = new Date(Date.UTC(y!, m! - 1 + 1, 0)).getUTCDate();
    const to = `${monthKey}-${String(last).padStart(2, "0")}`;
    return { from, to };
  }, [monthKey]);
