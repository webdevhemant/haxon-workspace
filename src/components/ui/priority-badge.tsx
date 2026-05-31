"use client";

type PriorityLevel = "Urgent" | "High" | "Medium" | "Low" | "None";

interface PriorityConfig {
  bg: string;
  text: string;
  dot: string;
  pulse?: boolean;
}

const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
  Urgent: { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444", pulse: true },
  High:   { bg: "#FFEDD5", text: "#C2410C", dot: "#F97316" },
  Medium: { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
  Low:    { bg: "#DBEAFE", text: "#1D4ED8", dot: "#3B82F6" },
  None:   { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
};

const FALLBACK: PriorityConfig = PRIORITY_CONFIG.None;

/** @deprecated use PRIORITY_CONFIG instead */
export const PRIORITY_COLORS: Record<string, string> = {
  Urgent: "#EF4444",
  High:   "#F97316",
  Medium: "#EAB308",
  Low:    "#3B82F6",
  None:   "#9CA3AF",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority] ?? FALLBACK;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0${cfg.pulse ? " animate-pulse" : ""}`}
        style={{ background: cfg.dot }}
      />
      {priority}
    </span>
  );
}
