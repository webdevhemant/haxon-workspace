"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { USERS } from "@/data/dummy-users";
import { useCan } from "@/lib/use-can";
import type { Board } from "@/types";
import { CardDetailModal } from "../card-detail-modal";
import { flattenBoard, type FlatCard } from "../shared";
import { StatusCell } from "./grid-view";

const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3, None: 4 };
const COLS = ["Name", "Status", "Assignee", "Priority", "Due", "Tags"];

export function BoardTableView({ board }: { board: Board }) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openCard, setOpenCard] = useState<FlatCard | null>(null);
  const rows = flattenBoard(board);
  const canEdit = useCan("board.edit");

  const sorted = [...rows].sort((a, b) => {
    if (!sortCol) return 0;
    let av = "", bv = "";
    if (sortCol === "Name") { av = a.title; bv = b.title; }
    if (sortCol === "Status") { av = a.colName; bv = b.colName; }
    if (sortCol === "Priority") { av = String(PRIORITY_ORDER[a.priority]); bv = String(PRIORITY_ORDER[b.priority]); }
    if (sortCol === "Due") { av = a.dueDate; bv = b.dueDate; }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <table className="w-full text-sm border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <th className="px-4 py-2.5 w-8" />
            {COLS.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className={`px-3 py-2.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none${col === "Name" ? " sticky left-0 z-10 bg-gray-50 dark:bg-gray-900" : ""}`}
              >
                <span className="flex items-center gap-1">
                  {col}
                  {sortCol === col && <span className="text-orange-500">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const assignee = USERS.find((u) => u.id === row.assigneeId);
            return (
              <tr
                key={row.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 group cursor-pointer"
                onClick={() => setOpenCard(row)}
              >
                <td className="px-4 py-2 w-8">
                  <input type="checkbox" disabled={!canEdit} className="rounded border-gray-300 dark:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50" onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-3 py-2 font-medium max-w-[240px] sticky left-0 z-10 bg-white dark:bg-gray-900">
                  <span className="truncate block">{row.title}</span>
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <StatusCell card={row} board={board} canEdit={canEdit} />
                </td>
                <td className="px-3 py-2">
                  {assignee ? (
                    <div className="flex items-center gap-1.5">
                      <UserAvatar user={assignee} size={20} />
                      <span className="text-xs text-gray-500">{assignee.name.split(" ")[0]}</span>
                    </div>
                  ) : "—"}
                </td>
                <td className="px-3 py-2"><PriorityBadge priority={row.priority} /></td>
                <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                  {row.dueDate !== "—" ? (
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" /> {row.dueDate}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(row.tags ?? []).slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 rounded">{t}</span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openCard && (
        <CardDetailModal card={openCard} colId={openCard.colId} boardId={board.id} open onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
}
