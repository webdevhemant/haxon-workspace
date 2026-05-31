"use client";
import { useCallback, useMemo, useState } from "react";
import type { ChatChannel, ChatMessage, ChatReaction } from "@/types";
import { CHANNELS, MESSAGES, THREAD_REPLIES } from "@/data/dummy-chat";
import { USERS } from "@/data/dummy-users";
import { CURRENT_USER_ID } from "./constants";

interface UseChatReturn {
  channels: ChatChannel[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string) => void;
  messagesByChannel: Record<string, ChatMessage[]>;
  repliesByParent: Record<string, ChatMessage[]>;
  threadParentId: string | null;
  openThread: (id: string | null) => void;
  send: (channelId: string, text: string) => void;
  reply: (parentId: string, text: string) => void;
  react: (channelId: string, messageId: string, emoji: string) => void;
  markRead: (channelId: string) => void;
  startDmWith: (userId: string) => string;
  pinChannel: (channelId: string) => void;
  muteChannel: (channelId: string) => void;
  removeChannel: (channelId: string) => void;
  addChannel: (name: string, isPrivate: boolean) => void;
}

export function useChat(initialChannelId: string = "c-product"): UseChatReturn {
  const [channels, setChannels] = useState<ChatChannel[]>(CHANNELS);
  const [activeChannelId, _setActive] = useState<string | null>(initialChannelId);
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>(
    () => groupBy(MESSAGES, (m) => m.channelId),
  );
  const [repliesByParent, setReplies] = useState<Record<string, ChatMessage[]>>(THREAD_REPLIES);
  const [threadParentId, setThreadParentId] = useState<string | null>(null);

  const setActiveChannelId = useCallback((id: string) => {
    _setActive(id);
    setThreadParentId(null);
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const send = useCallback((channelId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId,
      userId: CURRENT_USER_ID,
      text,
      at: "just now",
    };
    setMessagesByChannel((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] ?? []), newMsg],
    }));
  }, []);

  const reply = useCallback((parentId: string, text: string) => {
    setReplies((prev) => ({
      ...prev,
      [parentId]: [
        ...(prev[parentId] ?? []),
        {
          id: `r-${Date.now()}`,
          channelId: "",
          userId: CURRENT_USER_ID,
          text,
          at: "just now",
          replyToId: parentId,
        },
      ],
    }));
    setMessagesByChannel((prev) => {
      const updated = { ...prev };
      for (const cid of Object.keys(updated)) {
        updated[cid] = updated[cid].map((m) =>
          m.id === parentId
            ? { ...m, threadCount: (m.threadCount ?? 0) + 1 }
            : m,
        );
      }
      return updated;
    });
  }, []);

  const react = useCallback((channelId: string, messageId: string, emoji: string) => {
    const toggle = (arr?: ChatReaction[]): ChatReaction[] => {
      const reactions = arr ?? [];
      const found = reactions.find((r) => r.emoji === emoji);
      if (!found) return [...reactions, { emoji, userIds: [CURRENT_USER_ID] }];
      const has = found.userIds.includes(CURRENT_USER_ID);
      const nextUsers = has
        ? found.userIds.filter((u) => u !== CURRENT_USER_ID)
        : [...found.userIds, CURRENT_USER_ID];
      const next = reactions
        .map((r) => (r.emoji === emoji ? { ...r, userIds: nextUsers } : r))
        .filter((r) => r.userIds.length > 0);
      return next;
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] ?? []).map((m) =>
        m.id === messageId ? { ...m, reactions: toggle(m.reactions) } : m,
      ),
    }));
    setReplies((prev) => {
      const out: Record<string, ChatMessage[]> = { ...prev };
      for (const k of Object.keys(out)) {
        out[k] = out[k].map((m) =>
          m.id === messageId ? { ...m, reactions: toggle(m.reactions) } : m,
        );
      }
      return out;
    });
  }, []);

  const markRead = useCallback((channelId: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, unread: 0 } : c)),
    );
  }, []);

  const openThread = useCallback((id: string | null) => setThreadParentId(id), []);

  const startDmWith = useCallback((userId: string): string => {
    const existing = channels.find(
      (c) => c.kind === "dm" && c.memberIds.includes(userId) && c.memberIds.includes(CURRENT_USER_ID),
    );
    if (existing) {
      _setActive(existing.id);
      setThreadParentId(null);
      setChannels((prev) => prev.map((c) => (c.id === existing.id ? { ...c, unread: 0 } : c)));
      return existing.id;
    }
    const user = USERS.find((u) => u.id === userId);
    if (!user) return "";
    const id = `dm-${userId}-${Date.now()}`;
    const newChannel: ChatChannel = {
      id,
      kind: "dm",
      name: user.name,
      memberIds: [CURRENT_USER_ID, userId],
      unread: 0,
      lastActivityAt: "now",
    };
    setChannels((prev) => [...prev, newChannel]);
    setMessagesByChannel((prev) => ({ ...prev, [id]: [] }));
    _setActive(id);
    setThreadParentId(null);
    return id;
  }, [channels]);

  const pinChannel = useCallback((channelId: string) => {
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, isPinned: !c.isPinned } : c)));
  }, []);

  const muteChannel = useCallback((channelId: string) => {
    setChannels((prev) => prev.map((c) => (c.id === channelId ? { ...c, isMuted: !c.isMuted } : c)));
  }, []);

  const addChannel = useCallback((name: string, isPrivate: boolean) => {
    const id = `c-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newChannel: ChatChannel = {
      id, kind: "channel",
      name: name.toLowerCase().replace(/\s+/g, "-"),
      topic: isPrivate ? "Private channel" : "New channel",
      isPrivate,
      memberIds: [CURRENT_USER_ID],
      unread: 0,
      isPinned: false,
      isMuted: false,
      lastActivityAt: "now",
    };
    setChannels((prev) => [...prev, newChannel]);
    _setActive(id);
  }, []);

  const removeChannel = useCallback((channelId: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
    setMessagesByChannel((prev) => {
      const next = { ...prev };
      delete next[channelId];
      return next;
    });
    _setActive(null);
  }, []);

  return useMemo(
    () => ({
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
      addChannel,
    }),
    [
      channels,
      activeChannelId,
      messagesByChannel,
      repliesByParent,
      threadParentId,
      setActiveChannelId,
      openThread,
      send,
      reply,
      react,
      markRead,
      startDmWith,
      pinChannel,
      muteChannel,
      removeChannel,
      addChannel,
    ],
  );
}

function groupBy<T, K extends string>(arr: T[], key: (t: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
