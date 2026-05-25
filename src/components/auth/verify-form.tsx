"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { AuthShell } from "./auth-shell";

export default function VerifyForm() {
  const router = useRouter();
  return (
    <AuthShell
      title="You're all set! 🎉"
      subtitle="Your workspace is ready. Let's get you started."
      footer={<Link href="/login" className="text-gray-400 hover:underline">Sign in instead</Link>}
    >
      <div className="flex flex-col gap-5">
        <div className="w-20 h-20 rounded-2xl bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 flex items-center justify-center text-orange-500">
          <Check className="w-9 h-9" strokeWidth={2.5} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          We&apos;ve created your personal workspace. You can invite teammates anytime from Settings.
        </p>
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
          Continue to Haxon <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </AuthShell>
  );
}
