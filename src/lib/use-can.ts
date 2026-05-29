"use client";
import { useAppStore } from "@/store/app-store";
import { asRole, can, type Capability } from "./rbac";

export function useCurrentRole() {
  const ws = useAppStore((s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId));
  return asRole(ws?.role ?? "Member");
}

export function useCan(capability: Capability): boolean {
  const role = useCurrentRole();
  return can(role, capability);
}

export function useCapDenialReason(capability: Capability): string | null {
  const role = useCurrentRole();
  if (can(role, capability)) return null;
  return `Your role (${role}) can't ${humanize(capability)}.`;
}

function humanize(cap: Capability): string {
  return cap.replace(/\./g, " ").replace(/([A-Z])/g, " $1").toLowerCase();
}
