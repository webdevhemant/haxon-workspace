"use client";
import { useState } from "react";
import { X, Bell, Pin, FileText, Link as LinkIcon, Users } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatChannel, ChatMessage } from "@/types";
import { PresenceDot } from "@/components/ui/presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";

interface Props {
  channel: ChatChannel;
  messages: ChatMessage[];
  onClose: () => void;
}

type Tab = "about" | "members" | "pins" | "files";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "about", label: "About", icon: <Bell className="w-3.5 h-3.5" /> },
  { key: "members", label: "Members", icon: <Users className="w-3.5 h-3.5" /> },
  { key: "pins", label: "Pinned", icon: <Pin className="w-3.5 h-3.5" /> },
  { key: "files", label: "Files", icon: <FileText className="w-3.5 h-3.5" /> },
];

export function ChatInfoPanel({ channel, messages, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("about");
  const members = channel.memberIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));
  const pinned = messages.filter((m) => m.pinned);
  const files = messages.flatMap((m) =>
    (m.attachments ?? []).filter((a) => a.kind === "doc" || a.kind === "board" || a.kind === "image"),
  );
  const links = messages.flatMap((m) =>
    (m.attachments ?? []).filter((a) => a.kind === "link"),
  );

  return (
    <aside className="w-[320px] flex-shrink-0 flex flex-col border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="text-[14px] font-semibold text-gray-900 dark:text-white">Details</div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-0.5 px-2 pt-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors",
              tab === t.key
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200",
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "about" && (
          <div className="space-y-4">
            <Field label="Topic">{channel.topic ?? "—"}</Field>
            <Field label="Members">{members.length}</Field>
            <Field label="Created">2025-04-12 by Maya Chen</Field>
            <Field label="Notifications">{channel.isMuted ? "Muted" : "All new messages"}</Field>
          </div>
        )}

        {tab === "members" && (
          <div className="space-y-1">
            {members.map((u) => {
              const p = presenceFor(u.id);
              return (
                <div key={u.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="relative">
                    <UserAvatar user={u} size={28} />
                    <PresenceDot
                      presence={p}
                      size={9}
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium text-gray-900 dark:text-white truncate">
                      {u.name}
                    </div>
                    <div className="text-[10.5px] text-gray-500 dark:text-gray-400">
                      {u.role} · {PRESENCE_LABEL[p]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "pins" && (
          <div className="space-y-2">
            {pinned.length === 0 ? (
              <Empty icon={<Pin className="w-4 h-4" />} label="No pinned messages" />
            ) : (
              pinned.map((m) => (
                <div key={m.id} className="border border-gray-100 dark:border-gray-800 rounded-lg p-2 text-[12px] text-gray-700 dark:text-gray-300">
                  {m.text}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "files" && (
          <div className="space-y-3">
            <div>
              <SectionLabel>Documents & boards</SectionLabel>
              {files.length === 0 ? (
                <Empty icon={<FileText className="w-4 h-4" />} label="No files yet" />
              ) : (
                <div className="space-y-1.5 mt-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
                      <span>{f.emoji ?? "📄"}</span>
                      <span className="truncate">{f.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <SectionLabel>Links</SectionLabel>
              {links.length === 0 ? (
                <Empty icon={<LinkIcon className="w-4 h-4" />} label="No links shared" />
              ) : (
                <div className="space-y-1.5 mt-1">
                  {links.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate text-blue-600 dark:text-blue-400">{f.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-[12.5px] text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {children}
    </div>
  );
}

function Empty({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-6 text-gray-400">
      <span className="opacity-50">{icon}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  );
}
