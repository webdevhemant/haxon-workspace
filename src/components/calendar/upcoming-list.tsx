"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "./event-style";

interface Props {
  events: CalendarEvent[];
  today: Date;
  onSelect: (event: CalendarEvent) => void;
}

export function UpcomingList({ events, today, onSelect }: Props) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-gray-400">
        <Clock className="w-6 h-6 mx-auto mb-2 opacity-40" />
        Nothing on the calendar
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {events.map((ev, i) => {
        const start = parseISO(ev.startISO);
        const days = differenceInCalendarDays(start, today);
        const dayLabel = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`;
        const owner = USERS.find((u) => u.id === ev.ownerId);
        const c = EVENT_TYPE_COLOR[ev.type];
        return (
          <motion.button
            key={ev.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(ev)}
            className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
              <span className={cn("text-[9.5px] font-semibold uppercase tracking-wider", c.text)}>
                {EVENT_TYPE_LABEL[ev.type]}
              </span>
              <span className={cn(
                "ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums",
                days <= 1 ? "bg-rose-50 text-rose-500 dark:bg-rose-950/40" : days <= 3 ? "bg-orange-50 text-orange-500 dark:bg-orange-950/40" : "bg-gray-50 dark:bg-gray-800 text-gray-400",
              )}>
                {dayLabel}
              </span>
            </div>
            <div className="text-[12.5px] font-semibold text-gray-900 dark:text-white truncate mb-1.5">
              {ev.title}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-gray-500 tabular-nums">
                {ev.allDay ? "All day" : format(start, "EEE · HH:mm")}
              </span>
              {owner && <UserAvatar user={owner} size={16} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
