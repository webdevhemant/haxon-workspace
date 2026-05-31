"use client";
import { useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Laptop, Smartphone, Tablet, X } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Session {
  id: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  lastActive: string;
  current?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const INITIAL: Session[] = [
  {
    id: "s1",
    device: "MacBook Pro",
    os: "macOS 15.2",
    browser: "Chrome 131",
    location: "Berlin, DE",
    lastActive: "Active now",
    current: true,
    icon: Laptop,
  },
  {
    id: "s2",
    device: "iPhone 16 Pro",
    os: "iOS 18.2",
    browser: "Haxon iOS",
    location: "Berlin, DE",
    lastActive: "12 minutes ago",
    icon: Smartphone,
  },
  {
    id: "s3",
    device: "iPad Air",
    os: "iPadOS 18.1",
    browser: "Safari",
    location: "Munich, DE",
    lastActive: "2 days ago",
    icon: Tablet,
  },
];

export function ManageSessionsDialog({ open, onOpenChange }: Props) {
  const [sessions, setSessions] = useState<Session[]>(INITIAL);

  const signOut = (id: string, label: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Signed out of ${label}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[96vw] bg-white dark:bg-gray-950 rounded-md shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden">
          <div className="flex items-start gap-3 px-5 pt-5 pb-3">
            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Active sessions
              </Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Devices currently signed in to your account.
              </Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 -mt-1 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </Dialog.Close>
          </div>

          <div className="px-2 pb-2 max-h-[60vh] overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="px-3 py-10 text-center text-sm text-gray-500">
                No other active sessions.
              </div>
            ) : (
              sessions.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {s.device}
                        </div>
                        {s.current && (
                          <span className="px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            This device
                          </span>
                        )}
                      </div>
                      <div className="text-[11.5px] text-gray-500 dark:text-gray-400 truncate">
                        {s.os} · {s.browser} · {s.location}
                      </div>
                      <div className="text-[10.5px] text-gray-400 mt-0.5">{s.lastActive}</div>
                    </div>
                    {s.current ? (
                      <span className="text-[11px] text-gray-400 px-2">Current</span>
                    ) : (
                      <button
                        onClick={() => signOut(s.id, s.device)}
                        className="px-2.5 py-1 text-[11.5px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                      >
                        Sign out
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <Dialog.Close className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
