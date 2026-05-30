"use client";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import type { TeamMemberProfile, User } from "@/types";
import { useCan } from "@/lib/use-can";

interface Props {
  user: User;
  profile?: TeamMemberProfile;
  onOpen: () => void;
  onMessage: () => void;
}

const ROLE_COLOR: Record<string, string> = {
  Owner: "#F97316",
  Admin: "#8B5CF6",
  Member: "#6B7280",
};

export function TeamMemberRow({ user, profile, onOpen, onMessage }: Props) {
  const presence = presenceFor(user.id);
  const canMessage = useCan("team.message");
  return (
    <div
      onClick={onOpen}
      className="group grid grid-cols-[1fr_180px_120px_120px_140px] gap-4 items-center px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50/70 dark:hover:bg-gray-900/40 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <UserAvatar user={user} size={32} />
          <PresenceDot presence={presence} size={9} className="absolute -bottom-0.5 -right-0.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
        </div>
      </div>
      <div className="text-[12.5px] text-gray-700 dark:text-gray-300 truncate">
        {profile?.title ?? "—"}
      </div>
      <div className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
        {profile?.team ?? "—"}
      </div>
      <div className="text-[12px] text-gray-500 dark:text-gray-400">
        {PRESENCE_LABEL[presence]}
      </div>
      <div className="flex items-center justify-end gap-1.5">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
          style={{ background: ROLE_COLOR[user.role] + "22", color: ROLE_COLOR[user.role] }}
        >
          {user.role}
        </span>
        {canMessage && (
          <button
            onClick={(e) => { e.stopPropagation(); onMessage(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Message"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
          title="More"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TeamMemberRowHeader() {
  return (
    <div className="grid grid-cols-[1fr_180px_120px_120px_140px] gap-4 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/50">
      <div>Name</div>
      <div>Title</div>
      <div>Team</div>
      <div>Status</div>
      <div className="text-right">Role</div>
    </div>
  );
}
