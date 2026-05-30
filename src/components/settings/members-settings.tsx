"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, Mail, Clock, ShieldCheck } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { asRole, capabilityCount, ROLE_COLOR, ROLE_DESCRIPTIONS, ROLES, type WorkspaceRole } from "@/lib/rbac";
import { useCan, useCurrentRole } from "@/lib/use-can";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChangeRoleSubMenu } from "./members/change-role-submenu";

interface PendingInvite {
  email: string;
  role: WorkspaceRole;
  sentAt: string;
}

interface AuditEntry {
  at: string;
  actor: string;
  verb: string;
  target: string;
}

const SEED_INVITES: PendingInvite[] = [
  { email: "logan@haxon.app", role: "Member", sentAt: "2h ago" },
  { email: "kavya@haxon.app", role: "Admin", sentAt: "Yesterday" },
  { email: "guest-design@vellum.io", role: "Guest", sentAt: "3 days ago" },
];

const AUDIT_LOG: AuditEntry[] = [
  { at: "10m ago", actor: "Maya Chen", verb: "invited", target: "logan@haxon.app as Member" },
  { at: "2h ago", actor: "Diego Romano", verb: "promoted", target: "Priya Iyer to Admin" },
  { at: "Yesterday", actor: "Maya Chen", verb: "removed", target: "former-intern@haxon.app" },
  { at: "2d ago", actor: "Maya Chen", verb: "changed", target: "workspace name" },
];

