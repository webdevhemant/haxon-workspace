"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatChannel, ChatMessage } from "@/types";
import { ChatMessageRow } from "./chat-message";
import { ChatDateDivider, ChatUnreadDivider } from "./chat-date-divider";
import { ChatTypingIndicator } from "./chat-typing-indicator";

interface Props {
  channel: ChatChannel;
  messages: ChatMessage[];
  unreadFromId: string | null;
  typingUserIds: string[];
  onOpenThread: (message: ChatMessage) => void;
  onReact: (messageId: string, emoji: string) => void;
  activeMessageId?: string | null;
}

interface Row {
  kind: "msg";
  message: ChatMessage;
  showHeader: boolean;
  isLastInGroup: boolean;
}

interface SeparatorRow {
  kind: "date" | "unread";
  label: string;
  count?: number;
}

type AnyRow = Row | SeparatorRow;

function buildRows(messages: ChatMessage[], unreadFromId: string | null): AnyRow[] {
  const rows: AnyRow[] = [];
  let lastDate: string | null = null;
  let unreadInserted = false;
  let unreadStartIdx = -1;
  if (unreadFromId) unreadStartIdx = messages.findIndex((m) => m.id === unreadFromId);

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const dateLabel = inferDateLabel(msg.at);
    if (dateLabel !== lastDate) {
      rows.push({ kind: "date", label: dateLabel });
      lastDate = dateLabel;
    }
    if (!unreadInserted && unreadStartIdx >= 0 && i === unreadStartIdx) {
      rows.push({
        kind: "unread",
        label: "New",
        count: messages.length - unreadStartIdx,
      });
      unreadInserted = true;
    }
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const showHeader = !prev || prev.userId !== msg.userId || inferDateLabel(prev.at) !== dateLabel;
    const isLastInGroup = !next || next.userId !== msg.userId || inferDateLabel(next.at) !== dateLabel;
    rows.push({ kind: "msg", message: msg, showHeader, isLastInGroup });
  }
  return rows;
}

function inferDateLabel(at: string): string {
  if (at.toLowerCase().includes("yesterday")) return "Yesterday";
  if (at.includes("days ago") || at.endsWith("d ago") || at.endsWith("d")) return "Earlier this week";
  return "Today";
}

export function ChatThread({
  channel,
  messages,
  unreadFromId,
  typingUserIds,
  onOpenThread,
  onReact,
  activeMessageId,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showJump, setShowJump] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [channel.id]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowJump(dist > 240);
  };

  const jump = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const rows = buildRows(messages, unreadFromId);

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto"
      >
        <ChannelIntro channel={channel} />

        {rows.map((row, i) => {
          if (row.kind === "msg") {
            return (
              <ChatMessageRow
                key={row.message.id}
                message={row.message}
                showHeader={row.showHeader}
                isLastInGroup={row.isLastInGroup}
                onOpenThread={onOpenThread}
                onReact={onReact}
                isActive={activeMessageId === row.message.id}
              />
            );
          }
          if (row.kind === "unread") {
            return <ChatUnreadDivider key={`u-${i}`} count={row.count ?? 0} />;
          }
          return <ChatDateDivider key={`d-${i}`} label={row.label} />;
        })}

        <ChatTypingIndicator userIds={typingUserIds} />
        <div className="h-2" />
      </div>

      <AnimatePresence>
        {showJump && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={jump}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md text-[11.5px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowDown className="w-3 h-3" /> Jump to latest
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChannelIntro({ channel }: { channel: ChatChannel }) {
  if (channel.kind === "dm") return null;
  return (
    <div className="px-4 pt-8 pb-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-xl flex-shrink-0">
          {channel.emoji ?? "#"}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              #{channel.name}
            </h2>
            <span className="text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI summary
            </span>
          </div>
          <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-prose leading-relaxed">
            {channel.topic ?? `Welcome to #${channel.name}`} · This is the beginning of the channel.
          </p>
        </div>
      </div>
    </div>
  );
}
