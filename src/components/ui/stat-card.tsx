"use client";
import { cn } from "@/lib/utils";

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
  /** Optional bullet colour shown next to the label (used for status stats). */
  dotColor?: string;
  /** Tint applied to the value. Overrides accent. */
  valueColor?: string;
  icon?: React.ReactNode;
}

/**
 * Compact stat card used across page headers (Automations, Goals, Integrations, Team).
 * Renders a label above a large tabular value inside a bordered card.
 */
export function StatCard({ label, value, accent, dotColor, valueColor, icon }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {dotColor && (
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
        )}
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-lg font-bold tabular-nums",
          !valueColor && (accent ? "text-orange-500" : "text-gray-900 dark:text-white"),
        )}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
