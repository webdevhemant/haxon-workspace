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
import { useChat } from "./use-chat";

export default function InboxView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

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
  } = useChat();

  const [infoOpen, setInfoOpen] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) ?? null;
  const activeMessages = activeChannel ? messagesByChannel[activeChannel.id] ?? [] : [];
  const threadParent = threadParentId
    ? Object.values(messagesByChannel).flat().find((m) => m.id === threadParentId)
    : null;

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Inbox" }]} />}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChatSidebar
          channels={channels}
          activeId={activeChannelId}
          onSelect={setActiveChannelId}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950">
          {activeChannel ? (
            <>
              <ChatHeader
                channel={activeChannel}
                infoOpen={infoOpen}
                onToggleInfo={() => setInfoOpen((v) => !v)}
                onSearch={() => toast.info("Channel search coming soon")}
                onPinned={() => { setInfoOpen(true); }}
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
              <ChatComposer
                placeholder={
                  activeChannel.kind === "dm"
                    ? `Message ${activeChannel.name}`
                    : `Message #${activeChannel.name}`
                }
                onSend={(text) => send(activeChannel.id, text)}
              />
            </>
          ) : (
            <ChatEmptyState />
          )}
        </main>

        {threadParent && activeChannel && (
          <ChatThreadPanel
            parent={threadParent}
            replies={repliesByParent[threadParent.id] ?? []}
            onClose={() => openThread(null)}
            onSend={(text) => reply(threadParent.id, text)}
            onReact={(id, e) => react(activeChannel.id, id, e)}
          />
        )}

        {infoOpen && activeChannel && !threadParent && (
          <ChatInfoPanel
            channel={activeChannel}
            messages={activeMessages}
            onClose={() => setInfoOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
