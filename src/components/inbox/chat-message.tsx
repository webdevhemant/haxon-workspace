"use client";
import { MessageSquare } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserHoverCard } from "@/components/ui/user-hover-card";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { ChatAttachmentCard } from "./chat-attachment";
import { ChatReactions } from "./chat-reactions";
import { ChatMessageToolbar } from "./chat-message-toolbar";

interface Props {
  message: ChatMessage;
  showHeader: boolean;
  isLastInGroup: boolean;
  onOpenThread?: (message: ChatMessage) => void;
  onReact?: (messageId: string, emoji: string) => void;
  isActive?: boolean;
}

export function ChatMessageRow({
  message,
  showHeader,
  isLastInGroup,
  onOpenThread,
  onReact,
  isActive,
}: Props) {
  const author = USERS.find((u) => u.id === message.userId);
  if (!author) return null;

  return (
    <div
      className={cn(
        "group relative flex gap-2.5 px-4",
        showHeader ? "pt-2.5" : "pt-0.5",
        isLastInGroup ? "pb-1.5" : "pb-0.5",
        isActive && "bg-orange-50/40 dark:bg-orange-950/10",
        !isActive && "hover:bg-gray-50/70 dark:hover:bg-gray-900/40",
      )}
    >
      <div className="w-9 flex-shrink-0 flex justify-center pt-0.5">
        {showHeader ? (
          <UserAvatar user={author} size={32} />
        ) : (
          <span className="text-[10px] text-gray-300 dark:text-gray-700 opacity-0 group-hover:opacity-100 tabular-nums select-none mt-1">
            {message.at}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {showHeader && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <UserHoverCard user={author}>
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline">
                {author.name}
              </span>
            </UserHoverCard>
            <span className="text-[10.5px] text-gray-400 dark:text-gray-500 tabular-nums">
              {message.at}
            </span>
            {message.edited && (
              <span className="text-[10px] text-gray-400 italic">(edited)</span>
            )}
          </div>
        )}

        <div className="text-[13.5px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {message.text}
        </div>

        {message.attachments?.map((att, i) => (
          <ChatAttachmentCard key={i} attachment={att} />
        ))}

        {message.reactions && (
          <ChatReactions
            reactions={message.reactions}
            onReact={(emoji) => onReact?.(message.id, emoji)}
          />
        )}

        {message.threadCount ? (
          <button
            onClick={() => onOpenThread?.(message)}
            className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 px-1.5 py-0.5 -ml-1.5 rounded transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            {message.threadCount} {message.threadCount === 1 ? "reply" : "replies"}
            <span className="text-gray-400 dark:text-gray-500 font-normal">· View thread</span>
          </button>
        ) : null}
      </div>

      <ChatMessageToolbar
        onReact={(e) => onReact?.(message.id, e)}
        onOpenThread={() => onOpenThread?.(message)}
        onCopy={() => {
          if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(message.text).catch(() => undefined);
          }
        }}
      />
    </div>
  );
}
