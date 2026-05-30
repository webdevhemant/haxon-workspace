"use client";
import { useState } from "react";
import { Clock } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";

export interface ScheduleChoice {
  iso: string;
  label: string;
}

interface Props {
  onPick: (choice: ScheduleChoice) => void;
  disabled?: boolean;
}

function tomorrowAt9(): ScheduleChoice {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return { iso: d.toISOString(), label: `Tomorrow, ${format(d, "h:mm a")}` };
}

function nextMondayAt8(): ScheduleChoice {
  const d = new Date();
  const dow = d.getDay();
  const daysUntilMon = (8 - dow) % 7 || 7;
  d.setDate(d.getDate() + daysUntilMon);
  d.setHours(8, 30, 0, 0);
  return { iso: d.toISOString(), label: `Monday, ${format(d, "h:mm a")}` };
}

function inOneHour(): ScheduleChoice {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 60);
  return { iso: d.toISOString(), label: `In 1 hour · ${format(d, "h:mm a")}` };
}

export function ChatSchedulePopover({ onPick, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  });

  const presets: ScheduleChoice[] = [inOneHour(), tomorrowAt9(), nextMondayAt8()];

  const handlePick = (c: ScheduleChoice) => {
    onPick(c);
    setOpen(false);
  };

  const handleCustom = () => {
    const d = new Date(customDate);
    if (Number.isNaN(d.getTime())) return;
    handlePick({ iso: d.toISOString(), label: format(d, "MMM d, h:mm a") });
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          disabled={disabled}
          title="Schedule send"
          className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          side="top"
          sideOffset={8}
          className="z-50 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2"
        >
          <div className="px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
            Schedule send
          </div>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePick(p)}
              className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[12.5px] text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              <span>{p.label}</span>
            </button>
          ))}
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <div className="px-2 py-1.5">
            <label className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-400 block mb-1.5">
              Pick a time
            </label>
            <input
              type="datetime-local"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full px-2 py-1.5 text-[12px] border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
            />
            <button
              onClick={handleCustom}
              className="mt-2 w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded-md transition-colors"
            >
              Schedule
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
