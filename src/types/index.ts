export interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  initials: string;
  color: string;
}

export interface Workspace {
  id: string;
  name: string;
  emoji: string;
  color: string;
  role: string;
}

export interface DocBlock {
  type: "h1" | "h2" | "h3" | "p" | "list" | "callout" | "ai" | "divider";
  text?: string;
  items?: string[];
}

export interface Doc {
  id: string;
  workspaceId: string;
  title: string;
  folder: string;
  emoji: string;
  isFavorite: boolean;
  lastEditedBy: string;
  lastEditedAt: string;
  type: "doc" | "wiki";
  content?: DocBlock[];
}

export interface CardSubtask {
  id: string;
  title: string;
  done: boolean;
}

export interface CardComment {
  id: string;
  userId: string;
  text: string;
  at: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  priority: "Urgent" | "High" | "Medium" | "Low" | "None";
  startDate?: string;
  dueDate: string;
  tags?: string[];
  labels?: string[];
  followers?: string[];
  subtasks?: CardSubtask[];
  comments?: CardComment[];
}

export interface Column {
  id: string;
  name: string;
  color: string;
  cards: Card[];
}

export type ViewType = "board" | "list" | "grid" | "table" | "workload";

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  emoji: string;
  columns: Column[];
}

export interface GridRow {
  id: string;
  name: string;
  status: "Backlog" | "In Progress" | "In Review" | "Done";
  assigneeId: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  tags: string[];
  created: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  verb: string;
  target: string;
  in: string;
  at: string;
  icon: string;
}

export type CalendarEventType = "meeting" | "deadline" | "social" | "focus" | "ooo";

export interface CalendarEventAttendee {
  userId: string;
  rsvp: "yes" | "no" | "maybe" | "pending";
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  startISO: string;
  endISO: string;
  allDay?: boolean;
  location?: string;
  videoLink?: string;
  ownerId: string;
  attendees: CalendarEventAttendee[];
  description?: string;
  agenda?: string[];
  attachments?: { kind: "doc" | "board" | "link"; title: string; emoji?: string }[];
  priority?: "Urgent" | "High" | "Medium" | "Low" | "None";
  recurring?: string;
}

export interface TeamMemberProfile {
  userId: string;
  title: string;
  team: string;
  location: string;
  timezone: string;
  workingHours: string;
  bio: string;
  skills: string[];
  startedAt: string;
  projects: { name: string; emoji: string; href?: string }[];
  links?: { label: string; href: string }[];
  pronouns?: string;
  manager?: string;
  recentActivity?: { at: string; verb: string; target: string }[];
}

export type ChatChannelKind = "channel" | "dm";

export interface ChatChannel {
  id: string;
  kind: ChatChannelKind;
  name: string;
  topic?: string;
  emoji?: string;
  memberIds: string[];
  unread: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isPrivate?: boolean;
  lastActivityAt: string;
}

export interface ChatAttachment {
  kind: "doc" | "board" | "link" | "image";
  title: string;
  subtitle?: string;
  href?: string;
  emoji?: string;
}

export interface ChatReaction {
  emoji: string;
  userIds: string[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  text: string;
  at: string;
  edited?: boolean;
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  replyToId?: string;
  threadCount?: number;
  pinned?: boolean;
  system?: boolean;
}

export type ModalConfig =
  | { type: "delete"; id?: string; kind: string; name: string }
  | { type: "duplicate"; id?: string; kind: string; name: string }
  | { type: "rename"; id: string; kind: string; current: string }
  | { type: "invite" }
  | { type: "createWorkspace" }
  | { type: "createBoard"; workspaceId: string }
  | { type: "createDoc"; workspaceId: string }
  | { type: "share"; name: string };
