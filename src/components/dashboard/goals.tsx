"use client";
import { useState } from "react";
import { Target, Check, Pencil } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function Goals() {
  const goals = useAppStore((s) => s.goals);
  const setGoalTitle = useAppStore((s) => s.setGoalTitle);
  const setGoalProgress = useAppStore((s) => s.setGoalProgress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setDraft(title);
  };

  const commit = (id: string) => {
    const next = draft.trim();
    if (next) setGoalTitle(id, next);
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-semibold text-sm">Goals</span>
        </div>
        <span className="text-[10px] font-semibold text-gray-400">
          {goals.filter((g) => g.progress >= 100).length}/{goals.length} done
        </span>
      </div>
      <div className="px-3.5 py-3 space-y-3">
        {goals.map((g) => {
          const isEditing = editingId === g.id;
          return (
            <div key={g.id} className="group">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    g.progress >= 100
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-300 dark:border-gray-600",
                  )}
                  style={g.progress < 100 ? { borderColor: g.color + "66" } : undefined}
                >
                  {g.progress >= 100 && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                {isEditing ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commit(g.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commit(g.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 text-sm font-medium bg-transparent border-b border-orange-400 outline-none text-gray-900 dark:text-white"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(g.id, g.title)}
                    className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white truncate hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    title="Click to rename"
                  >
                    {g.title}
                  </button>
                )}
                {!isEditing && (
                  <button
                    onClick={() => startEdit(g.id, g.title)}
                    title="Edit goal"
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                )}
                <span className="text-[11px] font-semibold tabular-nums w-9 text-right" style={{ color: g.color }}>
                  {g.progress}%
                </span>
              </div>
              <div className="relative h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{ width: `${g.progress}%`, backgroundColor: g.color }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={g.progress}
                  onChange={(e) => setGoalProgress(g.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title={`Adjust progress: ${g.progress}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
