"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Zap, ArrowRight, MoreHorizontal, Play, Pause, Pencil, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Automation } from "@/data/dummy-automations";

interface Props {
  automation: Automation;
  onToggle: () => void;
  onRemove: () => void;
}

export function AutomationRow({ automation, onToggle, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const owner = USERS.find((u) => u.id === automation.ownerId);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center gap-3 p-3.5">
        <button
          onClick={onToggle}
          title={automation.enabled ? "Pause" : "Resume"}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer",
            automation.enabled
              ? "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 hover:bg-orange-200/70 dark:hover:bg-orange-950/60"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
          )}
        >
          {automation.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{automation.emoji}</span>
            <span className="text-[13.5px] font-semibold text-gray-900 dark:text-white truncate">
              {automation.name}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                automation.enabled
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500",
              )}
            >
              {automation.enabled ? "On" : "Paused"}
            </span>
          </div>
          <div className="mt-0.5 text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-1">
            {automation.description}
          </div>
        </button>

        <div className="hidden md:flex flex-col items-end text-[10.5px] text-gray-400 tabular-nums">
          <span>{automation.runsThisWeek} runs / wk</span>
          {automation.lastRunAt && <span>last {automation.lastRunAt}</span>}
        </div>

        {owner && <UserAvatar user={owner} size={24} />}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-44 z-50"
            >
              <Item label="Run now" icon={<Play className="w-3.5 h-3.5" />} onSelect={() => toast.success(`Ran "${automation.name}"`)} />
              <Item label="Edit" icon={<Pencil className="w-3.5 h-3.5" />} onSelect={() => toast.info("Inline editor below")} />
              <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
              <Item label="Delete" icon={<Trash2 className="w-3.5 h-3.5" />} onSelect={onRemove} danger />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {expanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40">
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            <Zap className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-500">
              Trigger
            </span>
          </div>
          <div className="text-[12.5px] text-gray-700 dark:text-gray-300 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md">
            {automation.trigger.label}
          </div>

          <div className="flex items-center gap-1.5 mt-3 mb-1.5">
            <ArrowRight className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-500">
              Then {automation.actions.length} action{automation.actions.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="space-y-1">
            {automation.actions.map((a, i) => (
              <div
                key={i}
                className="text-[12.5px] text-gray-700 dark:text-gray-300 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 inline-flex items-center justify-center text-[10px] font-bold tabular-nums">
                  {i + 1}
                </span>
                {a.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Item({
  label, icon, onSelect, danger,
}: { label: string; icon: React.ReactNode; onSelect: () => void; danger?: boolean }) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {icon} {label}
    </DropdownMenu.Item>
  );
}
