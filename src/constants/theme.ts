/**
 * cflowHR employee app theme — light-first lime / mint brand.
 */

import { Platform } from "react-native";

export const Brand = {
  primary: "#D0F94A",
  secondary: "#3CDB9D",
  primaryMuted: "#E8FCA3",
  secondaryMuted: "#C5F5E3",
  ink: "#12141A",
  inkSoft: "#3A3F4B",
  muted: "#6B7280",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  canvas: "#F4F6F2",
  canvasTint: "#EEF5E6",
  danger: "#EF4444",
  warning: "#F59E0B",
  success: "#3CDB9D",
} as const;

export const Colors = {
  light: {
    text: Brand.ink,
    textSecondary: Brand.muted,
    background: Brand.canvas,
    backgroundElement: Brand.surface,
    backgroundSelected: Brand.canvasTint,
    primary: Brand.primary,
    secondary: Brand.secondary,
    border: Brand.border,
    danger: Brand.danger,
    warning: Brand.warning,
    success: Brand.success,
  },
  dark: {
    text: "#F5F7FA",
    textSecondary: "#A0A6B2",
    background: "#0E1014",
    backgroundElement: "#1A1D24",
    backgroundSelected: "#242830",
    primary: Brand.primary,
    secondary: Brand.secondary,
    border: "#2A2F3A",
    danger: Brand.danger,
    warning: Brand.warning,
    success: Brand.success,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const Radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const StatusColors: Record<string, string> = {
  PRESENT: Brand.secondary,
  LATE: Brand.warning,
  ABSENT: Brand.danger,
  HALF_DAY: "#60A5FA",
  ON_LEAVE: "#A78BFA",
  HOLIDAY: "#94A3B8",
  WEEKEND: "#CBD5E1",
  WORK_FROM_HOME: "#38BDF8",
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
