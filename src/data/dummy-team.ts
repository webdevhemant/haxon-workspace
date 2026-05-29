import type { TeamMemberProfile } from "@/types";

export const TEAM_PROFILES: TeamMemberProfile[] = [
  {
    userId: "u1",
    title: "Founder & CEO",
    team: "Leadership",
    location: "San Francisco, CA",
    timezone: "PT (UTC−7)",
    workingHours: "08:00 – 18:00",
    pronouns: "she/her",
    bio: "Building Haxon. Previously product at Notion. Endlessly curious about how teams turn information into decisions.",
    skills: ["Strategy", "Product", "Writing", "AI"],
    startedAt: "Founder — April 2024",
    manager: undefined,
    projects: [
      { name: "Q3 Roadmap", emoji: "🗂" },
      { name: "Brand voice & tone", emoji: "✍️" },
      { name: "Marketing board", emoji: "📣" },
    ],
    links: [
      { label: "Personal site", href: "https://maya.example" },
      { label: "Twitter", href: "https://twitter.com/maya" },
    ],
    recentActivity: [
      { at: "10m ago", verb: "commented on", target: "Q3 Product Strategy" },
      { at: "2h ago", verb: "merged", target: "Marketing board" },
      { at: "yesterday", verb: "shared", target: "Brand voice & tone" },
    ],
  },
  {
    userId: "u2",
    title: "Head of Product",
    team: "Product",
    location: "Brooklyn, NY",
    timezone: "ET (UTC−4)",
    workingHours: "09:30 – 19:00",
    pronouns: "he/him",
    bio: "PM with a soft spot for changelog poetry. I think most product problems are actually communication problems wearing a hat.",
    skills: ["Discovery", "Pricing", "Research", "Specs"],
    startedAt: "Joined May 2024",
    manager: "u1",
    projects: [
      { name: "Q3 Product Strategy", emoji: "📘" },
      { name: "Q3 Pricing Matrix", emoji: "💰" },
    ],
    links: [
      { label: "LinkedIn", href: "https://linkedin.com/in/diego" },
    ],
    recentActivity: [
      { at: "9:42 AM", verb: "shared", target: "Q3 Product Strategy" },
      { at: "Yesterday", verb: "assigned", target: "Streaming improvements" },
    ],
  },
  {
    userId: "u3",
    title: "Staff Engineer",
    team: "Engineering",
    location: "Bengaluru, IN",
    timezone: "IST (UTC+5:30)",
    workingHours: "11:00 – 20:00",
    pronouns: "she/her",
    bio: "Distributed systems & local-first sync. Wrote half the sync engine. Currently reading too many Datomic papers.",
    skills: ["Sync engine", "CRDTs", "Postgres", "RFCs"],
    startedAt: "Joined June 2024",
    manager: "u4",
    projects: [
      { name: "Sync Engine RFC", emoji: "📐" },
      { name: "Engineering board", emoji: "⚙️" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/priya" }],
    recentActivity: [
      { at: "9:51 AM", verb: "reviewed", target: "Q3 Product Strategy" },
      { at: "Yesterday", verb: "published", target: "Sync Engine RFC v2" },
    ],
  },
  {
    userId: "u4",
    title: "Engineering Manager",
    team: "Engineering",
    location: "Berlin, DE",
    timezone: "CET (UTC+2)",
    workingHours: "09:00 – 17:30",
    pronouns: "they/them",
    bio: "Manages the platform crew. Cares deeply about cycle time, on-call sanity, and good docs. Will write you a runbook.",
    skills: ["Infra", "On-call", "Mentoring", "Planning"],
    startedAt: "Joined July 2024",
    manager: "u1",
    projects: [
      { name: "Q3 Roadmap", emoji: "🗂" },
      { name: "AI streaming improvements", emoji: "🤖" },
    ],
    recentActivity: [
      { at: "10:08 AM", verb: "moved", target: "Streaming improvements → In Progress" },
      { at: "8:12 AM", verb: "assigned", target: "AI streaming improvements" },
    ],
  },
  {
    userId: "u5",
    title: "Head of Design",
    team: "Design",
    location: "Beirut, LB",
    timezone: "EET (UTC+3)",
    workingHours: "10:00 – 19:00",
    pronouns: "she/her",
    bio: "Brand, marketing site, and the editor surface. Believes whitespace is a feature.",
    skills: ["Brand", "Illustration", "Editor UX", "Typography"],
    startedAt: "Joined August 2024",
    manager: "u1",
    projects: [
      { name: "Brand voice & tone", emoji: "✍️" },
      { name: "Empty-state illustrations", emoji: "🪄" },
    ],
    links: [{ label: "Dribbble", href: "https://dribbble.com/sana" }],
    recentActivity: [
      { at: "9:14 AM", verb: "shared", target: "Brand voice & tone" },
      { at: "Yesterday", verb: "posted", target: "Empty-state illustrations" },
    ],
  },
  {
    userId: "u6",
    title: "Senior Engineer",
    team: "Engineering",
    location: "Stockholm, SE",
    timezone: "CET (UTC+2)",
    workingHours: "08:30 – 17:00",
    pronouns: "he/him",
    bio: "Editor primitives and slash-command engine. Off the clock: open-water swimming and stubborn home-roasted espresso.",
    skills: ["Editor", "TypeScript", "Performance", "DX"],
    startedAt: "Joined September 2024",
    manager: "u4",
    projects: [
      { name: "Doc editor blocks", emoji: "🧱" },
      { name: "Engineering board", emoji: "⚙️" },
    ],
    recentActivity: [
      { at: "8:47 AM", verb: "shipped", target: "Reconnect bug fix" },
      { at: "3d ago", verb: "pushed", target: "Editor block primitives" },
    ],
  },
];

export const TEAM_HOLIDAYS_THIS_WEEK = [
  { userId: "u5", date: "Thu", reason: "Public holiday" },
];

export const OPEN_ROLES = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote · EU/US" },
  { title: "Product Designer", team: "Design", location: "Remote · global" },
  { title: "Developer Advocate", team: "Marketing", location: "SF or NYC" },
];

export function profileFor(userId: string): TeamMemberProfile | undefined {
  return TEAM_PROFILES.find((p) => p.userId === userId);
}
