"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCheck,
  AtSign,
  MessageSquare,
  Zap,
  X,
  Bell,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
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
  body: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "mention",
    userId: "u2",
    text: "mentioned you in",
    target: "Q3 Product Strategy",
    at: "8m ago",
    read: false,
    body: "Hey, looping you in here — I think your input on the positioning section would be really valuable. Specifically around the enterprise tier and how we differentiate from Notion. Can you add your thoughts before the Monday sync? It's in the 'Competitive Positioning' section, third paragraph.",
  },
  {
    id: "n2",
    type: "comment",
    userId: "u5",
    text: "commented on",
    target: "Brand voice & tone",
    at: "22m ago",
    read: false,
    body: "Left a detailed review on the 'Casual vs. Professional' section. I think we're swinging too casual for enterprise buyers — adding some examples from Stripe docs for comparison. Might be worth scheduling a quick 20-min review session with the whole team.",
  },
  {
    id: "n3",
    type: "update",
    userId: "u4",
    text: "moved a card you're assigned to In Progress in",
    target: "Q3 Roadmap",
    at: "1h ago",
    read: false,
    body: "The card 'Streaming improvements — SSE refactor' has been moved to In Progress. You're listed as the primary owner. Sprint ends Friday — let Jordan know if you need the deadline adjusted or need to unblock anything.",
  },
  {
    id: "n4",
    type: "mention",
    userId: "u3",
    text: "mentioned you in",
    target: "Engineering RFC — Sync Engine",
    at: "2h ago",
    read: true,
    body: "Flagging you in the 'Conflict resolution' section — specifically the vector clock approach. I referenced your earlier notes on CRDT tradeoffs. Would love your sign-off before we circulate this to the broader eng team next week. The section is marked with a TODO tag.",
  },
  {
    id: "n5",
    type: "comment",
    userId: "u6",
    text: "replied to your comment in",
    target: "Onboarding Playbook",
    at: "3h ago",
    read: true,
    body: "Replied to your comment about the 'Day 3 checklist' — agreed that it's too long. I've trimmed it to 5 items and moved the rest into an optional appendix. The revised version is live in the doc. Let me know if the flow feels better now.",
  },
  {
    id: "n6",
    type: "update",
    userId: "u2",
    text: "assigned you to",
    target: "AI assistant — streaming improvements",
    at: "yesterday",
    read: true,
    body: "You've been assigned as the lead on the AI streaming improvements task. This covers the SSE refactor, token buffer tuning, and the new partial-response UI. Estimated effort: ~3 days. It's tagged as P1 for this sprint. Check the spec doc linked in the card for full requirements.",
  },
  {
    id: "n7",
    type: "invite",
    userId: "u1",
    text: "invited you to collaborate on",
    target: "Marketing board",
    at: "yesterday",
    read: true,
    body: "Maya has given you editor access to the Marketing board. This includes the Q3 campaign tracker, content calendar, and launch checklists. You can view all cards and contribute to the 'Product Launch' and 'SEO' lanes. Reach out to Maya if you need admin access.",
  },
  {
    id: "n8",
    type: "comment",
    userId: "u5",
    text: "left a review on",
    target: "Sync Engine RFC",
    at: "2d ago",
    read: true,
    body: "Completed a full pass on the Sync Engine RFC. Left 11 inline comments — most are minor wording suggestions, but there are 2 blocking issues flagged in red: the rollback strategy section is incomplete, and the load testing methodology needs a baseline defined. Please address before final sign-off.",
  },
  {
    id: "n9",
    type: "mention",
    userId: "u4",
    text: "mentioned you in",
    target: "Q4 Planning doc",
    at: "2d ago",
    read: true,
    body: "Tagged you in the 'Resource allocation' section — specifically around headcount for the new data pipeline work. Jordan wants to align on whether this sits under your team or platform infra. There's a comment thread started in the doc. Might need a quick async decision before Thursday's planning review.",
  },
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

const TYPE_LABEL: Record<Notification["type"], string> = {
  mention: "Mention",
  comment: "Comment",
  update: "Update",
  invite: "Invite",
};

// Date grouping
const TODAY_IDS = ["n1", "n2", "n3"];
const YESTERDAY_IDS = ["n4", "n5", "n6", "n7"];
const EARLIER_IDS = ["n8", "n9"];

type Tab = "all" | "mentions" | "updates";

