"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Zap } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { StatCard } from "@/components/ui/stat-card";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";
import { AUTOMATIONS, type Automation } from "@/data/dummy-automations";
import { AutomationRow } from "./automation-row";
import { AutomationTemplates } from "./automation-templates";

const TABS = ["All", "Active", "Paused"] as const;
type Tab = (typeof TABS)[number];

export default function AutomationsView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const canCreate = useCan("automation.create");
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATIONS);
  const [tab, setTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");

  const filtered = automations.filter((a) => {
    if (tab === "Active" && !a.enabled) return false;
    if (tab === "Paused" && a.enabled) return false;
    if (search && !`${a.name} ${a.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = automations.filter((a) => a.enabled).length;
  const runsThisWeek = automations.reduce((sum, a) => sum + a.runsThisWeek, 0);

  const toggle = (id: string) => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
    const a = automations.find((x) => x.id === id);
    toast(`${a?.name} ${a?.enabled ? "paused" : "resumed"}`);
  };

  const remove = (id: string) => {
    const a = automations.find((x) => x.id === id);
    setAutomations((prev) => prev.filter((x) => x.id !== id));
    toast(`${a?.name ?? "Automation"} deleted`);
  };

  const useTemplate = (templateId: string) => {
    toast.success(`Created automation from template ${templateId}`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Automations" }]} />}
        right={
          canCreate ? (
            <button
              onClick={() => toast.info("New automation editor opening…")}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" /> New automation
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto">
        <header className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">
            Automations
          </h1>
          <dl className="flex items-center gap-8">
            <StatCard label="Total" value={automations.length} />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <StatCard label="Active" value={activeCount} accent />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <StatCard label="Runs this week" value={runsThisWeek} />
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <StatCard label="Time saved" value="~6h" />
          </dl>
        </header>

        <div className="px-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="flex items-center">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-1 py-3 mr-4 text-[13px] font-medium border-b-2 transition-colors cursor-pointer ${
                  tab === t
                    ? "border-orange-500 text-gray-900 dark:text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search automations…"
            className="flex-1 max-w-xs h-7 px-2.5 text-[12.5px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-orange-400 transition-colors"
          />
          <span className="text-[11px] text-gray-400 ml-auto tabular-nums">
            {filtered.length} shown
          </span>
        </div>

        <section className="px-6 py-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">
              <Zap className="w-5 h-5 opacity-30 mx-auto mb-2" />
              No automations match.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((a) => (
                <AutomationRow
                  key={a.id}
                  automation={a}
                  onToggle={() => toggle(a.id)}
                  onRemove={() => remove(a.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="px-6 pb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
          <AutomationTemplates onUse={useTemplate} />
        </section>
      </div>
    </div>
  );
}
