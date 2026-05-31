"use client";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { USERS } from "@/data/dummy-users";
import { UserAvatar } from "@/components/ui/user-avatar";
import { presenceFor, PRESENCE_COLOR, PRESENCE_LABEL } from "@/data/dummy-presence";
import { ACTIVITY } from "@/data/dummy-activity";

export function LoginPanel() {
  const recent = ACTIVITY.slice(0, 3);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,.22) 0%, transparent 70%)", filter: "blur(56px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,.14) 0%, transparent 70%)", filter: "blur(56px)" }} />

      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative w-full max-w-sm mx-auto space-y-3 px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Your workspace is ready</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-md border border-white/8 p-4"
          style={{ background: "rgba(255,255,255,.05)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/80 text-xs font-semibold">Team online now</div>
            <div className="text-white/30 text-[10px]">5 of 6 active</div>
          </div>
          <div className="space-y-2">
            {USERS.slice(0, 4).map((u) => {
              const p = presenceFor(u.id);
              return (
                <div key={u.id} className="flex items-center gap-2.5">
                  <div className="relative">
                    <UserAvatar user={u} size={22} hoverCard={false} />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-[#060609] ${PRESENCE_COLOR[p]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/85 text-xs font-medium truncate">{u.name}</div>
                  </div>
                  <span className="text-white/30 text-[10px]">{PRESENCE_LABEL[p]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          className="rounded-md border border-white/8 p-3.5"
          style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
          <div className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-2.5">Since you were away</div>
          <div className="space-y-2.5">
            {recent.map((a) => {
              const u = USERS.find((x) => x.id === a.userId);
              if (!u) return null;
              return (
                <div key={a.id} className="flex items-center gap-2.5">
                  <UserAvatar user={u} size={20} hoverCard={false} />
                  <div className="flex-1 min-w-0 text-white/70 text-[11px] leading-snug truncate">
                    <span className="text-white/90 font-medium">{u.name}</span>{" "}
                    {a.verb}{" "}
                    <span className="text-white/90 font-medium">{a.target}</span>
                  </div>
                  <span className="text-white/30 text-[10px] flex-shrink-0">{a.at}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="rounded-md border border-orange-500/20 p-3.5"
          style={{ background: "rgba(249,115,22,.08)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,.25)" }}>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest mb-1">Briefing</div>
              <div className="text-white/60 text-xs leading-relaxed">
                3 docs need your review and <span className="text-white/85">2 comments</span> mention you. Velocity is up 18% this week.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center justify-center gap-2 text-white/40 text-xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
        <span>SOC 2 Type II · end-to-end encrypted</span>
      </div>
    </div>
  );
}
