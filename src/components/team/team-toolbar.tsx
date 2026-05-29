"use client";
import { Search, ChevronDown, LayoutGrid, List, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  TEAM_VIEWS,
  TEAM_SORTS,
  type TeamView,
  type TeamSort,
  type TeamRoleFilter,
  type TeamPresenceFilter,
} from "./constants";
import { PRESENCE_LABEL } from "@/data/dummy-presence";

interface Props {
  view: TeamView;
  setView: (v: TeamView) => void;
  query: string;
  setQuery: (v: string) => void;
  role: TeamRoleFilter;
  setRole: (v: TeamRoleFilter) => void;
  presence: TeamPresenceFilter;
  setPresence: (v: TeamPresenceFilter) => void;
  sort: TeamSort;
  setSort: (v: TeamSort) => void;
  resultCount: number;
}

const VIEW_ICON = {
  grid: <LayoutGrid className="w-3.5 h-3.5" />,
  list: <List className="w-3.5 h-3.5" />,
  org: <Network className="w-3.5 h-3.5" />,
};

export function TeamToolbar({
  view, setView, query, setQuery, role, setRole, presence, setPresence, sort, setSort, resultCount,
}: Props) {
  return (
    <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 h-8 px-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-[12.5px] flex-1 min-w-[200px] max-w-sm">
        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, skill…"
          className="flex-1 outline-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400"
        />
      </div>

      <FilterDropdown
        label="Role"
        value={role === "all" ? "All roles" : role}
        items={[
          { key: "all", label: "All roles" },
          { key: "Owner", label: "Owner" },
          { key: "Admin", label: "Admin" },
          { key: "Member", label: "Member" },
        ]}
        onSelect={(v) => setRole(v as TeamRoleFilter)}
        active={role !== "all"}
      />

      <FilterDropdown
        label="Status"
        value={presence === "all" ? "Any" : PRESENCE_LABEL[presence]}
        items={[
          { key: "all", label: "Any status" },
          { key: "online", label: PRESENCE_LABEL.online },
          { key: "away", label: PRESENCE_LABEL.away },
          { key: "dnd", label: PRESENCE_LABEL.dnd },
          { key: "offline", label: PRESENCE_LABEL.offline },
        ]}
        onSelect={(v) => setPresence(v as TeamPresenceFilter)}
        active={presence !== "all"}
      />

      <FilterDropdown
        label="Sort"
        value={TEAM_SORTS.find((s) => s.key === sort)?.label ?? "Name"}
        items={TEAM_SORTS}
        onSelect={(v) => setSort(v as TeamSort)}
      />

      <span className="text-[11px] text-gray-400 tabular-nums mx-1">
        {resultCount} {resultCount === 1 ? "person" : "people"}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
        {TEAM_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11.5px] font-medium transition-colors",
              view === v.key
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            {VIEW_ICON[v.key]} {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface FilterItem { key: string; label: string }

function FilterDropdown({
  label, value, items, onSelect, active,
}: {
  label: string;
  value: string;
  items: readonly FilterItem[];
  onSelect: (key: string) => void;
  active?: boolean;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[12px] font-medium transition-colors",
            active
              ? "border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
          )}
        >
          <span className="text-gray-400 dark:text-gray-500">{label}:</span>
          {value}
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 min-w-[160px] z-50"
        >
          {items.map((it) => (
            <DropdownMenu.Item
              key={it.key}
              onSelect={() => onSelect(it.key)}
              className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {it.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
