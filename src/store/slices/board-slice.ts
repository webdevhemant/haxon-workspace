import type { StateCreator } from "zustand";
import type { Board, ViewType } from "@/types";
import { BOARDS } from "@/data/dummy-boards";
import type { AppState } from "../app-store";

const BOARD_EMOJIS = ["🗺️", "📋", "🚀", "📌", "🎯", "⚡", "🔥", "💡"];

export interface BoardSlice {
  boards: Board[];
  boardViews: Record<string, ViewType>;
  setBoardView: (boardId: string, view: ViewType) => void;
  addBoard: (workspaceId: string, name: string, emoji: string) => string;
  addColumn: (boardId: string, name: string) => void;
  reorderColumns: (boardId: string, fromIndex: number, toIndex: number) => void;
  addCard: (boardId: string, colId: string, title: string) => void;
  updateCard: (boardId: string, colId: string, cardId: string, patch: object) => void;
  deleteCard: (boardId: string, colId: string, cardId: string) => void;
  moveCard: (boardId: string, fromColId: string, toColId: string, cardId: string, toIndex: number) => void;
  moveCardByStatus: (boardId: string, cardId: string, toColName: string) => void;
  addSubtask: (boardId: string, colId: string, cardId: string, title: string) => void;
  toggleSubtask: (boardId: string, colId: string, cardId: string, subtaskId: string) => void;
  deleteSubtask: (boardId: string, colId: string, cardId: string, subtaskId: string) => void;
  addComment: (boardId: string, colId: string, cardId: string, text: string) => void;
  toggleFollower: (boardId: string, colId: string, cardId: string, userId: string) => void;
}

let cardCounter = 100;