export default function MembersSettings() {
  const { members, openModal } = useAppStore();
  const canInvite = useCan("members.invite");
  const canChangeRole = useCan("members.roleChange");
  const canRemove = useCan("members.remove");
  const canAudit = useCan("audit.view");
  const currentRole = useCurrentRole();
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("Member");
  const [invites, setInvites] = useState<PendingInvite[]>(SEED_INVITES);
  const [pendingRoleChanges, setPendingRoleChanges] = useState<Record<string, WorkspaceRole>>({});

  const handleRoleChange = (memberId: string, currentRole: WorkspaceRole, nextRole: WorkspaceRole, memberName: string) => {
    if (!canChangeRole) {
      toast.error(`Your role (${currentRole}) can't change roles`);
      return;
    }
    if (nextRole === currentRole) {
      setPendingRoleChanges((prev) => {
        const next = { ...prev };
        delete next[memberId];
        return next;
      });
      toast(`${memberName} stays ${currentRole}`);
      return;
    }
    setPendingRoleChanges((prev) => ({ ...prev, [memberId]: nextRole }));
    toast.success(`${memberName} will be ${nextRole}`);
  };

  const sendInvites = () => {
    if (!canInvite) {
      toast.error(`Your role (${currentRole}) can't invite members`);
      return;
    }
    const list = emails
      .split(/[,;\n]/)
      .map((e) => e.trim())
      .filter((e) => /\S+@\S+/.test(e));
    if (list.length === 0) {
      toast.error("Enter at least one valid email");
      return;
    }
    setInvites((prev) => [
      ...list.map((email) => ({ email, role, sentAt: "just now" })),
      ...prev,
    ]);
    toast.success(`${list.length} invite${list.length === 1 ? "" : "s"} sent as ${role}`);
    setEmails("");
  };

  const revokeInvite = (email: string) => {
    setInvites((prev) => prev.filter((p) => p.email !== email));
    toast(`Invite to ${email} revoked`);
  };

  return (
    <SettingsLayout title="Members">
      {canInvite && (
        <SettingSection
          title="Invite teammates"
          desc="Comma- or newline-separated emails. Pick the default role for this batch."
        >
          <div className="flex flex-col gap-2 mb-2">
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="colleague@company.com, kavya@company.com\nlogan@partners.io"
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors resize-y min-h-[68px]"
            />
            <div className="flex items-center gap-2">
              <RoleDropdown value={role} onChange={setRole} />
              <span className="text-[11px] text-gray-400 mr-auto">
                {capabilityCount(role)} capabilities · <Link href="/settings/roles" className="text-orange-500 hover:underline">see matrix</Link>
              </span>
              <button
                onClick={sendInvites}
                title="Send invites"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Send invites
              </button>
            </div>
          </div>
        </SettingSection>
      )}

      <SettingSection title="Roles at a glance" desc="What each role can do in this workspace.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ROLES.map((r) => (
            <Link
              key={r}
              href="/settings/roles"
              className="block rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5 hover:border-orange-200 dark:hover:border-orange-800/60 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: ROLE_COLOR[r] }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: ROLE_COLOR[r] }}>
                  {r}
                </span>
                <span className="ml-auto text-[10px] text-gray-400 tabular-nums">{capabilityCount(r)}</span>
              </div>
              <div className="text-[11.5px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {ROLE_DESCRIPTIONS[r]}
              </div>
            </Link>
          ))}
        </div>
      </SettingSection>

      {invites.length > 0 && (
        <SettingSection title={`Pending invites · ${invites.length}`} desc="No one has accepted these yet.">
          <div className="-mx-4">
            {invites.map((inv, i) => (
              <div
                key={inv.email}
                className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{inv.email}</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-2.5 h-2.5" /> Sent {inv.sentAt}
                  </div>
                </div>
                <RoleChip role={inv.role} />
                <button
                  onClick={() => toast.success(`Reminder sent to ${inv.email}`)}
                  className="px-2.5 py-1 text-[11.5px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Resend
                </button>
                <button
                  onClick={() => revokeInvite(inv.email)}
                  className="px-2.5 py-1 text-[11.5px] font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </SettingSection>
      )}

      <SettingSection title={`${members.length} active members`} desc="Manage roles and access for everyone in your workspace.">
        <div className="-mx-4">
          {members.map((m, i) => {
            const memberRole = asRole(m.role);
            const pendingRole = pendingRoleChanges[m.id];
            const displayedRole = pendingRole ?? memberRole;
            return (
            <div key={m.id} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
              <UserAvatar user={m} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">
                  {m.name}
                  {m.id === "u1" && (
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 rounded">You</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{m.email}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <RoleChip role={displayedRole} />
                {pendingRole && (
                  <span className="text-[9.5px] font-semibold uppercase tracking-wider text-orange-500">
                    Pending
                  </span>
                )}
              </div>
              {m.id !== "u1" && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-52 z-50"
                      sideOffset={4}
                      align="end"
                    >
                      <ChangeRoleSubMenu
                        currentRole={memberRole}
                        pendingRole={pendingRole}
                        disabled={!canChangeRole}
                        onPick={(next) => handleRoleChange(m.id, memberRole, next, m.name)}
                      />
                      {canInvite && (
                        <DropdownMenu.Item
                          onSelect={() => toast.success(`Resent invite to ${m.email}`)}
                          className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Resend invite link
                        </DropdownMenu.Item>
                      )}
                      {canRemove && (
                        <>
                          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                          <DropdownMenu.Item
                            onSelect={() => openModal({ type: "delete", kind: "member", name: m.name })}
                            className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            Remove from workspace
                          </DropdownMenu.Item>
                        </>
                      )}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>
            );
          })}
        </div>
      </SettingSection>

      {canAudit && (
        <SettingSection title="Recent activity" desc="Membership and role changes from the last few days.">
          <div className="space-y-2.5">
            {AUDIT_LOG.map((e, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[12.5px]">
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{e.actor}</span>{" "}
                    {e.verb}{" "}
                    <span className="font-medium text-gray-900 dark:text-white">{e.target}</span>
                  </div>
                  <div className="text-[10.5px] text-gray-400">{e.at}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Audit log preserved for 90 days on Pro · 7 years on Enterprise
          </div>
        </SettingSection>
      )}
    </SettingsLayout>
  );
}

function RoleChip({ role }: { role: WorkspaceRole }) {
  const color = ROLE_COLOR[role];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full"
      style={{ background: color + "22", color }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {role}
    </span>
  );
}

function RoleDropdown({
  value, onChange, disabled,
}: { value: WorkspaceRole; onChange: (r: WorkspaceRole) => void; disabled?: boolean }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RoleChip role={value} />
          <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-40 z-50"
          sideOffset={4}
        >
          {ROLES.filter((r) => r !== "Owner").map((r) => (
            <DropdownMenu.Item
              key={r}
              onSelect={() => onChange(r)}
              className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {r}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
