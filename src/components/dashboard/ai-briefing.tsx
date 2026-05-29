"use client";
import { Sparkles } from "lucide-react";

export function AiBriefing() {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/40 rounded-xl p-3 mb-5 flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-0.5">
          Haxon AI · Daily briefing
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
          Diego updated the <strong className="text-gray-900 dark:text-white">Sync Engine RFC</strong> with the new
          conflict resolution model — looks ready for your review. The team also moved 3 cards into{" "}
          <strong className="text-gray-900 dark:text-white">In Progress</strong> this morning.
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors">
            Summarize changes
          </button>
          <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
