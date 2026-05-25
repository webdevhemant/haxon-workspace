import Link from "next/link";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { ShieldOff } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-8">
        <HaxonLogo size={24} />
      </div>

      <div className="relative mb-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,.2), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative text-[120px] font-black tracking-tight leading-none text-gray-100 dark:text-gray-800 select-none">
          403
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🔒</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-3">Access denied</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        You don&apos;t have permission to view this page. Contact your workspace admin to request access.
      </p>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-8 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <ShieldOff className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-500 dark:text-gray-400 text-left">
            If you believe this is a mistake, ask your workspace owner to update your role permissions.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Go to dashboard
        </Link>
        <Link
          href="/settings/members"
          className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors"
        >
          Request access
        </Link>
      </div>
    </div>
  );
}
