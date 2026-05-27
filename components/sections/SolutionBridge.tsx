"use client";

import { motion } from "framer-motion";

export default function SolutionBridge() {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Vertical connector line from Problem → Solution */}
      <div className="absolute top-0 left-1/2 w-px h-24 bg-gradient-to-b from-transparent via-accent-green/30 to-transparent -translate-x-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-green rounded-3xl p-12 md:p-16 border border-accent-green/15 relative overflow-hidden"
        >
          {/* Grid inside card */}
          <div className="absolute inset-0 grid-overlay opacity-20" />

          {/* Corner brackets */}
          {[
            "top-4 left-4 border-l-2 border-t-2",
            "top-4 right-4 border-r-2 border-t-2",
            "bottom-4 left-4 border-l-2 border-b-2",
            "bottom-4 right-4 border-r-2 border-b-2",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-6 h-6 border-accent-green/40 ${cls}`} />
          ))}

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-px bg-accent-green" />
              <span className="text-accent-green text-xs font-semibold uppercase tracking-[0.25em]">
                The DronAI Solution
              </span>
              <div className="w-8 h-px bg-accent-green" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="text-4xl md:text-5xl font-black text-white leading-tight mb-6"
            >
              What if your farm could{" "}
              <span className="text-gradient-green">see itself?</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              DronAI gives your crops eyes, intelligence, and autonomous
              response — transforming guesswork into precision, and loss into
              yield.
            </motion.p>

            {/* Animated flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-10"
            >
              {[
                { label: "Scan", emoji: "🛸" },
                { label: "→", emoji: null },
                { label: "Analyze", emoji: "🧠" },
                { label: "→", emoji: null },
                { label: "Map", emoji: "🗺️" },
                { label: "→", emoji: null },
                { label: "Respond", emoji: "🎯" },
              ].map((item, i) =>
                item.emoji ? (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 glass-dark rounded-xl px-4 py-3 border border-white/5"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-accent-green text-xs font-bold tracking-widest">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <span key={i} className="text-accent-green/40 text-xl font-bold">
                    {item.label}
                  </span>
                )
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Vertical connector line to next section */}
      <div className="absolute bottom-0 left-1/2 w-px h-24 bg-gradient-to-b from-accent-green/30 via-transparent to-transparent -translate-x-1/2" />
    </section>
  );
}
