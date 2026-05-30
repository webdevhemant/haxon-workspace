export type TriggerKind =
  | "card.moved"
  | "card.created"
  | "card.due"
  | "doc.published"
  | "doc.commented"
  | "mention"
  | "schedule.daily";

export type ActionKind =
  | "post.channel"
  | "send.dm"
  | "set.priority"
  | "assign.to"
  | "add.label"
  | "create.task"
  | "email"
  | "ai.summarize";

export interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: { kind: TriggerKind; label: string };
  actions: { kind: ActionKind; label: string }[];
  lastRunAt?: string;
  runsThisWeek: number;
  ownerId: string;
  emoji: string;
}

export const AUTOMATIONS: Automation[] = [
  {
    id: "a1",
    emoji: "🚀",
    name: "Ship announcements",
    description: "When a card moves to Done, post to #general with the title and assignee.",
    enabled: true,
    trigger: { kind: "card.moved", label: "Card moved to Done" },
    actions: [
      { kind: "post.channel", label: "Post to #general" },
      { kind: "ai.summarize", label: "Auto-summarize description" },
    ],
    lastRunAt: "12m ago",
    runsThisWeek: 14,
    ownerId: "u1",
  },
  {
    id: "a2",
    emoji: "🔔",
    name: "Due-date reminders",
    description: "DM the assignee 24h before a card is due. Skip weekends.",
    enabled: true,
    trigger: { kind: "card.due", label: "24h before due date" },
    actions: [{ kind: "send.dm", label: "DM the assignee" }],
    lastRunAt: "2h ago",
    runsThisWeek: 9,
    ownerId: "u4",
  },
  {
    id: "a3",
    emoji: "🎯",
    name: "Triage new bugs",
    description: "When a card is created with #bug, set priority to High and assign to on-call.",
    enabled: true,
    trigger: { kind: "card.created", label: "Card created with #bug tag" },
    actions: [
      { kind: "set.priority", label: "Set priority to High" },
      { kind: "assign.to", label: "Assign to on-call" },
      { kind: "add.label", label: 'Add label "needs-triage"' },
    ],
    lastRunAt: "Yesterday",
    runsThisWeek: 6,
    ownerId: "u3",
  },
  {
    id: "a4",
    emoji: "📨",
    name: "Daily standup digest",
    description:
      "Every weekday at 09:00 PT, post yesterday's shipped cards and today's plan to #standup.",
    enabled: false,
    trigger: { kind: "schedule.daily", label: "Daily at 09:00 PT" },
    actions: [
      { kind: "ai.summarize", label: "AI summarize yesterday" },
      { kind: "post.channel", label: "Post to #standup" },
    ],
    lastRunAt: "3 days ago",
    runsThisWeek: 0,
    ownerId: "u2",
  },
  {
    id: "a5",
    emoji: "🤝",
    name: "Mention follow-ups",
    description: "When you're @mentioned in a doc, create a task in your Inbox board.",
    enabled: true,
    trigger: { kind: "mention", label: "@mentioned in a doc" },
    actions: [{ kind: "create.task", label: 'Create task in "Inbox" board' }],
    lastRunAt: "30m ago",
    runsThisWeek: 22,
    ownerId: "u1",
  },
  {
    id: "a6",
    emoji: "📬",
    name: "Customer call recap",
    description: "After a 'Customer call' event ends, email the attendees an AI recap.",
    enabled: true,
    trigger: { kind: "card.moved", label: "Event ends · Customer calls" },
    actions: [
      { kind: "ai.summarize", label: "AI summarize agenda + notes" },
      { kind: "email", label: "Email attendees" },
    ],
    lastRunAt: "Yesterday",
    runsThisWeek: 3,
    ownerId: "u2",
  },
];

export interface AutomationTemplate {
  id: string;
  emoji: string;
  name: string;
  desc: string;
  trigger: string;
  action: string;
  category: "Boards" | "Docs" | "Chat" | "Calendar";
}

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: "t1",
    emoji: "🎯",
    name: "Auto-assign by label",
    desc: "When a card gets a #design label, assign it to the design lead.",
    trigger: "Label added to card",
    action: "Assign to Sana Khoury",
    category: "Boards",
  },
  {
    id: "t2",
    emoji: "🧹",
    name: "Archive stale cards",
    desc: "Move cards inactive for 30 days to Archived.",
    trigger: "Card untouched for 30d",
    action: "Move to Archived",
    category: "Boards",
  },
  {
    id: "t3",
    emoji: "✨",
    name: "AI standup digest",
    desc: "Daily AI summary of who shipped what.",
    trigger: "Daily at 09:00",
    action: "Post to #standup",
    category: "Chat",
  },
  {
    id: "t4",
    emoji: "📝",
    name: "Doc → task",
    desc: "When a doc adds an action item, create a card.",
    trigger: 'Doc adds "[ ] …"',
    action: "Create card in Inbox",
    category: "Docs",
  },
  {
    id: "t5",
    emoji: "📆",
    name: "Event prep doc",
    desc: "30 min before a meeting, create a prep doc.",
    trigger: "30m before event",
    action: "Create doc from template",
    category: "Calendar",
  },
  {
    id: "t6",
    emoji: "🚨",
    name: "Critical incident page",
    desc: "When a card with #incident is created, page on-call.",
    trigger: "Card tagged #incident",
    action: "DM + email on-call",
    category: "Boards",
  },
];
