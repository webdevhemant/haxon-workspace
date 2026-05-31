"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Users } from "lucide-react";
import { AuthShell } from "./auth-shell";

const STEPS = [
  "Personal workspace created",
  "AI assistant activated",
  "Invite your team anytime",
];

export default function VerifyForm() {
  const router = useRouter();

  return (
    <AuthShell
      variant="verify-email"
      title="You're all set!"
      subtitle="Your workspace is ready. Let's get you started."
      footer={
        <Link href="/login" className="text-gray-400 hover:text-gray-600 dark:hover:text-white/50 transition-colors">
          Sign in instead
        </Link>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5"
      >
        {/* Success icon */}
        <div className="w-14 h-14 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-white/60"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
              {step}
            </motion.div>
          ))}
        </div>

        {/* Invite teaser */}
        <div className="flex items-center gap-2.5 p-3.5 rounded-md bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/8">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white">Invite your team</div>
            <div className="text-xs text-gray-400 dark:text-white/35">Free for up to 3 members</div>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-md text-sm transition-all shadow-lg shadow-orange-500/25"
        >
          Continue to Haxon
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </AuthShell>
  );
}
