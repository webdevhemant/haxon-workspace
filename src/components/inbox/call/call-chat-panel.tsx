"use client";
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";

interface CallChatMessage {
  id: string;
  userId: string;
  text: string;
  at: string;
}

interface Props {
  channelName: string;
  onClose: () => void;
}

function seedMessages(otherIds: string[]): CallChatMessage[] {
  const ids = otherIds.length > 0 ? otherIds : ["u2", "u3", "u4"];
  return [
    { id: "cc1", userId: ids[0] ?? "u2", text: "hey, can everyone hear me?", at: "2 min ago" },
    { id: "cc2", userId: CURRENT_USER.id, text: "loud and clear 👍", at: "2 min ago" },
    { id: "cc3", userId: ids[1] ?? ids[0] ?? "u3", text: "dropping the doc link here for reference", at: "1 min ago" },
    { id: "cc4", userId: ids[0] ?? "u2", text: "let's start with the demo", at: "just now" },
  ];
}

export function CallChatPanel({ channelName, onClose }: Props) {
  const otherIds = USERS.filter((u) => u.id !== CURRENT_USER.id).map((u) => u.id);
  const [messages, setMessages] = useState<CallChatMessage[]>(() => seedMessages(otherIds));
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `cc-${Date.now()}`, userId: CURRENT_USER.id, text, at: "just now" },
    ]);
    setDraft("");
  };

  return (
    <aside className="absolute top-0 right-0 bottom-0 w-[280px] bg-gray-950/95 border-l border-white/10 flex flex-col z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 h-11 border-b border-white/10 flex-shrink-0">
        <div className="text-[12px] font-semibold text-white truncate">In-call chat · {channelName}</div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {messages.map((m) => {
          const author = USERS.find((u) => u.id === m.userId) ?? CURRENT_USER;
          const mine = m.userId === CURRENT_USER.id;
          return (
            <div key={m.id} className={cn("flex gap-2", mine && "flex-row-reverse")}>
              <div className="flex-shrink-0">
                <UserAvatar user={author} size={22} hoverCard={false} />
              </div>
              <div className={cn("flex-1 min-w-0", mine && "flex flex-col items-end")}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10.5px] font-semibold text-white/80">
                    {mine ? "You" : author.name.split(" ")[0]}
                  </span>
                  <span className="text-[9.5px] text-white/40">{m.at}</span>
                </div>
                <div
                  className={cn(
                    "mt-0.5 inline-block max-w-[220px] text-[12px] leading-relaxed px-2 py-1 rounded-lg",
                    mine
                      ? "bg-orange-500/90 text-white"
                      : "bg-white/10 text-white/90",
                  )}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-2 flex-shrink-0">
        <div className="flex items-end gap-1.5 bg-white/5 rounded-lg border border-white/10 focus-within:border-white/30 transition-colors">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Send to call…"
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-[12px] text-white placeholder-white/40 px-2 py-1.5 max-h-24"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="w-7 h-7 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-30 text-white flex items-center justify-center mr-1 mb-1 transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
