import Link from "next/link";
import { HaxonLogo } from "@/components/ui/haxon-logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-8">
        <HaxonLogo size={24} />
      </div>

      <div className="relative mb-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,.2), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative text-[120px] font-black tracking-tight leading-none text-gray-100 dark:text-gray-800 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🗺️</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-3">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        This page doesn&apos;t exist or was moved. Check the URL or head back to your workspace.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
