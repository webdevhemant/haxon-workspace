"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Zap, Sparkles } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
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
              className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" /> New automation
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto">
        <header className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-orange-50/30 to-transparent dark:from-orange-950/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Automations <Sparkles className="w-5 h-5 text-orange-500" />
              </h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 max-w-prose">
                When-this-then-that rules across boards, docs, chat, and the calendar.
                Connect work and stop typing the same updates twice.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Stat label="Total" value={automations.length} />
            <Stat label="Active" value={activeCount} accent />
            <Stat label="Runs this week" value={runsThisWeek} />
            <Stat label="Saved" value="~6h" />
          </div>
        </header>

        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                  tab === t
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
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
            className="flex-1 max-w-sm h-8 px-3 text-[12.5px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-orange-400 transition-colors"
          />
          <span className="text-[11px] text-gray-400 ml-auto tabular-nums">
            {filtered.length} shown
          </span>
        </div>

        <section className="px-6 py-5 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              <Zap className="w-6 h-6 opacity-40 mx-auto mb-2" />
              No automations match.
            </div>
          ) : (
            filtered.map((a) => (
              <AutomationRow
                key={a.id}
                automation={a}
                onToggle={() => toggle(a.id)}
                onRemove={() => remove(a.id)}
              />
            ))
          )}
        </section>

        <section className="px-6 pb-8">
          <AutomationTemplates onUse={useTemplate} />
        </section>
      </div>
    </div>
  );
}

function Stat({
  label, value, accent,
}: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</div>
      <div className={`text-lg font-bold tabular-nums ${accent ? "text-orange-500" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
    </div>
  );
}
