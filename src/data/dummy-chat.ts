import type { ChatChannel, ChatMessage } from "@/types";

export const CHANNELS: ChatChannel[] = [
  {
    id: "c-general",
    kind: "channel",
    name: "general",
    emoji: "💬",
    topic: "Company-wide chatter, announcements & watercooler",
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
    unread: 4,
    isPinned: true,
    lastActivityAt: "2m",
  },
  {
    id: "c-product",
    kind: "channel",
    name: "product",
    emoji: "🛠",
    topic: "Roadmap, specs, and discovery",
    memberIds: ["u1", "u2", "u3", "u4"],
    unread: 2,
    isPinned: true,
    lastActivityAt: "11m",
  },
  {
    id: "c-engineering",
    kind: "channel",
    name: "engineering",
    emoji: "⚙️",
    topic: "Architecture, deploys, on-call",
    memberIds: ["u2", "u3", "u4", "u6"],
    unread: 0,
    lastActivityAt: "1h",
  },
  {
    id: "c-design",
    kind: "channel",
    name: "design",
    emoji: "🎨",
    topic: "Pixel pushing & critique",
    memberIds: ["u1", "u5", "u3"],
    unread: 1,
    lastActivityAt: "3h",
  },
  {
    id: "c-marketing",
    kind: "channel",
    name: "marketing",
    emoji: "📣",
    topic: "Launches, content, brand",
    memberIds: ["u1", "u5"],
    unread: 0,
    lastActivityAt: "yesterday",
  },
  {
    id: "c-random",
    kind: "channel",
    name: "random",
    emoji: "🌀",
    topic: "Gifs, side quests & weekend plans",
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
    unread: 0,
    isMuted: true,
    lastActivityAt: "2d",
  },
  {
    id: "dm-u2",
    kind: "dm",
    name: "Diego Romano",
    memberIds: ["u1", "u2"],
    unread: 2,
    lastActivityAt: "6m",
  },
  {
    id: "dm-u3",
    kind: "dm",
    name: "Priya Iyer",
    memberIds: ["u1", "u3"],
    unread: 0,
    lastActivityAt: "47m",
  },
  {
    id: "dm-u4",
    kind: "dm",
    name: "Jordan Webb",
    memberIds: ["u1", "u4"],
    unread: 1,
    lastActivityAt: "2h",
  },
  {
    id: "dm-u5",
    kind: "dm",
    name: "Sana Khoury",
    memberIds: ["u1", "u5"],
    unread: 0,
    lastActivityAt: "yesterday",
  },
  {
    id: "dm-u6",
    kind: "dm",
    name: "Theo Lindqvist",
    memberIds: ["u1", "u6"],
    unread: 0,
    lastActivityAt: "3d",
  },
];

