"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { ROLE_COLOR, ROLES, type WorkspaceRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

interface Props {
  currentRole: WorkspaceRole;
  pendingRole?: WorkspaceRole;
  disabled?: boolean;
  onPick: (role: WorkspaceRole) => void;
}

export function ChangeRoleSubMenu({ currentRole, pendingRole, disabled, onPick }: Props) {
  const effective = pendingRole ?? currentRole;
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger
        disabled={disabled}
        className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed flex items-center justify-between"
      >
        <span>Change role</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          sideOffset={4}
          alignOffset={-4}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 w-44 z-50"
        >
          {ROLES.map((r) => {
            const isCurrent = r === currentRole;
            const isPicked = r === effective;
            return (
              <DropdownMenu.Item
                key={r}
                onSelect={() => onPick(r)}
                className={cn(
                  "px-2 py-1.5 text-sm rounded cursor-pointer outline-none flex items-center gap-2",
                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: ROLE_COLOR[r] }}
                />
                <span className="flex-1">{r}</span>
                {isPicked && <Check className="w-3 h-3 text-orange-500" />}
                {isCurrent && !isPicked && (
                  <span className="text-[9.5px] text-gray-400 uppercase tracking-wider">Now</span>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}
