"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Zap } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/dashboard");
    }
  }, [status, router]);

  if (status === "idle" || status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 border border-accent-green/30 flex items-center justify-center animate-pulse-slow">
            <Zap className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-text-muted text-xs font-mono uppercase tracking-[0.2em]">
            Verifying session…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
