"use client";
import { MapPin, ArrowUpRight } from "lucide-react";
import { OPEN_ROLES } from "@/data/dummy-team";

export function TeamOpenRoles() {
  if (OPEN_ROLES.length === 0) return null;
  return (
    <div className="px-6 pt-1 pb-6">
      <div className="rounded-2xl border border-orange-200/70 dark:border-orange-900/40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white tracking-tight">
              We're hiring
            </h3>
            <p className="text-[11.5px] text-gray-600 dark:text-gray-400 mt-0.5">
              Help shape what Haxon becomes next — {OPEN_ROLES.length} open roles.
            </p>
          </div>
          <button className="text-[12px] font-semibold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {OPEN_ROLES.map((r) => (
            <div
              key={r.title}
              className="bg-white dark:bg-gray-900 rounded-xl border border-orange-100 dark:border-orange-900/30 px-3 py-2.5 hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer"
            >
              <div className="text-[12.5px] font-semibold text-gray-900 dark:text-white truncate">
                {r.title}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                <span>{r.team}</span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {r.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