export default function InboxView() {
  const { workspaces, activeWorkspaceId, boards } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const [tab, setTab] = useState<Tab>("all");
  const [items, setItems] = useState(NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>("n1");
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, { text: string; at: string }[]>>({});

  const filtered = items.filter((n) => {
    if (tab === "mentions") return n.type === "mention";
    if (tab === "updates") return n.type === "update" || n.type === "invite";
    return true;
  });

  const unreadCount = items.filter((n) => !n.read).length;
  const selectedItem = items.find((n) => n.id === selectedId) ?? null;
  const selectedUser = selectedItem
    ? USERS.find((u) => u.id === selectedItem.userId)
    : null;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const sendReply = () => {
    if (!replyText.trim() || !selectedId) return;
    setReplies((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), { text: replyText.trim(), at: "just now" }],
    }));
    setReplyText("");
  };
  const dismiss = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "mentions", label: "Mentions" },
    { key: "updates", label: "Updates" },
  ];

  const toGroup = (ids: string[]) =>
    filtered.filter((n) => ids.includes(n.id));

  const groups: { label: string; items: Notification[] }[] = [
    { label: "Today", items: toGroup(TODAY_IDS) },
    { label: "Yesterday", items: toGroup(YESTERDAY_IDS) },
    { label: "Earlier", items: toGroup(EARLIER_IDS) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Inbox" }]} />}
        right={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          ) : null
        }
      />

      {/* Two-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── LEFT PANEL ── */}
        <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#0F1117] overflow-y-auto">
          {/* Panel header */}
          <div className="px-3 pt-3.5 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
                  Inbox
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-orange-500 text-white rounded-full px-1.5 py-0.5 leading-none tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Pill tabs */}
            <div className="flex items-center gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    tab === t.key
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 px-3 pb-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                <Bell className="w-6 h-6 opacity-30" />
                <span className="text-xs text-gray-400">No notifications</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {groups.map((group) => (
                  <div key={group.label} className="mb-1">
                    <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 py-2 select-none">
                      {group.label}
                    </div>
                    {group.items.map((item, idx) => {
                      const user = USERS.find((u) => u.id === item.userId);
                      const color = TYPE_COLOR[item.type];
                      const isSelected = selectedId === item.id;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
                          transition={{ delay: idx * 0.025 }}
                          onClick={() => {
                            setSelectedId(item.id);
                            if (!item.read) markRead(item.id);
                          }}
                          className={`relative flex items-start gap-2.5 px-3 py-2.5 mb-1.5 rounded-xl border cursor-pointer group transition-all ${
                            isSelected
                              ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-orange-200 dark:ring-orange-800"
                              : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                          }`}
                        >
                          {/* Unread dot */}
                          <div className="flex-shrink-0 mt-[9px]">
                            {!item.read ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            ) : (
                              <div className="w-1.5 h-1.5" />
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <UserAvatar user={user} size={28} />
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-[16px] h-[16px] rounded-full flex items-center justify-center text-white"
                              style={{ background: color }}
                            >
                              {TYPE_ICON[item.type]}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-[12px] leading-snug truncate"
                              title={`${user?.name} ${item.text} ${item.target}`}
                            >
                              <span
                                className={`${
                                  !item.read
                                    ? "font-semibold text-gray-900 dark:text-white"
                                    : "font-medium text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {user?.name}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500 font-normal">
                                {" "}{item.text}{" "}
                              </span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {item.target}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide"
                                style={{
                                  color,
                                  background: color + "18",
                                }}
                              >
                                {TYPE_ICON[item.type]}
                                {TYPE_LABEL[item.type]}
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                {item.at}
                              </span>
                            </div>
                          </div>

                          {/* Hover actions */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismiss(item.id);
                            }}
                            className="w-5 h-5 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all flex-shrink-0 mt-0.5"
                            title="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
          <AnimatePresence mode="wait">
            {selectedItem && selectedUser ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="px-6 py-5 max-w-2xl"
              >
                {/* Detail header */}
                <div className="flex items-start gap-3.5 mb-6">
                  <UserAvatar user={selectedUser} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-gray-900 dark:text-white">
                        {selectedUser.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedItem.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                        style={{
                          color: TYPE_COLOR[selectedItem.type],
                          background: TYPE_COLOR[selectedItem.type] + "18",
                        }}
                      >
                        {TYPE_ICON[selectedItem.type]}
                        {TYPE_LABEL[selectedItem.type]}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {selectedItem.at}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Source doc card */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mb-5 group cursor-pointer hover:border-orange-200 dark:hover:border-orange-800 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-all">
                  <span className="text-base">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">
                      {selectedItem.target}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                      Source document
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                </div>

                {/* Body */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedItem.body}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 mb-5" />

                {/* Reply thread */}
                {(replies[selectedItem.id] ?? []).length > 0 && (
                  <div className="mb-4 space-y-3">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Replies</div>
                    {(replies[selectedItem.id] ?? []).map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">M</div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">You <span className="font-normal text-gray-400">{r.at}</span></div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">{r.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply input */}
                <div className="flex items-end gap-2 mb-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    placeholder="Reply to this notification… (Enter to send)"
                    rows={2}
                    className="flex-1 text-sm bg-transparent border-0 outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    <ArrowUpRight className="w-3 h-3" /> Send
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const board = boards.find((b) => b.workspaceId === activeWorkspaceId);
                      if (board) window.location.href = `/workspace/${board.workspaceId}/board/${board.id}`;
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Go to source
                  </button>
                  {!selectedItem.read ? (
                    <button
                      onClick={() => markRead(selectedItem.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark as read
                    </button>
                  ) : null}
                  <button
                    onClick={() => dismiss(selectedItem.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 select-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Select a notification to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
