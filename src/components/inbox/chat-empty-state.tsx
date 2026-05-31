"use client";
import { Inbox, Sparkles } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 select-none px-6 text-center">
      <div className="w-14 h-14 rounded-md bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 flex items-center justify-center">
        <Inbox className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white">
          Pick a conversation to get rolling
        </h3>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
          Channels for the team, DMs for the side-quests. Mentions, threads, and
          docs all live here.
        </p>
      </div>
      <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-full">
        <Sparkles className="w-3 h-3" /> Try ⌘K to jump anywhere
      </div>
    </div>
  );
}
