"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, Calendar } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Board, Card, Column } from "@/types";
import { CardDetailModal } from "../card-detail-modal";

function KanbanCard({ card, colId, boardId, index, colColor }: { card: Card; colId: string; boardId: string; index: number; colColor: string }) {
  const [open, setOpen] = useState(false);
  const assignee = USERS.find((u) => u.id === card.assigneeId);
  const subtasks = card.subtasks ?? [];
  const doneSubtasks = subtasks.filter((s) => s.done).length;
  const subtaskPct = subtasks.length > 0 ? (doneSubtasks / subtasks.length) * 100 : 0;

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
            <div className="font-medium text-sm leading-snug mb-1">{card.title}</div>
            {card.description && card.description.trim().length > 0 && (
              <div className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-2">
                {card.description.trim().slice(0, 65)}{card.description.trim().length > 65 ? "…" : ""}
              </div>
            )}
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] rounded font-medium">{t}</span>
                ))}
              </div>
            )}
            {subtasks.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-gray-400">{doneSubtasks}/{subtasks.length} subtasks</span>
                </div>
                <div className="h-0.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${subtaskPct}%`, background: colColor }}
                  />
                </div>
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

  const total = col.cards.length;
  const doneCards = col.cards.filter((card) => {
    const subtasks = card.subtasks ?? [];
    if (subtasks.length === 0) return col.name === "Done";
    return subtasks.every((s) => s.done);
  }).length;
  const progressPct = total > 0 ? (doneCards / total) * 100 : 0;

  return (
    <div className="flex-none w-[272px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col max-h-full">
      <div {...dragHandleProps} className="px-3.5 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
          <span className="font-semibold text-sm flex-1">{col.name}</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
          <button onClick={() => setAdding(true)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {total > 0 && (
          <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: col.color }}
            />
          </div>
        )}
      </div>
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn("flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 min-h-[60px] transition-colors", snapshot.isDraggingOver && "bg-orange-50 dark:bg-orange-950/20")}
          >
            {col.cards.map((card, i) => <KanbanCard key={card.id} card={card} colId={col.id} boardId={boardId} index={i} colColor={col.color} />)}
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

export function BoardKanbanView({ board, onDragEnd, addingCol, newColName, setNewColName, setAddingCol }: {
  board: Board;
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
