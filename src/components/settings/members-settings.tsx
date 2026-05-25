"use client";
import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const ROLE_COLORS: Record<string, string> = { Owner: "#F97316", Admin: "#8B5CF6", Member: "#6B7280" };

export default function MembersSettings() {
  const { members, openModal } = useAppStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const invite = () => {
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    toast.success(`Invite sent to ${email}`);
    setEmail("");
  };

  return (
    <SettingsLayout title="Members">
      <SettingSection title="Invite teammates" desc="Add up to 50 members on the Pro plan.">
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors" />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {role} <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-36 z-50" sideOffset={4}>
                {["Member", "Admin"].map((r) => (
                  <DropdownMenu.Item key={r} onSelect={() => setRole(r)}
                    className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{r}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <button onClick={invite} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Send invite
          </button>
        </div>
      </SettingSection>

      <SettingSection title={`${members.length} members`} desc="Manage roles and access for everyone in your workspace.">
        <div className="-mx-5">
          {members.map((m, i) => (
            <div key={m.id} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
              <UserAvatar user={m} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">
                  {m.name}
                  {m.id === "u1" && <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 rounded">You</span>}
                </div>
                <div className="text-xs text-gray-400">{m.email}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: ROLE_COLORS[m.role] + "20", color: ROLE_COLORS[m.role] }}>
                {m.role}
              </span>
              {m.id !== "u1" && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-48 z-50" sideOffset={4} align="end">
                      <DropdownMenu.Item className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Change role</DropdownMenu.Item>
                      <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                      <DropdownMenu.Item onSelect={() => openModal({ type: "delete", kind: "member", name: m.name })}
                        className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                        Remove from workspace
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>
          ))}
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}
