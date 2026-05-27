"use client";

import { motion } from "framer-motion";
import { Activity, Wind, CloudRain, Bug, Map, Navigation, AlertCircle, TrendingUp } from "lucide-react";

const dashboardCards = [
  {
    id: "telemetry",
    title: "Live Telemetry",
    icon: Navigation,
    span: "col-span-2",
    content: "telemetry",
  },
  {
    id: "health",
    title: "Farm Health Score",
    icon: Activity,
    span: "col-span-1",
    content: "health",
  },
  {
    id: "weather",
    title: "Weather Intelligence",
    icon: Wind,
    span: "col-span-1",
    content: "weather",
  },
  {
    id: "pest",
    title: "Pest Prediction",
    icon: Bug,
    span: "col-span-1",
    content: "pest",
  },
  {
    id: "missions",
    title: "Active Missions",
    icon: Map,
    span: "col-span-2",
    content: "missions",
  },
  {
    id: "alerts",
    title: "AI Alerts",
    icon: AlertCircle,
    span: "col-span-1",
    content: "alerts",
  },
];

function TelemetryContent() {
  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Altitude", value: "120m", unit: "AGL" },
          { label: "Speed", value: "8.4", unit: "m/s" },
          { label: "Battery", value: "73%", unit: "EST 28min" },
        ].map((d) => (
          <div key={d.label} className="bg-white/3 rounded-xl p-3">
            <div className="text-text-muted text-[10px] mb-1">{d.label}</div>
            <div className="text-white font-bold text-lg">{d.value}</div>
            <div className="text-text-muted text-[10px]">{d.unit}</div>
          </div>
        ))}
      </div>
      {/* Signal bars */}
      <div className="flex items-center gap-2">
        <span className="text-text-muted text-[10px]">GPS Signal</span>
        <div className="flex gap-0.5 items-end h-4">
          {[3, 5, 7, 9, 11].map((h, i) => (
            <div key={i} className={`w-1.5 rounded-sm ${i < 4 ? "bg-accent-green" : "bg-white/10"}`} style={{ height: `${h}px` }} />
          ))}
        </div>
        <span className="text-accent-green text-[10px]">STRONG</span>
      </div>
    </div>
  );
}

function HealthContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 mt-4">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke="#22c55e" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            whileInView={{ strokeDashoffset: 251.2 * 0.12 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-xl">88%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-accent-green text-xs font-semibold">Overall Health</div>
        <div className="text-text-muted text-[10px]">↑ 4% from last week</div>
      </div>
    </div>
  );
}

function WeatherContent() {
  return (
    <div className="mt-3 space-y-2">
      {[
        { label: "Wind", value: "12 km/h NE", icon: "💨" },
        { label: "Humidity", value: "64%", icon: "💧" },
        { label: "Rain Risk", value: "Low", icon: "🌤️" },
      ].map((w) => (
        <div key={w.label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">{w.icon}</span>
            <span className="text-text-muted text-xs">{w.label}</span>
          </div>
          <span className="text-white text-xs font-medium">{w.value}</span>
        </div>
      ))}
    </div>
  );
}

function PestContent() {
  return (
    <div className="mt-3">
      {[
        { pest: "Aphids", risk: 72, level: "HIGH" },
        { pest: "Bollworm", risk: 34, level: "MED" },
        { pest: "Whitefly", risk: 18, level: "LOW" },
      ].map((p) => (
        <div key={p.pest} className="mb-3">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text-muted">{p.pest}</span>
            <span className={p.risk > 60 ? "text-red-400" : p.risk > 30 ? "text-orange-400" : "text-accent-green"}>
              {p.level}
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${p.risk > 60 ? "bg-red-500" : p.risk > 30 ? "bg-orange-500" : "bg-accent-green"}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${p.risk}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MissionsContent() {
  const missions = [
    { id: "M-0847", drone: "DronAI-X1", status: "SCANNING", area: "Field A — 42 ha", progress: 78 },
    { id: "M-0848", drone: "DronAI-S2", status: "SPRAYING", area: "Field B — 18 ha", progress: 45 },
    { id: "M-0849", drone: "DronAI-X1", status: "QUEUED", area: "Field C — 60 ha", progress: 0 },
  ];
  return (
    <div className="mt-3 space-y-3">
      {missions.map((m) => (
        <div key={m.id} className="bg-white/3 rounded-xl p-3 flex items-center gap-4">
          <div className="shrink-0">
            <div className={`w-2 h-2 rounded-full ${m.status === "SCANNING" ? "bg-accent-green animate-pulse" : m.status === "SPRAYING" ? "bg-blue-400 animate-pulse" : "bg-white/20"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-xs font-medium">{m.drone}</span>
              <span className={`text-[10px] font-mono ${m.status === "SCANNING" ? "text-accent-green" : m.status === "SPRAYING" ? "text-blue-400" : "text-text-muted"}`}>
                {m.status}
              </span>
            </div>
            <div className="text-text-muted text-[11px] mb-2">{m.area}</div>
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent-green rounded-full" style={{ width: `${m.progress}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlertsContent() {
  return (
    <div className="mt-3 space-y-2">
      {[
        { msg: "Aphid risk elevated in Field A", time: "2m ago", level: "warn" },
        { msg: "Mission M-0847 80% complete", time: "5m ago", level: "info" },
        { msg: "Weather window optimal", time: "12m ago", level: "good" },
      ].map((a, i) => (
        <div key={i} className={`rounded-lg p-3 text-[11px] border ${
          a.level === "warn" ? "bg-red-500/10 border-red-500/20 text-red-300" :
          a.level === "good" ? "bg-accent-green/10 border-accent-green/20 text-accent-green" :
          "bg-blue-500/10 border-blue-500/20 text-blue-300"
        }`}>
          <div className="font-medium mb-0.5">{a.msg}</div>
          <div className="opacity-60">{a.time}</div>
        </div>
      ))}
    </div>
  );
}

const contentComponents: Record<string, React.FC> = {
  telemetry: TelemetryContent,
  health: HealthContent,
  weather: WeatherContent,
  pest: PestContent,
  missions: MissionsContent,
  alerts: AlertsContent,
};

export default function Dashboard() {
  return (
    <section id="dashboard" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent-green/4 rounded-full blur-[150px] pointer-events-none" />

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
            <span className="w-8 h-px bg-accent-green" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              Control Intelligence
            </span>
          </div>
          <h2 className="text-display font-black text-white mb-4 leading-tight">
            Ecosystem{" "}
            <span className="text-gradient-green">Dashboard</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl">
            One unified command center for your entire autonomous farming
            operation. Real-time intelligence at your fingertips.
          </p>
        </motion.div>

        {/* Dashboard HUD frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl border border-white/5 overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-accent-green/70" />
              </div>
              <span className="text-text-muted text-xs font-mono">DronAI Command Center v2.4</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
              <span className="text-accent-green text-[10px] font-mono">LIVE</span>
            </div>
          </div>

          {/* Dashboard grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardCards.map((card, i) => {
              const ContentComponent = contentComponents[card.content];
              return (
                <motion.div
                  key={card.id}
                  id={`dashboard-${card.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className={`glass-dark rounded-2xl p-4 border border-white/5 hover:border-accent-green/15 transition-colors ${
                    card.id === "telemetry" || card.id === "missions" ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-green/10 flex items-center justify-center">
                      <card.icon size={14} className="text-accent-green" />
                    </div>
                    <span className="text-text-secondary text-xs font-semibold uppercase tracking-wide">
                      {card.title}
                    </span>
                  </div>
                  <ContentComponent />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
