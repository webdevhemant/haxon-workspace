"use client";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { useAppStore } from "@/store/app-store";
import {
  CAPABILITIES, ROLES, ROLE_COLOR, ROLE_DESCRIPTIONS, asRole, can, capabilityCount,
  type WorkspaceRole,
} from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default function RolesSettings() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const myRole = asRole(ws?.role ?? "Member");
  const [highlight, setHighlight] = useState<WorkspaceRole>(myRole);

  const categories = Array.from(new Set(CAPABILITIES.map((c) => c.category)));

  return (
    <SettingsLayout title="Roles & permissions">
      <SettingSection
        title="Your role in this workspace"
        desc="Capabilities below show what each role can do — yours is highlighted."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROLES.map((r) => {
            const active = highlight === r;
            const isMine = myRole === r;
            const color = ROLE_COLOR[r];
            return (
              <button
                key={r}
                onClick={() => setHighlight(r)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  active
                    ? "border-orange-300 dark:border-orange-700 ring-2 ring-orange-500/15 bg-orange-50/40 dark:bg-orange-950/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900",
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: color + "22", color }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    {r}
                  </span>
                  {isMine && (
                    <span className="text-[9.5px] font-semibold text-orange-500 uppercase tracking-wider">
                      You
                    </span>
                  )}
                </div>
                <div className="text-[12.5px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {ROLE_DESCRIPTIONS[r]}
                </div>
                <div className="mt-2 text-[10.5px] text-gray-400 tabular-nums">
                  {capabilityCount(r)} / {CAPABILITIES.length} capabilities
                </div>
              </button>
            );
          })}
        </div>
      </SettingSection>

      <SettingSection title="Capability matrix" desc="The full breakdown by role.">
        <div className="overflow-x-auto -m-4 px-4 pb-4">
          <table className="w-full text-sm border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Capability
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r}
                    onClick={() => setHighlight(r)}
                    className={cn(
                      "px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-widest w-20 cursor-pointer",
                      highlight === r ? "text-orange-600 dark:text-orange-400" : "text-gray-500",
                    )}
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <RoleCategoryRows
                  key={cat}
                  category={cat}
                  highlight={highlight}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}

function RoleCategoryRows({
  category, highlight,
}: { category: string; highlight: WorkspaceRole }) {
  const rows = CAPABILITIES.filter((c) => c.category === category);
  return (
    <>
      <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <td colSpan={5} className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          {category}
        </td>
      </tr>
      {rows.map((row) => (
        <tr key={row.key} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/40 dark:hover:bg-gray-900/30">
          <td className="px-3 py-2.5 align-top">
            <div className="text-[12.5px] font-medium text-gray-900 dark:text-white">
              {row.label}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-md">
              {row.desc}
            </div>
          </td>
          {ROLES.map((r) => (
            <td
              key={r}
              className={cn(
                "px-3 py-2.5 text-center align-top",
                highlight === r && "bg-orange-50/50 dark:bg-orange-950/15",
              )}
            >
              {can(r, row.key) ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 inline" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 inline" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
