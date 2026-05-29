import type { DocBlock } from "@/types";

export interface DocCommentReply {
  id: string;
  userId: string;
  text: string;
  at: string;
}

export interface DocComment {
  id: string;
  userId: string;
  text: string;
  at: string;
  replies: DocCommentReply[];
}

export interface SlashMenuItem {
  kind: string;
  label: string;
  desc: string;
  featured?: boolean;
}

export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  { kind: "h1", label: "Heading 1", desc: "Big section heading" },
  { kind: "h2", label: "Heading 2", desc: "Medium section heading" },
  { kind: "h3", label: "Heading 3", desc: "Small section heading" },
  { kind: "p", label: "Text", desc: "Plain paragraph" },
  { kind: "list", label: "Bullet list", desc: "Simple bullet list" },
  { kind: "callout", label: "Callout", desc: "Highlight a key point" },
  { kind: "divider", label: "Divider", desc: "Horizontal rule" },
  { kind: "ai", label: "AI block", desc: "Ask AI to write or summarize", featured: true },
];

export const AI_SUGGESTIONS = [
  "Summarize Q3 Strategy",
  "What's blocked this sprint?",
  "Draft a release note",
  "Who's on the AI team?",
];

export const SEED_COMMENTS: DocComment[] = [
  {
    id: "c1", userId: "u2",
    text: "We should clarify the positioning section before publishing this.",
    at: "2h ago",
    replies: [{ id: "r1", userId: "u1", text: "Good point — I'll revise the second paragraph.", at: "1h ago" }],
  },
  {
    id: "c2", userId: "u3",
    text: "Can we add a section on competitive analysis?",
    at: "Yesterday",
    replies: [],
  },
];

export const BLOCK_TEMPLATES: Record<string, DocBlock> = {
  h1: { type: "h1", text: "New heading" },
  h2: { type: "h2", text: "New subheading" },
  h3: { type: "h3", text: "New section" },
  p: { type: "p", text: "" },
  list: { type: "list", items: ["First item", "Second item"] },
  callout: { type: "callout", text: "Important note…" },
  divider: { type: "divider" },
  ai: { type: "ai", text: "Drafted by Haxon AI based on your workspace context. This is a working summary — feel free to edit or regenerate." },
};

export function generateAiResponse(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("summar")) return "The Q3 Product Strategy commits to three bets: ship AI assistant to GA, launch Grid view with shared schema, and move to usage-based pricing for AI features.";
  if (l.includes("block")) return "Two cards are flagged: 'AI assistant — streaming improvements' (Jordan, High) and 'Doc → Board converter' (Maya, High). Both tracking late.";
  if (l.includes("release")) return "Draft v2.4 note:\n• AI streaming improvements\n• Grid view live\n• Slack threading v2\n• Faster workspace switcher with ⌘+number";
  return "Based on this workspace, I can help with drafting docs, summarizing pages, surfacing blocked work, and finding people or files.";
}
