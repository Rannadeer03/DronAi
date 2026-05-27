"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const HeatmapCanvas = dynamic(() => import("@/components/ui/HeatmapCanvas"), {
  ssr: false,
});

const scanLabels = [
  { x: "8%", y: "12%", label: "NDVI: 0.72", type: "green", delay: 0.3 },
  { x: "35%", y: "8%", label: "Pest Risk: HIGH", type: "red", delay: 0.6 },
  { x: "60%", y: "10%", label: "NDVI: 0.81", type: "green", delay: 0.4 },
  { x: "8%", y: "48%", label: "Water Stress: MED", type: "orange", delay: 0.8 },
  { x: "50%", y: "38%", label: "N-Deficiency", type: "red", delay: 1.0 },
  { x: "78%", y: "35%", label: "Temp: 38.2°C", type: "orange", delay: 0.7 },
  { x: "15%", y: "80%", label: "Crop Health: 94%", type: "green", delay: 0.5 },
  { x: "65%", y: "78%", label: "Critical Zone", type: "red", delay: 0.9 },
];

const colorMap: Record<string, string> = {
  green: "border-accent-green/40 text-accent-green bg-accent-green/10",
  red: "border-red-500/40 text-red-400 bg-red-500/10",
  orange: "border-orange-500/40 text-orange-400 bg-orange-500/10",
};

export default function FarmScanning() {
  const ref = useRef<HTMLDivElement>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScanProgress(Math.min(v * 2, 1));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const labelsVisible = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <section
      id="scanning"
      ref={ref}
      className="relative py-24 lg:py-32 bg-background overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-accent-green block" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              Live Intelligence
            </span>
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            Farm Scanning{" "}
            <span className="text-gradient-green">Experience</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl">
            The DronAI-X1 sweeps your entire farmland, building a real-time
            intelligence map with centimeter precision.
          </p>
        </motion.div>

        {/* Main scanning visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap canvas — large */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden border border-accent-green/10 h-[500px] md:h-[580px]">
              {/* Scan line animation */}
              {scanProgress < 1 && (
                <div
                  className="absolute left-0 right-0 z-20 pointer-events-none"
                  style={{
                    top: `${scanProgress * 100}%`,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(34,197,94,0.8), transparent)",
                    boxShadow: "0 0 20px rgba(34,197,94,0.5)",
                    transition: "top 0.05s linear",
                  }}
                />
              )}

              {/* Floating labels */}
              {scanLabels.map((label, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    scanProgress > label.delay
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute z-20 px-2 py-1 rounded-md text-[10px] font-mono font-semibold border backdrop-blur-sm ${colorMap[label.type]}`}
                  style={{ left: label.x, top: label.y }}
                >
                  {label.label}
                </motion.div>
              ))}

              {/* HUD corners */}
              {[
                "top-2 left-2 border-l border-t",
                "top-2 right-2 border-r border-t",
                "bottom-2 left-2 border-l border-b",
                "bottom-2 right-2 border-r border-b",
              ].map((corner, i) => (
                <div
                  key={i}
                  className={`absolute w-6 h-6 border-accent-green/50 ${corner}`}
                />
              ))}

              {/* Status indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 glass-dark px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-accent-green">
                  SCANNING {Math.round(scanProgress * 100)}%
                </span>
              </div>

              <HeatmapCanvas progress={scanProgress} />
            </div>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4">
            {/* Live metrics */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                <span className="text-accent-green text-xs font-semibold uppercase tracking-wider">
                  Live Analysis
                </span>
              </div>
              {[
                {
                  label: "Area Scanned",
                  value: `${Math.round(scanProgress * 120)} ha`,
                  color: "text-white",
                },
                {
                  label: "Healthy Zones",
                  value: "62%",
                  color: "text-accent-green",
                },
                {
                  label: "Stressed Zones",
                  value: "24%",
                  color: "text-red-400",
                },
                {
                  label: "Warning Zones",
                  value: "14%",
                  color: "text-orange-400",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-text-muted text-sm">
                    {metric.label}
                  </span>
                  <span className={`font-semibold text-sm ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Sensor readings */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h4 className="text-white text-sm font-semibold mb-4">
                Sensor Readings
              </h4>
              {[
                { label: "NDVI Index", value: 0.72, max: 1, color: "#22c55e" },
                {
                  label: "Soil Moisture",
                  value: 0.45,
                  max: 1,
                  color: "#3b82f6",
                },
                {
                  label: "Pest Probability",
                  value: 0.31,
                  max: 1,
                  color: "#ef4444",
                },
                {
                  label: "Thermal Index",
                  value: 0.68,
                  max: 1,
                  color: "#f97316",
                },
              ].map((sensor) => (
                <div key={sensor.label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-text-muted text-xs">
                      {sensor.label}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: sensor.color }}
                    >
                      {(sensor.value * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sensor.value * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: sensor.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            <div className="glass rounded-2xl p-4 border border-accent-green/10 font-mono">
              <div className="text-accent-green text-[10px] tracking-wider mb-2">
                GPS COORDINATES
              </div>
              <div className="text-white text-xs">28.7041° N, 77.1025° E</div>
              <div className="text-text-muted text-[10px] mt-1">
                Altitude: 120m AGL | Speed: 8m/s
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
