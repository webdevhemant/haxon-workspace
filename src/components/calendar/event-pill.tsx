"use client";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";
import { EVENT_TYPE_COLOR } from "./event-style";

interface Props {
  event: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}

export function EventPill({ event, onClick, compact }: Props) {
  const c = EVENT_TYPE_COLOR[event.type];
  const start = parseISO(event.startISO);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate flex items-center gap-1 transition-colors",
        c.bg, c.text,
        "hover:brightness-95 dark:hover:brightness-110",
      )}
      title={event.title}
    >
      <span className="inline-block w-1 h-1 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {!compact && !event.allDay && (
        <span className="tabular-nums opacity-70 flex-shrink-0">{format(start, "HH:mm")}</span>
      )}
      <span className="truncate">{event.title}</span>
    </button>
  );
}
