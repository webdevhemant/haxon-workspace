"use client";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { StatCard } from "@/components/ui/stat-card";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { GOALS, STATUS_COLOR, STATUS_LABEL, type GoalStatus, type Goal } from "@/data/dummy-goals";
import { GoalCard } from "./goal-card";
import { CreateGoalModal } from "./create-goal-modal";

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
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["g1"]));

  const filtered = useMemo(
    () => (filter === "all" ? goals : goals.filter((g) => g.status === filter)),
    [filter, goals],
  );

  const overall =
    goals.flatMap((g) => g.keyResults).reduce((sum, kr) => sum + kr.progress, 0) /
    Math.max(goals.flatMap((g) => g.keyResults).length, 1);

  const counts: Record<GoalStatus, number> = { "on-track": 0, "at-risk": 0, "off-track": 0, complete: 0 };
  for (const g of goals) counts[g.status]++;

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
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" /> New goal
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto">
        <header className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">Goals & OKRs</h1>
          <dl className="flex items-center gap-8 flex-wrap">
            <StatCard label="Overall progress" value={`${Math.round(overall)}%`} valueColor="#F97316" />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            {(["on-track", "at-risk", "off-track", "complete"] as GoalStatus[]).map((s, i) => (
              <div key={s} className="flex items-center gap-8">
                <StatCard
                  label={STATUS_LABEL[s]}
                  value={counts[s]}
                  valueColor={STATUS_COLOR[s]}
                />
                {i < 3 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />}
              </div>
            ))}
          </dl>
        </header>

        <div className="px-6 border-b border-gray-100 dark:border-gray-800 flex items-center">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-1 py-3 mr-4 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                filter === f.key
                  ? "border-orange-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section className="px-6 py-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">No goals match.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  expanded={expanded.has(g.id)}
                  onToggle={() => toggle(g.id)}
                  canDelete={canDeleteGoal}
                  onDelete={canDeleteGoal ? () => setGoals((prev) => prev.filter((x) => x.id !== g.id)) : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <CreateGoalModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(g) => { setGoals((prev) => [g, ...prev]); setExpanded((s) => new Set([...s, g.id])); }}
      />
    </div>
  );
}
