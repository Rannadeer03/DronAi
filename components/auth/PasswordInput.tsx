"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  error,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full bg-white/[0.03] border rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-text-muted",
          "focus:outline-none focus:ring-1 transition-colors",
          error
            ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/30"
            : "border-white/10 focus:border-accent-green/50 focus:ring-accent-green/30"
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
