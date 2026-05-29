"use client";
import { useEffect } from "react";
import { Hash } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { CHANNELS } from "@/data/dummy-chat";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import { cn } from "@/lib/utils";

export type MentionTrigger = "@" | "#";

interface Item {
  key: string;
  label: string;
  sublabel?: string;
  avatar?: React.ReactNode;
}

interface Props {
  trigger: MentionTrigger;
  query: string;
  activeIndex: number;
  onPick: (token: string) => void;
  setActiveIndex: (idx: number) => void;
}

function buildItems(trigger: MentionTrigger, query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (trigger === "@") {
    return USERS
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 6)
      .map((u) => ({
        key: u.id,
        label: `@${u.name.split(" ")[0].toLowerCase()}`,
        sublabel: `${u.name} · ${PRESENCE_LABEL[presenceFor(u.id)]}`,
        avatar: <UserAvatar user={u} size={22} />,
      }));
  }
  return CHANNELS
    .filter((c) => c.kind === "channel" && (!q || c.name.toLowerCase().includes(q)))
    .slice(0, 6)
    .map((c) => ({
      key: c.id,
      label: `#${c.name}`,
      sublabel: c.topic,
      avatar: (
        <span className="w-[22px] h-[22px] rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {c.emoji ?? <Hash className="w-3 h-3 text-gray-400" />}
        </span>
      ),
    }));
}

export function ChatMentionPopover({ trigger, query, activeIndex, onPick, setActiveIndex }: Props) {
  const items = buildItems(trigger, query);

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [items.length, activeIndex, setActiveIndex]);

  if (items.length === 0) return null;

  return (
    <div className="absolute bottom-full mb-1 left-2 w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
      <div className="px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-800 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {trigger === "@" ? "Mention a person" : "Reference a channel"}
      </div>
      <div className="py-1 max-h-60 overflow-y-auto">
        {items.map((it, i) => (
          <button
            key={it.key}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => onPick(it.label + " ")}
            className={cn(
              "w-full flex items-center gap-2.5 px-2 py-1.5 text-left transition-colors",
              activeIndex === i
                ? "bg-orange-50 dark:bg-orange-950/30"
                : "hover:bg-gray-50 dark:hover:bg-gray-800",
            )}
          >
            {it.avatar}
            <span className="flex-1 min-w-0">
              <span className="block text-[12.5px] font-medium text-gray-900 dark:text-white truncate">
                {it.label}
              </span>
              {it.sublabel && (
                <span className="block text-[10.5px] text-gray-500 dark:text-gray-400 truncate">
                  {it.sublabel}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="px-2.5 py-1.5 border-t border-gray-100 dark:border-gray-800 text-[9.5px] text-gray-400">
        <kbd>↑</kbd> <kbd>↓</kbd> navigate · <kbd>Enter</kbd> select · <kbd>Esc</kbd> dismiss
      </div>
    </div>
  );
}

export function getMentionItems(trigger: MentionTrigger, query: string): Item[] {
  return buildItems(trigger, query);
}
