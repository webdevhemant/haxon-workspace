"use client";
import { useRouter } from "next/navigation";
import type { Card } from "@/types";
import { PRIORITY_COLORS } from "./constants";

export interface MyTask extends Card {
  boardName: string;
  boardEmoji: string;
  boardId: string;
  colName: string;
  colColor: string;
}

export function MyTasks({
  tasks,
  workspaceId,
}: {
  tasks: MyTask[];
  workspaceId: string;
}) {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-5">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">My Tasks</span>
          <span className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => router.push(`/workspace/${workspaceId}/board/b1`)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="px-1.5 py-1">
        {tasks.length === 0 ? (
          <div className="py-5 text-center text-xs text-gray-400">
            No tasks assigned to you in this workspace.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/workspace/${workspaceId}/board/${task.boardId}`)}
              className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: PRIORITY_COLORS[task.priority] ?? "#9CA3AF" }}
              />
              <span className="text-sm font-medium truncate flex-1">{task.title}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {task.boardEmoji} {task.boardName}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 text-white"
                style={{ backgroundColor: task.colColor }}
              >
                {task.colName}
              </span>
              {task.dueDate && (
                <span className="text-[10px] text-gray-400 flex-shrink-0">{task.dueDate}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
