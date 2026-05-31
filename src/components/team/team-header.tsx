"use client";
import { UserPlus, Mail } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { TeamStats } from "./team-stats";

export function TeamHeader() {
  const { openModal } = useAppStore();
  const canInvite = useCan("members.invite");

  return (
    <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white flex-1">Team</h1>
        {canInvite && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal({ type: "invite" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[12px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Invite by link
            </button>
            <button
              onClick={() => openModal({ type: "invite" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add member
            </button>
          </div>
        )}
      </div>

      <TeamStats />
    </div>
  );
}
