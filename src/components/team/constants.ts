import type { Presence } from "@/data/dummy-presence";

export type TeamView = "grid" | "list" | "org";

export const TEAM_VIEWS: { key: TeamView; label: string }[] = [
  { key: "grid", label: "Grid" },
  { key: "list", label: "List" },
  { key: "org", label: "By team" },
];

export type TeamSort = "name" | "title" | "team" | "joined";
export const TEAM_SORTS: { key: TeamSort; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "team", label: "Team" },
  { key: "joined", label: "Joined" },
];

export type TeamRoleFilter = "all" | "Owner" | "Admin" | "Member";
export type TeamPresenceFilter = "all" | Presence;
