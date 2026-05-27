"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import dynamic from "next/dynamic";

const HeatmapCanvas = dynamic(() => import("@/components/ui/HeatmapCanvas"), {
  ssr: false,
});

export default function StressMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setProgress(Math.min(v * 1.8, 1));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden bg-[#040808]"
      id="stress-map"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, rgba(34,197,94,0.03) 50%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-accent-green block" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              AI Stress Intelligence
            </span>
            <span className="w-8 h-px bg-accent-green block" />
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            AI-Generated{" "}
            <span className="text-gradient-green">Crop Stress Map</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Pinpointing problem zones with centimeter-level accuracy — instantly.
          </p>
        </motion.div>

        {/* Main map area */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 h-[560px] md:h-[640px] bg-[#060a06]">
          {/* HUD corners */}
          {[
            "top-4 left-4 border-l-2 border-t-2",
            "top-4 right-4 border-r-2 border-t-2",
            "bottom-4 left-4 border-l-2 border-b-2",
            "bottom-4 right-4 border-r-2 border-b-2",
          ].map((pos, i) => (
            <div key={i} className={`absolute w-8 h-8 border-accent-green/40 z-20 ${pos}`} />
          ))}

          {/* Header overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-white text-xs font-mono uppercase tracking-wider">
                AI STRESS ANALYSIS — LIVE
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-muted text-xs font-mono">
                {new Date().toLocaleTimeString()}
              </span>
              <div className="glass-dark px-3 py-1 rounded-full">
                <span className="text-accent-green text-xs font-mono">
                  {Math.round(progress * 100)}% COMPLETE
                </span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <HeatmapCanvas progress={progress} />

          {/* Legend overlay */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
            {[
              { color: "bg-accent-green", label: "Healthy (NDVI > 0.6)" },
              { color: "bg-orange-500", label: "Moderate Stress" },
              { color: "bg-red-500", label: "Critical / Pest Affected" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color} opacity-80`} />
                <span className="text-white text-[11px] font-mono">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right side analytics */}
          <div className="absolute right-6 top-20 bottom-6 z-20 flex flex-col gap-3 w-52">
            <div className="glass-dark rounded-xl p-4 border border-white/5">
              <div className="text-accent-green text-[10px] font-mono uppercase tracking-wider mb-3">
                Zone Analysis
              </div>
              {[
                { label: "Healthy", pct: 62, color: "bg-accent-green" },
                { label: "Warning", pct: 14, color: "bg-orange-500" },
                { label: "Critical", pct: 24, color: "bg-red-500" },
              ].map((z) => (
                <div key={z.label} className="mb-2">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-text-muted">{z.label}</span>
                    <span className="text-white">{z.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${z.pct}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                      className={`h-full rounded-full ${z.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-dark rounded-xl p-4 border border-white/5">
              <div className="text-accent-green text-[10px] font-mono uppercase tracking-wider mb-3">
                Precision Data
              </div>
              {[
                { label: "Accuracy", value: "99.2%" },
                { label: "Resolution", value: "2cm/px" },
                { label: "Latency", value: "1.2s" },
                { label: "Coverage", value: "120 ha" },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex justify-between py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-text-muted text-[11px]">{d.label}</span>
                  <span className="text-white text-[11px] font-mono">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-white text-xl font-semibold mb-2">
            Every red zone identified. Every hectare accounted for.
          </p>
          <p className="text-text-secondary">
            The DronAI platform generates actionable intelligence in under 90
            seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
