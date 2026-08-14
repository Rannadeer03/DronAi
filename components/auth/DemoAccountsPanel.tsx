"use client";

import { DEMO_ACCOUNTS_TABLE } from "@/lib/auth/demo-users";
import { Sparkles } from "lucide-react";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  pilot: "Pilot",
  user: "User",
};

export default function DemoAccountsPanel({
  onSelect,
}: {
  onSelect: (email: string, password: string) => void;
}) {
  return (
    <div className="glass rounded-2xl p-4 border border-accent-green/10">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-accent-green" />
        <span className="text-white text-xs font-semibold uppercase tracking-wide">
          Demo Accounts
        </span>
      </div>
      <div className="space-y-1.5">
        {DEMO_ACCOUNTS_TABLE.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelect(acc.email, acc.password)}
            className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 bg-white/[0.02] hover:bg-accent-green/5 border border-transparent hover:border-accent-green/20 transition-colors text-left group"
          >
            <span className="text-accent-green text-[10px] font-mono font-semibold uppercase tracking-wide shrink-0">
              {roleLabel[acc.role]}
            </span>
            <span className="text-text-secondary text-xs truncate flex-1 group-hover:text-white transition-colors">
              {acc.email}
            </span>
            <span className="text-text-muted text-[10px] font-mono shrink-0">
              {acc.password}
            </span>
          </button>
        ))}
      </div>
      <p className="text-text-muted text-[10px] mt-3 leading-relaxed">
        Click a row to autofill. These are real signed-in accounts — treat the passwords as public.
      </p>
    </div>
  );
}
