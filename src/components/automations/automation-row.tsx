"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Zap, ArrowRight, MoreHorizontal, Play, Pencil, Trash2, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import { useCan, useCurrentRole } from "@/lib/use-can";
import type { Automation } from "@/data/dummy-automations";

interface Props {
  automation: Automation;
  onToggle: () => void;
  onRemove: () => void;
}

export function AutomationRow({ automation, onToggle, onRemove }: Props) {
  const role = useCurrentRole();
  const canToggle = useCan("automation.toggle");
  const canEdit = useCan("automation.edit");
  const canDelete = useCan("automation.delete");
  const [expanded, setExpanded] = useState(false);
  const owner = USERS.find((u) => u.id === automation.ownerId);

  return (
    <div>
      <div className="flex items-center gap-3 py-2.5 group">
        <Switch
          checked={automation.enabled}
          onCheckedChange={onToggle}
          disabled={!canToggle}
          title={canToggle ? undefined : `Your role (${role}) can't toggle automations`}
        />

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left cursor-pointer flex items-center gap-2.5"
        >
          <span className="text-base leading-none flex-shrink-0">{automation.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                {automation.name}
              </span>
              <span className={cn("text-[11px]", automation.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400")}>
                {automation.enabled ? "On" : "Paused"}
              </span>
            </div>
            <div className="text-[11.5px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
              {automation.description}
            </div>
          </div>
        </button>

        <div className="hidden md:flex flex-col items-end text-[11px] text-gray-400 tabular-nums flex-shrink-0">
          <span>{automation.runsThisWeek} runs / wk</span>
          {automation.lastRunAt && (
            <span className="text-gray-300 dark:text-gray-600">last {automation.lastRunAt}</span>
          )}
        </div>

        {owner && <UserAvatar user={owner} size={22} />}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 transition-colors cursor-pointer"
        >
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-6 h-6 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 w-40 z-50"
            >
              <Item label="Run now" icon={<Play className="w-3.5 h-3.5" />} onSelect={() => toast.success(`Ran "${automation.name}"`)} />
              {canEdit && (
                <Item label="Edit" icon={<Pencil className="w-3.5 h-3.5" />} onSelect={() => toast.info("Inline editor below")} />
              )}
              {canDelete && (
                <>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <Item label="Delete" icon={<Trash2 className="w-3.5 h-3.5" />} onSelect={onRemove} danger />
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {expanded && (
        <div className="ml-[52px] pb-3 pt-1 border-t border-gray-50 dark:border-gray-900">
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5 mt-2">
            <Zap className="w-3 h-3 text-orange-500" /> Trigger
          </div>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 mb-3">{automation.trigger.label}</p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
            <ArrowRight className="w-3 h-3 text-orange-500" />
            {automation.actions.length} action{automation.actions.length === 1 ? "" : "s"}
          </div>
          <div className="space-y-1">
            {automation.actions.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] text-gray-600 dark:text-gray-400">
                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 w-4 tabular-nums">{i + 1}.</span>
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
        "flex items-center gap-2 px-2 py-1.5 text-[12.5px] rounded cursor-pointer outline-none",
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {icon} {label}
    </DropdownMenu.Item>
  );
}
