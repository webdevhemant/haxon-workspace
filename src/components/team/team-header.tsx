"use client";
import { UserPlus, Mail } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { TeamStats } from "./team-stats";

export function TeamHeader() {
  const { openModal } = useAppStore();
  const canInvite = useCan("members.invite");

  return (
    <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-orange-50/40 to-transparent dark:from-orange-950/10">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Your team
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 max-w-prose">
            The people who turn Haxon from a deck into a product. See who's
            online, what they're working on, and where they sit across the
            globe.
          </p>
        </div>
        {canInvite && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => openModal({ type: "invite" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[12.5px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Invite by link
            </button>
            <button
              onClick={() => openModal({ type: "invite" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[12.5px] font-semibold transition-colors"
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
