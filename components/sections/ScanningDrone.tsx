"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { Cpu, Eye, Layers, Radio, Zap, Shield, Wind } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DroneModel = dynamic(() => import("@/components/ui/DroneModel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border border-accent-green/30 border-t-accent-green rounded-full animate-spin" />
        <span className="text-accent-green text-xs font-mono tracking-wider">LOADING DRONE MODEL</span>
      </div>
    </div>
  ),
});

const sensors = [
  {
    icon: Eye,
    label: "Multispectral Camera",
    desc: "6-band · 50MP · 2cm/px GSD",
    position: { top: "18%", right: "6%" },
    lineDir: "left",
  },
  {
    icon: Cpu,
    label: "AI Edge Processor",
    desc: "NVIDIA Jetson · Real-time inference",
    position: { top: "18%", left: "6%" },
    lineDir: "right",
  },
  {
    icon: Layers,
    label: "FLIR Thermal",
    desc: "320×256 · 30Hz · ±0.1°C",
    position: { bottom: "28%", right: "6%" },
    lineDir: "left",
  },
  {
    icon: Radio,
    label: "LiDAR + Soil Probe",
    desc: "SLAM mapping · NPK sensing",
    position: { bottom: "28%", left: "6%" },
    lineDir: "right",
  },
];

const specs = [
  { label: "Flight Time", value: "52 min", icon: Wind },
  { label: "Coverage/flight", value: "120 ha", icon: Shield },
  { label: "GSD Resolution", value: "2 cm/px", icon: Eye },
  { label: "AI Accuracy", value: "99.2%", icon: Zap },
];

export default function ScanningDrone() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [labelsVisible, setLabelsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.92, 1]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY / 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => setLabelsVisible(true),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative min-h-screen py-24 overflow-hidden bg-background"
    >
      {/* Ambient green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 65%)" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-15" />

      {/* Subtle horizontal scan line */}
      <div className="scan-line opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-accent-green" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.22em]">
              Flagship Product
            </span>
            <div className="w-8 h-px bg-accent-green" />
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            Meet{" "}
            <span className="text-gradient-green">DronAI-X1</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            An autonomous scanning intelligence platform engineered for
            precision agriculture at planetary scale.
          </p>
        </motion.div>

        {/* ── 3D Drone Showcase ── */}
        <div className="relative h-[65vh] md:h-[72vh] my-10">

          {/* HUD sensor labels */}
          {sensors.map((sensor, i) => (
            <motion.div
              key={sensor.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={labelsVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ delay: 0.6 + i * 0.18, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-30 glass-dark rounded-xl px-3 py-2 border border-accent-green/20
                         flex items-center gap-2 max-w-[180px] md:max-w-[210px]"
              style={sensor.position}
            >
              <div className="w-7 h-7 rounded-lg bg-accent-green/15 flex items-center justify-center shrink-0">
                <sensor.icon size={13} className="text-accent-green" />
              </div>
              <div>
                <div className="text-white text-[11px] font-semibold leading-tight">
                  {sensor.label}
                </div>
                <div className="text-text-muted text-[10px] leading-tight mt-0.5">
                  {sensor.desc}
                </div>
              </div>
              {/* Animated pulse dot */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            </motion.div>
          ))}

          {/* Drone 3D canvas */}
          <motion.div
            ref={droneRef}
            style={{ y, opacity, scale }}
            className="absolute inset-0 z-10"
          >
            <Suspense fallback={null}>
              <DroneModel scrollY={scrollY} />
            </Suspense>
          </motion.div>

          {/* Ground reflection glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-accent-green/8 rounded-full blur-3xl pointer-events-none" />

          {/* HUD ring decorations */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-96 h-96 rounded-full border border-accent-green/6"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute w-72 h-72 rounded-full border border-accent-green/4"
              style={{ borderStyle: "dashed" }}
            />
          </div>

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-8 h-8">
              <div className="absolute top-0 left-1/2 w-px h-3 bg-accent-green/30 -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-px h-3 bg-accent-green/30 -translate-x-1/2" />
              <div className="absolute left-0 top-1/2 w-3 h-px bg-accent-green/30 -translate-y-1/2" />
              <div className="absolute right-0 top-1/2 w-3 h-px bg-accent-green/30 -translate-y-1/2" />
            </div>
          </div>

          {/* Top HUD status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={labelsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 glass-dark px-4 py-2 rounded-full
                       flex items-center gap-3 border border-white/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
            </span>
            <span className="text-[10px] font-mono text-accent-green uppercase tracking-widest">
              DronAI-X1 · Systems Online
            </span>
          </motion.div>
        </div>

        {/* ── Specs Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ scale: 1.03, borderColor: "rgba(34,197,94,0.3)" }}
              className="glass rounded-xl p-5 text-center border border-white/5 cursor-default
                         transition-all duration-300 hover:bg-accent-green/3"
            >
              <div className="w-8 h-8 bg-accent-green/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <spec.icon size={15} className="text-accent-green" />
              </div>
              <div className="text-2xl font-black text-white mb-1">
                {spec.value}
              </div>
              <div className="text-accent-green text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                {spec.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Real-time intelligence callout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mt-20"
        >
          <div className="inline-block glass-green rounded-2xl px-8 py-6 border border-accent-green/15">
            <p className="text-white text-xl font-semibold mb-1">
              Real-time farm intelligence.
            </p>
            <p className="text-text-secondary text-sm">
              From takeoff to actionable insight in under 90 seconds.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