export const MESSAGES: ChatMessage[] = [
  // ── #product ────────────────────────────────────────────────────────────────
  {
    id: "m-p1",
    channelId: "c-product",
    userId: "u2",
    text: "Pushed the latest cut of the Q3 strategy doc — would love eyes from the leads before Monday.",
    at: "9:42 AM",
    attachments: [
      { kind: "doc", title: "Q3 Product Strategy", subtitle: "Updated 4 minutes ago", emoji: "📘" },
    ],
    reactions: [{ emoji: "👀", userIds: ["u1", "u4"] }],
  },
  {
    id: "m-p2",
    channelId: "c-product",
    userId: "u2",
    text: "Main change: rewrote the enterprise positioning section to lean into permissions + audit, not AI.",
    at: "9:43 AM",
  },
  {
    id: "m-p3",
    channelId: "c-product",
    userId: "u3",
    text: "Skimmed it — section 3 reads way tighter. The pricing matrix still needs a row for self-serve teams though.",
    at: "9:51 AM",
    reactions: [
      { emoji: "💯", userIds: ["u2"] },
      { emoji: "👍", userIds: ["u1"] },
    ],
    threadCount: 3,
  },
  {
    id: "m-p4",
    channelId: "c-product",
    userId: "u4",
    text: "Moved \"Streaming improvements — SSE refactor\" to In Progress. Sprint ends Friday — flag me if it slips.",
    at: "10:08 AM",
    attachments: [
      { kind: "board", title: "Q3 Roadmap", subtitle: "Engineering · In Progress", emoji: "🗂" },
    ],
  },
  {
    id: "m-p5",
    channelId: "c-product",
    userId: "u1",
    text: "On it. I'll prototype the partial-response UI today and drop a Loom in this thread.",
    at: "10:12 AM",
  },
  {
    id: "m-p6",
    channelId: "c-product",
    userId: "u3",
    text: "Quick aside — should we kill the legacy /streaming endpoint or keep it behind a flag for a release?",
    at: "10:21 AM",
    threadCount: 5,
  },

  // ── #general ────────────────────────────────────────────────────────────────
  {
    id: "m-g1",
    channelId: "c-general",
    userId: "u1",
    text: "Morning team ☀️ Reminder: all-hands moved to 11:00 PT today — Diego is presenting the Q3 vision.",
    at: "8:30 AM",
    reactions: [
      { emoji: "🙌", userIds: ["u2", "u3", "u4", "u5"] },
      { emoji: "☕", userIds: ["u6"] },
    ],
  },
  {
    id: "m-g2",
    channelId: "c-general",
    userId: "u5",
    text: "Brand voice doc is up for review — left detailed notes on \"Casual vs. Professional\".",
    at: "9:14 AM",
    attachments: [
      { kind: "doc", title: "Brand voice & tone", subtitle: "3 new comments", emoji: "✍️" },
    ],
  },
  {
    id: "m-g3",
    channelId: "c-general",
    userId: "u6",
    text: "Heads up — the staging deploy is paused while I patch the websocket reconnect bug.",
    at: "9:55 AM",
    reactions: [{ emoji: "🛠", userIds: ["u3"] }],
  },
  {
    id: "m-g4",
    channelId: "c-general",
    userId: "u4",
    text: "Anyone else seeing 30s+ load times on the dashboard? Or is it just me + bad coffee shop wifi.",
    at: "10:02 AM",
    threadCount: 2,
  },

  // ── #engineering ────────────────────────────────────────────────────────────
  {
    id: "m-e1",
    channelId: "c-engineering",
    userId: "u3",
    text: "Sync engine RFC v2 is out. Big change: vector clocks for conflict resolution. Reviews open till Thursday.",
    at: "Yesterday",
    attachments: [
      { kind: "doc", title: "Engineering RFC — Sync Engine v2", subtitle: "Open for review", emoji: "📐" },
    ],
    reactions: [
      { emoji: "🧠", userIds: ["u4"] },
      { emoji: "🔥", userIds: ["u2"] },
    ],
    threadCount: 7,
  },
  {
    id: "m-e2",
    channelId: "c-engineering",
    userId: "u6",
    text: "Reconnect bug fixed — 1.4s avg recovery now, was 8s+. Rolling out at 11.",
    at: "8:47 AM",
  },

  // ── #design ─────────────────────────────────────────────────────────────────
  {
    id: "m-d1",
    channelId: "c-design",
    userId: "u5",
    text: "New empty-state illustrations — pick a favorite for the doc editor?",
    at: "Yesterday",
    attachments: [
      { kind: "link", title: "figma.com/file/empty-states-v3", subtitle: "Figma · 6 frames" },
    ],
    reactions: [{ emoji: "🪄", userIds: ["u1"] }],
  },
  {
    id: "m-d2",
    channelId: "c-design",
    userId: "u1",
    text: "Frame 4 — the floating constellations one. Feels on-brand without being twee.",
    at: "Yesterday",
  },

  // ── DM with Diego ───────────────────────────────────────────────────────────
  {
    id: "m-dm2-1",
    channelId: "dm-u2",
    userId: "u2",
    text: "Hey — got a minute to talk through the enterprise tier before all-hands?",
    at: "8:54 AM",
  },
  {
    id: "m-dm2-2",
    channelId: "dm-u2",
    userId: "u1",
    text: "Yeah, jump on a huddle in 10? I have the Stripe + Notion competitive grid pulled up.",
    at: "8:55 AM",
  },
  {
    id: "m-dm2-3",
    channelId: "dm-u2",
    userId: "u2",
    text: "Perfect. Also — can you take a look at the pricing matrix when you get a sec? Priya flagged it in #product.",
    at: "9:58 AM",
    attachments: [
      { kind: "doc", title: "Q3 Pricing Matrix", subtitle: "Owned by Diego", emoji: "💰" },
    ],
  },
  {
    id: "m-dm2-4",
    channelId: "dm-u2",
    userId: "u2",
    text: "No rush — sometime today is fine 🙏",
    at: "9:58 AM",
  },

  // ── DM with Priya ───────────────────────────────────────────────────────────
  {
    id: "m-dm3-1",
    channelId: "dm-u3",
    userId: "u3",
    text: "RFC review notes are in. TL;DR — vector clocks ✅, rollback section needs work.",
    at: "Yesterday",
  },
  {
    id: "m-dm3-2",
    channelId: "dm-u3",
    userId: "u1",
    text: "Thanks Priya — I'll patch the rollback section this afternoon and re-ping.",
    at: "Yesterday",
  },

  // ── DM with Jordan ──────────────────────────────────────────────────────────
  {
    id: "m-dm4-1",
    channelId: "dm-u4",
    userId: "u4",
    text: "Assigned you AI streaming improvements. P1 this sprint. Spec linked in the card.",
    at: "8:12 AM",
    attachments: [
      { kind: "board", title: "AI assistant — streaming improvements", subtitle: "Q3 Roadmap · In Progress", emoji: "🤖" },
    ],
  },

  // ── DM with Sana ────────────────────────────────────────────────────────────
  {
    id: "m-dm5-1",
    channelId: "dm-u5",
    userId: "u5",
    text: "Onboarding playbook — trimmed Day 3 checklist to 5 items, rest is now an appendix. Let me know if the flow lands better.",
    at: "Yesterday",
    attachments: [
      { kind: "doc", title: "Onboarding Playbook", subtitle: "Edited yesterday", emoji: "🚀" },
    ],
  },

  // ── DM with Theo ────────────────────────────────────────────────────────────
  {
    id: "m-dm6-1",
    channelId: "dm-u6",
    userId: "u6",
    text: "Pushed the new editor block primitives. Slash-command menu picks them up automatically.",
    at: "3 days ago",
  },
];

