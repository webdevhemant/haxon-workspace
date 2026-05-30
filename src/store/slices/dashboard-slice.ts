"use client";
import type { StateCreator } from "zustand";
import type { AppState } from "../app-store";

export interface Goal {
  id: string;
  title: string;
  progress: number;
  color: string;
}

const DEFAULT_GOALS: Goal[] = [
  { id: "g1", title: "Ship Sync Engine v2", progress: 65, color: "#F97316" },
  { id: "g2", title: "Reach 1k weekly active teams", progress: 38, color: "#3B82F6" },
  { id: "g3", title: "Publish AI roadmap doc", progress: 80, color: "#10B981" },
];

export interface DashboardSlice {
  goals: Goal[];
  setGoalTitle: (id: string, title: string) => void;
  setGoalProgress: (id: string, progress: number) => void;
}

export const createDashboardSlice: StateCreator<AppState, [], [], DashboardSlice> = (set) => ({
  goals: DEFAULT_GOALS,
  setGoalTitle: (id, title) =>
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, title } : g)),
    })),
  setGoalProgress: (id, progress) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, progress: Math.max(0, Math.min(100, Math.round(progress))) } : g,
      ),
    })),
});
