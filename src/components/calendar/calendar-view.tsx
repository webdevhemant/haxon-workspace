"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { GridRow } from "@/types";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_ABBR: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function parseDueDate(str: string): Date | null {
  if (!str || str === "—") return null;
  const parts = str.trim().split(" ");
  if (parts.length === 2) {
    const m = MONTH_ABBR[parts[0]];
    const d = parseInt(parts[1]);
    if (m !== undefined && !isNaN(d)) return new Date(2026, m, d);
  }
  return null;
}

interface CalEvent {
  id: string;
  title: string;
  date: Date;
  priority: "Urgent" | "High" | "Medium" | "Low" | "None";
  assigneeId: string;
  type: "grid" | "card";
}

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const { boards, workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

  const events = useMemo<CalEvent[]>(() => {
    const result: CalEvent[] = [];
    boards.filter((b) => b.workspaceId === activeWorkspaceId).forEach((board) => {
      board.columns.forEach((col) => {
        col.cards.forEach((card) => {
          const d = parseDueDate(card.dueDate);
          if (d) result.push({ id: card.id, title: card.title, date: d, priority: card.priority, assigneeId: card.assigneeId, type: "card" });
        });
      });
    });
    return result;
  }, [boards, activeWorkspaceId]);

  const eventsInMonth = events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month);
  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const eventsOnDay = (day: number) => eventsInMonth.filter((e) => e.date.getDate() === day);

  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Calendar" }]} />}
        right={
          <button className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
            <Plus className="w-3 h-3" /> Event
          </button>
        }
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Calendar grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">{MONTHS[month]} {year}</h2>
              <button onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
                className="px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                Today
              </button>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn icon={<ChevronLeft className="w-4 h-4" />} tooltip="Previous month" onClick={prevMonth} />
              <IconBtn icon={<ChevronRight className="w-4 h-4" />} tooltip="Next month" onClick={nextMonth} />
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 border-l border-t border-gray-100 dark:border-gray-800">
            {Array.from({ length: totalCells }).map((_, i) => {
              const day = i - firstDay + 1;
              const isCurrentMonth = day >= 1 && day <= daysInMonth;
              const dayEvents = isCurrentMonth ? eventsOnDay(day) : [];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={cn(
                    "min-h-[88px] border-r border-b border-gray-100 dark:border-gray-800 p-2",
                    !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/30",
                  )}
                >
                  {isCurrentMonth && (
                    <>
                      <div className={cn(
                        "w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1.5 transition-colors",
                        isToday(day)
                          ? "bg-orange-500 text-white font-bold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div key={ev.id}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium truncate",
                              ev.priority === "Urgent" ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-semibold"
                                : ev.priority === "High" ? "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400"
                                  : ev.priority === "Medium" ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            )}>
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <button className="text-[10px] text-gray-400 hover:text-orange-500 px-1.5 transition-colors">+{dayEvents.length - 3} more</button>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming sidebar */}
        <div className="w-64 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="text-sm font-bold">Upcoming</div>
            <div className="text-xs text-gray-400 mt-0.5">Next due dates</div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[calc(100vh-200px)]">
            {upcoming.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-40" />
                No upcoming items
              </div>
            ) : upcoming.map((ev, i) => {
              const assignee = USERS.find((u) => u.id === ev.assigneeId);
              const diffMs = ev.date.getTime() - today.getTime();
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
              const label = diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `${diffDays}d`;
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white truncate mb-1.5">{ev.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {assignee && <UserAvatar user={assignee} size={16} />}
                      <PriorityBadge priority={ev.priority} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                      diffDays <= 1 ? "bg-red-50 dark:bg-red-950 text-red-500" : diffDays <= 3 ? "bg-orange-50 dark:bg-orange-950 text-orange-500" : "bg-gray-50 dark:bg-gray-800 text-gray-400",
                    )}>
                      {label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
