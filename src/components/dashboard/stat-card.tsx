"use client";

export function StatCard({
  label,
  value,
  delta,
  icon,
  color,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-3">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: color + "15", color }}
        >
          {icon}
        </span>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      {delta && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          {delta} <span className="text-gray-400 font-normal">vs last week</span>
        </div>
      )}
    </div>
  );
}
