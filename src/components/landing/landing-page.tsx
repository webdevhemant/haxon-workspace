"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Sparkles, FileText, Kanban, Users, Zap, Layers,
  Check, Play, Globe, GitBranch, ExternalLink, Star,
} from "lucide-react";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { FEATURES, TESTIMONIALS } from "@/data/dummy-users";

/* ─────────────────────────────────────────────
   Reveal animation wrapper
───────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles, FileText, Kanban, Users, Zap, Layers,
};

/* ─────────────────────────────────────────────
   Nav
───────────────────────────────────────────── */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-3.5 flex items-center justify-between gap-6">
        <HaxonLogo size={22} />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {["Product", "Pricing", "Docs", "Blog"].map((l) => (
            <a
              key={l}
              href="#"
              className="px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA area */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Subtle divider */}
          <div className="hidden sm:block w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   Hero — App Mockup sub-component
───────────────────────────────────────────── */
function AppMockup() {
  const [aiText, setAiText] = useState("");
  const fullText =
    "Based on the bets above, the highest-leverage actions this week are locking AI pricing and recruiting 5 design partners…";

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i <= fullText.length) {
        setAiText(fullText.slice(0, i));
        i++;
        setTimeout(tick, 38);
      }
    };
    const timer = setTimeout(tick, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sidebarItems = [
    { label: "Q3 Strategy", active: true },
    { label: "Eng RFC", active: false },
    { label: "Onboarding", active: false },
    { label: "Brand Guide", active: false },
  ];

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-2xl shadow-black/10"
      style={{ maxWidth: "896px", margin: "0 auto" }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-0.5 text-xs text-gray-400 min-w-40 text-center">
            haxon.app/northwind/q3-strategy
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* Main layout */}
      <div className="grid min-h-[380px]" style={{ gridTemplateColumns: "164px 1fr 256px" }}>
        {/* Sidebar */}
        <div className="border-r border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900 p-3 flex flex-col gap-0.5">
          <div className="px-2 pt-1 pb-2.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Northwind
            </div>
          </div>

          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] cursor-default ${
                item.active
                  ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-medium"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <FileText className="w-3 h-3 flex-shrink-0 opacity-70" />
              {item.label}
            </div>
          ))}

          <div className="mt-3 px-2 pb-1">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Members
            </div>
            <div className="flex -space-x-1">
              {["#F97316", "#3B82F6", "#8B5CF6", "#10B981"].map((c, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: c }}
                />
              ))}
              <div className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-500">
                +3
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="p-6 overflow-hidden">
          {/* Doc header */}
          <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white mb-1">
            Q3 Product Strategy
          </h2>
          <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-orange-400 flex items-center justify-center text-white text-[8px] font-bold">M</div>
              <span>Maya Chen</span>
            </div>
            <span>·</span>
            <span>Updated 2h ago</span>
            <span>·</span>
            <div className="flex items-center gap-1 text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft inline-block" />
              <span>3 live</span>
            </div>
          </div>

          {/* Body text */}
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            Haxon shipped its v2 doc engine last quarter, doubling editor
            performance and unlocking real-time multiplayer. Adoption is up
            38% MoM, with design partners reporting 3× faster planning cycles.
          </p>

          {/* Key objectives block */}
          <div className="mb-3">
            <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Key objectives
            </div>
            <div className="space-y-1">
              {[
                { label: "Ship AI pricing model", done: true },
                { label: "Recruit 5 design partners", done: true },
                { label: "Launch self-serve onboarding", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[11px]">
                  <div
                    className={`w-3 h-3 rounded flex-shrink-0 flex items-center justify-center ${
                      item.done
                        ? "bg-orange-500 text-white"
                        : "border border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {item.done && <Check className="w-2 h-2" />}
                  </div>
                  <span
                    className={
                      item.done
                        ? "line-through text-gray-400"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI callout */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 rounded-lg p-2.5 flex gap-2 items-start">
            <Sparkles className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-[9px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">
                Haxon AI
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Suggested: Add OKR alignment section based on your company goals doc.
              </div>
            </div>
          </div>
        </div>

        {/* AI assistant panel */}
        <div className="border-l border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900 flex flex-col">
          {/* Panel header */}
          <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              AI Assistant
            </span>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 pulse-soft" />
          </div>

          {/* Chat area */}
          <div className="flex-1 p-3 space-y-2 overflow-hidden">
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="bg-orange-500 text-white text-[10px] rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[80%] leading-relaxed">
                Summarize our Q3 strategy and next actions
              </div>
            </div>
            {/* AI bubble */}
            <div className="flex gap-2 items-start">
              <div className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-orange-500" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400 rounded-xl rounded-tl-sm px-2.5 py-2 leading-relaxed max-w-[88%]">
                {aiText}
                <span className="blink">|</span>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 flex-1">
                Ask about this doc…
              </span>
              <span className="font-mono text-[9px] text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                ⌘K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-center orange orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[480px] rounded-full float-orb"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.16), transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Bottom-right indigo orb */}
        <div
          className="absolute bottom-0 right-0 w-[480px] h-[400px] rounded-full float-orb-rev"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.14), transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.22,
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 25%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 relative text-center">
        {/* Badge */}
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-500 shadow-sm mb-8">
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded tracking-wide">
              NEW
            </span>
            Haxon AI 2.0 — workspace-grounded reasoning
            <ArrowRight className="w-3 h-3 text-gray-400" />
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.08}>
          <h1
            className="font-bold tracking-tight leading-[1.08] mb-5 text-gray-900 dark:text-white"
            style={{ fontSize: "clamp(44px, 6vw, 76px)" }}
          >
            Your team&apos;s second brain,
            <br />
            <span className="gradient-text">supercharged with AI</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={0.14}>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-9 leading-relaxed">
            Docs, boards, grids, and an AI that understands your work — unified
            into one fast workspace. Built for teams who think faster than they
            type.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.2}>
          <div className="flex items-center justify-center gap-3 mb-16 flex-wrap">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-gray-500" /> Live demo
            </Link>
          </div>
        </Reveal>

        {/* App mockup */}
        <Reveal delay={0.28} y={40}>
          <AppMockup />
        </Reveal>

        {/* Logo row */}
        <Reveal delay={0.36}>
          <div className="mt-16">
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-5">
              Trusted by 12,000+ teams
            </div>
            <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
              {["ATLAS", "MERCATOR", "REVERB", "HELIA", "VELLUM", "PINECREST"].map(
                (n) => (
                  <span
                    key={n}
                    className="text-sm font-bold tracking-widest text-gray-300 dark:text-gray-600 grayscale hover:grayscale-0 hover:text-gray-500 dark:hover:text-gray-400 transition-all cursor-default"
                  >
                    {n}
                  </span>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Features
───────────────────────────────────────────── */
function Features() {
  return (
    <section className="py-28 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              What&apos;s inside
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              Every tool your team needs.
              <br />
              <span className="text-gray-400 dark:text-gray-500">
                One workspace.
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon] || Sparkles;
            return (
              <Reveal key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon with left border accent */}
                    <div className="border-l-2 border-orange-500 pl-3 flex-shrink-0">
                      <Icon className="w-8 h-8 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1.5 text-base">
                        {f.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Workflow / How it works
───────────────────────────────────────────── */
function Workflow() {
  const steps = [
    {
      icon: FileText,
      title: "Draft in Docs",
      desc: "Spin up structured notes with slash commands. AI fills in scaffolds, summaries, and action items as you go.",
      step: 1,
    },
    {
      icon: Kanban,
      title: "Plan on Boards",
      desc: "Convert any list of headings to a kanban column. Drag, group by owner, and surface what&apos;s blocked instantly.",
      step: 2,
    },
    {
      icon: Layers,
      title: "Track in Grids",
      desc: "Same data, spreadsheet view. Filter, sort, group, bulk-edit — without leaving your workspace.",
      step: 3,
    },
  ];

  return (
    <section className="py-28 px-6 md:px-8 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              How it works
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              From thought to ship,
              <br />
              in three views.
            </h2>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Dashed connector line — desktop only */}
          <div
            className="absolute hidden md:block top-11 left-[22%] right-[22%] h-0 border-t-2 border-dashed border-gray-200 dark:border-gray-700"
            style={{ zIndex: 0 }}
          />

          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="text-center relative z-10">
                {/* Step icon circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 mx-auto mb-5 flex items-center justify-center shadow-sm">
                  <s.icon
                    className="w-8 h-8 text-gray-700 dark:text-gray-300"
                    strokeWidth={1.4}
                  />
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <div className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {s.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-56 mx-auto leading-relaxed">
                  {s.desc}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Testimonials
───────────────────────────────────────────── */
function StarRating() {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-8 mb-14">
        <Reveal>
          <div className="text-center">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              Loved by builders
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              What teams are saying
            </h2>
          </div>
        </Reveal>
      </div>

      {/* Scrollable row — custom scrollbar via globals.css */}
      <div
        className="flex gap-4 overflow-x-auto px-6 md:px-8 pb-8 landing-scroll-area"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="flex-none w-[320px] md:w-[360px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ scrollSnapAlign: "start" }}
          >
            <StarRating />
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Pricing
───────────────────────────────────────────── */
function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "For individuals exploring how teams work.",
      features: [
        "Unlimited docs",
        "1 workspace",
        "Up to 3 members",
        "Basic AI (50 / mo)",
        "7-day history",
      ],
      cta: "Start free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      per: "/seat/mo",
      desc: "For growing teams who ship every week.",
      popular: true,
      features: [
        "Unlimited workspaces",
        "Unlimited members",
        "Advanced AI (unlimited)",
        "Boards + Grids + Calendar",
        "30-day history",
        "SSO",
        "Priority support",
      ],
      cta: "Start free trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For org-wide rollouts with compliance needs.",
      features: [
        "Everything in Pro",
        "SCIM provisioning",
        "Audit log",
        "Custom data residency",
        "Dedicated CSM",
        "99.99% SLA",
      ],
      cta: "Talk to sales",
      popular: false,
    },
  ];

  return (
    <section className="py-28 px-6 md:px-8 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              Pricing
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white mb-3"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              Simple, honest pricing
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Start free. Upgrade only when your team grows.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative bg-white dark:bg-gray-950 rounded-2xl p-7 h-full flex flex-col transition-all ${
                  t.popular
                    ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/10"
                    : "border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Most popular
                  </div>
                )}

                <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {t.name}
                </div>
                <div className="text-sm text-gray-500 mb-5 min-h-10">
                  {t.desc}
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {t.price}
                  </span>
                  {t.per && (
                    <span className="text-sm text-gray-400">{t.per}</span>
                  )}
                </div>

                <Link
                  href="/signup"
                  className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold mb-6 transition-colors ${
                    t.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {t.cta}
                </Link>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex-1 space-y-2">
                  {t.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          t.popular ? "text-orange-500" : "text-gray-400"
                        }`}
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA
───────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24 px-6 md:px-8">
      <Reveal>
        <div
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl text-center text-white"
          style={{
            background: "linear-gradient(140deg, #080808 0%, #1a1004 100%)",
            padding: "80px 48px",
          }}
        >
          {/* Grid texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)",
            }}
          />

          {/* Orange orb */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.3), transparent 60%)",
              filter: "blur(48px)",
            }}
          />
          {/* Indigo orb */}
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.2), transparent 60%)",
              filter: "blur(48px)",
            }}
          />

          <div className="relative">
            <h2
              className="font-bold tracking-tight mb-4"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              Ready to think faster?
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Join thousands of teams who replaced four tools with one. Free
              forever for up to 3 people.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                View live demo
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="px-6 md:px-8 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_repeat(4,1fr)] gap-8 md:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <HaxonLogo size={22} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3.5 max-w-52 leading-relaxed">
              The workspace for teams who think for a living.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Globe, label: "Website" },
                { Icon: GitBranch, label: "GitHub" },
                { Icon: ExternalLink, label: "More" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              title: "Product",
              links: ["Docs", "Boards", "Grids", "AI Assistant", "Changelog"],
            },
            {
              title: "Company",
              links: ["About", "Customers", "Careers", "Press", "Brand"],
            },
            {
              title: "Resources",
              links: [
                "Help center",
                "API",
                "Integrations",
                "Templates",
                "Security",
              ],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "DPA", "Cookies", "GDPR"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold mb-3.5 text-gray-900 dark:text-white uppercase tracking-wide">
                {col.title}
              </div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-1 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6 text-xs text-gray-400">
          <div>© 2026 Haxon, Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Page root
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen">
      <LandingNav />
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
