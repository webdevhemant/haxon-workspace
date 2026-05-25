"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { AuthShell } from "./auth-shell";
import { useAppStore } from "@/store/app-store";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(4, "Password is too short."),
});
type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [loading, setLoading] = useState(false);

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
      footer={<span>Don&apos;t have an account? <Link href="/signup" className="text-orange-500 font-medium hover:underline">Sign up</Link></span>}
    >
      <div className="flex flex-col gap-4">
        <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3.1-4.4 3.1-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-1 6.7-2.5l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3a10 10 0 0 0 0 8.8l3.4-2.6Z"/><path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.3 14.7 2.3 12 2.3A10 10 0 0 0 3 7.6l3.4 2.6c.8-2.4 3-4.1 5.6-4.1Z"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          OR CONTINUE WITH EMAIL
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">Email</label>
            <input {...register("email")} type="email" placeholder="you@company.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
              <Link href="/reset-password" className="text-xs text-orange-500 hover:underline">Forgot?</Link>
            </div>
            <input {...register("password")} type="password" placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 mt-1">
            {loading ? <Loader2 className="w-4 h-4 spin-slow" /> : null}
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
