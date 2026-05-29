"use client";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";

interface Props {
  value?: string;
  onChange: (iso: string | undefined) => void;
  placeholder?: string;
  align?: "start" | "center" | "end";
  className?: string;
  clearable?: boolean;
}

function toDate(value?: string): Date | undefined {
  if (!value || value === "—") return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

export function DatePicker({
  value, onChange, placeholder = "Pick a date", align = "start", className, clearable = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const date = toDate(value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 text-xs text-left rounded-md transition-colors w-full",
            date
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400",
            className,
          )}
        >
          <CalendarIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="flex-1 truncate">
            {date ? format(date, "MMM d, yyyy") : placeholder}
          </span>
          {clearable && date && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
              title="Clear"
            >
              <X className="w-3 h-3" />
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={6}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[70] outline-none"
        >
          <Calendar
            value={date}
            onChange={(d) => {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
