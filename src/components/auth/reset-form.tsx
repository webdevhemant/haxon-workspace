"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthShell } from "./auth-shell";

const inputClass = "w-full px-3.5 py-3 text-sm border border-gray-200 dark:border-white/10 rounded-md bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-all";

export default function ResetForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      variant="reset-password"
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? `We sent a reset link to ${email || "your email"}. It expires in 1 hour.`
          : "Enter your work email and we'll send you a reset link."
      }
      footer={
        <Link href="/login" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-orange-500 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      }
    >
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            className="flex flex-col gap-3.5"
          >
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/50 mb-1.5 block uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className={inputClass + " pl-10"}
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-md text-sm transition-all shadow-lg shadow-orange-500/25"
            >
              Send reset link
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex flex-col gap-5"
          >
            <div className="w-14 h-14 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-md bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/8 text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                Didn&apos;t get the email? Check your spam folder, or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-orange-500 font-medium hover:underline"
                >
                  try a different address
                </button>.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
