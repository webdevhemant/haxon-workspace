"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EMOJI_PICKER } from "./constants";

interface Props {
  onPick: (emoji: string) => void;
  onClose: () => void;
}

export function ChatEmojiPopover({ onPick, onClose }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? [
        {
          label: "Results",
          items: EMOJI_PICKER.flatMap((g) => g.items).filter((e) =>
            e.codePointAt(0)?.toString(16).includes(q),
          ),
        },
      ]
    : EMOJI_PICKER;

  return (
    <div className="absolute bottom-full mb-1 left-2 w-[296px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
      <div className="p-2 border-b border-gray-100 dark:border-gray-800">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emoji…"
          className="w-full text-[12px] px-2.5 py-1.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:border-orange-400"
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-2 space-y-2">
        {filteredGroups.map((g) => (
          <div key={g.label}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1 px-0.5">
              {g.label}
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {g.items.map((e) => (
                <button
                  key={e}
                  onClick={() => { onPick(e); onClose(); }}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded text-[16px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
