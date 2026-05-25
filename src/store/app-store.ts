"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Doc, Board, Workspace, ActivityItem, GridRow, ModalConfig } from "@/types";
import { DOCS } from "@/data/dummy-docs";
import { BOARDS } from "@/data/dummy-boards";
import { WORKSPACES } from "@/data/dummy-workspaces";
import { ACTIVITY, GRID_ROWS } from "@/data/dummy-activity";
import { USERS, CURRENT_USER } from "@/data/dummy-users";

interface AppState {
  isAuthenticated: boolean;
  user: typeof CURRENT_USER;
  docs: Doc[];
  boards: Board[];
  workspaces: Workspace[];
  activity: ActivityItem[];
  gridRows: GridRow[];
  members: typeof USERS;
  activeWorkspaceId: string;
  favorites: string[];
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  commandOpen: boolean;
  modal: ModalConfig | null;
  expandedFolders: Record<string, boolean>;

  // auth
  login: (email: string) => void;
  logout: () => void;

  // workspace
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (name: string, emoji: string) => void;

  // docs
  updateDoc: (id: string, patch: Partial<Doc>) => void;
  deleteDoc: (id: string) => void;
  duplicateDoc: (id: string) => void;
  renameDoc: (id: string, title: string) => void;
  toggleFavorite: (id: string) => void;

  // boards
  addCard: (boardId: string, colId: string, title: string) => void;
  updateCard: (boardId: string, colId: string, cardId: string, patch: object) => void;
  deleteCard: (boardId: string, colId: string, cardId: string) => void;
  moveCard: (boardId: string, fromColId: string, toColId: string, cardId: string, toIndex: number) => void;
  addColumn: (boardId: string, name: string) => void;

  // grid
  updateGridRow: (id: string, patch: Partial<GridRow>) => void;
  addGridRow: () => void;

  // ui
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  toggleFolder: (key: string) => void;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  openCommand: () => void;
  closeCommand: () => void;
}

let cardCounter = 100;

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      isAuthenticated: false,
      user: CURRENT_USER,
      docs: DOCS,
      boards: BOARDS,
      workspaces: WORKSPACES,
      activity: ACTIVITY,
      gridRows: GRID_ROWS,
      members: USERS,
      activeWorkspaceId: "w1",
      favorites: ["d1", "d2", "d4"],
      sidebarCollapsed: false,
      aiPanelOpen: false,
      commandOpen: false,
      modal: null,
      expandedFolders: { "w1-Docs": true, "w1-Boards": true, "w1-Grids": true },

      login: (email) => set({ isAuthenticated: true, user: USERS.find(u => u.email === email) || CURRENT_USER }),
      logout: () => set({ isAuthenticated: false }),

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      addWorkspace: (name, emoji) => set(s => {
        const id = `w${Date.now()}`;
        const colors = ["#F97316", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#14B8A6"];
        const color = colors[s.workspaces.length % colors.length];
        return { workspaces: [...s.workspaces, { id, name, emoji, color, role: "Owner" }] };
      }),

      updateDoc: (id, patch) => set(s => ({ docs: s.docs.map(d => d.id === id ? { ...d, ...patch } : d) })),
      deleteDoc: (id) => set(s => ({ docs: s.docs.filter(d => d.id !== id), favorites: s.favorites.filter(f => f !== id) })),
      duplicateDoc: (id) => set(s => {
        const doc = s.docs.find(d => d.id === id);
        if (!doc) return {};
        return { docs: [...s.docs, { ...doc, id: `d${Date.now()}`, title: `${doc.title} (copy)`, isFavorite: false }] };
      }),
      renameDoc: (id, title) => set(s => ({ docs: s.docs.map(d => d.id === id ? { ...d, title } : d) })),
      toggleFavorite: (id) => set(s => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id],
      })),

      addCard: (boardId, colId, title) => set(s => ({
        boards: s.boards.map(b => b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map(c => c.id !== colId ? c : {
            ...c,
            cards: [...c.cards, { id: `k${++cardCounter}`, title, priority: "Medium", assigneeId: "u1", dueDate: "—", tags: [] }],
          }),
        }),
      })),
      updateCard: (boardId, colId, cardId, patch) => set(s => ({
        boards: s.boards.map(b => b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map(c => c.id !== colId ? c : {
            ...c,
            cards: c.cards.map(k => k.id !== cardId ? k : { ...k, ...patch }),
          }),
        }),
      })),
      deleteCard: (boardId, colId, cardId) => set(s => ({
        boards: s.boards.map(b => b.id !== boardId ? b : {
          ...b,
          columns: b.columns.map(c => c.id !== colId ? c : { ...c, cards: c.cards.filter(k => k.id !== cardId) }),
        }),
      })),
      addColumn: (boardId, name) => set(s => ({
        boards: s.boards.map(b => b.id !== boardId ? b : {
          ...b,
          columns: [...b.columns, { id: `col${Date.now()}`, name, color: "#6B7280", cards: [] }],
        }),
      })),

      moveCard: (boardId, fromColId, toColId, cardId, toIndex) => set(s => {
        const board = s.boards.find(b => b.id === boardId);
        if (!board) return {};
        const fromCol = board.columns.find(c => c.id === fromColId);
        const card = fromCol?.cards.find(k => k.id === cardId);
        if (!card) return {};
        return {
          boards: s.boards.map(b => b.id !== boardId ? b : {
            ...b,
            columns: b.columns.map(c => {
              if (c.id === fromColId) return { ...c, cards: c.cards.filter(k => k.id !== cardId) };
              if (c.id === toColId) {
                const cards = [...c.cards.filter(k => k.id !== cardId)];
                cards.splice(toIndex, 0, card);
                return { ...c, cards };
              }
              return c;
            }),
          }),
        };
      }),

      updateGridRow: (id, patch) => set(s => ({ gridRows: s.gridRows.map(r => r.id === id ? { ...r, ...patch } : r) })),
      addGridRow: () => set(s => ({
        gridRows: [...s.gridRows, { id: `g${Date.now()}`, name: "New item", status: "Backlog", assigneeId: "u1", priority: "Medium", dueDate: "—", tags: [], created: "Today" }],
      })),

      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleAiPanel: () => set(s => ({ aiPanelOpen: !s.aiPanelOpen })),
      toggleFolder: (key) => set(s => ({ expandedFolders: { ...s.expandedFolders, [key]: !s.expandedFolders[key] } })),
      openModal: (config) => set({ modal: config }),
      closeModal: () => set({ modal: null }),
      openCommand: () => set({ commandOpen: true }),
      closeCommand: () => set({ commandOpen: false }),
    }),
    {
      name: "haxon-store",
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, user: s.user, activeWorkspaceId: s.activeWorkspaceId, favorites: s.favorites }),
    }
  )
);
