"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { USERS } from "@/data/dummy-users";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { ChatMessage } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  channelName: string;
  messages: ChatMessage[];
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-orange-200/70 dark:bg-orange-700/40 text-orange-900 dark:text-orange-100 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function ChannelSearchPopover({ open, onOpenChange, trigger, channelName, messages }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return messages
      .filter((m) => m.text.toLowerCase().includes(q))
      .slice(0, 50);
  }, [messages, query]);

  return (
    <div className="relative inline-flex">
      {trigger}
      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search in ${channelName}…`}
              className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {!query.trim() ? (
              <div className="px-4 py-6 text-center text-[12px] text-gray-400">
                Type to search messages in this channel.
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12px] text-gray-400">
                No messages match &quot;{query}&quot;.
              </div>
            ) : (
              <>
                <div className="px-3 pt-2 pb-1 text-[10.5px] uppercase tracking-wider text-gray-400">
                  {results.length} match{results.length === 1 ? "" : "es"}
                </div>
                {results.map((m) => {
                  const author = USERS.find((u) => u.id === m.userId);
                  if (!author) return null;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onOpenChange(false);
                        toast(`Jumping to message from ${author.name.split(" ")[0]}…`);
                      }}
                      className="w-full flex items-start gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 text-left transition-colors"
                    >
                      <UserAvatar user={author} size={22} hoverCard={false} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[12px] font-semibold text-gray-900 dark:text-white truncate">
                            {author.name}
                          </span>
                          <span className="text-[10px] text-gray-400 tabular-nums">{m.at}</span>
                        </div>
                        <div className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-2 break-words">
                          {highlight(m.text, query.trim())}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
