"use client";
import { use, useState } from "react";
import { Plus, ChevronDown, X } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { GridRow } from "@/types";

const STATUSES = ["Backlog", "In Progress", "In Review", "Done"] as const;
const STATUS_COLORS: Record<string, string> = {
  "Backlog": "#9CA3AF",
  "In Progress": "#F59E0B",
  "In Review": "#3B82F6",
  "Done": "#10B981",
};

function StatusBadge({ status, onSelect }: { status: string; onSelect: (s: string) => void }) {
  const color = STATUS_COLORS[status] ?? "#9CA3AF";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: color + "20", color }}>
          {status} <ChevronDown className="w-2.5 h-2.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-40 z-50" sideOffset={4}>
          {STATUSES.map((s) => (
            <DropdownMenu.Item key={s} onSelect={() => onSelect(s)}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s] }} />
              {s}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function EditableCell({ value, onSave, className }: { value: string; onSave: (v: string) => void; className?: string }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  return editing ? (
    <input autoFocus value={val} onChange={(e) => setVal(e.target.value)}
      onBlur={() => { onSave(val); setEditing(false); }}
      onKeyDown={(e) => { if (e.key === "Enter") { onSave(val); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
      className="w-full px-1 py-0.5 text-sm outline-none border border-orange-400 rounded bg-white dark:bg-gray-900" />
  ) : (
    <div onClick={() => setEditing(true)} className={cn("px-1 py-0.5 text-sm rounded cursor-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors truncate", className)}>
      {value || <span className="text-gray-300 dark:text-gray-600">—</span>}
    </div>
  );
}

function GridRow({ row }: { row: GridRow }) {
  const { updateGridRow } = useAppStore();
  const assignee = USERS.find((u) => u.id === row.assigneeId);
  const update = (patch: Partial<GridRow>) => updateGridRow(row.id, patch);

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 group">
      <td className="px-4 py-2 w-8 text-center">
        <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
      </td>
      <td className="px-3 py-2 min-w-[260px]">
        <EditableCell value={row.name} onSave={(v) => update({ name: v })} className="font-medium" />
      </td>
      <td className="px-3 py-2">
        <StatusBadge status={row.status} onSelect={(s) => update({ status: s as GridRow["status"] })} />
      </td>
      <td className="px-3 py-2">
        {assignee ? (
          <div className="flex items-center gap-1.5 text-xs">
            <UserAvatar user={assignee} size={20} />
            <span className="text-gray-600 dark:text-gray-400 truncate">{assignee.name.split(" ")[0]}</span>
          </div>
        ) : <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>}
      </td>
      <td className="px-3 py-2">
        <PriorityBadge priority={row.priority} />
      </td>
      <td className="px-3 py-2">
        <EditableCell value={row.dueDate} onSave={(v) => update({ dueDate: v })} className="text-gray-500 dark:text-gray-400 text-xs" />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {row.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] rounded">{t}</span>
          ))}
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-gray-400">{row.created}</td>
    </tr>
  );
}

export default function GridView({ params }: { params: Promise<{ workspaceId: string; gridId: string }> }) {
  const { workspaceId } = use(params);
  const { gridRows, workspaces, addGridRow, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === (workspaceId ?? activeWorkspaceId));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const columns = ["Name", "Status", "Assignee", "Priority", "Due Date", "Tags", "Created"];

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "", href: "/dashboard" }, { label: "Grids" }, { label: "Sprint Tracker" }]} />}
        right={
          <>
            <button onClick={addGridRow} className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Add row
            </button>
          </>
        }
      />

      {/* Filter bar */}
      {activeFilters.length > 0 && (
        <div className="px-5 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <span className="text-xs text-gray-400">Filters:</span>
          {activeFilters.map((f) => (
            <span key={f} className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-950 text-orange-600 text-xs rounded-full">
              {f} <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters((prev) => prev.filter((x) => x !== f))} />
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <th className="px-4 py-2.5 w-8" />
              {columns.map((col) => (
                <th key={col} className="px-3 py-2.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridRows.map((row) => <GridRow key={row.id} row={row} />)}
          </tbody>
        </table>
        <div className="px-5 py-3">
          <button onClick={addGridRow}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add new row
          </button>
        </div>
      </div>
    </div>
  );
}
