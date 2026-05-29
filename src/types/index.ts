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
