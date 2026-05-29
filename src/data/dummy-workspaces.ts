import type { Workspace } from "@/types";

export const WORKSPACES: Workspace[] = [
  { id: "w1", name: "Northwind Studio", emoji: "🌊", color: "#0EA5E9", role: "Owner" },
  { id: "w2", name: "Lumen Labs", emoji: "💡", color: "#F59E0B", role: "Admin" },
  { id: "w3", name: "Acme Marketing", emoji: "📣", color: "#10B981", role: "Member" },
  { id: "w4", name: "Vellum (guest)", emoji: "🌿", color: "#8B5CF6", role: "Guest" },
];
