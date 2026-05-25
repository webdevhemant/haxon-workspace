"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "./auth-shell";
import { useAppStore } from "@/store/app-store";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(4, "Password is too short."),
});
type FormData = z.infer<typeof schema>;

const inputClass = "w-full px-3.5 py-3 text-sm border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-all";

export default function LoginForm() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "maya@haxon.app", password: "password123" },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      login(data.email);
      toast.success("Welcome back, Maya!");
      router.push("/dashboard");
    }, 700);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Haxon workspace."
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-500 font-medium hover:underline">
            Sign up free
          </Link>
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Google OAuth */}
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.07] rounded-xl text-sm font-medium text-gray-700 dark:text-white/80 transition-all shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3.1-4.4 3.1-7.5Z" />
            <path fill="#34A853" d="M12 22c2.7 0 5-1 6.7-2.5l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3a10 10 0 0 0 0 8.8l3.4-2.6Z" />
            <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.3 14.7 2.3 12 2.3A10 10 0 0 0 3 7.6l3.4 2.6c.8-2.4 3-4.1 5.6-4.1Z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
          <span className="text-xs text-gray-400 dark:text-white/25 flex-shrink-0">or with email</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/50 mb-1.5 block uppercase tracking-wide">
              Email
            </label>
            <input {...register("email")} type="email" placeholder="you@company.com" className={inputClass} />
            {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide">
                Password
              </label>
              <Link href="/reset-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className={inputClass + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
