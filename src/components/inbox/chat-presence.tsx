"use client";
import { cn } from "@/lib/utils";

export type Presence = "online" | "away" | "dnd" | "offline";

const COLOR: Record<Presence, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  dnd: "bg-rose-500",
  offline: "bg-gray-300 dark:bg-gray-600",
};

export function PresenceDot({
  presence,
  size = 8,
  ring = true,
  className,
}: {
  presence: Presence;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        COLOR[presence],
        ring && "ring-2 ring-white dark:ring-[#0F1117]",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

// Deterministic pseudo-presence per user so the UI is stable between renders.
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
