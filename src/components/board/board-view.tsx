"use client";
import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, Search, Filter, X, Calendar, ChevronDown } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Card, Column } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";

function CardItem({ card, colId, boardId, index }: { card: Card; colId: string; boardId: string; index: number }) {
  const [open, setOpen] = useState(false);
  const { updateCard } = useAppStore();
  const assignee = USERS.find((u) => u.id === card.assigneeId);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
            onClick={() => setOpen(true)}
            className={cn(
              "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer select-none",
              "hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-150",
              snapshot.isDragging && "shadow-xl rotate-1 scale-105 opacity-90",
            )}>
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

      {/* Card detail modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[720px] max-h-[85vh] flex flex-col z-50 overflow-hidden">
            <div className="flex items-center px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <div className="text-xs text-gray-400">Card · {card.id}</div>
              <div className="flex-1" />
              <IconBtn icon={<X className="w-3.5 h-3.5" />} tooltip="Close" onClick={() => setOpen(false)} />
            </div>
            <div className="flex-1 overflow-auto grid grid-cols-[1fr_200px]">
              <div className="p-6 border-r border-gray-100 dark:border-gray-800">
                <input defaultValue={card.title} onBlur={(e) => updateCard(boardId, colId, card.id, { title: e.target.value })}
                  className="w-full text-xl font-bold tracking-tight bg-transparent border-0 outline-none mb-5 text-gray-900 dark:text-white" />
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</div>
                <textarea defaultValue={card.description || "Add a description..."} rows={4}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-orange-500/30 text-gray-700 dark:text-gray-300" />
                <div className="mt-6">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Activity</div>
                  {[
                    { user: "Diego", text: "moved this from Backlog to In Progress", at: "2 hours ago" },
                    { user: "Maya", text: "assigned Jordan", at: "5 hours ago" },
                  ].map((a, i) => (
                    <div key={i} className="flex gap-2.5 items-start mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{a.user[0]}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <strong className="text-gray-900 dark:text-white">{a.user}</strong> {a.text}
                        <div className="text-gray-400 mt-0.5">{a.at}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-950 flex flex-col gap-4">
                {[
                  { label: "Assignee", content: assignee ? <div className="flex items-center gap-2 text-sm"><UserAvatar user={assignee} size={18} />{assignee.name}</div> : "Unassigned" },
                  { label: "Priority", content: <PriorityBadge priority={card.priority} /> },
                  { label: "Due date", content: <span className="text-sm">{card.dueDate}</span> },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{f.label}</div>
                    {typeof f.content === "string" ? <div className="text-sm text-gray-600 dark:text-gray-400">{f.content}</div> : f.content}
                  </div>
                ))}
                {card.tags && card.tags.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((t) => <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded">{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function KanbanColumn({ col, boardId }: { col: Column; boardId: string }) {
  const { addCard, openModal } = useAppStore();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const submit = () => {
    if (newTitle.trim()) { addCard(boardId, col.id, newTitle.trim()); }
    setNewTitle(""); setAdding(false);
  };

  return (
    <div className="flex-none w-[300px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col max-h-full">
      <div className="px-3.5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
        <span className="font-semibold text-sm flex-1">{col.name}</span>
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
        <button onClick={() => setAdding(true)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-44 z-50" sideOffset={4}>
              <DropdownMenu.Item className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Rename</DropdownMenu.Item>
              <DropdownMenu.Item className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Clear column</DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
              <DropdownMenu.Item onSelect={() => openModal({ type: "delete", kind: "column", name: col.name })}
                className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950">Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={cn("flex-1 overflow-y-auto p-2 flex flex-col gap-2 min-h-[60px] transition-colors", snapshot.isDraggingOver && "bg-orange-50 dark:bg-orange-950/20")}>
            {col.cards.map((card, i) => (
              <CardItem key={card.id} card={card} colId={col.id} boardId={boardId} index={i} />
            ))}
            {provided.placeholder}
            <AnimatePresence>
              {adding && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-900 border-2 border-orange-400 rounded-lg p-2.5">
                  <textarea autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } if (e.key === "Escape") setAdding(false); }}
                    placeholder="Card title..." rows={2}
                    className="w-full text-sm resize-none border-0 outline-none bg-transparent" />
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

export default function BoardView({ params }: { params: Promise<{ workspaceId: string; boardId: string }> }) {
  const { workspaceId, boardId } = use(params);
  const { boards, workspaces, moveCard, addColumn } = useAppStore();
  const board = boards.find((b) => b.id === boardId) ?? boards[0];
  const ws = workspaces.find((w) => w.id === (board?.workspaceId ?? workspaceId));
  const [query, setQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [addingCol, setAddingCol] = useState(false);
  const [newColName, setNewColName] = useState("");

  if (!board) return <div className="flex-1 flex items-center justify-center text-gray-400">Board not found</div>;

  const filteredCols = board.columns.map((c) => ({
    ...c,
    cards: c.cards.filter((card) =>
      (!filterAssignee || card.assigneeId === filterAssignee) &&
      (!filterPriority || card.priority === filterPriority) &&
      (!query || card.title.toLowerCase().includes(query.toLowerCase()))
    ),
  }));

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    moveCard(board.id, source.droppableId, destination.droppableId, draggableId, destination.index);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "", href: "/dashboard" }, { label: "Boards" }, { label: board.name }]} />}
        right={
          <>
            <div className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-400">
              <Search className="w-3 h-3" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cards" className="w-40 outline-none bg-transparent" />
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Filter className="w-3 h-3" /> {filterAssignee ? USERS.find((u) => u.id === filterAssignee)?.name : "Assignee"} <ChevronDown className="w-3 h-3" />
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {filterPriority || "Priority"} <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-40 z-50" sideOffset={4}>
                  <DropdownMenu.Item onSelect={() => setFilterPriority(null)} className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">All priorities</DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  {["High", "Medium", "Low"].map((p) => (
                    <DropdownMenu.Item key={p} onSelect={() => setFilterPriority(p)} className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{p}</DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        }
      />

      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-3xl">{board.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
          <div className="text-xs text-gray-400">{board.columns.reduce((a, c) => a + c.cards.length, 0)} cards · Updated 2h ago</div>
        </div>
        <div className="flex-1" />
        <AvatarGroup users={USERS.slice(0, 5)} size={28} />
        <button
          onClick={() => setAddingCol(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Column
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 p-5 h-full min-h-0">
            {filteredCols.map((col) => (
              <KanbanColumn key={col.id} col={col} boardId={board.id} />
            ))}
            <AnimatePresence>
              {addingCol && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 300 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-none bg-gray-50 dark:bg-gray-900 border-2 border-orange-400 rounded-xl p-3 self-start overflow-hidden"
                  style={{ width: 300 }}
                >
                  <input
                    autoFocus
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newColName.trim()) {
                        addColumn(board.id, newColName.trim());
                        setNewColName("");
                        setAddingCol(false);
                      }
                      if (e.key === "Escape") { setAddingCol(false); setNewColName(""); }
                    }}
                    placeholder="Column name…"
                    className="w-full text-sm font-semibold bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 mb-3"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        if (newColName.trim()) { addColumn(board.id, newColName.trim()); }
                        setNewColName(""); setAddingCol(false);
                      }}
                      className="px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingCol(false); setNewColName(""); }}
                      className="px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
