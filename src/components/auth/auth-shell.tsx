"use client";
import Link from "next/link";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { AvatarGroup } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { Sparkles, FileText, Kanban, Zap } from "lucide-react";

const FEATURES = [
  { icon: FileText, text: "Docs with native AI blocks" },
  { icon: Kanban, text: "Kanban boards with drag-and-drop" },
  { icon: Sparkles, text: "Data grids with shared schema" },
  { icon: Zap, text: "Local-first sync engine" },
];

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-950">
      {/* Left — form */}
      <div className="flex-none w-[480px] flex flex-col p-8">
        <Link href="/">
          <HaxonLogo size={22} />
        </Link>
        <div className="flex-1 flex flex-col justify-center max-w-[360px] w-full mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{subtitle}</p>
          {children}
        </div>
        <div className="text-xs text-gray-400 text-center">{footer}</div>
      </div>

      {/* Right — visual */}
      <div className="flex-1 relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute -top-1/5 -left-1/10 w-[600px] h-[600px] rounded-full float-orb"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,.4), transparent 60%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-1/5 -right-1/10 w-[500px] h-[500px] rounded-full float-orb-rev"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,.3), transparent 60%)", filter: "blur(60px)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative h-full flex flex-col justify-center px-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/8 border border-white/12 rounded-full text-xs font-medium mb-7 self-start text-white/85">
            <Sparkles className="w-3 h-3 text-orange-400" />
            Powered by Haxon AI 2.0
          </div>
          <h2 className="text-4xl font-bold tracking-tight leading-tight mb-5">
            One workspace for<br />everything your team<br />
            <span className="gradient-text">thinks, builds, and ships.</span>
          </h2>
          <p className="text-white/65 text-base max-w-[440px] leading-relaxed mb-10">
            Docs, boards, grids, and an AI that actually understands your work — unified into one blazing-fast workspace.
          </p>

          <div className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-white/85 text-sm">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,115,22,.15)", border: "1px solid rgba(249,115,22,.25)" }}>
                  <f.icon className="w-4 h-4 text-orange-400" />
                </span>
                {f.text}
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-16 right-16 flex items-center gap-3 text-white/50 text-xs">
            <AvatarGroup users={USERS.slice(0, 4)} size={24} />
            <span>Trusted by 12,000+ teams worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
