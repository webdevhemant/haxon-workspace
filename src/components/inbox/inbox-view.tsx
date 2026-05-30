"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { ChatThread } from "./chat-thread";
import { ChatComposer } from "./chat-composer";
import { ChatThreadPanel } from "./chat-thread-panel";
import { ChatInfoPanel } from "./chat-info-panel";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatCallModal, type CallMode } from "./chat-call-modal";
import { ChatSavedList } from "./chat-saved-list";
import { ChatScheduledStrip } from "./chat-scheduled-strip";
import { useChat } from "./use-chat";
import type { ChatSidebarTab } from "./constants";
import { useCan, useCurrentRole } from "@/lib/use-can";

export default function InboxView() {
  const { workspaces, activeWorkspaceId, savedMessageIds, scheduleMessage } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const canMessage = useCan("channel.message");
  const role = useCurrentRole();

  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    messagesByChannel,
    repliesByParent,
    threadParentId,
    openThread,
    send,
    reply,
    react,
    markRead,
    startDmWith,
    pinChannel,
    muteChannel,
    removeChannel,
  } = useChat();

  const [infoOpen, setInfoOpen] = useState(false);
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [tab, setTab] = useState<ChatSidebarTab>("all");

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;
  const activeMessages = activeChannel ? messagesByChannel[activeChannel.id] ?? [] : [];
  const threadParent = threadParentId
    ? Object.values(messagesByChannel).flat().find((m) => m.id === threadParentId)
    : null;

  const showSavedView = tab === "saved";

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Inbox" }]} />}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar
          channels={channels}
          activeId={activeChannelId}
          onSelect={(id) => { setTab("all"); setActiveChannelId(id); }}
          onStartDmWith={startDmWith}
          tab={tab}
          onTabChange={setTab}
          savedCount={savedMessageIds.length}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950">
          {showSavedView ? (
            <ChatSavedList
              channels={channels}
              messagesByChannel={messagesByChannel}
              onJumpToChannel={(id) => { setTab("all"); setActiveChannelId(id); }}
            />
          ) : activeChannel ? (
            <>
              <ChatHeader
                channel={activeChannel}
                messages={activeMessages}
                infoOpen={infoOpen}
                onToggleInfo={() => setInfoOpen((v) => !v)}
                onPinned={() => { setInfoOpen(true); }}
                onStartCall={() => setCallMode("audio")}
                onStartHuddle={() => setCallMode("huddle")}
                onMute={() => muteChannel(activeChannel.id)}
                onPinChannel={() => pinChannel(activeChannel.id)}
                onMarkRead={() => markRead(activeChannel.id)}
                onLeave={() => removeChannel(activeChannel.id)}
              />
              <ChatThread
                channel={activeChannel}
                messages={activeMessages}
                unreadFromId={null}
                typingUserIds={activeChannel.kind === "channel" ? ["u3"] : []}
                onOpenThread={(m) => openThread(m.id)}
                onReact={(id, e) => react(activeChannel.id, id, e)}
                activeMessageId={threadParentId}
              />
              <ChatScheduledStrip channelId={activeChannel.id} />
              <ChatComposer
                placeholder={
                  activeChannel.kind === "dm"
                    ? `Message ${activeChannel.name}`
                    : `Message #${activeChannel.name}`
                }
                onSend={(text) => send(activeChannel.id, text)}
                onSchedule={(text, choice) => {
                  scheduleMessage({
                    channelId: activeChannel.id,
                    text,
                    sendAtISO: choice.iso,
                    sendAtLabel: choice.label,
                  });
                  toast.success(`Scheduled · ${choice.label}`);
                }}
                canMessage={canMessage}
                role={role}
              />
            </>
          ) : (
            <ChatEmptyState />
          )}
        </main>

        {threadParent && activeChannel && !showSavedView && (
          <ChatThreadPanel
            parent={threadParent}
            replies={repliesByParent[threadParent.id] ?? []}
            onClose={() => openThread(null)}
            onSend={(text) => reply(threadParent.id, text)}
            onReact={(id, e) => react(activeChannel.id, id, e)}
          />
        )}

        {infoOpen && activeChannel && !threadParent && !showSavedView && (
          <ChatInfoPanel
            channel={activeChannel}
            messages={activeMessages}
            onClose={() => setInfoOpen(false)}
          />
        )}
      </div>

      <ChatCallModal
        channel={activeChannel}
        mode={callMode}
        onClose={() => setCallMode(null)}
      />
    </div>
  );
}
