"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import type { CalendarEvent, CalendarEventType } from "@/types";

const EVENT_TYPES: { value: CalendarEventType; label: string; color: string }[] = [
  { value: "meeting",  label: "Meeting",  color: "#6366f1" },
  { value: "deadline", label: "Deadline", color: "#ef4444" },
  { value: "focus",    label: "Focus",    color: "#f97316" },
  { value: "social",   label: "Social",   color: "#10b981" },
  { value: "ooo",      label: "OOO",      color: "#8b5cf6" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (event: CalendarEvent) => void;
}

export function CreateEventModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle]     = useState("");
  const [type, setType]       = useState<CalendarEventType>("meeting");
  const [date, setDate]       = useState<string>(format(new Date(2026, 4, 28), "yyyy-MM-dd"));
  const [startTime, setStart] = useState("10:00");
  const [endTime, setEnd]     = useState("11:00");
  const [location, setLoc]    = useState("");

  const reset = () => {
    setTitle(""); setType("meeting");
    setDate(format(new Date(2026, 4, 28), "yyyy-MM-dd"));
    setStart("10:00"); setEnd("11:00"); setLoc("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const [y, mo, d] = date.split("-").map(Number);
    const [sh, sm]   = startTime.split(":").map(Number);
    const [eh, em]   = endTime.split(":").map(Number);
    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      type,
      startISO: new Date(y, mo - 1, d, sh, sm).toISOString(),
      endISO:   new Date(y, mo - 1, d, eh, em).toISOString(),
      location: location.trim() || undefined,
      ownerId: "u1",
      attendees: [{ userId: "u1", rsvp: "yes" }],
    };
    onCreate(newEvent);
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Dialog.Title className="text-[14px] font-semibold text-gray-900 dark:text-white">New event</Dialog.Title>
            <Dialog.Close className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Title</label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title…"
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      "px-2.5 py-1 text-[12px] font-medium rounded border transition-colors cursor-pointer",
                      type === t.value
                        ? "text-white border-transparent"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300",
                    )}
                    style={type === t.value ? { background: t.color, borderColor: t.color } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Date</label>
              <div className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2">
                <DatePicker
                  value={date}
                  onChange={(v) => setDate(v ?? format(new Date(2026, 4, 28), "yyyy-MM-dd"))}
                  placeholder="Pick a date"
                  clearable={false}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Start time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">End time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Location <span className="normal-case font-normal text-gray-400">(optional)</span>
              </label>
              <input
                value={location}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="Room, video link, or address…"
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => { reset(); onClose(); }} className="px-3.5 py-2 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-3.5 py-2 text-[13px] font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded transition-colors cursor-pointer"
              >
                Create event
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
