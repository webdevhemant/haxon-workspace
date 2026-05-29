"use client";
import { useState } from "react";
import { Filter, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { ActivityRow } from "./activity-row";

type ActivityFilter = "all" | "comments" | "edits" | "mentions";

const FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: "all", label: "All activity" },
  { key: "comments", label: "Comments" },
  { key: "edits", label: "Edits & moves" },
  { key: "mentions", label: "Mentions of me" },
];

export function ActivityPanel({ activity }: { activity: ActivityItem[] }) {
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const filtered = activity.filter((a) => {
    if (filter === "all") return true;
    if (filter === "comments") return /comment|reply/i.test(a.verb);
    if (filter === "edits") return /updated|edited|moved|created|added/i.test(a.verb);
    if (filter === "mentions") return /mention/i.test(a.verb);
    return true;
  });

  return (
    <div className="w-72 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div>
          <div className="font-bold text-sm tracking-tight">Activity</div>
          {filter !== "all" && (
            <div className="text-[10px] text-orange-500 font-semibold">
              {FILTERS.find((f) => f.key === filter)?.label}
            </div>
          )}
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              title="Filter activity"
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors cursor-pointer",
                filter !== "all" && "text-orange-500",
              )}
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-44 z-50"
            >
              {FILTERS.map((f) => (
                <DropdownMenu.Item
                  key={f.key}
                  onSelect={() => setFilter(f.key)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer outline-none text-[12.5px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="w-3 flex items-center">
                    {filter === f.key && <Check className="w-3 h-3 text-orange-500" />}
                  </span>
                  {f.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800 flex items-center gap-1.5 flex-shrink-0">
        <span className="text-[10px] text-gray-400 font-medium">Online now</span>
        <div className="flex items-center gap-1 ml-1">
          {[USERS[1], USERS[2], USERS[3]].map((u) => (
            <div key={u.id} className="relative">
              <UserAvatar user={u} size={22} />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-gray-900" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-1">
        {filtered.slice(0, 8).map((a, i) => (
          <ActivityRow key={a.id} item={a} idx={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-[11px] text-gray-400 text-center py-6">
            No activity matches
          </div>
        )}
      </div>
    </div>
  );
}
