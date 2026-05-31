"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function CTA() {
  return (
    <section className="py-24 px-6 md:px-8">
      <Reveal>
        <div
          className="max-w-4xl mx-auto relative overflow-hidden rounded-md text-center text-white"
          style={{
            background: "linear-gradient(140deg, #080808 0%, #1a1004 100%)",
            padding: "80px 48px",
          }}
        >
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

          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(249,115,22,0.3), transparent 60%)",
              filter: "blur(48px)",
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 60%)",
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
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md text-sm transition-colors shadow-sm"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 font-semibold rounded-md text-sm transition-colors"
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
