"use client";
import type { StateCreator } from "zustand";
import type { AppState } from "../app-store";

export interface ScheduledMessage {
  id: string;
  channelId: string;
  text: string;
  sendAtISO: string;
  sendAtLabel: string;
  createdAt: number;
}

export interface InboxSlice {
  savedMessageIds: string[];
  scheduledMessages: ScheduledMessage[];
  toggleSavedMessage: (messageId: string) => void;
  isMessageSaved: (messageId: string) => boolean;
  scheduleMessage: (msg: Omit<ScheduledMessage, "id" | "createdAt">) => void;
  cancelScheduledMessage: (id: string) => void;
}

export const createInboxSlice: StateCreator<AppState, [], [], InboxSlice> = (set, get) => ({
  savedMessageIds: [],
  scheduledMessages: [],
  toggleSavedMessage: (messageId) =>
    set((s) => ({
      savedMessageIds: s.savedMessageIds.includes(messageId)
        ? s.savedMessageIds.filter((id) => id !== messageId)
        : [...s.savedMessageIds, messageId],
    })),
  isMessageSaved: (messageId) => get().savedMessageIds.includes(messageId),
  scheduleMessage: (msg) =>
    set((s) => ({
      scheduledMessages: [
        ...s.scheduledMessages,
        { ...msg, id: `sched-${Date.now()}`, createdAt: Date.now() },
      ],
    })),
  cancelScheduledMessage: (id) =>
    set((s) => ({
      scheduledMessages: s.scheduledMessages.filter((m) => m.id !== id),
    })),
});
