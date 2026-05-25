"use client";
import { useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { AuthShell } from "./auth-shell";

export default function ResetForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={sent ? "We sent a reset link. It expires in 1 hour." : "Enter your email and we'll send you a reset link."}
      footer={<Link href="/login" className="text-orange-500 hover:underline">← Back to sign in</Link>}
    >
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors" />
          <button type="submit"
            className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Send reset link
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 flex items-center justify-center text-orange-500">
            <Inbox className="w-7 h-7" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We sent a link to <strong className="text-gray-900 dark:text-white">{email || "your email"}</strong>. Click it to choose a new password.
          </p>
          <button onClick={() => setSent(false)} className="self-start px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Try a different email
          </button>
        </div>
      )}
    </AuthShell>
  );
}
