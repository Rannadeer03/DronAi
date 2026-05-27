"use client";

import { motion } from "framer-motion";

const nodes = [
  {
    id: "drones",
    label: "DronAI Fleet",
    sub: "X1 Scanner + S2 Sprayer",
    emoji: "🚁",
    pos: { x: 50, y: 10 },
  },
  {
    id: "iot",
    label: "IoT Sensors",
    sub: "Soil + Weather + GPS",
    emoji: "📡",
    pos: { x: 10, y: 45 },
  },
  {
    id: "ai",
    label: "AI Cloud Engine",
    sub: "Computer Vision + ML",
    emoji: "🧠",
    pos: { x: 50, y: 45 },
  },
  {
    id: "analytics",
    label: "Analytics Engine",
    sub: "Stress Maps + Reports",
    emoji: "📊",
    pos: { x: 88, y: 45 },
  },
  {
    id: "app",
    label: "Farmer App",
    sub: "iOS + Android + Web",
    emoji: "📱",
    pos: { x: 20, y: 85 },
  },
  {
    id: "mission",
    label: "Mission Planner",
    sub: "Autonomous Route AI",
    emoji: "🗺️",
    pos: { x: 80, y: 85 },
  },
];

const connections = [
  ["drones", "ai"],
  ["iot", "ai"],
  ["ai", "analytics"],
  ["ai", "app"],
  ["ai", "mission"],
  ["analytics", "app"],
  ["mission", "drones"],
];

function getNodeById(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export default function TechArch() {
  return (
    <section
      id="technology"
      className="relative py-24 lg:py-32 bg-[#040808] overflow-hidden"
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
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-accent-green" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              System Architecture
            </span>
            <span className="w-8 h-px bg-accent-green" />
          </div>
          <h2 className="text-display font-black text-white mb-4">
            Full-Stack{" "}
            <span className="text-gradient-green">Intelligence</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A vertically integrated AI ecosystem — from drone hardware to cloud
            analytics to farmer mobile app.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative glass rounded-3xl border border-white/5 p-8 overflow-hidden"
        >
          {/* Background grid */}
          <div className="absolute inset-0 grid-overlay opacity-10" />

          {/* SVG connection lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {connections.map(([fromId, toId], i) => {
                const from = getNodeById(fromId);
                const to = getNodeById(toId);
                return (
                  <motion.line
                    key={i}
                    x1={from.pos.x}
                    y1={from.pos.y}
                    x2={to.pos.x}
                    y2={to.pos.y}
                    stroke="rgba(34,197,94,0.25)"
                    strokeWidth="0.3"
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  />
                );
              })}

              {/* Animated dots along lines */}
              {connections.map(([fromId, toId], i) => {
                const from = getNodeById(fromId);
                const to = getNodeById(toId);
                const midX = (from.pos.x + to.pos.x) / 2;
                const midY = (from.pos.y + to.pos.y) / 2;
                return (
                  <motion.circle
                    key={`dot-${i}`}
                    cx={midX}
                    cy={midY}
                    r="0.6"
                    fill="#22c55e"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Nodes */}
          <div
            className="relative"
            style={{ height: "clamp(400px, 60vh, 600px)" }}
          >
            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                id={`arch-${node.id}`}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + i * 0.12,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute glass-green rounded-2xl p-4 border border-accent-green/15 cursor-pointer
                           hover:border-accent-green/40 hover:bg-accent-green/10 transition-all duration-300
                           w-36 md:w-44"
                style={{
                  left: `calc(${node.pos.x}% - 72px)`,
                  top: `calc(${node.pos.y}% - 40px)`,
                }}
              >
                <div className="text-2xl mb-2">{node.emoji}</div>
                <div className="text-white text-xs font-semibold leading-tight">
                  {node.label}
                </div>
                <div className="text-text-muted text-[10px] mt-0.5 leading-tight">
                  {node.sub}
                </div>
                {/* Pulse ring */}
                <div className="absolute -inset-px rounded-2xl border border-accent-green/10 animate-pulse-slow" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {[
            "Computer Vision",
            "Edge AI",
            "Multispectral Analysis",
            "NDVI Mapping",
            "LiDAR",
            "5G Telemetry",
            "Cloud ML",
            "React Native",
            "Real-time GPS",
            "IoT Mesh",
          ].map((tech) => (
            <span
              key={tech}
              className="glass px-4 py-2 rounded-full text-xs font-medium text-text-secondary
                         border border-white/5 hover:border-accent-green/20 hover:text-white
                         transition-colors"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
