"use client";
import { MapPin, MessageSquare, Clock } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import type { TeamMemberProfile, User } from "@/types";
import { cn } from "@/lib/utils";
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

export function TeamMemberCard({ user, profile, onOpen, onMessage }: Props) {
  const presence = presenceFor(user.id);
  const canMessage = useCan("team.message");

  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-200 dark:hover:border-orange-800/60 hover:shadow-md hover:shadow-orange-100/40 dark:hover:shadow-none transition-all overflow-hidden flex flex-col"
    >

      <div
        className="h-14 relative"
        style={{ background: `linear-gradient(135deg, ${user.color}22, ${user.color}05)` }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="px-4 pb-4 -mt-7 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="rounded-full ring-4 ring-white dark:ring-gray-900">
              <UserAvatar user={user} size={52} />
            </div>
            <PresenceDot
              presence={presence}
              size={12}
              className="absolute bottom-0.5 right-0.5"
            />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-7"
            style={{ background: ROLE_COLOR[user.role] + "22", color: ROLE_COLOR[user.role] }}
          >
            {user.role}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
            {user.id === "u1" && (
              <span className="ml-1.5 text-[10px] font-medium text-gray-400">You</span>
            )}
          </div>
          <div className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
            {profile?.title ?? user.role} · {profile?.team ?? "—"}
          </div>
        </div>

        {profile?.bio && (
          <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
            {profile.bio}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {(profile?.skills ?? []).slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0 text-gray-300 dark:text-gray-600" />
            <span className="truncate">{profile?.location ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Clock className="w-3 h-3 flex-shrink-0 text-gray-300 dark:text-gray-600" />
            <span className="truncate">{profile?.timezone ?? PRESENCE_LABEL[presence]}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {canMessage && (
            <span
              onClick={(e) => { e.stopPropagation(); onMessage(); }}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors",
                "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </span>
          )}
          <span className={cn(
            "h-8 px-3 inline-flex items-center justify-center rounded-lg text-[12px] font-semibold bg-orange-500 group-hover:bg-orange-600 text-white transition-colors",
            !canMessage && "flex-1",
          )}>
            View profile
          </span>
        </div>
      </div>
    </button>
  );
}
