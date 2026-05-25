"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "./auth-shell";
import { useAppStore } from "@/store/app-store";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type FormData = z.infer<typeof schema>;

const inputClass = "w-full px-3.5 py-3 text-sm border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-all";

const FIELDS = [
  { key: "name" as const, label: "Full name", type: "text", placeholder: "Maya Chen" },
  { key: "email" as const, label: "Work email", type: "email", placeholder: "you@company.com" },
  { key: "password" as const, label: "Password", type: "password", placeholder: "At least 6 characters" },
];

export default function SignupForm() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    login(data.email);
    router.push("/verify-email");
  };

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Free forever for up to 3 people. No credit card required."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            Sign in
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
          Sign up with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
          <span className="text-xs text-gray-400 dark:text-white/25 flex-shrink-0">or with email</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/50 mb-1.5 block uppercase tracking-wide">
                {field.label}
              </label>
              {field.key === "password" ? (
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPwd ? "text" : "password"}
                    placeholder={field.placeholder}
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
              ) : (
                <input
                  {...register(field.key)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}
              {errors[field.key] && (
                <p className="text-xs text-red-500 mt-1.5">{errors[field.key]?.message}</p>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-400 dark:text-white/25 leading-relaxed">
            By signing up you agree to our{" "}
            <span className="text-gray-600 dark:text-white/50 underline cursor-pointer hover:text-orange-500 transition-colors">Terms</span>{" "}
            and{" "}
            <span className="text-gray-600 dark:text-white/50 underline cursor-pointer hover:text-orange-500 transition-colors">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 mt-1"
          >
            Create workspace
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
