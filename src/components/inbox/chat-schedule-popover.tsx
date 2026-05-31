"use client";
import { useState } from "react";
import { Clock } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

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

const TIME_PRESETS = [
  { h: 9, m: 0 },
  { h: 12, m: 0 },
  { h: 14, m: 0 },
  { h: 17, m: 30 },
];

export function ChatSchedulePopover({ onPick, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [customDay, setCustomDay] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [time, setTime] = useState("09:00");

  const presets: ScheduleChoice[] = [inOneHour(), tomorrowAt9(), nextMondayAt8()];

  const handlePick = (c: ScheduleChoice) => {
    onPick(c);
    setOpen(false);
  };

  const handleCustom = () => {
    const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const d = setMinutes(setHours(customDay, hh), mm);
    if (d.getTime() < Date.now()) return;
    handlePick({ iso: d.toISOString(), label: format(d, "MMM d, h:mm a") });
  };

  const pickTimePreset = (h: number, m: number) => {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    setTime(`${hh}:${mm}`);
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
          className="z-50 w-[320px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl overflow-hidden"
        >
          <div className="px-3 pt-2.5 pb-1 text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
            Quick schedule
          </div>
          <div className="px-1 pb-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePick(p)}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[12.5px] text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <div className="px-3 pt-2 pb-1 flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-400">
              Pick a date & time
            </span>
            <span className="text-[10.5px] text-gray-400 tabular-nums">
              {format(customDay, "EEE MMM d")}
            </span>
          </div>

          <Calendar
            value={customDay}
            onChange={(d) => setCustomDay(d)}
            minDate={(() => { const x = new Date(); x.setHours(0, 0, 0, 0); return x; })()}
          />

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          <div className="px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {TIME_PRESETS.map((t) => {
                const value = `${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}`;
                const active = value === time;
                return (
                  <button
                    key={value}
                    onClick={() => pickTimePreset(t.h, t.m)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium tabular-nums transition-colors ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="ml-auto h-7 px-2 text-[12px] tabular-nums border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"
              />
            </div>
            <button
              onClick={handleCustom}
              className="w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold rounded-md transition-colors"
            >
              Schedule for {format(setMinutes(setHours(customDay, parseInt(time.slice(0, 2)) || 0), parseInt(time.slice(3, 5)) || 0), "MMM d, h:mm a")}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

