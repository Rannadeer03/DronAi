"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  pilot: "Pilot",
  user: "User",
};

export default function DashboardShell({
  navItems,
  children,
}: {
  navItems: DashboardNavItem[];
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 bg-surface/60 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 px-6 h-20 border-b border-white/5">
          <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="currentColor" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Dron<span className="text-accent-green">AI</span>
          </span>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                pathname === item.href
                  ? "text-white bg-white/5"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
              <span className="text-white font-bold text-lg">
                Dron<span className="text-accent-green">AI</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-white text-base"
                  >
                    <item.icon size={18} className="text-accent-green" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 text-base mt-4"
              >
                <LogOut size={18} />
                Log out
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 h-16 lg:h-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <span className="hidden lg:block text-text-secondary text-sm">
            Welcome back, <span className="text-white font-medium">{user?.name}</span>
          </span>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wide",
                "bg-accent-green/10 text-accent-green border border-accent-green/20"
              )}
            >
              {user ? ROLE_LABELS[user.role] : ""}
            </span>
            <div className="w-9 h-9 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green text-xs font-bold">
              {user?.name?.charAt(0) ?? "?"}
            </div>
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center gap-2 text-text-secondary hover:text-red-400 text-sm transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main className="px-6 lg:px-10 py-8 lg:py-12 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
