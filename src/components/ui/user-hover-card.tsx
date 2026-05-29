"use client";
import { useState, useRef, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { toast } from "sonner";
import { MessageSquare, MapPin, Clock, UserCircle } from "lucide-react";
import { PresenceDot } from "./presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import { profileFor } from "@/data/dummy-team";
import { CURRENT_USER } from "@/data/dummy-users";
import type { User } from "@/types";

interface Props {
  user?: User | null;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function UserHoverCard({ user, children, side = "bottom", align = "start" }: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!user || user.id === CURRENT_USER.id) return <>{children}</>;

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  const profile = profileFor(user.id);
  const presence = presenceFor(user.id);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          style={{ display: "inline-flex" }}
        >
          {children}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={6}
          onMouseEnter={show}
          onMouseLeave={hide}
          className="z-[80] outline-none"
        >
          <div className="w-[280px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div
              className="h-12 relative"
              style={{ background: `linear-gradient(135deg, ${user.color}33, ${user.color}05)` }}
            />
            <div className="px-3.5 pb-3.5 -mt-7">
              <div className="flex items-end gap-2">
                <div className="relative">
                  <div className="rounded-full ring-4 ring-white dark:ring-gray-950">
                    <div
                      className="inline-flex items-center justify-center rounded-full font-semibold text-white select-none"
                      style={{ width: 48, height: 48, background: user.color, fontSize: 48 * 0.38 }}
                    >
                      {user.initials}
                    </div>
                  </div>
                  <PresenceDot
                    presence={presence}
                    size={12}
                    className="absolute bottom-0.5 right-0.5"
                  />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-[13.5px] font-semibold text-gray-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-[11.5px] text-gray-500 dark:text-gray-400 truncate">
                  {profile?.title ?? user.role} · {PRESENCE_LABEL[presence]}
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[11.5px] text-gray-500 dark:text-gray-400">
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile?.timezone && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    <span className="truncate">{profile.timezone}</span>
                  </div>
                )}
              </div>

              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5">
                <button
                  onClick={() => toast.info(`Opening DM with ${user.name.split(" ")[0]}…`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-[11.5px] font-semibold transition-colors"
                >
                  <MessageSquare className="w-3 h-3" /> Message
                </button>
                <button
                  onClick={() => (typeof window !== "undefined" ? (window.location.href = "/team") : undefined)}
                  className="inline-flex items-center justify-center gap-1 h-7 px-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11.5px] font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <UserCircle className="w-3 h-3" /> Profile
                </button>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
