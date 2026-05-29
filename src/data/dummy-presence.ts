export type Presence = "online" | "away" | "dnd" | "offline";

const PRESET: Record<string, Presence> = {
  u1: "online",
  u2: "online",
  u3: "online",
  u4: "away",
  u5: "dnd",
  u6: "offline",
};

export function presenceFor(userId: string): Presence {
  return PRESET[userId] ?? "offline";
}

export const PRESENCE_LABEL: Record<Presence, string> = {
  online: "Active",
  away: "Away",
  dnd: "Do not disturb",
  offline: "Offline",
};

export const PRESENCE_COLOR: Record<Presence, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-gray-300 dark:bg-gray-600",
};
