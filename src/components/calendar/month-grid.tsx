"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";
import { EventPill } from "./event-pill";

interface Props {
  year: number;
  month: number;
  today: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthGrid({ year, month, today, events, onEventClick, onDayClick }: Props) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const eventsOnDay = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.startISO);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t border-gray-100 dark:border-gray-800">
        {Array.from({ length: totalCells }).map((_, i) => {
          const day = i - firstDay + 1;
          const inMonth = day >= 1 && day <= daysInMonth;
          const dayEvents = inMonth ? eventsOnDay(day) : [];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.005 }}
              onClick={() => inMonth && onDayClick(new Date(year, month, day))}
              className={cn(
                "min-h-[96px] border-r border-b border-gray-100 dark:border-gray-800 p-1.5 cursor-pointer transition-colors",
                inMonth ? "hover:bg-gray-50 dark:hover:bg-gray-900/30" : "bg-gray-50/50 dark:bg-gray-900/30 cursor-default",
              )}
            >
              {inMonth && (
                <>
                  <div className={cn(
                    "w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1 transition-colors",
                    isToday(day)
                      ? "bg-orange-500 text-white font-bold"
                      : "text-gray-700 dark:text-gray-300",
                  )}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <EventPill key={ev.id} event={ev} onClick={() => onEventClick(ev)} />
                    ))}
                    {dayEvents.length > 3 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEventClick(dayEvents[3]); }}
                        className="text-[10px] text-gray-400 hover:text-orange-500 px-1.5 transition-colors"
                      >
                        +{dayEvents.length - 3} more
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
