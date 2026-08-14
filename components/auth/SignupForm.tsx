"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import PasswordInput from "./PasswordInput";
import { cn } from "@/lib/utils";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupForm() {
  const { signup, error, clearError } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Full name is required.";

    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      errors.password = "Include at least one uppercase letter and one number.";

    if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
    else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup({ name, email, password });
      router.push("/dashboard");
    } catch {
      // error surfaced via auth context
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl px-4 py-3 overflow-hidden"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label htmlFor="name" className="block text-xs text-text-secondary mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Cooper"
            autoComplete="name"
            className={cn(
              "w-full bg-white/[0.03] border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-text-muted",
              "focus:outline-none focus:ring-1 transition-colors",
              fieldErrors.name
                ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/30"
                : "border-white/10 focus:border-accent-green/50 focus:ring-accent-green/30"
            )}
          />
        </div>
        {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs text-text-secondary mb-1.5">
          Email
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className={cn(
              "w-full bg-white/[0.03] border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-text-muted",
              "focus:outline-none focus:ring-1 transition-colors",
              fieldErrors.email
                ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/30"
                : "border-white/10 focus:border-accent-green/50 focus:ring-accent-green/30"
            )}
          />
        </div>
        {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-xs text-text-secondary mb-1.5">
          Password
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        {!fieldErrors.password && (
          <p className="mt-1.5 text-[11px] text-text-muted">
            Min. 8 characters, one uppercase letter, one number.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs text-text-secondary mb-1.5">
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating account…
          </>
        ) : (
          <>
            Create Account
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="text-center text-text-secondary text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-green hover:text-green-400 font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
}
