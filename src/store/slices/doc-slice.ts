import type { StateCreator } from "zustand";
import type { Doc, ActivityItem } from "@/types";
import { DOCS } from "@/data/dummy-docs";
import { ACTIVITY } from "@/data/dummy-activity";
import type { AppState } from "../app-store";

export interface DocSlice {
  docs: Doc[];
  activity: ActivityItem[];
  favorites: string[];
  updateDoc: (id: string, patch: Partial<Doc>) => void;
  deleteDoc: (id: string) => void;
  duplicateDoc: (id: string) => void;
  renameDoc: (id: string, title: string) => void;
  addDoc: (workspaceId: string, title: string, emoji: string, folder: string) => void;
  toggleFavorite: (id: string) => void;
}

export const createDocSlice: StateCreator<AppState, [], [], DocSlice> = (set) => ({
  docs: DOCS,
  activity: ACTIVITY,
  favorites: ["d1", "d2", "d4"],

  updateDoc: (id, patch) => set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  deleteDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id), favorites: s.favorites.filter((f) => f !== id) })),
  duplicateDoc: (id) =>
    set((s) => {
      const doc = s.docs.find((d) => d.id === id);
      if (!doc) return {};
      return { docs: [...s.docs, { ...doc, id: `d${Date.now()}`, title: `${doc.title} (copy)`, isFavorite: false }] };
    }),
  renameDoc: (id, title) => set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, title } : d)) })),
  addDoc: (workspaceId, title, emoji, folder) =>
    set((s) => ({
      docs: [
        ...s.docs,
        {
          id: `d${Date.now()}`,
          workspaceId,
          title,
          folder,
          emoji,
          isFavorite: false,
          lastEditedBy: "u1",
          lastEditedAt: "just now",
          type: "doc" as const,
          content: [{ type: "h1" as const, text: title }, { type: "p" as const, text: "" }],
        },
      ],
    })),
  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    })),
});
