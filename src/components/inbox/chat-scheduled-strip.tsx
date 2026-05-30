"use client";
import { useMemo } from "react";
import { X, Clock } from "lucide-react";
import { useAppStore } from "@/store/app-store";

interface Props {
  channelId: string;
}

export function ChatScheduledStrip({ channelId }: Props) {
  const all = useAppStore((s) => s.scheduledMessages);
  const cancel = useAppStore((s) => s.cancelScheduledMessage);
  const scheduled = useMemo(
    () => all.filter((m) => m.channelId === channelId),
    [all, channelId],
  );

  if (scheduled.length === 0) return null;

  return (
    <div className="px-4 pt-2 space-y-1.5">
      {scheduled.map((m) => (
        <div
          key={m.id}
          className="flex items-start gap-2 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-900/60 bg-orange-50/70 dark:bg-orange-950/20"
        >
          <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
              Scheduled · {m.sendAtLabel}
            </div>
            <div className="text-[12.5px] text-gray-700 dark:text-gray-300 truncate mt-0.5">
              {m.text}
            </div>
          </div>
          <button
            onClick={() => cancel(m.id)}
            title="Cancel scheduled send"
            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-900 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
