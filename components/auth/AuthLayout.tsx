"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Radar, Satellite } from "lucide-react";

const highlights = [
  { icon: Radar, text: "Real-time drone telemetry & mission control" },
  { icon: Satellite, text: "AI-driven crop stress & pest intelligence" },
  { icon: ShieldCheck, text: "Role-based access for teams of any size" },
];

export default function AuthLayout({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden grid lg:grid-cols-2">
      {/* Ambient bg */}
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-accent-green/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/5">
        <Link href="/" className="flex items-center gap-2 group w-fit">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-accent-green/20 rounded-lg animate-pulse-slow" />
            <div className="relative w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" fill="currentColor" />
            </div>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Dron<span className="text-accent-green">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <h1 className="text-display font-black text-white leading-tight mb-6">
            Engineering{" "}
            <span className="text-gradient-green">autonomous farming</span>{" "}
            intelligence.
          </h1>
          <div className="space-y-4 mt-10">
            {highlights.map((h, i) => (
              <motion.div
                key={h.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="flex items-center gap-3 glass rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                  <h.icon size={15} className="text-accent-green" />
                </div>
                <span className="text-text-secondary text-sm">{h.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-text-muted text-xs relative z-10">
          © 2025 DronAI Technologies. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center px-6 py-16 sm:px-12">
        {/* Mobile logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="currentColor" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Dron<span className="text-accent-green">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <span className="section-label">{eyebrow}</span>
            <h2 className="text-title font-bold text-white mb-2">{title}</h2>
            <p className="text-text-secondary text-sm">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </main>
  );
}
