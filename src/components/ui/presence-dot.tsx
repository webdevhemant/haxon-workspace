"use client";
import { cn } from "@/lib/utils";
import { PRESENCE_COLOR, type Presence } from "@/data/dummy-presence";

interface Props {
  presence: Presence;
  size?: number;
  ring?: boolean;
  className?: string;
}

export function PresenceDot({ presence, size = 8, ring = true, className }: Props) {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        PRESENCE_COLOR[presence],
        ring && "ring-2 ring-white dark:ring-[#0F1117]",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
