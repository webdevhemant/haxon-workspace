"use client";
import { useRouter } from "next/navigation";
import { ChevronRight, PanelLeft } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function Topbar({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  return (
    <div className="h-10 flex-shrink-0 border-b border-gray-100 dark:border-gray-800 flex items-center px-3.5 gap-2 bg-white/80 dark:bg-[#0F1117]/80 backdrop-blur-sm">
      {sidebarCollapsed && (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button onClick={toggleSidebar}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors mr-1">
                <PanelLeft className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="bottom" sideOffset={4} className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                Expand sidebar
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
      <div className="flex-1 flex items-center gap-2 min-w-0">{left}</div>
      <div className="flex items-center gap-1 flex-shrink-0">{right}</div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1 text-sm min-w-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />}
          <span
            onClick={() => item.href && router.push(item.href)}
            className={cn(
              "px-1.5 py-0.5 rounded truncate transition-colors",
              i === items.length - 1
                ? "font-medium text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400",
              item.href && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700",
            )}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function IconBtn({
  icon, tooltip, onClick, active, className,
}: {
  icon: React.ReactNode; tooltip?: string; onClick?: () => void; active?: boolean; className?: string;
}) {
  const btn = (
    <button onClick={onClick}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors",
        active && "text-orange-500 bg-orange-50 dark:bg-orange-950",
        className,
      )}>
      {icon}
    </button>
  );
  if (!tooltip) return btn;
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{btn}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="bottom" sideOffset={4} className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
            {tooltip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
