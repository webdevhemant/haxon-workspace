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

export function StatCard({ label, value, accent, valueColor }: Props) {
  const valueClass = cn(
    "text-[22px] font-semibold tabular-nums leading-none",
    !valueColor && (accent ? "text-orange-500" : "text-gray-900 dark:text-white"),
  );

  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </dt>
      <dd
        className={valueClass}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
