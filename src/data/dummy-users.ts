import type { User } from "@/types";

export const USERS: User[] = [
  {
    id: "u1",
    name: "Maya Chen",
    email: "maya@haxon.app",
    role: "Owner",
    initials: "MC",
    color: "#F97316",
  },
  {
    id: "u2",
    name: "Diego Romano",
    email: "diego@haxon.app",
    role: "Admin",
    initials: "DR",
    color: "#3B82F6",
  },
  {
    id: "u3",
    name: "Priya Iyer",
    email: "priya@haxon.app",
    role: "Member",
    initials: "PI",
    color: "#8B5CF6",
  },
  {
    id: "u4",
    name: "Jordan Webb",
    email: "jordan@haxon.app",
    role: "Member",
    initials: "JW",
    color: "#10B981",
  },
  {
    id: "u5",
    name: "Sana Khoury",
    email: "sana@haxon.app",
    role: "Member",
    initials: "SK",
    color: "#EC4899",
  },
  {
    id: "u6",
    name: "Theo Lindqvist",
    email: "theo@haxon.app",
    role: "Member",
    initials: "TL",
    color: "#14B8A6",
  },
];

export const CURRENT_USER = USERS[0];

export const FEATURES = [
  {
    icon: "Sparkles",
    title: "AI that knows your work",
    desc: "Drafts, summaries, and answers grounded in your workspace — not the open internet.",
  },
  {
    icon: "FileText",
    title: "Docs that think",
    desc: "Slash commands, embedded blocks, real-time multiplayer. Your second brain, structured.",
  },
  {
    icon: "Kanban",
    title: "Boards & grids, unified",
    desc: "Swap any project between kanban, grid, and timeline. Same source of truth.",
  },
  {
    icon: "Users",
    title: "Built for teams",
    desc: "Granular roles, audit trail, SSO, and SCIM provisioning out of the box.",
  },
  {
    icon: "Zap",
    title: "Fast, always",
    desc: "Local-first sync engine. Sub-50ms typing latency even with 200-person workspaces.",
  },
  {
    icon: "Layers",
    title: "Composable workspaces",
    desc: "Nest spaces, link blocks across docs, and template the work that repeats.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Replaced three tools in our first month. The AI doesn't feel bolted on — it feels like a teammate.",
    name: "Lena Vargas",
    role: "Head of Product, Atlas Robotics",
    initials: "LV",
    color: "#0EA5E9",
  },
  {
    quote:
      "Finally, a workspace that respects how engineers think. Slash command into a board? Yes please.",
    name: "Ravi Subramanian",
    role: "Staff Eng, Mercator",
    initials: "RS",
    color: "#8B5CF6",
  },
  {
    quote:
      "Our onboarding time for new hires dropped from 9 days to 3. The wiki + AI search is unreasonably good.",
    name: "Mei Tanaka",
    role: "Chief of Staff, Reverb",
    initials: "MT",
    color: "#F97316",
  },
  {
    quote:
      "We migrated 11,000 docs in a weekend. No data loss, no formatting drift. Genuinely impressed.",
    name: "Oscar Brennan",
    role: "Eng Manager, Helia",
    initials: "OB",
    color: "#10B981",
  },
  {
    quote:
      "Haxon is the first tool where I trust the AI to read everything. Permissions actually work.",
    name: "Aïcha Diallo",
    role: "VP Ops, Vellum",
    initials: "AD",
    color: "#EC4899",
  },
  {
    quote:
      "Our team meetings are 40% shorter because the prep docs basically write themselves now.",
    name: "Tom Halverson",
    role: "Founder, Pinecrest Labs",
    initials: "TH",
    color: "#14B8A6",
  },
];
