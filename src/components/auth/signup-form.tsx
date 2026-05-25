"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "./auth-shell";
import { useAppStore } from "@/store/app-store";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);

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
      footer={<span>Already have an account? <Link href="/login" className="text-orange-500 font-medium hover:underline">Sign in</Link></span>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {(["name", "email", "password"] as const).map((field) => (
          <div key={field}>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block capitalize">
              {field === "name" ? "Full name" : field === "email" ? "Work email" : "Password"}
            </label>
            <input
              {...register(field)}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              placeholder={field === "name" ? "Maya Chen" : field === "email" ? "you@company.com" : "At least 6 characters"}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors"
            />
            {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]?.message}</p>}
          </div>
        ))}
        <p className="text-xs text-gray-400 leading-relaxed">
          By signing up you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
        <button type="submit"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors mt-1">
          Create workspace <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </AuthShell>
  );
}
