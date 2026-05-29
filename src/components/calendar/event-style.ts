import type { CalendarEventType } from "@/types";

export const EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  meeting: "Meeting",
  deadline: "Deadline",
  social: "Social",
  focus: "Focus",
  ooo: "Out of office",
};

export const EVENT_TYPE_COLOR: Record<CalendarEventType, { bg: string; text: string; border: string; dot: string }> = {
  meeting: {
    bg: "bg-blue-100 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/60",
    dot: "#3B82F6",
  },
  deadline: {
    bg: "bg-rose-100 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800/60",
    dot: "#F43F5E",
  },
  social: {
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
    dot: "#10B981",
  },
  focus: {
    bg: "bg-violet-100 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800/60",
    dot: "#8B5CF6",
  },
  ooo: {
    bg: "bg-amber-100 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
    dot: "#F59E0B",
  },
};
