"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const metrics = [
  { value: 70, suffix: "%", label: "Pesticide Reduction", color: "text-accent-green" },
  { value: 3.2, suffix: "x", label: "Faster Response", color: "text-accent-green", decimals: 1 },
  { value: 99.2, suffix: "%", label: "Targeting Accuracy", color: "text-accent-green", decimals: 1 },
  { value: 45, suffix: "%", label: "Cost Savings", color: "text-accent-green" },
];

const sprayZones = [
  { x: 32, y: 8, w: 20, h: 25, type: "stressed" },
  { x: 45, y: 30, w: 30, h: 35, type: "stressed" },
  { x: 55, y: 72, w: 40, h: 23, type: "stressed" },
];

export default function PrecisionSpray() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const pathProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-40 overflow-hidden bg-[#040808]"
      id="solution"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-accent-green" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              Precision Response
            </span>
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            Targeted{" "}
            <span className="text-gradient-green">Precision Spraying</span>
            <br />
            Only Where It Matters
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl">
            The DronAI-S2 flies autonomously to each identified stress zone,
            applying treatment with surgical precision — completely eliminating
            wasteful blanket spraying.
          </p>
        </motion.div>

        {/* Full story loop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Spray map visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass rounded-3xl overflow-hidden border border-white/5 h-[480px] relative bg-[#060a06]">
              {/* HUD header */}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10 flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-accent-green uppercase tracking-wider">
                    SPRAY MISSION ACTIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  Mission ID: DRN-S2-2024-0847
                </span>
              </div>

              {/* Farm grid */}
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                {/* Background */}
                <rect width="100" height="100" fill="#060a06" />

                {/* Grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <g key={i}>
                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(34,197,94,0.06)" strokeWidth="0.3" />
                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(34,197,94,0.06)" strokeWidth="0.3" />
                  </g>
                ))}

                {/* Farm field zones (healthy - green) */}
                {[
                  [5, 5, 25, 30], [60, 5, 40, 20], [5, 42, 35, 25], [80, 28, 17, 40], [5, 72, 45, 23]
                ].map(([x, y, w, h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.3)" strokeWidth="0.3" rx="1"/>
                ))}

                {/* Stressed zones with spray overlay */}
                {sprayZones.map((z, i) => (
                  <g key={i}>
                    <motion.rect
                      x={z.x} y={z.y} width={z.w} height={z.h}
                      fill="rgba(239,68,68,0.35)"
                      stroke="rgba(239,68,68,0.6)"
                      strokeWidth="0.4"
                      rx="1"
                    />
                    {/* Spray coverage animation */}
                    <motion.rect
                      x={z.x} y={z.y} width={z.w} height={z.h}
                      fill="rgba(34,197,94,0.25)"
                      rx="1"
                      initial={{ scaleY: 0, originY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.4, duration: 1.2, ease: "easeInOut" }}
                      style={{ transformBox: "fill-box", transformOrigin: "top" }}
                    />
                    {/* Zone label */}
                    <text x={z.x + 1} y={z.y + 5} fontSize="2.5" fill="rgba(239,68,68,0.9)" fontFamily="monospace">TARGETED</text>
                  </g>
                ))}

                {/* Drone flight path */}
                <motion.path
                  d="M 50 50 L 42 20 L 42 20 L 60 45 L 75 45 L 75 95"
                  stroke="#22c55e"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />

                {/* Drone position */}
                <motion.g
                  initial={{ x: 0, y: 0 }}
                  whileInView={{ x: [0, -8, 18, 25], y: [0, -30, -5, 45] }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                >
                  <circle cx="50" cy="50" r="2.5" fill="#22c55e" opacity="0.9" />
                  <circle cx="50" cy="50" r="4" stroke="#22c55e" strokeWidth="0.5" fill="none" opacity="0.6" />
                </motion.g>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
                {[
                  { color: "bg-accent-green/60", label: "Healthy (no spray)" },
                  { color: "bg-red-500/60", label: "Targeted Zone" },
                  { color: "bg-accent-green", label: "Treatment Applied" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className={`w-3 h-2 rounded-sm ${l.color}`} />
                    <span className="text-[10px] font-mono text-white/70">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: story loop + metrics */}
          <div className="flex flex-col gap-6">
            {/* Story loop */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-white font-semibold mb-6">
                The Complete Intelligence Loop
              </h3>
              <div className="flex flex-col gap-0">
                {[
                  { icon: "🔍", label: "SCAN", desc: "DronAI-X1 surveys the entire farm" },
                  { icon: "🧠", label: "ANALYZE", desc: "AI processes multispectral + thermal data" },
                  { icon: "🗺️", label: "MAP", desc: "Stress zones identified with GPS precision" },
                  { icon: "🎯", label: "RESPOND", desc: "DronAI-S2 treats only affected areas" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-start gap-4 relative">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-lg">
                        {step.icon}
                      </div>
                      {i < 3 && <div className="w-px h-6 bg-accent-green/20 my-1" />}
                    </div>
                    <div className="pt-1.5 pb-4">
                      <span className="text-accent-green text-xs font-bold tracking-widest">
                        {step.label}
                      </span>
                      <p className="text-text-secondary text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="glass rounded-2xl p-5 border border-white/5 text-center"
                >
                  <div className={`text-3xl font-black ${m.color} mb-1`}>
                    <AnimatedCounter
                      end={m.value}
                      suffix={m.suffix}
                      decimals={(m as { decimals?: number }).decimals || 0}
                    />
                  </div>
                  <div className="text-text-muted text-xs">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
