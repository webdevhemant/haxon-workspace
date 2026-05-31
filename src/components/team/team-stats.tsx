"use client";
import { Users, Globe2, Clock, Briefcase } from "lucide-react";
import { USERS } from "@/data/dummy-users";
import { presenceFor } from "@/data/dummy-presence";
import { OPEN_ROLES, TEAM_PROFILES } from "@/data/dummy-team";

export function TeamStats() {
  const totalMembers = USERS.length;
  const online = USERS.filter((u) => presenceFor(u.id) === "online").length;
  const countries = new Set(TEAM_PROFILES.map((p) => p.location.split(",").pop()?.trim())).size;
  const open = OPEN_ROLES.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      <Stat icon={<Users className="w-3.5 h-3.5" />} label="Members" value={totalMembers} />
      <Stat icon={<Clock className="w-3.5 h-3.5" />} label="Online now" value={`${online}/${totalMembers}`} accent />
      <Stat icon={<Globe2 className="w-3.5 h-3.5" />} label="Countries" value={countries} />
      <Stat icon={<Briefcase className="w-3.5 h-3.5" />} label="Open roles" value={open} />
    </div>
  );
}

function Stat({
  icon, label, value, accent,
}: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className={`mt-1 text-[20px] font-semibold tabular-nums leading-none ${accent ? "text-orange-500" : "text-gray-900 dark:text-white"}`}>
        {value}
      </div>
    </div>
  );
}
