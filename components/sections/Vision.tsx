"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Leaf, TrendingUp, Users } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";

const stats = [
  { value: "$90B", label: "Total Addressable Market", icon: Globe },
  { value: "600M+", label: "Farms Globally", icon: Users },
  { value: "70%", label: "Pesticide Reduction", icon: Leaf },
  { value: "3.2x", label: "Yield Improvement", icon: TrendingUp },
];

const milestones = [
  { year: "2024", label: "Seed Round — $2.5M", status: "done" },
  { year: "2025", label: "Series A — $12M", status: "done" },
  { year: "2026", label: "Pan-India Expansion", status: "active" },
  { year: "2027", label: "Global Rollout — 20 countries", status: "upcoming" },
  { year: "2030", label: "1M+ Farms Served", status: "upcoming" },
];

export default function Vision() {
  return (
    <section
      id="vision"
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden bg-background"
    >
      {/* Particles */}
      <div className="absolute inset-0">
        <ParticleField count={40} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-green/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Grid */}
      <div className="absolute inset-0 grid-overlay opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="w-8 h-px bg-accent-green" />
            <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em]">
              Vision 2030
            </span>
            <span className="w-8 h-px bg-accent-green" />
          </div>
          <h2 className="text-hero font-black text-white mb-6 leading-tight">
            The Future{" "}
            <span className="text-gradient-green">Operating System</span>
            <br />
            for Agriculture
          </h2>
          <p className="text-text-secondary text-xl max-w-3xl mx-auto leading-relaxed">
            DronAI is not just a drone company. We are building the intelligent
            infrastructure for the next era of autonomous farming —
            scalable, sustainable, and accessible to every farmer on Earth.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="glass rounded-2xl p-6 border border-white/5 text-center hover:border-accent-green/20 transition-colors group"
            >
              <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-green/20 transition-colors">
                <stat.icon size={18} className="text-accent-green" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-text-muted text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-white text-2xl font-bold mb-8">
              Roadmap to Scale
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent-green via-accent-green/30 to-transparent" />

              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-6 mb-6 pl-10 relative"
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${
                      m.status === "done"
                        ? "border-accent-green bg-accent-green/20"
                        : m.status === "active"
                          ? "border-accent-green bg-accent-green/10 animate-pulse"
                          : "border-white/10 bg-transparent"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        m.status === "done"
                          ? "bg-accent-green"
                          : m.status === "active"
                            ? "bg-accent-green"
                            : "bg-white/20"
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-accent-green text-xs font-mono">
                      {m.year}
                    </span>
                    <p
                      className={`font-semibold ${
                        m.status === "upcoming"
                          ? "text-text-muted"
                          : "text-white"
                      }`}
                    >
                      {m.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Investor block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-green rounded-3xl p-8 border border-accent-green/15">
              <div className="text-accent-green text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Investment Opportunity
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                Series A — $15M
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                We are expanding our autonomous fleet, AI research division, and
                pan-India deployment. Join us in transforming global agriculture.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Proven technology with 2,400+ farm deployments",
                  "First-mover advantage in AI precision farming",
                  "Scalable SaaS + hardware business model",
                  "Strategic backing from AgriTech + Deep Tech VCs",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-2 shrink-0" />
                    <span className="text-text-secondary text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className="btn-primary inline-flex w-full justify-center"
              >
                Connect with Founders
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Sustainability badge */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🌿</div>
                <div>
                  <div className="text-white font-semibold mb-1">
                    UN SDG Aligned
                  </div>
                  <p className="text-text-muted text-sm">
                    Zero Hunger · Responsible Consumption · Climate Action
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
            Ready to transform farming?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#demo" className="btn-primary">
              Request a Demo
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-ghost">
              Talk to Founders
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