export const THREAD_REPLIES: Record<string, ChatMessage[]> = {
  "m-p3": [
    {
      id: "m-p3-r1",
      channelId: "c-product",
      userId: "u2",
      text: "Good catch — adding self-serve row now. Should we cap it at 10 seats or leave it open?",
      at: "9:53 AM",
      replyToId: "m-p3",
    },
    {
      id: "m-p3-r2",
      channelId: "c-product",
      userId: "u3",
      text: "10 seats feels right. Anything bigger should be talking to sales anyway.",
      at: "9:54 AM",
      replyToId: "m-p3",
    },
    {
      id: "m-p3-r3",
      channelId: "c-product",
      userId: "u1",
      text: "+1 to 10. Keeps the upgrade conversation natural.",
      at: "9:57 AM",
      replyToId: "m-p3",
    },
  ],
  "m-p6": [
    {
      id: "m-p6-r1",
      channelId: "c-product",
      userId: "u6",
      text: "Behind a flag for one release, then nuke. Logs show 4 customers still hitting it.",
      at: "10:24 AM",
      replyToId: "m-p6",
    },
    {
      id: "m-p6-r2",
      channelId: "c-product",
      userId: "u4",
      text: "Agreed. I'll send the deprecation email this week.",
      at: "10:26 AM",
      replyToId: "m-p6",
    },
  ],
  "m-e1": [
    {
      id: "m-e1-r1",
      channelId: "c-engineering",
      userId: "u4",
      text: "Rollback strategy is the only blocker for me. Everything else reads clean.",
      at: "Yesterday",
      replyToId: "m-e1",
    },
    {
      id: "m-e1-r2",
      channelId: "c-engineering",
      userId: "u2",
      text: "Same — let's land that section before circulating broadly.",
      at: "Yesterday",
      replyToId: "m-e1",
    },
  ],
  "m-g4": [
    {
      id: "m-g4-r1",
      channelId: "c-general",
      userId: "u6",
      text: "It's you 😄 — but also the dashboard does 6 parallel fetches on load. Already in the perf backlog.",
      at: "10:05 AM",
      replyToId: "m-g4",
    },
    {
      id: "m-g4-r2",
      channelId: "c-general",
      userId: "u4",
      text: "Phew. Will move to a real cafe.",
      at: "10:06 AM",
      replyToId: "m-g4",
    },
  ],
};
