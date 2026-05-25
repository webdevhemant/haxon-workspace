import type { StateCreator } from "zustand";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import type { AppState } from "../app-store";

export interface AuthSlice {
  isAuthenticated: boolean;
  user: typeof CURRENT_USER;
  login: (email: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: CURRENT_USER,
  login: (email) => set({ isAuthenticated: true, user: USERS.find((u) => u.email === email) || CURRENT_USER }),
  logout: () => set({ isAuthenticated: false }),
});
