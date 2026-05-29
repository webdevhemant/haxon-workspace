"use client";
import { useRouter } from "next/navigation";

export interface BoardHealthItem {
  id: string;
  name: string;
  emoji: string;
  workspaceId: string;
  total: number;
  done: number;
  inProgress: number;
  pct: number;
}

export function BoardHealth({
  items,
  workspaceId,
}: {
  items: BoardHealthItem[];
  workspaceId: string;
}) {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-5 px-2.5 py-1">
      <div className="flex items-center justify-between px-1 py-2.5 border-b border-gray-50 dark:border-gray-800 mb-0.5">
        <span className="font-semibold text-sm">Board Health</span>
        <button
          onClick={() => router.push(`/workspace/${workspaceId}/board/b1`)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Open
        </button>
      </div>
      {items.length === 0 ? (
        <div className="py-4 text-center text-xs text-gray-400">No boards in this workspace.</div>
      ) : (
        items.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/50 last:border-0"
          >
            <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-sm flex-shrink-0">
              {b.emoji}
            </span>
            <span className="text-sm font-medium flex-1 truncate">{b.name}</span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[80px]">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <span className="text-[11px] text-gray-500 font-medium w-8 text-right flex-shrink-0">
              {b.pct}%
            </span>
            <span className="text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded-full flex-shrink-0">
              {b.inProgress} active
            </span>
          </div>
        ))
      )}
    </div>
  );
}
