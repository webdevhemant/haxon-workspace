"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { USERS } from "@/data/dummy-users";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

function ProductPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,.2) 0%, transparent 70%)", filter: "blur(48px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,.15) 0%, transparent 70%)", filter: "blur(48px)" }} />

      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Floating cards */}
      <div className="relative w-full max-w-sm mx-auto space-y-3 px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Live workspace</span>
        </motion.div>

        {/* Board card */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl border border-white/8 p-3.5"
          style={{ background: "rgba(255,255,255,.05)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-start gap-2.5">
            <div className="w-1 h-full min-h-[36px] rounded-full bg-orange-500/70 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-white/90 text-sm font-medium mb-1">AI assistant — streaming improvements</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(249,115,22,.15)", color: "#FB923C" }}>High</span>
                <span className="text-white/30 text-[10px]">Q3 Roadmap · Due Jun 2</span>
              </div>
            </div>
            <UserAvatar user={USERS[1]} size={22} />
          </div>
        </motion.div>

        {/* Activity item */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl border border-white/8 p-3"
          style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2.5">
            <UserAvatar user={USERS[2]} size={26} />
            <div className="flex-1 min-w-0">
              <div className="text-white/70 text-xs leading-relaxed">
                <span className="text-white/90 font-medium">{USERS[2].name}</span> updated{" "}
                <span className="text-white/90 font-medium">Q3 Product Strategy</span>
              </div>
              <div className="text-white/30 text-[10px] mt-0.5">8 minutes ago</div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
          </div>
        </motion.div>

        {/* AI briefing card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-xl border border-orange-500/20 p-3.5"
          style={{ background: "rgba(249,115,22,.08)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(249,115,22,.25)" }}>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest mb-1">Haxon AI</div>
              <div className="text-white/60 text-xs leading-relaxed">
                3 cards moved to <span className="text-white/80">In Progress</span> this morning. Team velocity is up 18%.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="grid grid-cols-3 gap-2">
          {[["48", "Docs"], ["6", "Boards"], ["12", "Members"]].map(([val, label]) => (
            <div key={label} className="rounded-lg border border-white/6 p-2.5 text-center"
              style={{ background: "rgba(255,255,255,.04)" }}>
              <div className="text-white/90 text-base font-bold">{val}</div>
              <div className="text-white/30 text-[10px]">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Social proof */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center gap-3">
        <div className="flex -space-x-2">
          {USERS.slice(0, 4).map((u) => (
            <div key={u.id} className="ring-2 ring-[#060609] rounded-full">
              <UserAvatar user={u} size={26} />
            </div>
          ))}
        </div>
        <div className="text-white/40 text-xs">
          Trusted by <span className="text-white/70 font-medium">12,000+</span> teams worldwide
        </div>
      </div>
    </div>
  );
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — form panel */}
      <div className="flex flex-col w-full max-w-[480px] flex-shrink-0 bg-white dark:bg-[#08080C] border-r border-gray-100 dark:border-white/[0.06]">
        {/* Logo */}
        <div className="px-8 pt-8 pb-0">
          <Link href="/" className="inline-block">
            <HaxonLogo size={22} />
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-10 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">{subtitle}</p>
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 text-xs text-gray-400 dark:text-gray-500 text-center">
          {footer}
        </div>
      </div>

      {/* Right — dark visual */}
      <div className="flex-1 relative overflow-hidden hidden md:block" style={{ background: "#060609" }}>
        {/* Top badge */}
        <div className="absolute top-8 right-8 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/10"
            style={{ background: "rgba(255,255,255,.06)" }}>
            <Sparkles className="w-3 h-3 text-orange-400" />
            Powered by Haxon AI 2.0
          </div>
        </div>

        {/* Top-left headline */}
        <div className="absolute top-8 left-8 z-10">
          <div className="text-white/90 text-lg font-bold tracking-tight leading-tight">
            Think, build,{" "}
            <span className="gradient-text">ship faster.</span>
          </div>
        </div>

        <div className="h-full pt-20">
          <ProductPreview />
        </div>

        {/* Feature pills at top */}
        <div className="absolute top-20 left-8 flex flex-col gap-2 z-10">
          {["AI-native docs", "Drag-and-drop boards", "Local-first sync"].map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-white/50 text-xs">
              <CheckCircle2 className="w-3 h-3 text-orange-400/70 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
