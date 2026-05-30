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
        <header className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-sky-50/30 to-transparent dark:from-sky-950/10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Integrations <Plug className="w-5 h-5 text-sky-500" />
              </h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 max-w-prose">
                Connect Haxon to the tools your team already uses. Bidirectional sync,
                live embeds, and AI handoffs — no glue code.
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Connected</div>
              <div className="text-2xl font-bold tabular-nums text-sky-500">
                {connectedCount}<span className="text-gray-300 dark:text-gray-700 text-base font-normal"> / {list.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 h-9 px-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations…"
              className="flex-1 outline-none bg-transparent text-[13px] text-gray-700 dark:text-gray-300 placeholder-gray-400"
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
                  onConfigure={() => toast.info(`${i.name} configuration opening…`)}
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
                  onConfigure={() => toast.info(`${i.name} configuration opening…`)}
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
        active
          ? "bg-orange-500 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
