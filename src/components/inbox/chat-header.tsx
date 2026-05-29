"use client";
import { Hash, Pin, Bell, Phone, Video, Users, Search, MoreHorizontal } from "lucide-react";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatChannel } from "@/types";
import { PresenceDot, presenceFor, PRESENCE_LABEL } from "./chat-presence";
import { CURRENT_USER_ID } from "./constants";

interface Props {
  channel: ChatChannel;
  onToggleInfo: () => void;
  infoOpen: boolean;
}

export function ChatHeader({ channel, onToggleInfo, infoOpen }: Props) {
  const isDM = channel.kind === "dm";
  const otherId = channel.memberIds.find((id) => id !== CURRENT_USER_ID);
  const other = otherId ? USERS.find((u) => u.id === otherId) : undefined;
  const members = channel.memberIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isDM && other ? (
          <div className="relative">
            <UserAvatar user={other} size={26} />
            <PresenceDot
              presence={presenceFor(other.id)}
              size={9}
              className="absolute -bottom-0.5 -right-0.5"
            />
          </div>
        ) : (
          <span className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-base">
            {channel.emoji ?? <Hash className="w-3.5 h-3.5 text-gray-400" />}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {!isDM && <Hash className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
              {channel.name}
            </span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {isDM && other
              ? PRESENCE_LABEL[presenceFor(other.id)]
              : channel.topic ?? `${members.length} members`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {!isDM && (
          <div className="hidden sm:flex items-center mr-1.5">
            <AvatarGroup users={members.slice(0, 4)} size={22} max={4} />
          </div>
        )}
        <HeaderBtn title="Call"><Phone className="w-3.5 h-3.5" /></HeaderBtn>
        <HeaderBtn title="Huddle"><Video className="w-3.5 h-3.5" /></HeaderBtn>
        <HeaderBtn title="Search in channel"><Search className="w-3.5 h-3.5" /></HeaderBtn>
        <HeaderBtn title="Pinned"><Pin className="w-3.5 h-3.5" /></HeaderBtn>
        <HeaderBtn title="Notifications"><Bell className="w-3.5 h-3.5" /></HeaderBtn>
        <HeaderBtn
          title={infoOpen ? "Hide details" : "Show details"}
          active={infoOpen}
          onClick={onToggleInfo}
        >
          <Users className="w-3.5 h-3.5" />
        </HeaderBtn>
        <HeaderBtn title="More"><MoreHorizontal className="w-3.5 h-3.5" /></HeaderBtn>
      </div>
    </div>
  );
}

function HeaderBtn({
  children, title, onClick, active,
}: { children: React.ReactNode; title: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
        active
          ? "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-300"
          : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {children}
    </button>
  );
}
