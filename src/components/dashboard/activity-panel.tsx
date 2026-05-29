"use client";
import { Filter } from "lucide-react";
import { IconBtn } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import type { ActivityItem } from "@/types";
import { ActivityRow } from "./activity-row";

export function ActivityPanel({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="w-72 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="font-bold text-sm tracking-tight">Activity</div>
        <IconBtn icon={<Filter className="w-3.5 h-3.5" />} tooltip="Filter activity" />
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
        {activity.slice(0, 8).map((a, i) => (
          <ActivityRow key={a.id} item={a} idx={i} />
        ))}
      </div>
    </div>
  );
}
