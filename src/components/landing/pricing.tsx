"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./reveal";

const TIERS = [
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

export function Pricing() {
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
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative bg-white dark:bg-gray-950 rounded-md p-7 h-full flex flex-col transition-all ${
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
                <div className="text-sm text-gray-500 mb-5 min-h-10">{t.desc}</div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {t.price}
                  </span>
                  {t.per && <span className="text-sm text-gray-400">{t.per}</span>}
                </div>

                <Link
                  href="/signup"
                  className={`flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold mb-6 transition-colors ${
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
