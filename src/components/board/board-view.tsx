"use client";
import { use, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import {
  Plus, MoreHorizontal, Search, Filter, X, Calendar, ChevronDown,
  Kanban, List, Grid3X3, Table2, BarChart3, ChevronRight,
  CheckSquare, Square, Trash2, MessageSquare, Tag, Users, Send,
  Eye, Clock, AlertCircle,
} from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Card, Column, ViewType } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";

// ─── Priority config ─────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  Urgent: { color: "#EF4444", label: "Urgent" },
  High:   { color: "#F97316", label: "High" },
  Medium: { color: "#EAB308", label: "Medium" },
  Low:    { color: "#3B82F6", label: "Low" },
  None:   { color: "#9CA3AF", label: "None" },
};

const PRIORITY_OPTIONS = ["Urgent", "High", "Medium", "Low", "None"] as const;

// ─── Card detail modal ──────────────────────────────────────────────────────

function CardDetailModal({
  card, colId, boardId, open, onClose,
}: { card: Card; colId: string; boardId: string; open: boolean; onClose: () => void }) {
  const {
    updateCard, moveCardByStatus,
    addSubtask, toggleSubtask, deleteSubtask,
    addComment, toggleFollower,
    boards,
  } = useAppStore();

  const board = boards.find((b) => b.id === boardId);
  const currentCol = board?.columns.find((c) => c.id === colId);

  const [titleVal, setTitleVal] = useState(card.title);
  const [descVal, setDescVal] = useState(card.description ?? "");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [addingLabel, setAddingLabel] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleVal(card.title);
    setDescVal(card.description ?? "");
  }, [card.id, card.title, card.description]);

  useEffect(() => {
    if (addingLabel) labelInputRef.current?.focus();
  }, [addingLabel]);

  const subtasks = card.subtasks ?? [];
  const comments = card.comments ?? [];
  const labels = card.labels ?? [];
  const followers = card.followers ?? [];
  const doneCount = subtasks.filter((s) => s.done).length;
  const subtaskProgress = subtasks.length > 0 ? (doneCount / subtasks.length) * 100 : 0;

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      addSubtask(boardId, colId, card.id, subtaskInput.trim());
      setSubtaskInput("");
    }
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      addComment(boardId, colId, card.id, commentInput.trim());
      setCommentInput("");
    }
  };

  const handleAddLabel = () => {
    if (labelInput.trim()) {
      updateCard(boardId, colId, card.id, { labels: [...labels, labelInput.trim()] });
      setLabelInput("");
      setAddingLabel(false);
    }
  };

  const handleRemoveLabel = (label: string) => {
    updateCard(boardId, colId, card.id, { labels: labels.filter((l) => l !== label) });
  };

  const priorityConfig = PRIORITY_CONFIG[card.priority] ?? PRIORITY_CONFIG.None;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ width: "min(860px, 96vw)", maxHeight: "90vh" }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            {currentCol && (
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold"
                style={{ background: currentCol.color + "18", color: currentCol.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentCol.color }} />
                {currentCol.name}
              </div>
            )}
            <div className="flex-1" />
            <span className="text-[11px] text-gray-400 font-mono">{card.id}</span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: two columns */}
          <div className="flex-1 overflow-hidden flex min-h-0">

            {/* ── Left column ── */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

              {/* Title */}
              <input
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                onBlur={() => updateCard(boardId, colId, card.id, { title: titleVal })}
                className="w-full text-xl font-bold tracking-tight bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0"
                placeholder="Card title…"
              />

              {/* Description */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</div>
                <textarea
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  onBlur={() => updateCard(boardId, colId, card.id, { description: descVal })}
                  placeholder="Add a description…"
                  rows={3}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg text-sm resize-none outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 text-gray-700 dark:text-gray-300 placeholder-gray-400 transition-colors"
                />
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtasks</span>
                  {subtasks.length > 0 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
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
                      className="group flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleSubtask(boardId, colId, card.id, st.id)}
                        className="flex-shrink-0 transition-colors"
                      >
                        {st.done
                          ? <CheckSquare className="w-4 h-4 text-orange-500" />
                          : <Square className="w-4 h-4 text-gray-300 dark:text-gray-600 hover:text-gray-400" />
                        }
                      </button>
                      <span className={cn("flex-1 text-sm", st.done && "line-through text-gray-400 dark:text-gray-600")}>
                        {st.title}
                      </span>
                      <button
                        onClick={() => deleteSubtask(boardId, colId, card.id, st.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddSubtask(); }}
                    placeholder="Add a subtask…"
                    className="flex-1 text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 placeholder-gray-400 transition-colors"
                  />
                  <button
                    onClick={handleAddSubtask}
                    disabled={!subtaskInput.trim()}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Activity / Comments */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</span>
                </div>

                {comments.length > 0 && (
                  <div className="flex flex-col gap-2 mb-3">
                    {comments.map((cm) => {
                      const commenter = USERS.find((u) => u.id === cm.userId);
                      return (
                        <div key={cm.id} className="flex gap-2.5">
                          <UserAvatar user={commenter} size={24} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {commenter?.name ?? "Unknown"}
                              </span>
                              <span className="text-[10px] text-gray-400">{cm.at}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cm.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2.5 items-start">
                  <UserAvatar user={USERS[0]} size={24} />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
                      }}
                      placeholder="Add a comment…"
                      rows={1}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg text-sm resize-none outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 placeholder-gray-400 transition-colors"
                      style={{ minHeight: 36 }}
                    />
                    {commentInput.trim() && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddComment}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Send className="w-3 h-3" /> Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column (metadata sidebar) ── */}
            <div className="w-64 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/50">
              <div className="p-4 flex flex-col">

                {/* Status */}
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Status</span>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md hover:opacity-80 transition-colors"
                        style={{ background: (currentCol?.color ?? "#9CA3AF") + "18", color: currentCol?.color ?? "#9CA3AF" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentCol?.color ?? "#9CA3AF" }} />
                        {currentCol?.name ?? "—"}
                        <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-44 z-[60]" sideOffset={4}>
                        {board?.columns.map((col) => (
                          <DropdownMenu.Item
                            key={col.id}
                            onSelect={() => moveCardByStatus(boardId, card.id, col.name)}
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                              col.id === colId
                                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

                {/* Priority */}
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Priority</span>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityConfig.color }} />
                        {priorityConfig.label}
                        <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-36 z-[60]" sideOffset={4}>
                        {PRIORITY_OPTIONS.map((p) => {
                          const cfg = PRIORITY_CONFIG[p];
                          return (
                            <DropdownMenu.Item
                              key={p}
                              onSelect={() => updateCard(boardId, colId, card.id, { priority: p })}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                                card.priority === p
                                  ? "bg-gray-100 dark:bg-gray-800 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

                {/* Assignee */}
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Assignee</span>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors min-w-0">
                        {card.assigneeId ? (
                          <>
                            <UserAvatar user={USERS.find((u) => u.id === card.assigneeId)} size={18} />
                            <span className="truncate">{USERS.find((u) => u.id === card.assigneeId)?.name ?? "—"}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                        <ChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-48 z-[60]" sideOffset={4}>
                        <DropdownMenu.Item
                          onSelect={() => updateCard(boardId, colId, card.id, { assigneeId: "" })}
                          className="px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          Unassigned
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                        {USERS.map((u) => (
                          <DropdownMenu.Item
                            key={u.id}
                            onSelect={() => updateCard(boardId, colId, card.id, { assigneeId: u.id })}
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded cursor-pointer outline-none transition-colors",
                              card.assigneeId === u.id
                                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

                {/* Start date */}
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Start date</span>
                  <div className="relative flex-1">
                    {!card.startDate && (
                      <span className="absolute inset-0 flex items-center text-xs text-gray-400 pointer-events-none select-none">
                        Not set
                      </span>
                    )}
                    <input
                      type="date"
                      defaultValue={card.startDate ?? ""}
                      onChange={(e) => updateCard(boardId, colId, card.id, { startDate: e.target.value || undefined })}
                      className="w-full text-xs text-gray-700 dark:text-gray-300 bg-transparent outline-none cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                      style={{ colorScheme: "light dark" }}
                    />
                  </div>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">Due date</span>
                  <div className="relative flex-1">
                    {(!card.dueDate || card.dueDate === "—") && (
                      <span className="absolute inset-0 flex items-center text-xs text-gray-400 pointer-events-none select-none">
                        Not set
                      </span>
                    )}
                    <input
                      type="date"
                      defaultValue={card.dueDate !== "—" ? (card.dueDate ?? "") : ""}
                      onChange={(e) => updateCard(boardId, colId, card.id, { dueDate: e.target.value || "—" })}
                      className="w-full text-xs text-gray-700 dark:text-gray-300 bg-transparent outline-none cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                      style={{ colorScheme: "light dark" }}
                    />
                  </div>
                </div>

                {/* Labels */}
                <div className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0 pt-0.5">Labels</span>
                  <div className="flex-1 flex flex-wrap gap-1 items-center">
                    {labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-medium rounded-md"
                      >
                        {label}
                        <button onClick={() => handleRemoveLabel(label)} className="hover:text-red-500 transition-colors ml-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    {addingLabel ? (
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
                        className="text-[10px] px-1.5 py-0.5 border border-orange-400 rounded-md outline-none w-16 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                      />
                    ) : (
                      <button
                        onClick={() => setAddingLabel(true)}
                        className="flex items-center justify-center w-5 h-5 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 hover:border-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Followers / Watchers */}
                <div className="flex items-start gap-3 py-2">
                  <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0 pt-0.5">Watchers</span>
                  <div className="flex flex-wrap gap-1">
                    {USERS.map((u) => {
                      const isFollowing = followers.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => toggleFollower(boardId, colId, card.id, u.id)}
                          title={`${u.name}${isFollowing ? " (watching)" : ""}`}
                          className={cn(
                            "rounded-full transition-all duration-150",
                            isFollowing
                              ? "ring-2 ring-orange-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950"
                              : "opacity-40 hover:opacity-70"
                          )}
                        >
                          <UserAvatar user={u} size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Board (Kanban) view ─────────────────────────────────────────────────────

function KanbanCard({ card, colId, boardId, index }: { card: Card; colId: string; boardId: string; index: number }) {
  const [open, setOpen] = useState(false);
  const assignee = USERS.find((u) => u.id === card.assigneeId);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpen(true)}
            className={cn(
              "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer select-none",
              "hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150",
              snapshot.isDragging && "shadow-xl rotate-1 scale-105 opacity-90",
            )}
          >
            <div className="font-medium text-sm leading-snug mb-2">{card.title}</div>
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] rounded font-medium">{t}</span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <PriorityBadge priority={card.priority} />
                {card.dueDate && card.dueDate !== "—" && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" /> {card.dueDate}
                  </span>
                )}
              </div>
              {assignee && <UserAvatar user={assignee} size={20} />}
            </div>
          </div>
        )}
      </Draggable>
      <CardDetailModal card={card} colId={colId} boardId={boardId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function KanbanColumn({ col, boardId, dragHandleProps }: { col: Column; boardId: string; dragHandleProps?: object }) {
  const { addCard } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const submit = () => {
    if (newTitle.trim()) addCard(boardId, col.id, newTitle.trim());
    setNewTitle(""); setAdding(false);
  };

  return (
    <div className="flex-none w-[272px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col max-h-full">
      <div {...dragHandleProps} className="px-3.5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 cursor-grab active:cursor-grabbing select-none">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
        <span className="font-semibold text-sm flex-1">{col.name}</span>
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
        <button onClick={() => setAdding(true)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 min-h-[60px] transition-colors", snapshot.isDraggingOver && "bg-orange-50 dark:bg-orange-950/20")}
          >
            {col.cards.map((card, i) => <KanbanCard key={card.id} card={card} colId={col.id} boardId={boardId} index={i} />)}
            {provided.placeholder}
            <AnimatePresence>
              {adding && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-900 border-2 border-orange-400 rounded-lg p-2.5">
                  <textarea autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } if (e.key === "Escape") setAdding(false); }}
                    placeholder="Card title…" rows={2} className="w-full text-sm resize-none border-0 outline-none bg-transparent" />
                  <div className="flex gap-1.5 mt-2">
                    <button onClick={submit} className="px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors">Add</button>
                    <button onClick={() => setAdding(false)} className="px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!adding && (
              <button onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 px-2 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <Plus className="w-3 h-3" /> Add card
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function BoardKanbanView({ board, onDragEnd, addingCol, newColName, setNewColName, setAddingCol }: {
  board: import("@/types").Board;
  onDragEnd: (r: DropResult) => void;
  addingCol: boolean;
  newColName: string;
  setNewColName: (v: string) => void;
  setAddingCol: (v: boolean) => void;
}) {
  const { addColumn } = useAppStore();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
        {(colProvided) => (
          <div ref={colProvided.innerRef} {...colProvided.droppableProps} className="flex gap-2.5 p-3 h-full min-h-0">
            {board.columns.map((col, index) => (
              <Draggable key={col.id} draggableId={col.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn("flex-none self-start max-h-full flex flex-col", snapshot.isDragging && "rotate-1 opacity-90 shadow-2xl")}
                    style={{ ...provided.draggableProps.style, height: snapshot.isDragging ? undefined : "100%" }}
                  >
                    <KanbanColumn col={col} boardId={board.id} dragHandleProps={provided.dragHandleProps ?? undefined} />
                  </div>
                )}
              </Draggable>
            ))}
            {colProvided.placeholder}
            <AnimatePresence>
              {addingCol && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 272 }} exit={{ opacity: 0, width: 0 }}
                  className="flex-none bg-gray-50 dark:bg-gray-900 border-2 border-orange-400 rounded-xl p-3 self-start overflow-hidden"
                  style={{ width: 272 }}
                >
                  <input
                    autoFocus value={newColName} onChange={(e) => setNewColName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newColName.trim()) { addColumn(board.id, newColName.trim()); setNewColName(""); setAddingCol(false); }
                      if (e.key === "Escape") { setAddingCol(false); setNewColName(""); }
                    }}
                    placeholder="Column name…"
                    className="w-full text-sm font-semibold bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 mb-3"
                  />
                  <div className="flex gap-1.5">
                    <button onClick={() => { if (newColName.trim()) addColumn(board.id, newColName.trim()); setNewColName(""); setAddingCol(false); }}
                      className="px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors">Add</button>
                    <button onClick={() => { setAddingCol(false); setNewColName(""); }}
                      className="px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// ─── List view ───────────────────────────────────────────────────────────────

function BoardListView({ board }: { board: import("@/types").Board }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [openCard, setOpenCard] = useState<{ card: Card; colId: string } | null>(null);

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="w-full space-y-3">
        {board.columns.map((col) => {
          const isOpen = expanded[col.id] !== false;
          return (
            <div key={col.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(col.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                <span className="font-semibold text-sm flex-1 text-left">{col.name}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
                <ChevronRight className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-90")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      {col.cards.map((card, i) => {
                        const assignee = USERS.find((u) => u.id === card.assigneeId);
                        return (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            onClick={() => setOpenCard({ card, colId: col.id })}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors"
                          >
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 flex-shrink-0" onClick={(e) => e.stopPropagation()} />
                            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{card.title}</span>
                            {card.tags && card.tags.length > 0 && (
                              <div className="hidden md:flex gap-1 flex-shrink-0">
                                {card.tags.slice(0, 2).map((t) => (
                                  <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 rounded">{t}</span>
                                ))}
                              </div>
                            )}
                            <PriorityBadge priority={card.priority} />
                            {card.dueDate && card.dueDate !== "—" && (
                              <span className="text-[10px] text-gray-400 hidden sm:flex items-center gap-0.5 flex-shrink-0">
                                <Calendar className="w-2.5 h-2.5" /> {card.dueDate}
                              </span>
                            )}
                            {assignee && <UserAvatar user={assignee} size={22} />}
                          </motion.div>
                        );
                      })}
                      {col.cards.length === 0 && (
                        <div className="px-4 py-4 text-xs text-gray-400 italic">No cards in this column</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {openCard && (
        <CardDetailModal
          card={openCard.card} colId={openCard.colId} boardId={board.id}
          open onClose={() => setOpenCard(null)}
        />
      )}
    </div>
  );
}

// ─── Grid / Table shared flat view ──────────────────────────────────────────

type FlatCard = Card & { colId: string; colName: string; colColor: string };

function flattenBoard(board: import("@/types").Board): FlatCard[] {
  return board.columns.flatMap((col) =>
    col.cards.map((card) => ({ ...card, colId: col.id, colName: col.name, colColor: col.color }))
  );
}

function StatusCell({ card, board }: { card: FlatCard; board: import("@/types").Board }) {
  const { moveCardByStatus } = useAppStore();
  const color = card.colColor;
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

function EditableCell({ value, onSave, className }: { value: string; onSave: (v: string) => void; className?: string }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
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

function BoardGridView({ board }: { board: import("@/types").Board }) {
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
                <td className="px-4 py-2 w-8 text-center"><input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" onClick={(e) => e.stopPropagation()} /></td>
                <td className="px-3 py-2 min-w-[220px] sticky left-0 z-10 bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                  <EditableCell value={row.title} onSave={(v) => updateCard(board.id, row.colId, row.id, { title: v })} className="font-medium" />
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <StatusCell card={row} board={board} />
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
                  <EditableCell value={row.dueDate} onSave={(v) => updateCard(board.id, row.colId, row.id, { dueDate: v })} className="text-gray-500 dark:text-gray-400 text-xs" />
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
      <div className="px-5 py-3">
        <button onClick={() => addCard(board.id, board.columns[0]?.id ?? "", "New item")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add new row
        </button>
      </div>
      {openCard && (
        <CardDetailModal card={openCard} colId={openCard.colId} boardId={board.id} open onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
}

// ─── Table view (dense, sortable columns) ────────────────────────────────────

function BoardTableView({ board }: { board: import("@/types").Board }) {
  const { updateCard } = useAppStore();
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openCard, setOpenCard] = useState<FlatCard | null>(null);
  const rows = flattenBoard(board);

  const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3, None: 4 };
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

  const cols = ["Name", "Status", "Assignee", "Priority", "Due", "Tags"];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <table className="w-full text-sm border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <th className="px-4 py-2.5 w-8" />
            {cols.map((col) => (
              <th key={col} onClick={() => handleSort(col)}
                className={`px-3 py-2.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none${col === "Name" ? " sticky left-0 z-10 bg-gray-50 dark:bg-gray-900" : ""}`}>
                <span className="flex items-center gap-1">
                  {col}
                  {sortCol === col && <span className="text-orange-500">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const assignee = USERS.find((u) => u.id === row.assigneeId);
            return (
              <tr key={row.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 group cursor-pointer"
                onClick={() => setOpenCard(row)}
              >
                <td className="px-4 py-2 w-8"><input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" onClick={(e) => e.stopPropagation()} /></td>
                <td className="px-3 py-2 font-medium max-w-[240px] sticky left-0 z-10 bg-white dark:bg-gray-900">
                  <span className="truncate block">{row.title}</span>
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <StatusCell card={row} board={board} />
                </td>
                <td className="px-3 py-2">
                  {assignee ? <div className="flex items-center gap-1.5"><UserAvatar user={assignee} size={20} /><span className="text-xs text-gray-500">{assignee.name.split(" ")[0]}</span></div> : "—"}
                </td>
                <td className="px-3 py-2"><PriorityBadge priority={row.priority} /></td>
                <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                  {row.dueDate !== "—" ? <span className="flex items-center gap-0.5"><Calendar className="w-3 h-3" />{row.dueDate}</span> : "—"}
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

// ─── Workload view (assignee × due date timeline) ───────────────────────────

function BoardWorkloadView({ board }: { board: import("@/types").Board }) {
  const rows = flattenBoard(board);
  const byAssignee: Record<string, FlatCard[]> = {};
  rows.forEach((r) => {
    if (!byAssignee[r.assigneeId]) byAssignee[r.assigneeId] = [];
    byAssignee[r.assigneeId].push(r);
  });
  const [openCard, setOpenCard] = useState<FlatCard | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="w-full space-y-4">
        {Object.entries(byAssignee).map(([userId, cards]) => {
          const user = USERS.find((u) => u.id === userId);
          return (
            <div key={userId} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <UserAvatar user={user} size={28} />
                <span className="font-semibold text-sm">{user?.name ?? "Unassigned"}</span>
                <span className="text-xs text-gray-400">{cards.length} items</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {cards.map((card) => (
                  <div key={card.id} onClick={() => setOpenCard(card)}
                    className="flex items-center gap-4 px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors">
                    <span className="flex-1 text-sm font-medium truncate">{card.title}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: card.colColor + "20", color: card.colColor }}>
                      {card.colName}
                    </span>
                    <PriorityBadge priority={card.priority} />
                    {card.dueDate && card.dueDate !== "—" && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                        <Calendar className="w-2.5 h-2.5" /> {card.dueDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {openCard && (
        <CardDetailModal card={openCard} colId={openCard.colId} boardId={board.id} open onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
}

// ─── View switcher ────────────────────────────────────────────────────────────

const VIEWS: { key: ViewType; icon: React.ReactNode; label: string }[] = [
  { key: "board", icon: <Kanban className="w-3.5 h-3.5" />, label: "Board" },
  { key: "list", icon: <List className="w-3.5 h-3.5" />, label: "List" },
  { key: "grid", icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "Grid" },
  { key: "table", icon: <Table2 className="w-3.5 h-3.5" />, label: "Table" },
  { key: "workload", icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Workload" },
];

// ─── Main Board page ─────────────────────────────────────────────────────────

export default function BoardView({ params }: { params: Promise<{ workspaceId: string; boardId: string }> }) {
  const { workspaceId, boardId } = use(params);
  const { boards, workspaces, moveCard, reorderColumns, boardViews, setBoardView } = useAppStore();
  const board = boards.find((b) => b.id === boardId) ?? boards[0];
  const ws = workspaces.find((w) => w.id === (board?.workspaceId ?? workspaceId));
  const [query, setQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");

  const activeView: ViewType = boardViews[board?.id] ?? "board";

  if (!board) return <div className="flex-1 flex items-center justify-center text-gray-400">Board not found</div>;

  const filteredBoard = {
    ...board,
    columns: board.columns.map((c) => ({
      ...c,
      cards: c.cards.filter(
        (card) =>
          (!filterAssignee || card.assigneeId === filterAssignee) &&
          (!query || card.title.toLowerCase().includes(query.toLowerCase()))
      ),
    })),
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    if (type === "COLUMN") {
      reorderColumns(board.id, source.index, destination.index);
      return;
    }
    moveCard(board.id, source.droppableId, destination.droppableId, draggableId, destination.index);
  };

  const totalCards = board.columns.reduce((a, c) => a + c.cards.length, 0);

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "", href: "/dashboard" }, { label: "Boards" }, { label: board.name }]} />}
        right={
          <>
            <div className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-400">
              <Search className="w-3 h-3" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cards" className="w-32 outline-none bg-transparent" />
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Filter className="w-3 h-3" /> {filterAssignee ? USERS.find((u) => u.id === filterAssignee)?.name?.split(" ")[0] : "Assignee"} <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-48 z-50" sideOffset={4}>
                  <DropdownMenu.Item onSelect={() => setFilterAssignee(null)} className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">All assignees</DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  {USERS.map((u) => (
                    <DropdownMenu.Item key={u.id} onSelect={() => setFilterAssignee(u.id)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <UserAvatar user={u} size={18} /> {u.name}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        }
      />

      {/* Board header */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-3xl">{board.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
          <div className="text-xs text-gray-400">{totalCards} cards · {board.columns.length} columns</div>
        </div>
        <div className="flex-1" />

        {/* View switcher */}
        <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setBoardView(board.id, v.key)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
                activeView === v.key
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
        <AvatarGroup users={USERS.slice(0, 5)} size={28} />
        {activeView === "board" && (
          <button onClick={() => setAddingCol(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Column
          </button>
        )}
      </div>

      {/* View content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {activeView === "board" && (
          <BoardKanbanView board={filteredBoard} onDragEnd={onDragEnd}
            addingCol={addingCol} newColName={newColName}
            setNewColName={setNewColName} setAddingCol={setAddingCol} />
        )}
        {activeView === "list" && <BoardListView board={filteredBoard} />}
        {activeView === "grid" && <BoardGridView board={filteredBoard} />}
        {activeView === "table" && <BoardTableView board={filteredBoard} />}
        {activeView === "workload" && <BoardWorkloadView board={filteredBoard} />}
      </div>
    </div>
  );
}
