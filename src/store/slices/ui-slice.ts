import type { StateCreator } from "zustand";
import type { ModalConfig } from "@/types";
import type { AppState } from "../app-store";

export interface UISlice {
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  commandOpen: boolean;
  modal: ModalConfig | null;
  expandedFolders: Record<string, boolean>;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  openCommand: () => void;
  closeCommand: () => void;
  toggleFolder: (key: string) => void;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  sidebarCollapsed: false,
  aiPanelOpen: false,
  commandOpen: false,
  modal: null,
  expandedFolders: { "w1-Docs": true, "w1-Boards": true },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleAiPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  openCommand: () => set({ commandOpen: true }),
  closeCommand: () => set({ commandOpen: false }),
  toggleFolder: (key) => set((s) => ({ expandedFolders: { ...s.expandedFolders, [key]: !s.expandedFolders[key] } })),
  openModal: (config) => set({ modal: config }),
  closeModal: () => set({ modal: null }),
});
