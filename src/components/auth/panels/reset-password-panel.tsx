"use client";
import { motion } from "framer-motion";
import { Shield, KeyRound, Check, X, Lock, Fingerprint } from "lucide-react";

const RULES = [
  { ok: true, text: "At least 12 characters" },
  { ok: true, text: "A mix of upper and lower case" },
  { ok: true, text: "Numbers and a symbol or two" },
  { ok: false, text: "Avoid pet names, birth years, or 'password'" },
  { ok: false, text: "Don't reuse passwords from other sites" },
];

const HABITS = [
  { icon: KeyRound, title: "Use a password manager", desc: "1Password, Bitwarden, or your browser — all great." },
  { icon: Fingerprint, title: "Turn on passkeys", desc: "Sign in with Face ID or your fingerprint, no password needed." },
  { icon: Lock, title: "Enable two-factor", desc: "An extra step that stops 99% of account takeover attempts." },
];

export function ResetPasswordPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,.18) 0%, transparent 70%)", filter: "blur(56px)" }} />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,.18) 0%, transparent 70%)", filter: "blur(56px)" }} />

      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative w-full max-w-sm mx-auto space-y-3 px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Strong by default</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-xl border border-white/10 p-4"
          style={{ background: "rgba(255,255,255,.05)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/85 text-xs font-semibold">What makes a strong password</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(16,185,129,.15)", color: "#34D399" }}>
              Checklist
            </span>
          </div>
          <div className="space-y-2">
            {RULES.map((r) => (
              <div key={r.text} className="flex items-start gap-2.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  r.ok ? "bg-emerald-500/20" : "bg-rose-500/15"
                }`}>
                  {r.ok ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                  ) : (
                    <X className="w-2.5 h-2.5 text-rose-400" strokeWidth={3} />
                  )}
                </div>
                <div className="text-white/70 text-[11px] leading-snug">{r.text}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          className="rounded-xl border border-white/8 p-3.5"
          style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
          <div className="text-white/45 text-[10px] uppercase tracking-widest font-semibold mb-2.5">
            Smart habits
          </div>
          <div className="space-y-2.5">
            {HABITS.map((h, i) => (
              <motion.div key={h.title}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,115,22,.14)" }}>
                  <h.icon className="w-3.5 h-3.5 text-orange-400" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white/85 text-[11px] font-semibold">{h.title}</div>
                  <div className="text-white/45 text-[10.5px] leading-snug">{h.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-xl border border-orange-500/20 p-3.5 flex items-start gap-2.5"
          style={{ background: "rgba(249,115,22,.08)", backdropFilter: "blur(12px)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(249,115,22,.25)" }}>
            <Shield className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-orange-400/80 uppercase tracking-widest mb-1">
              Heads up
            </div>
            <div className="text-white/65 text-[11px] leading-relaxed">
              Reset links expire after 1 hour. We&apos;ll notify you on this device after the change goes through.
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center justify-center gap-2 text-white/40 text-xs">
        <Lock className="w-3 h-3 text-emerald-400/80" />
        <span>Passwords hashed with bcrypt · never stored in plain text</span>
      </div>
    </div>
  );
}
