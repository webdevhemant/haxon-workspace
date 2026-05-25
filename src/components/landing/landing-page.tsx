"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Sparkles, FileText, Kanban, Users, Zap, Layers,
  Quote, Check, Play,
} from "lucide-react";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { FEATURES, TESTIMONIALS } from "@/data/dummy-users";

function Reveal({ children, delay = 0, y = 24, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
      {children}
    </motion.div>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles, FileText, Kanban, Users, Zap, Layers,
};

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-6xl mx-auto px-8 py-3.5 flex items-center justify-between gap-6">
        <HaxonLogo size={22} />
        <div className="flex items-center gap-1 text-sm">
          {["Product", "Pricing", "Customers", "Changelog", "Docs"].map((l) => (
            <a key={l} href="#" className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</Link>
          <Link href="/signup" className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [aiText, setAiText] = useState("");
  const fullText = "Draft a launch plan for our v3 release in Q4.";
  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i <= fullText.length) { setAiText(fullText.slice(0, i)); i++; setTimeout(tick, 50); }
    };
    setTimeout(tick, 800);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/10 left-2/12 w-[520px] h-[520px] rounded-full float-orb"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,.35), transparent 60%)", filter: "blur(40px)" }} />
        <div className="absolute top-1/10 right-1/20 w-[460px] h-[460px] rounded-full float-orb-rev"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,.22), transparent 60%)", filter: "blur(40px)" }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(var(--tw-prose-hr,#e5e7eb) 1px, transparent 1px), linear-gradient(90deg, var(--tw-prose-hr,#e5e7eb) 1px, transparent 1px)",
            backgroundSize: "64px 64px", opacity: 0.35,
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 30%, black 30%, transparent 100%)",
          }} />
      </div>

      <div className="max-w-5xl mx-auto px-8 relative text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-500 shadow-sm mb-7">
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">NEW</span>
            Haxon AI 2.0 — workspace-grounded reasoning <ArrowRight className="w-3 h-3" />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="text-[clamp(48px,7vw,92px)] font-bold tracking-tight leading-none mb-6">
            Your team&apos;s second brain,<br />
            supercharged with <span className="gradient-text">AI</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-9 leading-relaxed">
            Docs, boards, grids, and an AI that actually understands your work — unified into one blazing-fast workspace. Built for teams who think faster than they type.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex items-center justify-center gap-3 mb-16">
            <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/20">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Play className="w-3.5 h-3.5" /> View demo
            </Link>
          </div>
        </Reveal>

        {/* App mockup */}
        <Reveal delay={0.32} y={40}>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden max-w-5xl mx-auto text-left">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-400">haxon.app / northwind / Q3 Strategy</div>
            </div>
            <div className="grid grid-cols-[180px_1fr_280px] min-h-[440px]">
              {/* Mini sidebar */}
              <div className="border-r border-gray-100 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900 text-xs">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5">Northwind</div>
                {["🎯 Q3 Strategy", "⚙️ Eng RFC", "🚀 Onboarding", "🎨 Brand"].map((t, i) => (
                  <div key={i} className={`px-2 py-1 rounded-md mb-0.5 ${i === 0 ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-500 hover:bg-gray-100"}`}>{t}</div>
                ))}
              </div>
              {/* Editor */}
              <div className="p-7">
                <div className="text-xl font-bold mb-2 tracking-tight">Q3 Product Strategy</div>
                <div className="flex gap-2 mb-4 text-xs text-gray-400">
                  <span>Maya · 2h ago</span><span>·</span><span>4 collaborators</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Haxon shipped its v2 doc engine last quarter, doubling editor performance and unlocking real-time multiplayer. Adoption is up 38% MoM…
                </p>
                <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900 rounded-lg p-3 flex gap-2.5 items-start text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-orange-600 text-[10px] uppercase tracking-wider mb-1">HAXON AI</div>
                    <div className="text-gray-600 dark:text-gray-400">Based on the bets above, the highest-leverage actions this week are locking AI pricing, recruiting 5 design partners…</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-soft" />
                  3 collaborators editing
                </div>
              </div>
              {/* AI panel */}
              <div className="border-l border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3.5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-semibold">AI Assistant</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {aiText}<span className="blink">|</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-xs text-gray-400 flex items-center gap-1.5">
                  Ask anything… <span className="ml-auto font-mono text-gray-300">⌘K</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Logos */}
        <Reveal delay={0.4}>
          <div className="mt-16">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Trusted by 12,000+ teams shipping fast</div>
            <div className="flex justify-center gap-10 flex-wrap opacity-40">
              {["ATLAS", "MERCATOR", "REVERB", "HELIA", "VELLUM", "PINECREST"].map((n) => (
                <span key={n} className="text-lg font-bold tracking-widest text-gray-500">{n}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">What&apos;s inside</div>
            <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight">
              Every tool your team needs.<br /><span className="text-gray-400">One workspace.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon] || Sparkles;
            return (
              <Reveal key={f.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-7 h-full hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 flex items-center justify-center text-orange-500 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-lg mb-2">{f.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { icon: FileText, title: "Draft in Docs", desc: "Spin up structured notes with slash commands. AI fills in scaffolds, summaries, and action items as you go." },
    { icon: Kanban, title: "Plan on Boards", desc: "Convert any list of headings to a kanban column. Drag, group by anyone, surface what's blocked." },
    { icon: Layers, title: "Track in Grids", desc: "Same data, spreadsheet view. Filter, sort, group, bulk-edit — without leaving your workspace." },
  ];
  return (
    <section className="py-24 px-8 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">How it works</div>
            <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight">
              From thought to ship,<br />in three views.
            </h2>
          </div>
        </Reveal>
        <div className="relative grid grid-cols-3 gap-6">
          <div className="absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="text-center relative z-10">
                <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 mx-auto mb-6 flex items-center justify-center text-orange-500 shadow-sm">
                  <s.icon className="w-10 h-10" strokeWidth={1.4} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <div className="font-bold text-xl mb-2">{s.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-64 mx-auto leading-relaxed">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 mb-16">
        <Reveal>
          <div className="text-center">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">Loved by builders</div>
            <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight">What teams are saying</h2>
          </div>
        </Reveal>
      </div>
      <div className="flex gap-4 overflow-x-auto px-8 pb-10" style={{ scrollSnapType: "x mandatory" }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="flex-none w-[360px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-7" style={{ scrollSnapAlign: "start" }}>
            <Quote className="w-6 h-6 text-orange-500 mb-4" />
            <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-6">&ldquo;{t.quote}&rdquo;</div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: t.color }}>
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For individuals exploring how teams work.", features: ["Unlimited docs", "1 workspace", "Up to 3 members", "Basic AI (50 / mo)", "7-day history"], cta: "Start free", popular: false },
    { name: "Pro", price: "$12", per: "/seat/mo", desc: "For growing teams who ship every week.", popular: true, features: ["Unlimited workspaces", "Unlimited members", "Advanced AI (unlimited)", "Boards + Grids + Calendar", "30-day history", "SSO", "Priority support"], cta: "Start free trial" },
    { name: "Enterprise", price: "Custom", desc: "For org-wide rollouts with compliance needs.", features: ["Everything in Pro", "SCIM provisioning", "Audit log", "Custom data residency", "Dedicated CSM", "99.99% SLA"], cta: "Talk to sales", popular: false },
  ];
  return (
    <section className="py-24 px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight mb-3">Simple, honest pricing</h2>
            <div className="text-gray-500 dark:text-gray-400">Start free. Upgrade only when your team grows.</div>
          </div>
        </Reveal>
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className={`relative bg-white dark:bg-gray-950 rounded-2xl p-7 h-full flex flex-col ${t.popular ? "border-2 border-orange-500 shadow-xl shadow-orange-500/10" : "border border-gray-200 dark:border-gray-800"}`}>
                {t.popular && (
                  <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Most popular</div>
                )}
                <div className="font-bold text-xl mb-1">{t.name}</div>
                <div className="text-sm text-gray-500 mb-4 min-h-10">{t.desc}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold tracking-tight">{t.price}</span>
                  {t.per && <span className="text-sm text-gray-400">{t.per}</span>}
                </div>
                <Link href="/signup"
                  className={`flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold mb-6 transition-colors ${t.popular ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                  {t.cta}
                </Link>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex-1 space-y-2.5">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                      <Check className={`w-4 h-4 flex-shrink-0 ${t.popular ? "text-orange-500" : "text-gray-400"}`} />
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

function CTA() {
  return (
    <section className="py-24 px-8">
      <Reveal>
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl text-center text-white p-18" style={{ background: "linear-gradient(135deg, #0A0A0A 0%, #1C1410 100%)", padding: "72px 48px" }}>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,.35), transparent 60%)", filter: "blur(40px)" }} />
          <div className="relative">
            <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight mb-4">Ready to think faster?</h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of teams who replaced four tools with one. Free forever for up to 3 people.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/signup" className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors">
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl text-sm transition-colors" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)" }}>
                View live demo
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-8 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-[1.5fr_repeat(4,1fr)] gap-12 mb-12">
          <div>
            <HaxonLogo size={22} />
            <p className="text-sm text-gray-500 mt-3.5 max-w-56 leading-relaxed">The workspace for teams who think for a living.</p>
          </div>
          {[
            { title: "Product", links: ["Docs", "Boards", "Grids", "AI Assistant", "Changelog"] },
            { title: "Company", links: ["About", "Customers", "Careers", "Press", "Brand"] },
            { title: "Resources", links: ["Help center", "API", "Integrations", "Templates", "Security"] },
            { title: "Legal", links: ["Privacy", "Terms", "DPA", "Cookies", "GDPR"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold mb-3.5 text-gray-900 dark:text-white">{col.title}</div>
              {col.links.map((l) => (
                <a key={l} href="#" className="block text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-1 transition-colors">{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-6 text-xs text-gray-400">
          <div>© 2026 Haxon, Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

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
