"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, X, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Board, Card, Column } from "@/types";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS } from "../constants";

export function CardDetailSidebar({
  card,
  colId,
  board,
  currentCol,
  onMoveStatus,
  onUpdatePriority,
  onUpdateAssignee,
  onUpdateStartDate,
  onUpdateDueDate,
  onAddLabel,
  onRemoveLabel,
  onToggleFollower,
  canEdit,
}: {
  card: Card;
  colId: string;
  board: Board | undefined;
  currentCol: Column | undefined;
  onMoveStatus: (columnName: string) => void;
  onUpdatePriority: (priority: Card["priority"]) => void;
  onUpdateAssignee: (assigneeId: string) => void;
  onUpdateStartDate: (iso: string | undefined) => void;
  onUpdateDueDate: (iso: string | undefined) => void;
  onAddLabel: (label: string) => void;
  onRemoveLabel: (label: string) => void;
  onToggleFollower: (userId: string) => void;
  canEdit: boolean;
}) {
  const [labelInput, setLabelInput] = useState("");
  const [addingLabel, setAddingLabel] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingLabel) labelInputRef.current?.focus();
  }, [addingLabel]);

  const labels = card.labels ?? [];
  const followers = card.followers ?? [];
  const priorityConfig = PRIORITY_CONFIG[card.priority] ?? PRIORITY_CONFIG.None;

  const handleAddLabel = () => {
    if (labelInput.trim()) {
      onAddLabel(labelInput.trim());
      setLabelInput("");
      setAddingLabel(false);
    }
  };

  return (
    <div className="w-64 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50">
      <div className="p-4 flex flex-col">

        <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Status</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild disabled={!canEdit}>
              <button
                disabled={!canEdit}
                className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md hover:opacity-80 transition-colors disabled:cursor-not-allowed"
                style={{ background: (currentCol?.color ?? "#9CA3AF") + "18", color: currentCol?.color ?? "#9CA3AF" }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentCol?.color ?? "#9CA3AF" }} />
                {currentCol?.name ?? "—"}
                {canEdit && <ChevronDown className="w-2.5 h-2.5 ml-0.5" />}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl p-1 w-44 z-[60]" sideOffset={4}>
                {board?.columns.map((col) => (
                  <DropdownMenu.Item
                    key={col.id}
                    onSelect={() => onMoveStatus(col.name)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                      col.id === colId
                        ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
                    {col.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Priority</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild disabled={!canEdit}>
              <button disabled={!canEdit} className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:cursor-not-allowed">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityConfig.color }} />
                {priorityConfig.label}
                {canEdit && <ChevronDown className="w-2.5 h-2.5 text-gray-400" />}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl p-1 w-36 z-[60]" sideOffset={4}>
                {PRIORITY_OPTIONS.map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  return (
                    <DropdownMenu.Item
                      key={p}
                      onSelect={() => onUpdatePriority(p)}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                        card.priority === p
                          ? "bg-gray-100 dark:bg-gray-800 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      )}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      {cfg.label}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Assignee</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild disabled={!canEdit}>
              <button disabled={!canEdit} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors min-w-0 disabled:cursor-not-allowed">
                {card.assigneeId ? (
                  <>
                    <UserAvatar user={USERS.find((u) => u.id === card.assigneeId)} size={18} />
                    <span className="truncate">{USERS.find((u) => u.id === card.assigneeId)?.name ?? "—"}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
                {canEdit && <ChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl p-1 w-48 z-[60]" sideOffset={4}>
                <DropdownMenu.Item
                  onSelect={() => onUpdateAssignee("")}
                  className="px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Unassigned
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                {USERS.map((u) => (
                  <DropdownMenu.Item
                    key={u.id}
                    onSelect={() => onUpdateAssignee(u.id)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                      card.assigneeId === u.id
                        ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    <UserAvatar user={u} size={18} />
                    {u.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Start date</span>
          {canEdit ? (
            <DatePicker
              value={card.startDate}
              onChange={onUpdateStartDate}
              placeholder="Not set"
            />
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">{card.startDate ?? "—"}</span>
          )}
        </div>

        <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Due date</span>
          {canEdit ? (
            <DatePicker
              value={card.dueDate !== "—" ? card.dueDate : undefined}
              onChange={onUpdateDueDate}
              placeholder="Not set"
            />
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">{card.dueDate}</span>
          )}
        </div>

        <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0 pt-0.5">Labels</span>
          <div className="flex-1 flex flex-wrap gap-1 items-center">
            {labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-medium rounded"
              >
                {label}
                {canEdit && (
                  <button onClick={() => onRemoveLabel(label)} className="hover:text-red-500 transition-colors ml-0.5">
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            ))}
            {canEdit && addingLabel && (
              <input
                ref={labelInputRef}
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLabel();
                  if (e.key === "Escape") { setAddingLabel(false); setLabelInput(""); }
                }}
                onBlur={() => { if (!labelInput.trim()) setAddingLabel(false); }}
                placeholder="Label…"
                className="text-[10px] px-1.5 py-0.5 border border-orange-400 rounded outline-none w-16 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              />
            )}
            {canEdit && !addingLabel && (
              <button
                onClick={() => setAddingLabel(true)}
                className="flex items-center justify-center w-5 h-5 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 hover:border-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            )}
            {!canEdit && labels.length === 0 && (
              <span className="text-xs text-gray-400">No labels</span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 py-2">
          <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0 pt-0.5">Watchers</span>
          <div className="flex flex-wrap gap-1.5">
            {USERS.map((u) => {
              const isFollowing = followers.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => canEdit && onToggleFollower(u.id)}
                  disabled={!canEdit}
                  title={`${u.name}${isFollowing ? " (watching)" : ""}`}
                  style={{ width: 24, height: 24 }}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full transition-all duration-150 flex-shrink-0",
                    canEdit ? "cursor-pointer" : "cursor-not-allowed",
                    isFollowing
                      ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950"
                      : "opacity-40 hover:opacity-100",
                  )}
                >
                  <UserAvatar user={u} size={20} hoverCard={false} />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
