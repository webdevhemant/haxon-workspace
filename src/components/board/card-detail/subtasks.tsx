"use client";
import { useState } from "react";
import { CheckSquare, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardSubtask } from "@/types";

export function CardDetailSubtasks({
  subtasks,
  onToggle,
  onDelete,
  onAdd,
  canEdit,
}: {
  subtasks: CardSubtask[];
  onToggle: (subtaskId: string) => void;
  onDelete: (subtaskId: string) => void;
  onAdd: (title: string) => void;
  canEdit: boolean;
}) {
  const [subtaskInput, setSubtaskInput] = useState("");
  const doneCount = subtasks.filter((s) => s.done).length;
  const subtaskProgress = subtasks.length > 0 ? (doneCount / subtasks.length) * 100 : 0;

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      onAdd(subtaskInput.trim());
      setSubtaskInput("");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CheckSquare className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Subtasks</span>
        {subtasks.length > 0 && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
            {doneCount}/{subtasks.length}
          </span>
        )}
        {subtasks.length > 0 && (
          <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ml-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${subtaskProgress}%`, background: "#F97316" }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 mb-2">
        {subtasks.map((st) => (
          <div
            key={st.id}
            className="group flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <button
              onClick={() => canEdit && onToggle(st.id)}
              disabled={!canEdit}
              className="flex-shrink-0 transition-colors disabled:cursor-not-allowed"
            >
              {st.done
                ? <CheckSquare className="w-4 h-4 text-orange-500" />
                : <Square className="w-4 h-4 text-gray-300 dark:text-gray-600 hover:text-gray-400" />
              }
            </button>
            <span className={cn("flex-1 text-sm", st.done && "line-through text-gray-400 dark:text-gray-600")}>
              {st.title}
            </span>
            {canEdit && (
              <button
                onClick={() => onDelete(st.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="flex items-center gap-2 mt-1">
          <input
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddSubtask(); }}
            placeholder="Add a subtask…"
            className="flex-1 text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-md outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 placeholder-gray-400 transition-colors"
          />
          <button
            onClick={handleAddSubtask}
            disabled={!subtaskInput.trim()}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
