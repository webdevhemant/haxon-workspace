"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Plug } from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { INTEGRATIONS, INTEGRATION_CATEGORIES, type Integration } from "@/data/dummy-integrations";
import { IntegrationCard } from "./integration-card";

export default function IntegrationsView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const [list, setList] = useState<Integration[]>(INTEGRATIONS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | typeof INTEGRATION_CATEGORIES[number]>("All");

  const filtered = list.filter((i) => {
    if (category !== "All" && i.category !== category) return false;
    if (search) {
      const hay = `${i.name} ${i.vendor} ${i.category} ${i.short}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const connectedCount = list.filter((i) => i.connected).length;

  const toggle = (id: string) => {
    setList((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const next = { ...i, connected: !i.connected, connectedAt: !i.connected ? "just now" : undefined };
      toast(next.connected ? `${i.name} connected` : `${i.name} disconnected`);
      return next;
    }));
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Integrations" }]} />} />

      <div className="flex-1 overflow-y-auto">
        <header className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white">Integrations</h1>
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <dt className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Connected</dt>
              <dd className="text-[22px] font-semibold tabular-nums leading-none text-gray-900 dark:text-white">
                {connectedCount}<span className="text-gray-400 text-[14px] font-normal"> / {list.length}</span>
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-1.5 h-8 px-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations…"
              className="flex-1 outline-none bg-transparent text-[12.5px] text-gray-700 dark:text-gray-300 placeholder-gray-400"
            />
          </div>
        </header>

        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto">
          <CategoryChip active={category === "All"} onClick={() => setCategory("All")}>
            All <span className="text-gray-400 tabular-nums">{list.length}</span>
          </CategoryChip>
          {INTEGRATION_CATEGORIES.map((c) => {
            const count = list.filter((i) => i.category === c).length;
            if (count === 0) return null;
            return (
              <CategoryChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c} <span className="text-gray-400 tabular-nums">{count}</span>
              </CategoryChip>
            );
          })}
        </div>

        {connectedCount > 0 && category === "All" && !search && (
          <section className="px-6 pt-5">
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Already connected
            </h2>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.filter((i) => i.connected).map((i) => (
                <IntegrationCard
                  key={i.id}
                  integration={i}
                  onToggle={() => toggle(i.id)}
                  onConfigure={() => {/* settings redirect handled by IntegrationCard */}}
                />
              ))}
            </div>
          </section>
        )}

        <section className="px-6 py-5">
          <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
            {category === "All" && !search
              ? connectedCount > 0
                ? "Discover more"
                : "All integrations"
              : `${filtered.length} match`}
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              <Plug className="w-6 h-6 opacity-40 mx-auto mb-2" />
              Nothing matches your search.
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(category === "All" && !search ? filtered.filter((i) => !i.connected) : filtered).map((i) => (
                <IntegrationCard
                  key={i.id}
                  integration={i}
                  onToggle={() => toggle(i.id)}
                  onConfigure={() => {/* settings redirect handled by IntegrationCard */}}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CategoryChip({
  active, children, onClick,
}: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
        active
          ? "bg-orange-500 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
