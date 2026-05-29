"use client";
import { Hash, Lock, BellOff, Pin } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatChannel } from "@/types";
import { PresenceDot, presenceFor } from "./chat-presence";
import { CURRENT_USER_ID } from "./constants";

interface Props {
  channel: ChatChannel;
  active: boolean;
  onSelect: () => void;
}

export function ChatSidebarItem({ channel, active, onSelect }: Props) {
  const isDM = channel.kind === "dm";
  const otherId = channel.memberIds.find((id) => id !== CURRENT_USER_ID);
  const other = otherId ? USERS.find((u) => u.id === otherId) : undefined;
  const presence = other ? presenceFor(other.id) : undefined;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
        active
          ? "bg-orange-100/70 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {/* Leading icon / avatar */}
      <span className="flex-shrink-0 relative">
        {isDM && other ? (
          <>
            <UserAvatar user={other} size={22} />
            {presence && (
              <PresenceDot
                presence={presence}
                size={8}
                className="absolute -bottom-0.5 -right-0.5"
              />
            )}
          </>
        ) : channel.isPrivate ? (
          <Lock className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <Hash className="w-3.5 h-3.5 text-gray-400" />
        )}
      </span>

      <span className={cn(
        "flex-1 min-w-0 truncate text-[13px]",
        channel.unread > 0 ? "font-semibold text-gray-900 dark:text-white" : "font-medium",
      )}>
        {channel.name}
      </span>

      {channel.isMuted && (
        <BellOff className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      {channel.isPinned && !channel.unread && (
        <Pin className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
      )}
      {channel.unread > 0 && (
        <span className="text-[10px] font-bold tabular-nums bg-orange-500 text-white rounded-full px-1.5 py-0.5 leading-none flex-shrink-0">
          {channel.unread}
        </span>
      )}
    </button>
  );
}
