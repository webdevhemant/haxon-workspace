export type WorkspaceRole = "Owner" | "Admin" | "Member" | "Guest";

export type Capability =
  | "workspace.delete"
  | "workspace.rename"
  | "workspace.create"
  | "workspace.switch"
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
  | "settings.workspace"
  | "automation.view"
  | "automation.create"
  | "automation.toggle"
  | "automation.edit"
  | "automation.delete"
  | "integration.view"
  | "integration.connect"
  | "integration.configure"
  | "integration.disconnect"
  | "files.view"
  | "files.upload"
  | "files.delete"
  | "files.star"
  | "files.download"
  | "goals.view"
  | "goals.create"
  | "goals.edit"
  | "goals.delete"
  | "calendar.view"
  | "calendar.event.create"
  | "calendar.event.edit"
  | "calendar.event.rsvp"
  | "team.view"
  | "team.message"
  | "team.member.edit"
  | "dashboard.view"
  | "inbox.view"
  | "settings.members.view"
  | "settings.billing.view"
  | "settings.roles.view";

interface CapabilityInfo {
  key: Capability;
  category:
    | "Workspace"
    | "People"
    | "Docs & boards"
    | "Chat"
    | "AI"
    | "Automations"
    | "Integrations"
    | "Files"
    | "Goals"
    | "Calendar"
    | "Team"
    | "Navigation"
    | "Settings";
  label: string;
  desc: string;
}

