"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsRight, Clock, Plus } from "lucide-react";
import { parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { EVENTS } from "@/data/dummy-events";
import type { CalendarEvent } from "@/types";
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "./event-style";
import { MonthGrid } from "./month-grid";
import { MonthJumpPopover } from "./month-jump-popover";
import { UpcomingList } from "./upcoming-list";
import { EventDetailModal } from "./event-detail-modal";

const DEFAULT_DATE = new Date(2026, 4, 28);

export default function CalendarView() {
  const today = DEFAULT_DATE;
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const canCreateEvent = useCan("calendar.event.create");

  const upcoming = useMemo(() => {
    return [...EVENTS]
      .filter((e) => parseISO(e.startISO).getTime() >= today.getTime())
      .sort((a, b) => parseISO(a.startISO).getTime() - parseISO(b.startISO).getTime())
      .slice(0, 8);
  }, [today]);

  const typeCounts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const e of EVENTS) {
      result[e.type] = (result[e.type] ?? 0) + 1;
    }
    return result;
  }, []);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Calendar" }]} />}
        right={
          canCreateEvent ? (
            <button className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Event
            </button>
          ) : null
        }
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <MonthJumpPopover
                month={month}
                year={year}
                todayMonth={today.getMonth()}
                todayYear={today.getFullYear()}
                onJump={(y, m) => { setYear(y); setMonth(m); }}
              />
              <button
                onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
                className="px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                Today
              </button>
              <div className="hidden md:flex items-center gap-2 ml-2">
                {(Object.keys(EVENT_TYPE_LABEL) as (keyof typeof EVENT_TYPE_LABEL)[]).map((t) => {
                  const c = EVENT_TYPE_COLOR[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-[10.5px] text-gray-500 dark:text-gray-400"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                      {EVENT_TYPE_LABEL[t]}
                      <span className="text-gray-300 dark:text-gray-600 tabular-nums">
                        {typeCounts[t] ?? 0}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn icon={<ChevronLeft className="w-4 h-4" />} tooltip="Previous month" onClick={prevMonth} />
              <IconBtn icon={<ChevronRight className="w-4 h-4" />} tooltip="Next month" onClick={nextMonth} />
            </div>
          </div>

          <MonthGrid
            year={year}
            month={month}
            today={today}
            events={EVENTS}
            onEventClick={(ev) => setSelected(ev)}
            onDayClick={() => undefined}
          />
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {upcomingOpen ? (
            <motion.aside
              key="open"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
            >
              <div className="w-72 flex flex-col h-full">
                <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-bold">Upcoming</div>
                    <div className="text-xs text-gray-400 mt-0.5">Next on your calendar</div>
                  </div>
                  <button
                    onClick={() => setUpcomingOpen(false)}
                    title="Collapse"
                    className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                  <UpcomingList events={upcoming} today={today} onSelect={setSelected} />
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 36, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setUpcomingOpen(true)}
              title="Show upcoming"
              className="flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col items-center justify-start py-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span className="mt-2 text-[10px] font-semibold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                Upcoming
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <EventDetailModal
        event={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
