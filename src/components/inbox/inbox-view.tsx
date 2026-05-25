"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Filter, Bell, AtSign, MessageSquare, Zap, X } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";

interface Notification {
  id: string;
  type: "mention" | "comment" | "update" | "invite";
  userId: string;
  text: string;
  target: string;
  targetHref?: string;
  at: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "mention", userId: "u2", text: "mentioned you in", target: "Q3 Product Strategy", at: "8m ago", read: false },
  { id: "n2", type: "comment", userId: "u5", text: "commented on", target: "Brand voice & tone", at: "22m ago", read: false },
  { id: "n3", type: "update", userId: "u4", text: "moved a card you're assigned to In Progress in", target: "Q3 Roadmap", at: "1h ago", read: false },
  { id: "n4", type: "mention", userId: "u3", text: "mentioned you in", target: "Engineering RFC — Sync Engine", at: "2h ago", read: true },
  { id: "n5", type: "comment", userId: "u6", text: "replied to your comment in", target: "Onboarding Playbook", at: "3h ago", read: true },
  { id: "n6", type: "update", userId: "u2", text: "assigned you to", target: "AI assistant — streaming improvements", at: "yesterday", read: true },
  { id: "n7", type: "invite", userId: "u1", text: "invited you to collaborate on", target: "Marketing board", at: "yesterday", read: true },
  { id: "n8", type: "comment", userId: "u5", text: "left a review on", target: "Sync Engine RFC", at: "2d ago", read: true },
  { id: "n9", type: "mention", userId: "u4", text: "mentioned you in", target: "Q4 Planning doc", at: "2d ago", read: true },
];

const TYPE_ICON: Record<Notification["type"], React.ReactNode> = {
  mention: <AtSign className="w-3 h-3" />,
  comment: <MessageSquare className="w-3 h-3" />,
  update: <Zap className="w-3 h-3" />,
  invite: <Bell className="w-3 h-3" />,
};
const TYPE_COLOR: Record<Notification["type"], string> = {
  mention: "#F97316",
  comment: "#3B82F6",
  update: "#10B981",
  invite: "#8B5CF6",
};

type Tab = "all" | "mentions" | "comments" | "updates";

export default function InboxView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const [tab, setTab] = useState<Tab>("all");
  const [items, setItems] = useState(NOTIFICATIONS);

  const filtered = items.filter((n) => {
    if (tab === "mentions") return n.type === "mention";
    if (tab === "comments") return n.type === "comment";
    if (tab === "updates") return n.type === "update" || n.type === "invite";
    return true;
  });

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "mentions", label: "Mentions" },
    { key: "comments", label: "Comments" },
    { key: "updates", label: "Updates" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Inbox" }]} />}
        right={
          <>
            <IconBtn icon={<Filter className="w-3.5 h-3.5" />} tooltip="Filter" />
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 h-7 px-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
                Inbox
                {unreadCount > 0 && (
                  <span className="text-sm font-semibold bg-orange-500 text-white rounded-full px-2 py-0.5 leading-none">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-gray-100 dark:border-gray-800">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  tab === t.key
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <div className="font-medium text-gray-500">No notifications here</div>
              <div className="text-sm mt-1">You&apos;re all caught up on {tab}</div>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {filtered.map((item, idx) => {
                  const user = USERS.find((u) => u.id === item.userId);
                  const color = TYPE_COLOR[item.type];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                      transition={{ delay: idx * 0.03 }}
                      className={`flex items-start gap-3.5 p-4 rounded-xl group transition-colors ${
                        item.read
                          ? "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                          : "bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                      }`}
                    >
                      {!item.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      )}
                      {item.read && <div className="w-1.5 flex-shrink-0" />}

                      <div className="relative flex-shrink-0">
                        <UserAvatar user={user} size={36} />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-white"
                          style={{ background: color, width: 18, height: 18 }}
                        >
                          {TYPE_ICON[item.type]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          <strong className="text-gray-900 dark:text-white font-semibold">{user?.name}</strong>{" "}
                          {item.text}{" "}
                          <span className="font-medium text-gray-900 dark:text-white cursor-pointer hover:underline">
                            {item.target}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.at}</div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {!item.read && (
                          <button
                            onClick={() => markRead(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
