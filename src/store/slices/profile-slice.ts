"use client";
import type { StateCreator } from "zustand";
import { TEAM_PROFILES } from "@/data/dummy-team";
import type { TeamMemberProfile } from "@/types";

export interface ProfileSlice {
  profiles: TeamMemberProfile[];
  updateProfile: (userId: string, patch: Partial<TeamMemberProfile>) => void;
  addProfileSkill: (userId: string, skill: string) => void;
  removeProfileSkill: (userId: string, skill: string) => void;
  addProfileLink: (userId: string, label: string, href: string) => void;
  removeProfileLink: (userId: string, href: string) => void;
}

export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set) => ({
  profiles: TEAM_PROFILES,
  updateProfile: (userId, patch) =>
    set((s) => ({
      profiles: s.profiles.map((p) => (p.userId === userId ? { ...p, ...patch } : p)),
    })),
  addProfileSkill: (userId, skill) =>
    set((s) => ({
      profiles: s.profiles.map((p) =>
        p.userId === userId && !p.skills.includes(skill)
          ? { ...p, skills: [...p.skills, skill] }
          : p,
      ),
    })),
  removeProfileSkill: (userId, skill) =>
    set((s) => ({
      profiles: s.profiles.map((p) =>
        p.userId === userId
          ? { ...p, skills: p.skills.filter((x) => x !== skill) }
          : p,
      ),
    })),
  addProfileLink: (userId, label, href) =>
    set((s) => ({
      profiles: s.profiles.map((p) =>
        p.userId === userId
          ? { ...p, links: [...(p.links ?? []), { label, href }] }
          : p,
      ),
    })),
  removeProfileLink: (userId, href) =>
    set((s) => ({
      profiles: s.profiles.map((p) =>
        p.userId === userId
          ? { ...p, links: (p.links ?? []).filter((l) => l.href !== href) }
          : p,
      ),
    })),
});
