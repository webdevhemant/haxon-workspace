"use client";
import { toast } from "sonner";
import { Hash, Pin, Bell, BellOff, Phone, Video, Users, Search, MoreHorizontal } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatChannel } from "@/types";
import { PresenceDot } from "@/components/ui/presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import { CURRENT_USER_ID } from "./constants";

interface Props {
  channel: ChatChannel;
  onToggleInfo: () => void;
  infoOpen: boolean;
  onSearch: () => void;
  onPinned: () => void;
}

export function ChatHeader({ channel, onToggleInfo, infoOpen, onSearch, onPinned }: Props) {
  const isDM = channel.kind === "dm";
  const otherId = channel.memberIds.find((id) => id !== CURRENT_USER_ID);
  const other = otherId ? USERS.find((u) => u.id === otherId) : undefined;
  const members = channel.memberIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  return (
    <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
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

      <div className="flex items-center gap-0.5 flex-shrink-0">
        {!isDM && (
          <div className="hidden sm:flex items-center mr-1.5">
            <AvatarGroup users={members.slice(0, 4)} size={22} max={4} />
          </div>
        )}
        <HeaderBtn title="Start call" onClick={() => toast.info(`Calling ${channel.name}…`)}>
          <Phone className="w-3.5 h-3.5" />
        </HeaderBtn>
        <HeaderBtn title="Start huddle" onClick={() => toast.success("Huddle starting…")}>
          <Video className="w-3.5 h-3.5" />
        </HeaderBtn>
        <HeaderBtn title="Search in channel" onClick={onSearch}>
          <Search className="w-3.5 h-3.5" />
        </HeaderBtn>
        <HeaderBtn title="Pinned messages" onClick={onPinned}>
          <Pin className="w-3.5 h-3.5" />
        </HeaderBtn>
        <HeaderBtn
          title={channel.isMuted ? "Unmute" : "Mute"}
          onClick={() => toast(channel.isMuted ? "Notifications on" : "Notifications muted")}
        >
          {channel.isMuted ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
        </HeaderBtn>
        <HeaderBtn
          title={infoOpen ? "Hide details" : "Show details"}
          active={infoOpen}
          onClick={onToggleInfo}
        >
          <Users className="w-3.5 h-3.5" />
        </HeaderBtn>
        <ChannelMoreMenu channel={channel} />
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

function ChannelMoreMenu({ channel }: { channel: ChatChannel }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          title="More"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-52 z-50"
        >
          <Item label="Copy link" onSelect={() => toast.success("Link copied to clipboard")} />
          <Item label={channel.isPinned ? "Unpin from sidebar" : "Pin to sidebar"} onSelect={() => toast(`${channel.name} ${channel.isPinned ? "unpinned" : "pinned"}`)} />
          <Item label="Mark all as read" onSelect={() => toast.success("Marked as read")} />
          <Item label="Channel settings" onSelect={() => toast.info("Settings coming soon")} />
          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <Item label={channel.kind === "channel" ? "Leave channel" : "Close conversation"} onSelect={() => toast(`Left ${channel.name}`)} danger />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Item({ label, onSelect, danger }: { label: string; onSelect: () => void; danger?: boolean }) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {label}
    </DropdownMenu.Item>
  );
}
