"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "./reveal";
import { AppMockup } from "./app-mockup";

const LOGOS = ["ATLAS", "MERCATOR", "REVERB", "HELIA", "VELLUM", "PINECREST"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      <HeroBackground />

      <div className="max-w-5xl mx-auto px-6 md:px-8 relative text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-500 shadow-sm mb-8">
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded tracking-wide">
              NEW
            </span>
            Haxon AI 2.0 — workspace-grounded reasoning
            <ArrowRight className="w-3 h-3 text-gray-400" />
          </div>
        </Reveal>

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

        <Reveal delay={0.14}>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-9 leading-relaxed">
            Docs, boards, grids, and an AI that understands your work — unified
            into one fast workspace. Built for teams who think faster than they
            type.
          </p>
        </Reveal>

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

        <Reveal delay={0.28} y={40}>
          <AppMockup />
        </Reveal>

        <Reveal delay={0.36}>
          <div className="mt-16">
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-5">
              Trusted by 12,000+ teams
            </div>
            <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
              {LOGOS.map((n) => (
                <span
                  key={n}
                  className="text-sm font-bold tracking-widest text-gray-300 dark:text-gray-600 grayscale hover:grayscale-0 hover:text-gray-500 dark:hover:text-gray-400 transition-all cursor-default"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[480px] rounded-full float-orb"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.16), transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[480px] h-[400px] rounded-full float-orb-rev"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.14), transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.22,
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 25%, black 20%, transparent 100%)",
        }}
      />
    </div>
  );
}
