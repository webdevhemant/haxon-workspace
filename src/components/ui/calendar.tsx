"use client";
import { useState } from "react";
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay,
  isSameMonth, isToday, startOfMonth, startOfWeek, subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({ value, onChange, minDate, maxDate }: Props) {
  const [month, setMonth] = useState<Date>(value ?? new Date());

  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  const isDisabled = (d: Date) => {
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  return (
    <div className="p-2 select-none">
      <div className="flex items-center justify-between px-1 mb-2">
        <button
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-[12.5px] font-semibold text-gray-900 dark:text-white">
          {format(month, "MMMM yyyy")}
        </div>
        <button
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-[10px] font-semibold text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const inMonth = isSameMonth(d, month);
          const selected = value ? isSameDay(d, value) : false;
          const today = isToday(d);
          const disabled = isDisabled(d);
          return (
            <button
              key={d.toISOString()}
              disabled={disabled}
              onClick={() => onChange(d)}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-md text-[12px] tabular-nums transition-colors",
                disabled && "opacity-30 cursor-not-allowed",
                !disabled && !selected && "hover:bg-gray-100 dark:hover:bg-gray-800",
                !inMonth && !selected && "text-gray-300 dark:text-gray-600",
                inMonth && !selected && "text-gray-700 dark:text-gray-300",
                today && !selected && "ring-1 ring-orange-300 dark:ring-orange-700",
                selected && "bg-orange-500 text-white font-semibold hover:bg-orange-600",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
