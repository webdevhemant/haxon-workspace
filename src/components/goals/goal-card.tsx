"use client";
import { ChevronRight, Trash2 } from "lucide-react";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import { useCan, useCurrentRole } from "@/lib/use-can";
import { STATUS_COLOR, STATUS_LABEL, type Goal } from "@/data/dummy-goals";

interface Props {
  goal: Goal;
  expanded: boolean;
  onToggle: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function GoalCard({ goal, expanded, onToggle, canDelete = false, onDelete }: Props) {
  const role = useCurrentRole();
  const canEdit = useCan("goals.edit");
  const owner = USERS.find((u) => u.id === goal.ownerId);
  const contributors = goal.contributorIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));
  const overall = goal.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / Math.max(goal.keyResults.length, 1);
  const color = STATUS_COLOR[goal.status];

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors cursor-pointer"
      >
        <span className="text-xl leading-none flex-shrink-0">{goal.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium text-gray-900 dark:text-white truncate">
              {goal.title}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {STATUS_LABEL[goal.status]}
            </span>
            <span className="text-[11px] text-gray-400">{goal.period}</span>
          </div>
          <p className="text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {goal.description}
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end w-28 flex-shrink-0 gap-1">
          <span className="text-[13px] font-semibold text-gray-900 dark:text-white tabular-nums">{Math.round(overall)}%</span>
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${overall}%`, background: color }} />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          {owner && <UserAvatar user={owner} size={24} />}
          {contributors.length > 1 && <AvatarGroup users={contributors} size={20} max={3} />}
        </div>

        <ChevronRight
          className={cn("w-3.5 h-3.5 text-gray-300 dark:text-gray-600 transition-transform flex-shrink-0", expanded && "rotate-90")}
        />
      </button>

      {expanded && (
        <div className="ml-8 pb-3 border-t border-gray-50 dark:border-gray-900">
          <div className="flex items-center justify-between mt-2 mb-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Key results</span>
            {(canDelete && onDelete) && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            )}
            {!canEdit && (
              <span className="text-[10px] text-gray-400 italic" title={`Your role (${role}) can't edit goals`}>
                View only
              </span>
            )}
          </div>
          <div className="space-y-2">
            {goal.keyResults.map((kr) => {
              const krOwner = USERS.find((u) => u.id === kr.ownerId);
              return (
                <div key={kr.id} className="flex items-center gap-3 py-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-gray-700 dark:text-gray-300 mb-1.5">{kr.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${kr.progress}%`, background: color }} />
                      </div>
                      <span className="text-[10.5px] text-gray-400 tabular-nums whitespace-nowrap">{kr.current} / {kr.target}</span>
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 tabular-nums w-8 text-right">{kr.progress}%</span>
                    </div>
                  </div>
                  {krOwner && <UserAvatar user={krOwner} size={20} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
