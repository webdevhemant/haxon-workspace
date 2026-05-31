"use client";
import { cn } from "@/lib/utils";

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
  dotColor?: string;
  valueColor?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, accent, dotColor, valueColor, icon }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
        {dotColor && (
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        )}
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "text-2xl font-semibold tabular-nums leading-none",
          !valueColor && (accent ? "text-orange-500" : "text-gray-900 dark:text-white"),
        )}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
