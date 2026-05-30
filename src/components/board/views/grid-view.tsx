"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Board } from "@/types";
import { flattenBoard, type FlatCard } from "../shared";
import { CardDetailModal } from "../card-detail-modal";

export function StatusCell({ card, board, canEdit = true }: { card: FlatCard; board: Board; canEdit?: boolean }) {
  const { moveCardByStatus } = useAppStore();
  const color = card.colColor;
  if (!canEdit) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium"
        style={{ background: color + "20", color }}
      >
        {card.colName}
      </span>
    );
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium hover:opacity-80 transition-colors"
          style={{ background: color + "20", color }}
        >
          {card.colName} <ChevronDown className="w-2.5 h-2.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-40 z-50" sideOffset={4}>
          {board.columns.map((col) => (
            <DropdownMenu.Item key={col.id} onSelect={() => moveCardByStatus(board.id, card.id, col.name)}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="w-2 h-2 rounded-full" style={{ background: col.color }} /> {col.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function EditableCell({ value, onSave, className, canEdit = true }: { value: string; onSave: (v: string) => void; className?: string; canEdit?: boolean }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  if (!canEdit) {
    return (
      <div className={cn("px-1 py-0.5 text-sm truncate", className)}>
        {value || <span className="text-gray-300 dark:text-gray-600">—</span>}
      </div>
    );
  }
  if (editing) {
    return (
      <input autoFocus value={val} onChange={(e) => setVal(e.target.value)}
        onBlur={() => { onSave(val); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") { onSave(val); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
        className="w-full px-1 py-0.5 text-sm outline-none border border-orange-400 rounded bg-white dark:bg-gray-900" />
    );
  }
  return (
    <div onClick={() => setEditing(true)} className={cn("px-1 py-0.5 text-sm rounded cursor-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors truncate", className)}>
      {value || <span className="text-gray-300 dark:text-gray-600">—</span>}
    </div>
  );
}

export function BoardGridView({ board, canEdit = true }: { board: Board; canEdit?: boolean }) {
  const { updateCard, addCard } = useAppStore();
  const [openCard, setOpenCard] = useState<FlatCard | null>(null);
  const rows = flattenBoard(board);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
            <th className="px-4 py-2.5 w-8" />
            {["Name", "Status", "Assignee", "Priority", "Due Date", "Tags"].map((col) => (
              <th key={col} className={`px-3 py-2.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap${col === "Name" ? " sticky left-0 z-10 bg-gray-50 dark:bg-gray-900" : ""}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const assignee = USERS.find((u) => u.id === row.assigneeId);
            return (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 group cursor-pointer"
                onClick={() => setOpenCard(row)}
              >
                <td className="px-4 py-2 w-8 text-center"><input type="checkbox" disabled={!canEdit} className="rounded border-gray-300 dark:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50" onClick={(e) => e.stopPropagation()} /></td>
                <td className="px-3 py-2 min-w-[220px] sticky left-0 z-10 bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                  <EditableCell value={row.title} onSave={(v) => updateCard(board.id, row.colId, row.id, { title: v })} className="font-medium" canEdit={canEdit} />
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <StatusCell card={row} board={board} canEdit={canEdit} />
                </td>
                <td className="px-3 py-2">
                  {assignee ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <UserAvatar user={assignee} size={20} />
                      <span className="text-gray-600 dark:text-gray-400 truncate hidden md:block">{assignee.name.split(" ")[0]}</span>
                    </div>
                  ) : <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>}
                </td>
                <td className="px-3 py-2"><PriorityBadge priority={row.priority} /></td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <EditableCell value={row.dueDate} onSave={(v) => updateCard(board.id, row.colId, row.id, { dueDate: v })} className="text-gray-500 dark:text-gray-400 text-xs" canEdit={canEdit} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(row.tags ?? []).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] rounded">{t}</span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
      {canEdit && (
        <div className="px-5 py-3">
          <button onClick={() => addCard(board.id, board.columns[0]?.id ?? "", "New item")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add new row
          </button>
        </div>
      )}
      {openCard && (
        <CardDetailModal card={openCard} colId={openCard.colId} boardId={board.id} open onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
}
