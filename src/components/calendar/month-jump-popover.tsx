"use client";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  month: number;
  year: number;
  onJump: (year: number, month: number) => void;
  todayMonth: number;
  todayYear: number;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function MonthJumpPopover({ month, year, onJump, todayMonth, todayYear }: Props) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(v) => { setOpen(v); if (v) setViewYear(year); }}
    >
      <Popover.Trigger asChild>
        <button className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          {MONTHS_FULL[month]} {year}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl z-[70] outline-none p-2 w-[280px]"
        >
          <div className="flex items-center justify-between px-1 mb-2">
            <button
              onClick={() => setViewYear((y) => y - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="text-[13px] font-semibold text-gray-900 dark:text-white tabular-nums">
              {viewYear}
            </div>
            <button
              onClick={() => setViewYear((y) => y + 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {MONTHS_SHORT.map((m, i) => {
              const isCurrent = viewYear === year && i === month;
              const isToday = viewYear === todayYear && i === todayMonth;
              return (
                <button
                  key={m}
                  onClick={() => { onJump(viewYear, i); setOpen(false); }}
                  className={cn(
                    "h-9 rounded-md text-[12px] font-medium transition-colors",
                    isCurrent
                      ? "bg-orange-500 text-white"
                      : isToday
                        ? "ring-1 ring-orange-300 text-gray-800 dark:text-gray-200"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <button
              onClick={() => { onJump(todayYear, todayMonth); setOpen(false); }}
              className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Jump to today
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
