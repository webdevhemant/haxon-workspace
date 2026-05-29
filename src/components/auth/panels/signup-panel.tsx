"use client";
import { motion } from "framer-motion";
import { Sparkles, FileText, Kanban, Users, Zap, Layers, Quote } from "lucide-react";
import { FEATURES, TESTIMONIALS, USERS } from "@/data/dummy-users";
import { UserAvatar } from "@/components/ui/user-avatar";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles, FileText, Kanban, Users, Zap, Layers,
};

const LOGOS = ["Atlas Robotics", "Mercator", "Reverb", "Helia", "Vellum", "Pinecrest"];

export function SignupPanel() {
  const features = FEATURES.slice(0, 3);
  const quote = TESTIMONIALS[0];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,.22) 0%, transparent 70%)", filter: "blur(56px)" }} />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,.18) 0%, transparent 70%)", filter: "blur(56px)" }} />

      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative w-full max-w-sm mx-auto space-y-3 px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Build something today</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-2">
          {features.map((f, i) => {
            const Icon = ICON_MAP[f.icon] || Sparkles;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-white/8 p-3.5 flex items-start gap-3"
                style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,115,22,.18)" }}>
                  <Icon className="w-4 h-4 text-orange-400" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="text-white/90 text-xs font-semibold mb-0.5">{f.title}</div>
                  <div className="text-white/45 text-[11px] leading-snug">{f.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
          className="rounded-xl border border-white/10 p-4"
          style={{ background: "rgba(255,255,255,.05)", backdropFilter: "blur(12px)" }}>
          <Quote className="w-4 h-4 text-orange-400/70 mb-2" />
          <div className="text-white/80 text-xs leading-relaxed italic mb-3">
            &ldquo;{quote.quote}&rdquo;
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: quote.color }}>
              {quote.initials}
            </div>
            <div className="min-w-0">
              <div className="text-white/85 text-[11px] font-semibold truncate">{quote.name}</div>
              <div className="text-white/40 text-[10px] truncate">{quote.role}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
          className="pt-2">
          <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2.5 text-center">Trusted by teams at</div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            {LOGOS.map((l) => (
              <span key={l} className="text-white/45 text-[11px] font-semibold tracking-tight">
                {l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center justify-center gap-3">
        <div className="flex -space-x-2">
          {USERS.slice(0, 4).map((u) => (
            <div key={u.id} className="ring-2 ring-[#060609] rounded-full">
              <UserAvatar user={u} size={22} hoverCard={false} />
            </div>
          ))}
        </div>
        <div className="text-white/40 text-xs">
          Join <span className="text-white/70 font-medium">12,000+</span> teams shipping faster
        </div>
      </div>
    </div>
  );
}
