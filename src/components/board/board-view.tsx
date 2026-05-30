"use client";
import { use, useState } from "react";
import { Plus, Search, Filter, ChevronDown, Lock } from "lucide-react";
import type { DropResult } from "@hello-pangea/dnd";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import { useCan, useCurrentRole } from "@/lib/use-can";
import type { ViewType } from "@/types";
import { VIEWS } from "./constants";
import { BoardKanbanView } from "./views/kanban-view";
import { BoardListView } from "./views/list-view";
import { BoardGridView } from "./views/grid-view";
import { BoardTableView } from "./views/table-view";
import { BoardWorkloadView } from "./views/workload-view";

export default function BoardView({ params }: { params: Promise<{ workspaceId: string; boardId: string }> }) {
  const { workspaceId, boardId } = use(params);
  const { boards, workspaces, moveCard, reorderColumns, boardViews, setBoardView } = useAppStore();
  const board = boards.find((b) => b.id === boardId) ?? boards[0];
  const ws = workspaces.find((w) => w.id === (board?.workspaceId ?? workspaceId));
  const role = useCurrentRole();
  const canEditBoard = useCan("board.edit");
  const canMoveCards = useCan("board.move");
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
          (!query || card.title.toLowerCase().includes(query.toLowerCase())),
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
            <AssigneeFilter value={filterAssignee} onChange={setFilterAssignee} />
          </>
        }
      />

      <BoardHeader
        board={board}
        totalCards={totalCards}
        activeView={activeView}
        onChangeView={(v) => setBoardView(board.id, v)}
        onAddColumn={() => setAddingCol(true)}
        canEdit={canEditBoard}
        canMove={canMoveCards}
        role={role}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {activeView === "board" && (
          <BoardKanbanView
            board={filteredBoard}
            onDragEnd={onDragEnd}
            addingCol={addingCol}
            newColName={newColName}
            setNewColName={setNewColName}
            setAddingCol={setAddingCol}
            canEdit={canEditBoard}
            canMove={canMoveCards}
          />
        )}
        {activeView === "list" && <BoardListView board={filteredBoard} />}
        {activeView === "grid" && <BoardGridView board={filteredBoard} canEdit={canEditBoard} />}
        {activeView === "table" && <BoardTableView board={filteredBoard} />}
        {activeView === "workload" && <BoardWorkloadView board={filteredBoard} />}
      </div>
    </div>
  );
}

function BoardHeader({
  board, totalCards, activeView, onChangeView, onAddColumn, canEdit, canMove, role,
}: {
  board: import("@/types").Board;
  totalCards: number;
  activeView: ViewType;
  onChangeView: (v: ViewType) => void;
  onAddColumn: () => void;
  canEdit: boolean;
  canMove: boolean;
  role: string;
}) {
  const readOnly = !canEdit && !canMove;
  return (
    <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
      <span className="text-3xl">{board.emoji}</span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
        <div className="text-xs text-gray-400">{totalCards} cards · {board.columns.length} columns</div>
      </div>
      {readOnly && (
        <span
          title={`Your role (${role}) is read-only on boards`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500"
        >
          <Lock className="w-3 h-3" /> Read-only
        </span>
      )}
      <div className="flex-1" />
      <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => onChangeView(v.key)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
              activeView === v.key
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>
      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
      <AvatarGroup users={USERS.slice(0, 5)} size={28} />
      {activeView === "board" && canEdit && (
        <button
          onClick={onAddColumn}
          title={`New column`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Column
        </button>
      )}
    </div>
  );
}

function AssigneeFilter({
  value, onChange,
}: { value: string | null; onChange: (v: string | null) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
          <Filter className="w-3 h-3" /> {value ? USERS.find((u) => u.id === value)?.name?.split(" ")[0] : "Assignee"} <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-48 z-50" sideOffset={4}>
          <DropdownMenu.Item onSelect={() => onChange(null)} className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            All assignees
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
          {USERS.map((u) => (
            <DropdownMenu.Item
              key={u.id}
              onSelect={() => onChange(u.id)}
              className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <UserAvatar user={u} size={18} /> {u.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
