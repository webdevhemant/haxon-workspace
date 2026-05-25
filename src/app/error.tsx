"use client";
import { useEffect } from "react";
import Link from "next/link";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-8">
        <HaxonLogo size={24} />
      </div>

      <div className="relative mb-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,.15), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative text-[120px] font-black tracking-tight leading-none text-gray-100 dark:text-gray-800 select-none">
          500
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">⚡</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-3">Something went wrong</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-2 leading-relaxed">
        An unexpected error occurred on our end. We&apos;ve been notified and are looking into it.
      </p>
      {error.digest && (
        <p className="text-xs text-gray-400 font-mono mb-8">Error ID: {error.digest}</p>
      )}
      {!error.digest && <div className="mb-8" />}

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
