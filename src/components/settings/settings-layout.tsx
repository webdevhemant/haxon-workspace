"use client";
import { useRouter, usePathname } from "next/navigation";
import { User, Users, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";

const NAV = [
  { key: "/settings", label: "Profile", icon: User },
  { key: "/settings/members", label: "Members", icon: Users },
  { key: "/settings/billing", label: "Billing", icon: CreditCard },
];

export function SettingsLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar left={<Breadcrumb items={[{ label: "Settings" }, { label: title }]} />} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-52 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">Settings</div>
          {NAV.map((item) => (
            <button key={item.key} onClick={() => router.push(item.key)}
              className={cn("flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors text-left cursor-pointer",
                pathname === item.key
                  ? "bg-white dark:bg-gray-800 font-medium shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-200")}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-6 max-w-5xl">
            <h1 className="text-xl font-bold tracking-tight mb-4">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingSection({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-3 mb-2">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
        {desc && <div className="text-xs text-gray-500 truncate">{desc}</div>}
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 shadow-sm">
        {children}
      </div>
    </div>
  );
}