export const CAPABILITIES: CapabilityInfo[] = [
  {
    key: "workspace.delete",
    category: "Workspace",
    label: "Delete workspace",
    desc: "Permanently remove a workspace and all of its data.",
  },
  {
    key: "workspace.rename",
    category: "Workspace",
    label: "Rename workspace",
    desc: "Change the workspace name, emoji, or color.",
  },
  {
    key: "workspace.create",
    category: "Workspace",
    label: "Create workspace",
    desc: "Spin up a new workspace from the switcher.",
  },
  {
    key: "workspace.switch",
    category: "Workspace",
    label: "Switch workspace",
    desc: "Move between workspaces you belong to.",
  },
  {
    key: "settings.workspace",
    category: "Workspace",
    label: "Edit workspace settings",
    desc: "Domain, SSO, defaults, integrations.",
  },
  {
    key: "billing.manage",
    category: "Workspace",
    label: "Manage billing",
    desc: "Change plan, payment method, view invoices.",
  },
  {
    key: "audit.view",
    category: "Workspace",
    label: "View audit log",
    desc: "See who did what across the workspace.",
  },

  {
    key: "members.invite",
    category: "People",
    label: "Invite members",
    desc: "Send an invite link or add by email.",
  },
  {
    key: "members.roleChange",
    category: "People",
    label: "Change roles",
    desc: "Promote or demote teammates.",
  },
  {
    key: "members.remove",
    category: "People",
    label: "Remove members",
    desc: "Deactivate or remove people from the workspace.",
  },

  {
    key: "doc.create",
    category: "Docs & boards",
    label: "Create docs",
    desc: "Spin up new documents and wikis.",
  },
  {
    key: "doc.edit",
    category: "Docs & boards",
    label: "Edit docs",
    desc: "Modify content in docs you have access to.",
  },
  {
    key: "doc.delete",
    category: "Docs & boards",
    label: "Delete docs",
    desc: "Move docs to trash. Owners and admins can restore.",
  },
  {
    key: "doc.share",
    category: "Docs & boards",
    label: "Share externally",
    desc: "Generate public or guest-facing share links.",
  },
  {
    key: "board.create",
    category: "Docs & boards",
    label: "Create boards",
    desc: "Spin up Kanban, list, or grid boards.",
  },
  {
    key: "board.edit",
    category: "Docs & boards",
    label: "Edit boards",
    desc: "Add columns, edit cards, change views.",
  },
  {
    key: "board.move",
    category: "Docs & boards",
    label: "Move cards",
    desc: "Drag cards across columns and reorder.",
  },
  {
    key: "board.delete",
    category: "Docs & boards",
    label: "Delete boards",
    desc: "Archive or permanently remove a board.",
  },

  {
    key: "channel.create",
    category: "Chat",
    label: "Create channels",
    desc: "Start new public or private channels.",
  },
  {
    key: "channel.archive",
    category: "Chat",
    label: "Archive channels",
    desc: "Close a channel and remove from sidebars.",
  },
  {
    key: "channel.message",
    category: "Chat",
    label: "Send messages",
    desc: "Post in channels and DMs.",
  },
  {
    key: "comment.add",
    category: "Docs & boards",
    label: "Comment",
    desc: "Leave inline comments and threaded replies.",
  },

  {
    key: "ai.use",
    category: "AI",
    label: "Use AI assistant",
    desc: "Run prompts, generate, summarize, draft.",
  },

  {
    key: "automation.view",
    category: "Automations",
    label: "View automations",
    desc: "Browse the automations list.",
  },
  {
    key: "automation.create",
    category: "Automations",
    label: "Create automations",
    desc: "Build a new when/then rule.",
  },
  {
    key: "automation.toggle",
    category: "Automations",
    label: "Toggle automations",
    desc: "Pause or resume an existing automation.",
  },
  {
    key: "automation.edit",
    category: "Automations",
    label: "Edit automations",
    desc: "Modify triggers and actions on existing rules.",
  },
  {
    key: "automation.delete",
    category: "Automations",
    label: "Delete automations",
    desc: "Remove automations permanently.",
  },

  {
    key: "integration.view",
    category: "Integrations",
    label: "View integrations",
    desc: "Browse the integrations directory.",
  },
  {
    key: "integration.connect",
    category: "Integrations",
    label: "Connect integrations",
    desc: "Hook up third-party tools.",
  },
  {
    key: "integration.configure",
    category: "Integrations",
    label: "Configure integrations",
    desc: "Adjust scopes, mappings, and defaults.",
  },
  {
    key: "integration.disconnect",
    category: "Integrations",
    label: "Disconnect integrations",
    desc: "Remove a third-party connection.",
  },

  { key: "files.view", category: "Files", label: "View files", desc: "Browse files and folders." },
  {
    key: "files.upload",
    category: "Files",
    label: "Upload files",
    desc: "Add new files to the workspace.",
  },
  {
    key: "files.delete",
    category: "Files",
    label: "Delete files",
    desc: "Remove files permanently.",
  },
  { key: "files.star", category: "Files", label: "Star files", desc: "Pin files to favorites." },
  {
    key: "files.download",
    category: "Files",
    label: "Download files",
    desc: "Pull files to a local device.",
  },

  {
    key: "goals.view",
    category: "Goals",
    label: "View goals",
    desc: "See goals and OKRs in this workspace.",
  },
  {
    key: "goals.create",
    category: "Goals",
    label: "Create goals",
    desc: "Start a new goal or OKR.",
  },
  {
    key: "goals.edit",
    category: "Goals",
    label: "Edit goals",
    desc: "Update progress, owner, or status.",
  },
  {
    key: "goals.delete",
    category: "Goals",
    label: "Delete goals",
    desc: "Remove a goal permanently.",
  },

  {
    key: "calendar.view",
    category: "Calendar",
    label: "View calendar",
    desc: "See team events and meetings.",
  },
  {
    key: "calendar.event.create",
    category: "Calendar",
    label: "Create events",
    desc: "Schedule new events.",
  },
  {
    key: "calendar.event.edit",
    category: "Calendar",
    label: "Edit events",
    desc: "Change details on existing events.",
  },
  {
    key: "calendar.event.rsvp",
    category: "Calendar",
    label: "RSVP to events",
    desc: "Respond yes / maybe / no.",
  },

  {
    key: "team.view",
    category: "Team",
    label: "View team",
    desc: "See teammates in this workspace.",
  },
  {
    key: "team.message",
    category: "Team",
    label: "Message teammates",
    desc: "Start DMs and direct conversations.",
  },
  {
    key: "team.member.edit",
    category: "Team",
    label: "Edit teammates",
    desc: "Update team member profile fields.",
  },

  {
    key: "dashboard.view",
    category: "Navigation",
    label: "View dashboard",
    desc: "Land on the workspace dashboard.",
  },
  {
    key: "inbox.view",
    category: "Navigation",
    label: "View inbox",
    desc: "Open the inbox / chat surface.",
  },

  {
    key: "settings.members.view",
    category: "Settings",
    label: "View members settings",
    desc: "Open the members tab in settings.",
  },
  {
    key: "settings.billing.view",
    category: "Settings",
    label: "View billing settings",
    desc: "Open the billing tab in settings.",
  },
  {
    key: "settings.roles.view",
    category: "Settings",
    label: "View roles settings",
    desc: "Open the roles & capabilities tab in settings.",
  },
];

