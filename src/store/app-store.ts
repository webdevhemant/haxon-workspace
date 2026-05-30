"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSlice } from "./slices/auth-slice";
import type { WorkspaceSlice } from "./slices/workspace-slice";
import type { DocSlice } from "./slices/doc-slice";
import type { BoardSlice } from "./slices/board-slice";
import type { UISlice } from "./slices/ui-slice";
import type { ProfileSlice } from "./slices/profile-slice";
import type { InboxSlice } from "./slices/inbox-slice";
import type { DashboardSlice } from "./slices/dashboard-slice";
import { createAuthSlice } from "./slices/auth-slice";
import { createWorkspaceSlice } from "./slices/workspace-slice";
import { createDocSlice } from "./slices/doc-slice";
import { createBoardSlice } from "./slices/board-slice";
import { createUISlice } from "./slices/ui-slice";
import { createProfileSlice } from "./slices/profile-slice";
import { createInboxSlice } from "./slices/inbox-slice";
import { createDashboardSlice } from "./slices/dashboard-slice";

export type AppState = AuthSlice &
  WorkspaceSlice &
  DocSlice &
  BoardSlice &
  UISlice &
  ProfileSlice &
  InboxSlice &
  DashboardSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createWorkspaceSlice(...a),
      ...createDocSlice(...a),
      ...createBoardSlice(...a),
      ...createUISlice(...a),
      ...createProfileSlice(...a),
      ...createInboxSlice(...a),
      ...createDashboardSlice(...a),
    }),
    {
      name: "haxon-store",
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        activeWorkspaceId: s.activeWorkspaceId,
        favorites: s.favorites,
        boardViews: s.boardViews,
        profiles: s.profiles,
        savedMessageIds: s.savedMessageIds,
        scheduledMessages: s.scheduledMessages,
        goals: s.goals,
      }),
    }
  )
);
