"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { LoginPanel } from "./panels/login-panel";
import { SignupPanel } from "./panels/signup-panel";
import { VerifyEmailPanel } from "./panels/verify-email-panel";
import { ResetPasswordPanel } from "./panels/reset-password-panel";

export type AuthVariant = "login" | "signup" | "verify-email" | "reset-password";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  variant: AuthVariant;
}

const HEADLINES: Record<AuthVariant, { eyebrow: string; headline: React.ReactNode; pills: string[] }> = {
  login: {
    eyebrow: "Powered by Haxon AI 2.0",
    headline: (
      <>
        Pick up <span className="gradient-text">right where you left off.</span>
      </>
    ),
    pills: ["Real-time multiplayer", "Workspace-grounded AI", "Local-first sync"],
  },
  signup: {
    eyebrow: "Free for up to 3 people",
    headline: (
      <>
        Think, build, <span className="gradient-text">ship faster.</span>
      </>
    ),
    pills: ["Set up in 90 seconds", "No credit card needed", "Cancel any time"],
  },
  "verify-email": {
    eyebrow: "Almost there",
    headline: (
      <>
        One quick step <span className="gradient-text">and you&apos;re in.</span>
      </>
    ),
    pills: ["Verified accounts unlock SSO", "Recover access any time", "Inbox-only — we don't spam"],
  },
  "reset-password": {
    eyebrow: "Account security",
    headline: (
      <>
        Lock it down <span className="gradient-text">in 30 seconds.</span>
      </>
    ),
    pills: ["End-to-end encrypted", "Passkey-ready", "SOC 2 Type II"],
  },
};

function Panel({ variant }: { variant: AuthVariant }) {
  switch (variant) {
    case "login":
      return <LoginPanel />;
    case "signup":
      return <SignupPanel />;
    case "verify-email":
      return <VerifyEmailPanel />;
    case "reset-password":
      return <ResetPasswordPanel />;
  }
}

export function AuthShell({ title, subtitle, children, footer, variant }: Props) {
  const meta = HEADLINES[variant];
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="flex flex-col w-full max-w-[480px] flex-shrink-0 bg-white dark:bg-[#08080C] border-r border-gray-100 dark:border-white/[0.06]">
        <div className="px-8 pt-8 pb-0">
          <Link href="/" className="inline-block">
            <HaxonLogo size={22} />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-[22px] font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">{subtitle}</p>
            {children}
          </motion.div>
        </div>

        <div className="px-8 pb-7 text-xs text-gray-400 dark:text-gray-500 text-center">
          {footer}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden hidden md:block" style={{ background: "#060609" }}>
        <div className="absolute top-8 right-8 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/10"
            style={{ background: "rgba(255,255,255,.06)" }}>
            <Sparkles className="w-3 h-3 text-orange-400" />
            {meta.eyebrow}
          </div>
        </div>

        <div className="absolute top-8 left-8 z-10 max-w-[260px]">
          <div className="text-white/90 text-lg font-bold tracking-tight leading-tight">
            {meta.headline}
          </div>
        </div>

        <div className="h-full pt-20">
          <Panel variant={variant} />
        </div>

        <div className="absolute top-24 left-8 flex flex-col gap-2 z-10">
          {meta.pills.map((f) => (
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
