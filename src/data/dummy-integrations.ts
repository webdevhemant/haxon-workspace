export type IntegrationCategory =
  | "Communication"
  | "Code"
  | "Files"
  | "Calendar"
  | "Productivity"
  | "Support"
  | "Analytics";

export interface Integration {
  id: string;
  name: string;
  vendor: string;
  category: IntegrationCategory;
  emoji: string;
  color: string;
  short: string;
  long: string;
  features: string[];
  connected?: boolean;
  connectedAt?: string;
  popular?: boolean;
  recommended?: boolean;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    vendor: "Salesforce",
    category: "Communication",
    emoji: "💬",
    color: "#4A154B",
    short: "Mirror updates and DMs into Slack channels.",
    long: "Two-way sync between Haxon comments and Slack threads, channel mirroring for board updates, and slash commands to create cards from a Slack message.",
    features: ["Mirror @mentions", "Create cards from messages", "Daily digest", "Slash commands"],
    connected: true,
    connectedAt: "Apr 2024",
    popular: true,
  },
  {
    id: "github",
    name: "GitHub",
    vendor: "Microsoft",
    category: "Code",
    emoji: "🐙",
    color: "#181717",
    short: "Link PRs and issues to cards, auto-close on merge.",
    long: "Link a card to a PR — when the PR is merged, the card moves to Done. Issues open in GitHub appear on a synced board.",
    features: ["PR ↔ card links", "Auto-close on merge", "Branch from card", "Issue sync"],
    connected: true,
    connectedAt: "May 2024",
    popular: true,
  },
  {
    id: "gdrive",
    name: "Google Drive",
    vendor: "Google",
    category: "Files",
    emoji: "📁",
    color: "#1FA463",
    short: "Embed Docs, Sheets, Slides as live blocks.",
    long: "Drop a Drive link into any Haxon doc to render a live preview. Permissions are inherited from your Drive sharing settings.",
    features: ["Live embeds", "Inherit permissions", "Search across Drive", "Quick attach"],
    connected: false,
    popular: true,
  },
  {
    id: "gcal",
    name: "Google Calendar",
    vendor: "Google",
    category: "Calendar",
    emoji: "📅",
    color: "#4285F4",
    short: "Sync events both ways. Card due dates appear in your calendar.",
    long: "Haxon events appear in your Google Calendar and Google events appear in the Haxon calendar. RSVPs sync.",
    features: ["Two-way sync", "RSVP sync", "Auto-create prep doc", "Free/busy"],
    connected: false,
    recommended: true,
  },
  {
    id: "linear",
    name: "Linear",
    vendor: "Linear",
    category: "Productivity",
    emoji: "📐",
    color: "#5E6AD2",
    short: "Pull engineering issues into a synced board.",
    long: "Mirror Linear issues into a Haxon board. Status, assignee, priority round-trip.",
    features: ["Issue mirror", "Status round-trip", "Cycle imports"],
    connected: false,
    recommended: true,
  },
  {
    id: "figma",
    name: "Figma",
    vendor: "Adobe",
    category: "Productivity",
    emoji: "🎨",
    color: "#F24E1E",
    short: "Embed Figma frames as previews in docs.",
    long: "Paste a Figma link into a doc to render a live preview. Comments thread bi-directionally.",
    features: ["Live frame embeds", "Comment sync", "Auto-thumbnails"],
    connected: false,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    vendor: "Zendesk",
    category: "Support",
    emoji: "🎟",
    color: "#03363D",
    short: "Turn support tickets into cards.",
    long: "Triage tickets in Zendesk and push selected ones to a Haxon board for engineering.",
    features: ["Ticket → card", "Status sync", "SLA badges"],
    connected: false,
  },
  {
    id: "datadog",
    name: "Datadog",
    vendor: "Datadog",
    category: "Analytics",
    emoji: "🐶",
    color: "#632CA6",
    short: "Embed dashboards and alerts in docs.",
    long: "Pin Datadog charts to a doc for incident postmortems. Auto-link alerts to cards.",
    features: ["Dashboard embeds", "Alert → card", "Postmortem mode"],
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    vendor: "Notion Labs",
    category: "Productivity",
    emoji: "📓",
    color: "#000000",
    short: "Migrate or mirror your Notion pages.",
    long: "One-time import or continuous mirror of selected Notion pages and databases.",
    features: ["One-time import", "Continuous mirror", "Backlink rewrite"],
    connected: false,
  },
  {
    id: "loom",
    name: "Loom",
    vendor: "Atlassian",
    category: "Communication",
    emoji: "🎥",
    color: "#625DF5",
    short: "Embed and transcribe Looms in docs.",
    long: "Auto-transcribe Loom videos when pasted into a doc. Searchable transcripts.",
    features: ["Transcripts", "Inline preview", "Auto-summarize"],
    connected: true,
    connectedAt: "Jun 2024",
  },
  {
    id: "stripe",
    name: "Stripe",
    vendor: "Stripe",
    category: "Analytics",
    emoji: "💳",
    color: "#635BFF",
    short: "Pipe revenue events into dashboards.",
    long: "Subscription events become activity items. Pin MRR/ARR charts to docs.",
    features: ["MRR charts", "Event pipe", "Dunning alerts"],
    connected: false,
  },
  {
    id: "intercom",
    name: "Intercom",
    vendor: "Intercom",
    category: "Support",
    emoji: "💬",
    color: "#1F8DED",
    short: "Live customer conversations next to product work.",
    long: "See live customer conversations alongside the card or doc you're working on. AI tags suggest next steps.",
    features: ["Conversation embed", "AI tagging", "Customer →  card"],
    connected: false,
  },
];

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  "Communication",
  "Code",
  "Files",
  "Calendar",
  "Productivity",
  "Support",
  "Analytics",
];
