"use client";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatReaction } from "@/types";
import { CURRENT_USER_ID } from "./constants";

interface Props {
  reactions: ChatReaction[];
  onReact: (emoji: string) => void;
}

export function ChatReactions({ reactions, onReact }: Props) {
  if (reactions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 mt-1.5">
      {reactions.map((r) => {
        const mine = r.userIds.includes(CURRENT_USER_ID);
        return (
          <button
            key={r.emoji}
            onClick={() => onReact(r.emoji)}
            className={cn(
              "inline-flex items-center gap-1 h-6 px-1.5 rounded-full border text-[11px] font-medium transition-colors",
              mine
                ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
            )}
          >
            <span className="text-[12px] leading-none">{r.emoji}</span>
            <span className="tabular-nums">{r.userIds.length}</span>
          </button>
        );
      })}
      <button
        onClick={() => onReact("👍")}
        className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        title="Add reaction"
      >
        <SmilePlus className="w-3 h-3" />
      </button>
    </div>
  );
}
