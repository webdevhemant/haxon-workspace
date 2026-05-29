import type { CalendarEvent } from "@/types";

function iso(year: number, month: number, day: number, hour: number, minute = 0): string {
  return new Date(year, month, day, hour, minute).toISOString();
}

const Y = 2026;
const M = 4;

export const EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    title: "Q3 All-Hands",
    type: "meeting",
    startISO: iso(Y, M, 28, 11),
    endISO: iso(Y, M, 28, 12),
    location: "HQ — Atrium",
    videoLink: "https://meet.haxon.app/all-hands",
    ownerId: "u1",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u2", rsvp: "yes" },
      { userId: "u3", rsvp: "yes" },
      { userId: "u4", rsvp: "yes" },
      { userId: "u5", rsvp: "maybe" },
      { userId: "u6", rsvp: "pending" },
    ],
    description:
      "Diego walks the team through the Q3 vision: enterprise positioning, sync engine v2, and the AI roadmap. Live Q&A at the end.",
    agenda: [
      "Welcome & wins from the week",
      "Q3 vision — Diego",
      "Sync engine v2 demo — Priya",
      "AI streaming preview — Maya",
      "Q&A",
    ],
    attachments: [{ kind: "doc", title: "Q3 Product Strategy", emoji: "📘" }],
    recurring: "Bi-weekly",
  },
  {
    id: "e2",
    title: "Product / Design weekly",
    type: "meeting",
    startISO: iso(Y, M, 29, 10, 30),
    endISO: iso(Y, M, 29, 11, 30),
    videoLink: "https://meet.haxon.app/product-design",
    ownerId: "u2",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u2", rsvp: "yes" },
      { userId: "u5", rsvp: "yes" },
      { userId: "u3", rsvp: "maybe" },
    ],
    description:
      "Weekly sync between product and design. Review last week's ships, walk through next sprint's priorities.",
    agenda: [
      "Last week recap",
      "Editor empty states review",
      "Pricing matrix UX",
      "Open questions",
    ],
    recurring: "Weekly",
  },
  {
    id: "e3",
    title: "Streaming improvements — SSE refactor",
    type: "deadline",
    startISO: iso(Y, M, 29, 17),
    endISO: iso(Y, M, 29, 17),
    allDay: true,
    ownerId: "u4",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u4", rsvp: "yes" },
    ],
    description: "End-of-sprint cutoff for the SSE refactor. Slipping bumps the AI launch demo.",
    priority: "High",
    attachments: [{ kind: "board", title: "Q3 Roadmap", emoji: "🗂" }],
  },
  {
    id: "e4",
    title: "Sync Engine RFC review",
    type: "meeting",
    startISO: iso(Y, M, 30, 15),
    endISO: iso(Y, M, 30, 16),
    location: "Zoom",
    videoLink: "https://meet.haxon.app/sync-rfc",
    ownerId: "u3",
    attendees: [
      { userId: "u2", rsvp: "yes" },
      { userId: "u3", rsvp: "yes" },
      { userId: "u4", rsvp: "yes" },
      { userId: "u6", rsvp: "yes" },
    ],
    description:
      "Final pass on the Sync Engine v2 RFC. Focus on rollback strategy and load-test methodology.",
    agenda: ["Vector clock recap", "Rollback strategy", "Load testing plan", "Open issues"],
    attachments: [{ kind: "doc", title: "Engineering RFC — Sync Engine v2", emoji: "📐" }],
  },
  {
    id: "e5",
    title: "Brand voice workshop",
    type: "meeting",
    startISO: iso(Y, M, 30, 13),
    endISO: iso(Y, M, 30, 14, 30),
    location: "Studio room",
    ownerId: "u5",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u5", rsvp: "yes" },
    ],
    description:
      "Workshop: re-align voice & tone with the enterprise positioning shift. Bring examples.",
    agenda: ["Voice principles refresh", "Enterprise tone exercises", "Doc rewrite sprint"],
  },
  {
    id: "e6",
    title: "Focus block — partial-response UI",
    type: "focus",
    startISO: iso(Y, M, 28, 14),
    endISO: iso(Y, M, 28, 17),
    ownerId: "u1",
    attendees: [{ userId: "u1", rsvp: "yes" }],
    description: "Heads-down: prototype the partial-response UI, drop a Loom in #product.",
  },
  {
    id: "e7",
    title: "Sana — Public holiday",
    type: "ooo",
    startISO: iso(Y, M, 31, 0),
    endISO: iso(Y, M, 31, 23, 59),
    allDay: true,
    ownerId: "u5",
    attendees: [{ userId: "u5", rsvp: "yes" }],
    description: "Public holiday in Beirut. Sana is offline.",
  },
  {
    id: "e8",
    title: "Coffee with Diego",
    type: "social",
    startISO: iso(Y, M, 28, 9),
    endISO: iso(Y, M, 28, 9, 30),
    location: "Blue Bottle, Hayes Valley",
    ownerId: "u2",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u2", rsvp: "yes" },
    ],
    description: "Informal: walk through the Q3 positioning before the all-hands.",
  },
  {
    id: "e9",
    title: "Customer call — Atlas Robotics",
    type: "meeting",
    startISO: iso(Y, M + 1, 1, 16),
    endISO: iso(Y, M + 1, 1, 17),
    videoLink: "https://meet.haxon.app/atlas",
    ownerId: "u1",
    attendees: [
      { userId: "u1", rsvp: "yes" },
      { userId: "u2", rsvp: "yes" },
    ],
    description:
      "Discovery call with Lena's team at Atlas. Focus: permissions and audit log requirements.",
    agenda: ["Their workflow today", "Permissions deep-dive", "Roadmap preview", "Next steps"],
  },
  {
    id: "e10",
    title: "On-call rotation switch",
    type: "deadline",
    startISO: iso(Y, M + 1, 2, 9),
    endISO: iso(Y, M + 1, 2, 9),
    allDay: true,
    ownerId: "u4",
    attendees: [
      { userId: "u3", rsvp: "yes" },
      { userId: "u4", rsvp: "yes" },
      { userId: "u6", rsvp: "yes" },
    ],
    description: "Priya hands the pager to Theo. Runbook review at 09:00.",
    priority: "Medium",
  },
];