export const createBoardSlice: StateCreator<AppState, [], [], BoardSlice> = (set, get) => ({
  boards: BOARDS,
  boardViews: {},

  setBoardView: (boardId, view) => set((s) => ({ boardViews: { ...s.boardViews, [boardId]: view } })),

  addBoard: (workspaceId, name, emoji) => {
    const id = `b${Date.now()}`;
    set((s) => ({
      boards: [
        ...s.boards,
        {
          id,
          workspaceId,
          name,
          emoji,
          columns: [
            { id: `col${Date.now()}1`, name: "Backlog", color: "#78716C", cards: [] },
            { id: `col${Date.now()}2`, name: "In Progress", color: "#F59E0B", cards: [] },
            { id: `col${Date.now()}3`, name: "Done", color: "#10B981", cards: [] },
          ],
        },
      ],
    }));
    return id;
  },

  addColumn: (boardId, name) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId
          ? b
          : { ...b, columns: [...b.columns, { id: `col${Date.now()}`, name, color: "#6B7280", cards: [] }] }
      ),
    })),

  reorderColumns: (boardId, fromIndex, toIndex) =>
    set((s) => ({
      boards: s.boards.map((b) => {
        if (b.id !== boardId) return b;
        const cols = [...b.columns];
        const [removed] = cols.splice(fromIndex, 1);
        cols.splice(toIndex, 0, removed);
        return { ...b, columns: cols };
      }),
    })),

  addCard: (boardId, colId, title) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId
          ? b
          : {
              ...b,
              columns: b.columns.map((c) =>
                c.id !== colId
                  ? c
                  : {
                      ...c,
                      cards: [
                        ...c.cards,
                        { id: `k${++cardCounter}`, title, priority: "Medium" as const, assigneeId: "u1", dueDate: "—", tags: [] },
                      ],
                    }
              ),
            }
      ),
    })),

  updateCard: (boardId, colId, cardId, patch) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId
          ? b
          : {
              ...b,
              columns: b.columns.map((c) =>
                c.id !== colId
                  ? c
                  : { ...c, cards: c.cards.map((k) => (k.id !== cardId ? k : { ...k, ...patch })) }
              ),
            }
      ),
    })),

  deleteCard: (boardId, colId, cardId) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId
          ? b
          : {
              ...b,
              columns: b.columns.map((c) =>
                c.id !== colId ? c : { ...c, cards: c.cards.filter((k) => k.id !== cardId) }
              ),
            }
      ),
    })),

  moveCard: (boardId, fromColId, toColId, cardId, toIndex) =>
    set((s) => {
      const board = s.boards.find((b) => b.id === boardId);
      if (!board) return {};
      const fromCol = board.columns.find((c) => c.id === fromColId);
      const card = fromCol?.cards.find((k) => k.id === cardId);
      if (!card) return {};
      return {
        boards: s.boards.map((b) =>
          b.id !== boardId
            ? b
            : {
                ...b,
                columns: b.columns.map((c) => {
                  if (c.id === fromColId) return { ...c, cards: c.cards.filter((k) => k.id !== cardId) };
                  if (c.id === toColId) {
                    const cards = [...c.cards.filter((k) => k.id !== cardId)];
                    cards.splice(toIndex, 0, card);
                    return { ...c, cards };
                  }
                  return c;
                }),
              }
        ),
      };
    }),

  moveCardByStatus: (boardId, cardId, toColName) =>
    set((s) => {
      const board = s.boards.find((b) => b.id === boardId);
      if (!board) return {};
      let card = null as typeof board.columns[0]["cards"][0] | null;
      let fromColId = "";
      for (const col of board.columns) {
        const found = col.cards.find((k) => k.id === cardId);
        if (found) { card = found; fromColId = col.id; break; }
      }
      if (!card) return {};
      const toCol = board.columns.find((c) => c.name === toColName);
      if (!toCol || toCol.id === fromColId) return {};
      return {
        boards: s.boards.map((b) =>
          b.id !== boardId
            ? b
            : {
                ...b,
                columns: b.columns.map((c) => {
                  if (c.id === fromColId) return { ...c, cards: c.cards.filter((k) => k.id !== cardId) };
                  if (c.id === toCol.id) return { ...c, cards: [...c.cards, card!] };
                  return c;
                }),
              }
        ),
      };
    }),

  addSubtask: (boardId, colId, cardId, title) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map((c) =>
            c.id !== colId ? c : {
              ...c,
              cards: c.cards.map((k) =>
                k.id !== cardId ? k : {
                  ...k,
                  subtasks: [...(k.subtasks ?? []), { id: `st${Date.now()}`, title, done: false }],
                }
              ),
            }
          ),
        }
      ),
    })),

  toggleSubtask: (boardId, colId, cardId, subtaskId) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map((c) =>
            c.id !== colId ? c : {
              ...c,
              cards: c.cards.map((k) =>
                k.id !== cardId ? k : {
                  ...k,
                  subtasks: (k.subtasks ?? []).map((st) =>
                    st.id !== subtaskId ? st : { ...st, done: !st.done }
                  ),
                }
              ),
            }
          ),
        }
      ),
    })),

  deleteSubtask: (boardId, colId, cardId, subtaskId) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map((c) =>
            c.id !== colId ? c : {
              ...c,
              cards: c.cards.map((k) =>
                k.id !== cardId ? k : {
                  ...k,
                  subtasks: (k.subtasks ?? []).filter((st) => st.id !== subtaskId),
                }
              ),
            }
          ),
        }
      ),
    })),

  addComment: (boardId, colId, cardId, text) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map((c) =>
            c.id !== colId ? c : {
              ...c,
              cards: c.cards.map((k) =>
                k.id !== cardId ? k : {
                  ...k,
                  comments: [...(k.comments ?? []), { id: `cm${Date.now()}`, userId: "u1", text, at: "just now" }],
                }
              ),
            }
          ),
        }
      ),
    })),

  toggleFollower: (boardId, colId, cardId, userId) =>
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map((c) =>
            c.id !== colId ? c : {
              ...c,
              cards: c.cards.map((k) => {
                if (k.id !== cardId) return k;
                const followers = k.followers ?? [];
                return {
                  ...k,
                  followers: followers.includes(userId)
                    ? followers.filter((f) => f !== userId)
                    : [...followers, userId],
                };
              }),
            }
          ),
        }
      ),
    })),
});
