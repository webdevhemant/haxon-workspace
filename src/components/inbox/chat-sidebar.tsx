"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search, Plus, ChevronDown, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCan } from "@/lib/use-can";
import type { ChatChannel } from "@/types";
import { ChatSidebarItem } from "./chat-sidebar-item";
import { ChatNewConversation } from "./chat-new-conversation";
import { CURRENT_USER_ID, SIDEBAR_TABS, type ChatSidebarTab } from "./constants";

interface Props {
  channels: ChatChannel[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onStartDmWith: (userId: string) => void;
  onAddChannel?: (name: string, isPrivate: boolean) => void;
  tab: ChatSidebarTab;
  onTabChange: (tab: ChatSidebarTab) => void;
  savedCount?: number;
}

export function ChatSidebar({ channels, activeId, onSelect, onStartDmWith, onAddChannel, tab, onTabChange, savedCount = 0 }: Props) {
  const canCreateChannel = useCan("channel.create");
  const canMessage = useCan("team.message");
  const [query, setQuery] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [addingChannel, setAddingChannel] = useState(false);
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    channels: true,
    dms: true,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return channels.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (tab === "unread") return c.unread > 0;
      if (tab === "threads") return c.kind === "channel";
      if (tab === "drafts") return false;
      return true;
    });
  }, [channels, query, tab]);

  const channelGroup = filtered.filter((c) => c.kind === "channel");
  const dmGroup = filtered.filter((c) => c.kind === "dm");
  const totalUnread = channels.reduce((sum, c) => sum + c.unread, 0);

  return (
    <aside className="w-[272px] flex-shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#0F1117]">

      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
              Inbox
            </h2>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold tabular-nums bg-orange-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                {totalUnread}
              </span>
            )}
          </div>
          <ChatNewConversation
            existingDmUserIds={channels
              .filter((c) => c.kind === "dm")
              .flatMap((c) => c.memberIds)
              .filter((id) => id !== CURRENT_USER_ID)}
            onStart={onStartDmWith}
          />
        </div>


        <div className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-xs mb-2">
          <Search className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="flex-1 outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400"
          />
        </div>


        <div className="flex items-center gap-1 flex-wrap">
          {SIDEBAR_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
                tab === t.key
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
              )}
            >
              {t.key === "saved" && <Bookmark className="w-2.5 h-2.5" />}
              {t.label}
              {t.key === "saved" && savedCount > 0 && (
                <span className="text-[9.5px] tabular-nums text-orange-600 dark:text-orange-400 font-semibold">
                  {savedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>


      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <SidebarSection
          title="Channels"
          count={channelGroup.length}
          open={openSection.channels}
          onToggle={() => setOpenSection((s) => ({ ...s, channels: !s.channels }))}
          onAdd={canCreateChannel && onAddChannel ? () => setAddingChannel(true) : undefined}
        >
          {channelGroup.map((c) => (
            <ChatSidebarItem
              key={c.id}
              channel={c}
              active={activeId === c.id}
              onSelect={() => onSelect(c.id)}
            />
          ))}
          {addingChannel && (
            <div className="px-2 py-1">
              <input
                autoFocus
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newChannelName.trim()) {
                    onAddChannel!(newChannelName.trim(), false);
                    setNewChannelName("");
                    setAddingChannel(false);
                  }
                  if (e.key === "Escape") { setNewChannelName(""); setAddingChannel(false); }
                }}
                onBlur={() => { if (!newChannelName.trim()) setAddingChannel(false); }}
                placeholder="channel-name"
                className="w-full text-[12px] px-2 py-1 rounded border border-orange-400 bg-white dark:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              <p className="text-[10px] text-gray-400 mt-0.5">Enter to create · Esc to cancel</p>
            </div>
          )}
        </SidebarSection>

        <SidebarSection
          title="Direct messages"
          count={dmGroup.length}
          open={openSection.dms}
          onToggle={() => setOpenSection((s) => ({ ...s, dms: !s.dms }))}
          onAdd={undefined}
        >
          {dmGroup.map((c) => (
            <ChatSidebarItem
              key={c.id}
              channel={c}
              active={activeId === c.id}
              onSelect={() => onSelect(c.id)}
            />
          ))}
        </SidebarSection>

        {filtered.length === 0 && (
          <div className="text-[11px] text-gray-400 text-center mt-8">
            No conversations match
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarSection({
  title, count, open, onToggle, onAdd, children,
}: {
  title: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <div className="group/h flex items-center pl-1 pr-1.5 mt-2 mb-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-1 flex-1 min-w-0 text-[10px] font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ChevronDown className={cn("w-3 h-3 transition-transform", !open && "-rotate-90")} />
          <span className="truncate">{title}</span>
          <span className="text-gray-300 dark:text-gray-600 font-normal normal-case tracking-normal tabular-nums">{count}</span>
        </button>
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-4 h-4 flex items-center justify-center rounded text-gray-400 opacity-0 group-hover/h:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title={`Add ${title.toLowerCase()}`}
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}
