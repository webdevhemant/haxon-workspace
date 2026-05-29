"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, CreditCard, Download, Sparkles } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { cn } from "@/lib/utils";

const INVOICES = [
  { date: "Aug 1, 2026", amount: "$144.00", invoice: "INV-2026-0008", status: "Paid" },
  { date: "Jul 1, 2026", amount: "$144.00", invoice: "INV-2026-0007", status: "Paid" },
  { date: "Jun 1, 2026", amount: "$132.00", invoice: "INV-2026-0006", status: "Paid" },
  { date: "May 1, 2026", amount: "$108.00", invoice: "INV-2026-0005", status: "Paid" },
  { date: "Apr 1, 2026", amount: "$108.00", invoice: "INV-2026-0004", status: "Paid" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "",
    features: ["3 members", "1 workspace", "Basic AI (50/mo)", "7-day history"],
  },
  {
    name: "Pro",
    price: "$12",
    per: "/seat/mo",
    current: true,
    features: ["Unlimited members", "Unlimited workspaces", "Advanced AI", "30-day history", "SSO"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    features: ["Everything in Pro", "SCIM provisioning", "Audit log", "Dedicated CSM", "99.99% SLA"],
  },
];

const USAGE = [
  { label: "Docs", used: 248, total: "Unlimited", pct: 0.32 },
  { label: "Members", used: 12, total: 50, pct: 0.24 },
  { label: "Storage", used: "4.2 GB", total: "100 GB", pct: 0.04 },
];

export default function BillingSettings() {
  const [promo, setPromo] = useState("");

  return (
    <SettingsLayout title="Billing">
      <SettingSection title="Current plan">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              Pro
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-bold rounded-full">Active</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">$12 per seat per month · billed monthly · 12 seats</div>
            <div className="text-xs text-gray-400 mt-1">Next invoice on Sep 1, 2026 — $144.00</div>
          </div>
          <button
            onClick={() => toast.info("Plan management coming soon")}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Manage plan
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {USAGE.map((s) => (
            <div key={s.label}>
              <div className="text-xs text-gray-400 mb-1.5">{s.label}</div>
              <div className="text-lg font-semibold mb-1.5">
                {s.used} <span className="text-sm text-gray-400 font-normal">/ {s.total}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${s.pct * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Payment method" desc="Used for monthly invoices and seat add-ons.">
        <div className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
          <div className="w-10 h-7 rounded bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Visa ending in 4242</div>
            <div className="text-xs text-gray-400">Expires 09/2028 · billing@haxon.app</div>
          </div>
          <button
            onClick={() => toast.info("Update card flow coming soon")}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Update
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Compare plans" desc="Switch any time. Annual billing saves 17%.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "rounded-xl p-4 border transition-all",
                p.current
                  ? "border-orange-300 dark:border-orange-700 ring-2 ring-orange-500/15 bg-orange-50/40 dark:bg-orange-950/20"
                  : "border-gray-200 dark:border-gray-800",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">{p.name}</div>
                {p.current && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold">{p.price}</span>
                {p.per && <span className="text-xs text-gray-400">{p.per}</span>}
              </div>
              <ul className="space-y-1.5 mb-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-[12.5px] text-gray-600 dark:text-gray-400">
                    <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toast.info(p.current ? "Already on this plan" : `Switching to ${p.name}…`)}
                disabled={p.current}
                className={cn(
                  "w-full text-xs font-semibold py-1.5 rounded-lg transition-colors",
                  p.current
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white",
                )}
              >
                {p.current ? "Current plan" : `Switch to ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Promo code" desc="Have a code from a partner or a promo? Apply it here.">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value.toUpperCase())}
            placeholder="e.g. HAXON25"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors uppercase tracking-wider"
          />
          <button
            onClick={() => {
              if (!promo.trim()) return;
              toast.success(`Code "${promo}" applied`);
              setPromo("");
            }}
            disabled={!promo.trim()}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Invoices" desc="Download a copy any time for your records.">
        <div className="-mx-4">
          {INVOICES.map((inv, i) => (
            <div
              key={inv.invoice}
              className={`flex items-center px-4 py-3 text-sm ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}
            >
              <div className="w-32 text-gray-600 dark:text-gray-400">{inv.date}</div>
              <div className="w-24 font-medium">{inv.amount}</div>
              <div className="flex-1">
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-semibold rounded-full">
                  {inv.status}
                </span>
              </div>
              <div className="text-gray-400 text-xs mr-3">{inv.invoice}</div>
              <button
                onClick={() => toast.success(`${inv.invoice} downloaded`)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}
