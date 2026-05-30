export type GoalStatus = "on-track" | "at-risk" | "off-track" | "complete";

export interface KeyResult {
  id: string;
  title: string;
  progress: number;
  target: string;
  current: string;
  ownerId: string;
}

export interface Goal {
  id: string;
  emoji: string;
  title: string;
  description: string;
  period: string;
  status: GoalStatus;
  ownerId: string;
  contributorIds: string[];
  keyResults: KeyResult[];
  parentId?: string;
}

export const GOALS: Goal[] = [
  {
    id: "g1",
    emoji: "🚀",
    title: "Reach 20,000 active workspaces",
    description: "Top-line goal for Q3. Activated workspace = ≥3 docs created and ≥1 collaborator.",
    period: "Q3 2026",
    status: "on-track",
    ownerId: "u1",
    contributorIds: ["u2", "u4", "u5"],
    keyResults: [
      { id: "kr1", title: "Land 10 enterprise design partners", progress: 70, target: "10", current: "7", ownerId: "u2" },
      { id: "kr2", title: "Self-serve activation rate ≥ 38%", progress: 55, target: "38%", current: "21%", ownerId: "u1" },
      { id: "kr3", title: "AI features adopted by 60% of teams", progress: 40, target: "60%", current: "24%", ownerId: "u3" },
    ],
  },
  {
    id: "g2",
    emoji: "🛠",
    title: "Ship Sync Engine v2",
    description: "Local-first sync with vector clocks. Unblocks real-time multiplayer at scale.",
    period: "Q3 2026",
    status: "at-risk",
    ownerId: "u3",
    contributorIds: ["u3", "u4", "u6"],
    parentId: "g1",
    keyResults: [
      { id: "kr4", title: "RFC v2 signed off", progress: 90, target: "1", current: "0.9", ownerId: "u3" },
      { id: "kr5", title: "Reconnect time < 2s in p99", progress: 60, target: "<2s", current: "2.6s", ownerId: "u6" },
      { id: "kr6", title: "Migration plan for existing workspaces", progress: 25, target: "100%", current: "25%", ownerId: "u4" },
    ],
  },
  {
    id: "g3",
    emoji: "🎯",
    title: "Lock the enterprise positioning",
    description: "Move from 'AI workspace' to 'permissions-first AI workspace'. Refresh site, docs, and pricing.",
    period: "Q3 2026",
    status: "on-track",
    ownerId: "u2",
    contributorIds: ["u1", "u2", "u5"],
    parentId: "g1",
    keyResults: [
      { id: "kr7", title: "New positioning doc shipped", progress: 100, target: "1", current: "1", ownerId: "u2" },
      { id: "kr8", title: "Site refresh launched", progress: 35, target: "100%", current: "35%", ownerId: "u5" },
      { id: "kr9", title: "Pricing matrix v2 live", progress: 50, target: "100%", current: "50%", ownerId: "u2" },
    ],
  },
  {
    id: "g4",
    emoji: "🤖",
    title: "AI assistant reaches daily-active for power users",
    description: "Power users open the AI panel at least 3 days a week.",
    period: "Q3 2026",
    status: "off-track",
    ownerId: "u1",
    contributorIds: ["u1", "u3"],
    keyResults: [
      { id: "kr10", title: "Power-user DAU on AI ≥ 60%", progress: 15, target: "60%", current: "9%", ownerId: "u1" },
      { id: "kr11", title: "Median response < 1.5s", progress: 50, target: "<1.5s", current: "2.1s", ownerId: "u3" },
    ],
  },
  {
    id: "g5",
    emoji: "📈",
    title: "Net revenue retention ≥ 130%",
    description: "Healthy expansion from existing customers.",
    period: "Q3 2026",
    status: "complete",
    ownerId: "u2",
    contributorIds: ["u2"],
    keyResults: [
      { id: "kr12", title: "NRR ≥ 130%", progress: 100, target: "130%", current: "132%", ownerId: "u2" },
    ],
  },
];

export const STATUS_LABEL: Record<GoalStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  "off-track": "Off track",
  complete: "Complete",
};

export const STATUS_COLOR: Record<GoalStatus, string> = {
  "on-track": "#10B981",
  "at-risk": "#F59E0B",
  "off-track": "#EF4444",
  complete: "#3B82F6",
};
