export type WorkspaceRole = "Owner" | "Admin" | "Member" | "Guest";

export type Capability =
  | "workspace.delete"
  | "workspace.rename"
  | "billing.manage"
  | "members.invite"
  | "members.remove"
  | "members.roleChange"
  | "audit.view"
  | "doc.create"
  | "doc.edit"
  | "doc.delete"
  | "doc.share"
  | "board.create"
  | "board.edit"
  | "board.delete"
  | "board.move"
  | "comment.add"
  | "ai.use"
  | "channel.create"
  | "channel.archive"
  | "channel.message"
  | "settings.workspace";

interface CapabilityInfo {
  key: Capability;
  category: "Workspace" | "People" | "Docs & boards" | "Chat" | "AI";
  label: string;
  desc: string;
}

export const CAPABILITIES: CapabilityInfo[] = [
  { key: "workspace.delete", category: "Workspace", label: "Delete workspace", desc: "Permanently remove a workspace and all of its data." },
  { key: "workspace.rename", category: "Workspace", label: "Rename workspace", desc: "Change the workspace name, emoji, or color." },
  { key: "settings.workspace", category: "Workspace", label: "Edit workspace settings", desc: "Domain, SSO, defaults, integrations." },
  { key: "billing.manage", category: "Workspace", label: "Manage billing", desc: "Change plan, payment method, view invoices." },
  { key: "audit.view", category: "Workspace", label: "View audit log", desc: "See who did what across the workspace." },

  { key: "members.invite", category: "People", label: "Invite members", desc: "Send an invite link or add by email." },
  { key: "members.roleChange", category: "People", label: "Change roles", desc: "Promote or demote teammates." },
  { key: "members.remove", category: "People", label: "Remove members", desc: "Deactivate or remove people from the workspace." },

  { key: "doc.create", category: "Docs & boards", label: "Create docs", desc: "Spin up new documents and wikis." },
  { key: "doc.edit", category: "Docs & boards", label: "Edit docs", desc: "Modify content in docs you have access to." },
  { key: "doc.delete", category: "Docs & boards", label: "Delete docs", desc: "Move docs to trash. Owners and admins can restore." },
  { key: "doc.share", category: "Docs & boards", label: "Share externally", desc: "Generate public or guest-facing share links." },
  { key: "board.create", category: "Docs & boards", label: "Create boards", desc: "Spin up Kanban, list, or grid boards." },
  { key: "board.edit", category: "Docs & boards", label: "Edit boards", desc: "Add columns, edit cards, change views." },
  { key: "board.move", category: "Docs & boards", label: "Move cards", desc: "Drag cards across columns and reorder." },
  { key: "board.delete", category: "Docs & boards", label: "Delete boards", desc: "Archive or permanently remove a board." },

  { key: "channel.create", category: "Chat", label: "Create channels", desc: "Start new public or private channels." },
  { key: "channel.archive", category: "Chat", label: "Archive channels", desc: "Close a channel and remove from sidebars." },
  { key: "channel.message", category: "Chat", label: "Send messages", desc: "Post in channels and DMs." },
  { key: "comment.add", category: "Docs & boards", label: "Comment", desc: "Leave inline comments and threaded replies." },

  { key: "ai.use", category: "AI", label: "Use AI assistant", desc: "Run prompts, generate, summarize, draft." },
];

export const ROLES: WorkspaceRole[] = ["Owner", "Admin", "Member", "Guest"];

export const ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
  Owner: "The buck stops here. Full control over the workspace, including billing and deletion.",
  Admin: "Day-to-day operator. Can invite, manage roles, and run the workspace — but can't delete it or change billing.",
  Member: "Default for teammates. Can create, edit, comment, and message everywhere they have access.",
  Guest: "Read-mostly access. Can view shared docs and boards, comment, and chat in invited channels — nothing structural.",
};

export const ROLE_COLOR: Record<WorkspaceRole, string> = {
  Owner: "#F97316",
  Admin: "#8B5CF6",
  Member: "#3B82F6",
  Guest: "#6B7280",
};

const POLICY: Record<WorkspaceRole, Capability[]> = {
  Owner: [
    "workspace.delete", "workspace.rename", "settings.workspace", "billing.manage", "audit.view",
    "members.invite", "members.roleChange", "members.remove",
    "doc.create", "doc.edit", "doc.delete", "doc.share",
    "board.create", "board.edit", "board.move", "board.delete",
    "channel.create", "channel.archive", "channel.message", "comment.add",
    "ai.use",
  ],
  Admin: [
    "workspace.rename", "settings.workspace", "audit.view",
    "members.invite", "members.roleChange", "members.remove",
    "doc.create", "doc.edit", "doc.delete", "doc.share",
    "board.create", "board.edit", "board.move", "board.delete",
    "channel.create", "channel.archive", "channel.message", "comment.add",
    "ai.use",
  ],
  Member: [
    "doc.create", "doc.edit", "doc.share",
    "board.create", "board.edit", "board.move",
    "channel.create", "channel.message", "comment.add",
    "ai.use",
  ],
  Guest: [
    "comment.add", "channel.message", "ai.use",
  ],
};

export function can(role: WorkspaceRole, capability: Capability): boolean {
  return POLICY[role].includes(capability);
}

export function capabilityCount(role: WorkspaceRole): number {
  return POLICY[role].length;
}

export function asRole(role: string): WorkspaceRole {
  return (ROLES as readonly string[]).includes(role) ? (role as WorkspaceRole) : "Member";
}
