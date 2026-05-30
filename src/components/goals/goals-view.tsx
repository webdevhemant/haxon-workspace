"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Target } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { GOALS, STATUS_COLOR, STATUS_LABEL, type GoalStatus } from "@/data/dummy-goals";
import { GoalCard } from "./goal-card";

type StatusFilter = "all" | GoalStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "on-track", label: STATUS_LABEL["on-track"] },
  { key: "at-risk", label: STATUS_LABEL["at-risk"] },
  { key: "off-track", label: STATUS_LABEL["off-track"] },
  { key: "complete", label: STATUS_LABEL.complete },
];

export default function GoalsView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const canCreateGoal = useCan("goals.create");
  const canDeleteGoal = useCan("goals.delete");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["g1"]));

  const filtered = useMemo(
    () => (filter === "all" ? GOALS : GOALS.filter((g) => g.status === filter)),
    [filter],
  );

  const overall =
    GOALS.flatMap((g) => g.keyResults).reduce((sum, kr) => sum + kr.progress, 0) /
    Math.max(GOALS.flatMap((g) => g.keyResults).length, 1);

  const counts: Record<GoalStatus, number> = {
    "on-track": 0,
    "at-risk": 0,
    "off-track": 0,
    complete: 0,
  };
  for (const g of GOALS) counts[g.status]++;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Goals" }]} />}
        right={
          canCreateGoal ? (
            <button
              onClick={() => toast.info("New goal editor opening…")}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" /> New goal
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto">
        <header className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Goals & OKRs <Target className="w-5 h-5 text-emerald-500" />
              </h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 max-w-prose">
                One source of truth for what the team is trying to ship this quarter.
                Roll up automatically from cards and docs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <Stat label="Overall" value={`${Math.round(overall)}%`} color="#F97316" />
            {(["on-track", "at-risk", "off-track", "complete"] as GoalStatus[]).map((s) => (
              <Stat
                key={s}
                label={STATUS_LABEL[s]}
                value={counts[s]}
                color={STATUS_COLOR[s]}
              />
            ))}
          </div>
        </header>

        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section className="px-6 py-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              <Target className="w-6 h-6 opacity-40 mx-auto mb-2" />
              No goals match.
            </div>
          ) : (
            filtered.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                expanded={expanded.has(g.id)}
                onToggle={() => toggle(g.id)}
                canDelete={canDeleteGoal}
                onDelete={canDeleteGoal ? () => toast.success(`Deleted ${g.title}`) : undefined}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label, value, color,
}: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="mt-1 text-lg font-bold tabular-nums" style={{ color }}>{value}</div>
    </div>
  );
}
