"use client";
import { Bookmark, MessageSquare, X } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { useAppStore } from "@/store/app-store";
import type { ChatChannel, ChatMessage } from "@/types";

interface Props {
  channels: ChatChannel[];
  messagesByChannel: Record<string, ChatMessage[]>;
  onJumpToChannel: (channelId: string) => void;
}

export function ChatSavedList({ channels, messagesByChannel, onJumpToChannel }: Props) {
  const savedIds = useAppStore((s) => s.savedMessageIds);
  const toggleSaved = useAppStore((s) => s.toggleSavedMessage);

  const items = savedIds
    .map((id) => {
      for (const cid of Object.keys(messagesByChannel)) {
        const msg = messagesByChannel[cid].find((m) => m.id === id);
        if (msg) {
          const channel = channels.find((c) => c.id === cid) ?? null;
          return { msg, channel };
        }
      }
      return null;
    })
    .filter((x): x is { msg: ChatMessage; channel: ChatChannel | null } => x !== null);

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-950">
        <div className="w-12 h-12 rounded-md bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center mb-3">
          <Bookmark className="w-5 h-5 text-orange-500" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No saved messages yet</h2>
        <p className="text-[12.5px] text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
          Hover any message and click the bookmark to save it here for later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-4 h-4 text-orange-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Saved</h2>
          <span className="text-[10px] font-semibold tabular-nums bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 rounded-full px-1.5 py-0.5">
            {items.length}
          </span>
        </div>
        <p className="text-[11.5px] text-gray-500 dark:text-gray-400">
          Messages you bookmarked. Click any to jump to its channel.
        </p>
      </div>
      <div className="px-3 pb-6 space-y-2">
        {items.map(({ msg, channel }) => {
          const author = USERS.find((u) => u.id === msg.userId);
          return (
            <div
              key={msg.id}
              className="group flex gap-2.5 px-3 py-2.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-200 dark:hover:border-orange-800/60 transition-colors cursor-pointer"
              onClick={() => channel && onJumpToChannel(channel.id)}
            >
              {author && <UserAvatar user={author} size={28} />}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                    {author?.name ?? "Unknown"}
                  </span>
                  {channel && (
                    <span className="text-[10.5px] text-gray-400 dark:text-gray-500 inline-flex items-center gap-1 flex-shrink-0">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {channel.kind === "dm" ? channel.name : `#${channel.name}`}
                    </span>
                  )}
                  <span className="text-[10.5px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                    {msg.at}
                  </span>
                </div>
                <div className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3 whitespace-pre-wrap break-words">
                  {msg.text}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSaved(msg.id); }}
                title="Remove from saved"
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
