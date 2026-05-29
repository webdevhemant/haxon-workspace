"use client";
import { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Edit3, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";

interface Props {
  existingDmUserIds: string[];
  onStart: (userId: string) => void;
}

export function ChatNewConversation({ existingDmUserIds, onStart }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USERS
      .filter((u) => u.id !== CURRENT_USER.id)
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [query]);

  return (
    <Popover.Root open={open} onOpenChange={(v) => { setOpen(v); if (v) setQuery(""); }}>
      <Popover.Trigger asChild>
        <button
          title="New message"
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-[60] w-[300px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden outline-none"
        >
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 h-8 px-2.5 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a teammate…"
                className="flex-1 text-[12.5px] bg-transparent outline-none placeholder-gray-400"
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="text-center text-[11.5px] text-gray-400 py-6">
                No teammates match
              </div>
            ) : (
              filtered.map((u) => {
                const has = existingDmUserIds.includes(u.id);
                const presence = presenceFor(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => { onStart(u.id); setOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
                  >
                    <UserAvatar user={u} size={28} hoverCard={false} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-gray-900 dark:text-white truncate">
                        {u.name}
                      </div>
                      <div className="text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                        {PRESENCE_LABEL[presence]} · {u.role}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {has ? "Open" : "Start"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
