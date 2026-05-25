import type { Board } from "@/types";

export const BOARDS: Board[] = [
  {
    id: "b1", workspaceId: "w1", name: "Q3 Roadmap", emoji: "🗺️",
    columns: [
      { id: "c1", name: "Backlog", color: "#78716C", cards: [
        { id: "k1", title: "Audit AI block latency on mobile", priority: "Medium", assigneeId: "u2", dueDate: "Aug 14", tags: ["mobile", "perf"], description: "Mobile P95 for AI inserts is 2.4s — target 1.2s." },
        { id: "k2", title: "Design empty-state for Grid view", priority: "Low", assigneeId: "u5", dueDate: "Aug 18", tags: ["design"] },
        { id: "k3", title: "Spike: collaborative cursors in Tiptap", priority: "Medium", assigneeId: "u2", dueDate: "—", tags: ["editor"] },
      ]},
      { id: "c2", name: "In Progress", color: "#F59E0B", cards: [
        { id: "k4", title: "AI assistant — streaming improvements", priority: "High", assigneeId: "u4", dueDate: "Aug 9", tags: ["ai", "p0"], description: "Cursor jumps when tokens land mid-paragraph." },
        { id: "k5", title: "Workspace switcher hotkeys", priority: "Medium", assigneeId: "u3", dueDate: "Aug 11", tags: ["UX"] },
        { id: "k6", title: "Slack integration v2 — threading", priority: "High", assigneeId: "u6", dueDate: "Aug 12", tags: ["integrations"] },
      ]},
      { id: "c3", name: "In Review", color: "#3B82F6", cards: [
        { id: "k7", title: "Doc → Board converter", priority: "High", assigneeId: "u1", dueDate: "Aug 8", tags: ["editor", "board"], description: "Convert headings into kanban columns." },
        { id: "k8", title: "Onboarding emails redesign", priority: "Medium", assigneeId: "u5", dueDate: "Aug 7", tags: ["growth"] },
      ]},
      { id: "c4", name: "Done", color: "#10B981", cards: [
        { id: "k9", title: "v2.3.1 patch release", priority: "High", assigneeId: "u2", dueDate: "Aug 3", tags: ["release"] },
        { id: "k10", title: "Member roles UI refresh", priority: "Low", assigneeId: "u3", dueDate: "Aug 2", tags: ["settings"] },
        { id: "k11", title: "Pricing page A/B test live", priority: "Medium", assigneeId: "u1", dueDate: "Aug 1", tags: ["growth"] },
      ]},
    ],
  },
  { id: "b2", workspaceId: "w1", name: "Marketing", emoji: "📣", columns: [] },
];
