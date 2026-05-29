"use client";
import { X } from "lucide-react";
import type { ChatMessage } from "@/types";
import { ChatMessageRow } from "./chat-message";
import { ChatComposer } from "./chat-composer";

interface Props {
  parent: ChatMessage;
  replies: ChatMessage[];
  onClose: () => void;
  onSend: (text: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export function ChatThreadPanel({ parent, replies, onClose, onSend, onReact }: Props) {
  return (
    <aside className="w-[360px] flex-shrink-0 flex flex-col border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div>
          <div className="text-[14px] font-semibold text-gray-900 dark:text-white">Thread</div>
          <div className="text-[11px] text-gray-400">{replies.length} replies</div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <ChatMessageRow
          message={parent}
          showHeader
          isLastInGroup
          onReact={onReact}
        />
        <div className="my-2 mx-4 h-px bg-gray-100 dark:bg-gray-800" />
        {replies.map((r, i) => {
          const prev = replies[i - 1];
          const showHeader = !prev || prev.userId !== r.userId;
          return (
            <ChatMessageRow
              key={r.id}
              message={r}
              showHeader={showHeader}
              isLastInGroup={i === replies.length - 1 || replies[i + 1]?.userId !== r.userId}
              onReact={onReact}
            />
          );
        })}
        {replies.length === 0 && (
          <div className="text-center text-[12px] text-gray-400 mt-6">
            Be the first to reply
          </div>
        )}
      </div>

      <ChatComposer
        placeholder="Reply to thread…"
        onSend={onSend}
        small
        autoFocus
      />
    </aside>
  );
}
