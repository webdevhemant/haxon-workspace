import type { StateCreator } from "zustand";
import type { Workspace } from "@/types";
import { WORKSPACES } from "@/data/dummy-workspaces";
import { USERS } from "@/data/dummy-users";
import type { AppState } from "../app-store";

const WS_COLORS = ["#F97316", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#14B8A6"];

export interface WorkspaceSlice {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  members: typeof USERS;
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (name: string, emoji: string) => void;
}

export const createWorkspaceSlice: StateCreator<AppState, [], [], WorkspaceSlice> = (set, get) => ({
  workspaces: WORKSPACES,
  activeWorkspaceId: "w1",
  members: USERS,
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  addWorkspace: (name, emoji) =>
    set((s) => ({
      workspaces: [
        ...s.workspaces,
        { id: `w${Date.now()}`, name, emoji, color: WS_COLORS[s.workspaces.length % WS_COLORS.length], role: "Owner" },
      ],
    })),
});
