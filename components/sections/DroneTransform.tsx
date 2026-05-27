"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Zap, Target, Settings, CheckCircle2 } from "lucide-react";

const phases = [
  {
    id: 1,
    icon: Target,
    title: "Mission Upload",
    desc: "AI stress map coordinates uploaded to the DronAI-S2 spray system.",
    step: "01",
  },
  {
    id: 2,
    icon: Settings,
    title: "System Configuration",
    desc: "Spray tanks, nozzle pressure, and chemical ratios auto-calibrated.",
    step: "02",
  },
  {
    id: 3,
    icon: Zap,
    title: "AI Route Generation",
    desc: "Precision flight path computed targeting only affected zones.",
    step: "03",
  },
  {
    id: 4,
    icon: CheckCircle2,
    title: "Response Activated",
    desc: "Autonomous deployment initiated. Zero human intervention required.",
    step: "04",
  },
];

export default function DroneTransform() {
  const ref = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const droneOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const droneScale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-40 overflow-hidden bg-background"
      id="transform"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-accent-green block" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              Response System
            </span>
            <span className="w-8 h-px bg-accent-green block" />
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            Precision Response{" "}
            <br />
            <span className="text-gradient-green">System Activated</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Once the stress map is complete, DronAI autonomously deploys its
            precision sprayer — targeting only the affected zones.
          </p>
        </motion.div>

        {/* Main transformation visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: drone transformation visual */}
          <motion.div
            style={{ opacity: droneOpacity, scale: droneScale }}
            className="relative"
          >
            {/* The transformation card */}
            <div className="relative glass rounded-3xl p-8 border border-white/5 overflow-hidden h-96">
              {/* Background scan effect */}
              <div className="absolute inset-0 grid-overlay opacity-30" />

              {/* Drone SVG illustration */}
              <div className="relative h-full flex items-center justify-center">
                {/* Sprayer drone SVG */}
                <svg viewBox="0 0 320 200" className="w-full max-w-xs drone-glow" fill="none">
                  {/* Body */}
                  <rect x="110" y="80" width="100" height="30" rx="8" fill="#1a1a1a" stroke="#22c55e" strokeWidth="1"/>
                  {/* Tank */}
                  <rect x="125" y="112" width="70" height="40" rx="6" fill="#0d1f0d" stroke="#22c55e" strokeWidth="0.5"/>
                  <text x="148" y="137" fontSize="9" fill="#22c55e" fontFamily="monospace">SPRAY</text>
                  {/* Arms */}
                  <line x1="110" y1="92" x2="55" y2="70" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="210" y1="92" x2="265" y2="70" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="120" y1="100" x2="55" y2="120" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="200" y1="100" x2="265" y2="120" stroke="#333" strokeWidth="6" strokeLinecap="round"/>
                  {/* Motors */}
                  {[[48, 68],[258, 68],[48, 118],[258, 118]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="12" fill="#111" stroke="#22c55e" strokeWidth="1"/>
                  ))}
                  {/* Spray nozzles */}
                  {[145, 165, 185].map((x, i) => (
                    <g key={i}>
                      <rect x={x} y={150} width="6" height="8" rx="2" fill="#22c55e" opacity="0.8"/>
                      {/* Spray animation lines */}
                      <motion.line
                        x1={x + 3} y1={158} x2={x + 3} y2={175}
                        stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    </g>
                  ))}
                  {/* AI targeting reticle */}
                  <circle cx="160" cy="95" r="15" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.6"/>
                  <circle cx="160" cy="95" r="5" stroke="#22c55e" strokeWidth="1" opacity="0.8"/>
                  {/* LED lights */}
                  {[[48, 68, "#22c55e"], [258, 68, "#22c55e"], [48, 118, "#ef4444"], [258, 118, "#ef4444"]].map(([cx, cy, col], i) => (
                    <motion.circle
                      key={i}
                      cx={cx as number} cy={cy as number} r="4"
                      fill={col as string}
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </svg>

                {/* Status overlay */}
                <div className="absolute top-4 left-4 glass-dark rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
                    <span className="text-accent-green text-[10px] font-mono uppercase">
                      DronAI-S2 Online
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-3 py-2">
                  <span className="text-white text-[10px] font-mono">
                    Targeting: 24 Zones
                  </span>
                </div>
              </div>
            </div>

            {/* Glow under drone */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-accent-green/15 rounded-full blur-2xl" />
          </motion.div>

          {/* Right: phase steps */}
          <div className="flex flex-col gap-4">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActivePhase(i)}
                className={`glass rounded-2xl p-6 border cursor-pointer transition-all duration-300 ${
                  activePhase === i
                    ? "border-accent-green/30 bg-accent-green/5"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-text-muted font-mono text-xs shrink-0 mt-1">
                    {phase.step}
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activePhase === i
                        ? "bg-accent-green/20 text-accent-green"
                        : "bg-white/5 text-text-secondary"
                    }`}
                  >
                    <phase.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
