export const QUICK_EMOJI = ["👍", "🎉", "❤️", "👀", "🚀", "✅"] as const;

export const SIDEBAR_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "threads", label: "Threads" },
  { key: "drafts", label: "Drafts" },
] as const;

export type ChatSidebarTab = (typeof SIDEBAR_TABS)[number]["key"];

export const CURRENT_USER_ID = "u1";
