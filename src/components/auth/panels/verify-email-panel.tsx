"use client";
import { motion } from "framer-motion";
import { Mail, MailCheck, Clock, RefreshCw, AtSign, HelpCircle } from "lucide-react";

const STEPS = [
  { icon: Mail, title: "Open your inbox", desc: "We sent a confirmation link from hello@haxon.app." },
  { icon: MailCheck, title: "Click the verify button", desc: "It takes you straight back here, signed in." },
  { icon: Clock, title: "Link expires in 24 hours", desc: "Request a fresh one anytime if it lapses." },
];

const TIPS = [
  { icon: RefreshCw, label: "Resend the email", hint: "Available again in 30s" },
  { icon: AtSign, label: "Used the wrong address?", hint: "Update it in one click" },
  { icon: HelpCircle, label: "Still nothing?", hint: "Check spam, or contact support" },
];

export function VerifyEmailPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,.2) 0%, transparent 70%)", filter: "blur(56px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,.16) 0%, transparent 70%)", filter: "blur(56px)" }} />

      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative w-full max-w-sm mx-auto space-y-4 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-orange-500/30 blur-2xl" />
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center border border-white/10"
              style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.22), rgba(249,115,22,0.06))" }}>
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
                <Mail className="w-9 h-9 text-orange-300" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center">
          <div className="text-white/90 text-base font-semibold tracking-tight mb-1">Check your inbox</div>
          <div className="text-white/45 text-xs">Three quick steps to get you in.</div>
        </motion.div>

        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
              className="rounded-xl border border-white/8 p-3 flex items-start gap-3"
              style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-orange-300 border border-orange-400/30"
                style={{ background: "rgba(249,115,22,.12)" }}>
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white/85 text-xs font-semibold mb-0.5 flex items-center gap-1.5">
                  <s.icon className="w-3 h-3 text-white/45" strokeWidth={2} />
                  {s.title}
                </div>
                <div className="text-white/45 text-[11px] leading-snug">{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
          className="rounded-xl border border-white/8 p-3.5"
          style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
          <div className="text-white/45 text-[10px] uppercase tracking-widest font-semibold mb-2.5">
            Email not arriving?
          </div>
          <div className="space-y-2">
            {TIPS.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5">
                <t.icon className="w-3.5 h-3.5 text-orange-400/80 flex-shrink-0" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-[11px] font-medium truncate">{t.label}</div>
                </div>
                <span className="text-white/30 text-[10px] flex-shrink-0">{t.hint}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-8 text-center text-white/35 text-xs">
        Most emails arrive within <span className="text-white/65 font-medium">30 seconds</span>.
      </div>
    </div>
  );
}