export const ROLES: WorkspaceRole[] = ["Owner", "Admin", "Member", "Guest"];

export const ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
  Owner: "The buck stops here. Full control over the workspace, including billing and deletion.",
  Admin:
    "Day-to-day operator. Can invite, manage roles, and run the workspace — but can't delete it or change billing.",
  Member:
    "Default for teammates. Can create, edit, comment, and message everywhere they have access.",
  Guest:
    "Read-mostly access. Can view shared docs and boards, comment, and chat in invited channels — nothing structural.",
};

export const ROLE_COLOR: Record<WorkspaceRole, string> = {
  Owner: "#F97316",
  Admin: "#8B5CF6",
  Member: "#3B82F6",
  Guest: "#6B7280",
};

const POLICY: Record<WorkspaceRole, Capability[]> = {
  Owner: [
    "workspace.delete",
    "workspace.rename",
    "workspace.create",
    "workspace.switch",
    "settings.workspace",
    "billing.manage",
    "audit.view",
    "members.invite",
    "members.roleChange",
    "members.remove",
    "doc.create",
    "doc.edit",
    "doc.delete",
    "doc.share",
    "board.create",
    "board.edit",
    "board.move",
    "board.delete",
    "channel.create",
    "channel.archive",
    "channel.message",
    "comment.add",
    "ai.use",
    "automation.view",
    "automation.create",
    "automation.toggle",
    "automation.edit",
    "automation.delete",
    "integration.view",
    "integration.connect",
    "integration.configure",
    "integration.disconnect",
    "files.view",
    "files.upload",
    "files.delete",
    "files.star",
    "files.download",
    "goals.view",
    "goals.create",
    "goals.edit",
    "goals.delete",
    "calendar.view",
    "calendar.event.create",
    "calendar.event.edit",
    "calendar.event.rsvp",
    "team.view",
    "team.message",
    "team.member.edit",
    "dashboard.view",
    "inbox.view",
    "settings.members.view",
    "settings.billing.view",
    "settings.roles.view",
  ],
  Admin: [
    "workspace.rename",
    "workspace.create",
    "workspace.switch",
    "settings.workspace",
    "audit.view",
    "members.invite",
    "members.roleChange",
    "members.remove",
    "doc.create",
    "doc.edit",
    "doc.delete",
    "doc.share",
    "board.create",
    "board.edit",
    "board.move",
    "board.delete",
    "channel.create",
    "channel.archive",
    "channel.message",
    "comment.add",
    "ai.use",
    "automation.view",
    "automation.create",
    "automation.toggle",
    "automation.edit",
    "automation.delete",
    "integration.view",
    "integration.connect",
    "integration.configure",
    "integration.disconnect",
    "files.view",
    "files.upload",
    "files.delete",
    "files.star",
    "files.download",
    "goals.view",
    "goals.create",
    "goals.edit",
    "goals.delete",
    "calendar.view",
    "calendar.event.create",
    "calendar.event.edit",
    "calendar.event.rsvp",
    "team.view",
    "team.message",
    "team.member.edit",
    "dashboard.view",
    "inbox.view",
    "settings.members.view",
    "settings.roles.view",
  ],
  Member: [
    "workspace.create",
    "workspace.switch",
    "doc.create",
    "doc.edit",
    "doc.share",
    "board.create",
    "board.edit",
    "board.move",
    "channel.create",
    "channel.message",
    "comment.add",
    "ai.use",
    "automation.view",
    "integration.view",
    "files.view",
    "files.upload",
    "files.star",
    "files.download",
    "goals.view",
    "goals.create",
    "goals.edit",
    "calendar.view",
    "calendar.event.create",
    "calendar.event.rsvp",
    "team.view",
    "team.message",
    "dashboard.view",
    "inbox.view",
    "settings.members.view",
    "settings.roles.view",
  ],
  Guest: [
    "workspace.switch",
    "comment.add",
    "channel.message",
    "ai.use",
    "files.view",
    "files.download",
    "calendar.view",
    "calendar.event.rsvp",
    "dashboard.view",
    "inbox.view",
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
