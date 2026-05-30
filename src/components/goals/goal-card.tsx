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
  const contributors = goal.contributorIds.map((id) => USERS.find((u) => u.id === id)).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const overall = goal.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / Math.max(goal.keyResults.length, 1);
  const status = goal.status;
  const color = STATUS_COLOR[status];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/40 dark:hover:bg-gray-900/40 transition-colors cursor-pointer"
      >
        <span className="text-2xl leading-none flex-shrink-0">{goal.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
              {goal.title}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ background: color + "22", color }}
            >
              {STATUS_LABEL[status]}
            </span>
            <span className="text-[10.5px] text-gray-400">{goal.period}</span>
          </div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-1">
            {goal.description}
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end w-32 flex-shrink-0">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Progress</div>
          <div className="text-[14px] font-bold text-gray-900 dark:text-white tabular-nums">{Math.round(overall)}%</div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${overall}%`, background: color }}
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 ml-2">
          {owner && <UserAvatar user={owner} size={28} />}
          {contributors.length > 1 && <AvatarGroup users={contributors} size={22} max={3} />}
        </div>

        <ChevronRight className={cn("w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform flex-shrink-0", expanded && "rotate-90")} />
      </button>
      {(canDelete || canEdit) && (
        <div className="flex items-center gap-1 px-2 pb-2 -mt-2">
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              title={`Delete goal`}
              className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
          {!canEdit && (
            <span
              className="ml-auto text-[10px] text-gray-400 italic"
              title={`Your role (${role}) can't edit goals`}
            >
              View only
            </span>
          )}
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-2 mb-2">
            Key results
          </h3>
          <div className="space-y-2">
            {goal.keyResults.map((kr) => {
              const krOwner = USERS.find((u) => u.id === kr.ownerId);
              return (
                <div key={kr.id} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium text-gray-900 dark:text-white">
                      {kr.title}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${kr.progress}%`, background: color }}
                        />
                      </div>
                      <span className="text-[10.5px] text-gray-500 tabular-nums whitespace-nowrap">
                        {kr.current} / {kr.target}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 tabular-nums whitespace-nowrap w-9 text-right">
                        {kr.progress}%
                      </span>
                    </div>
                  </div>
                  {krOwner && <UserAvatar user={krOwner} size={22} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
