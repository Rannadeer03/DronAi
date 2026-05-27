"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { AlertTriangle, Droplets, Bug, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Bug,
    stat: 30,
    suffix: "%",
    label: "Crop Loss",
    description:
      "Delayed pest detection causes massive harvest failures every season.",
    color: "red",
  },
  {
    icon: Droplets,
    stat: 2.4,
    suffix: "x",
    label: "Pesticide Overuse",
    description:
      "Blanket chemical spraying damages soil health and ecosystem balance.",
    color: "orange",
  },
  {
    icon: TrendingDown,
    stat: 40,
    suffix: "%",
    label: "Water Waste",
    description:
      "Inefficient irrigation driven by guesswork, not precision data.",
    color: "yellow",
  },
  {
    icon: AlertTriangle,
    stat: 800,
    suffix: "Bn",
    label: "Annual Loss (USD)",
    description:
      "Global agriculture loses hundreds of billions yearly to preventable crop diseases.",
    color: "red",
  },
];

const colorMap: Record<string, string> = {
  red: "text-red-stress border-red-500/20 bg-red-500/5",
  orange: "text-orange-warn border-orange-500/20 bg-orange-500/5",
  yellow: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",
};

const iconColorMap: Record<string, string> = {
  red: "bg-red-500/10 text-red-400",
  orange: "bg-orange-500/10 text-orange-400",
  yellow: "bg-yellow-500/10 text-yellow-400",
};

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="problem"
      className="relative py-32 lg:py-48 bg-background overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="section-label text-red-400 mb-6">
            <span className="w-8 h-px bg-red-400 block" />
            The Problem
          </div>
          <h2 className="text-display font-black text-white max-w-3xl leading-tight mb-6">
            The Silent Crisis{" "}
            <span className="text-red-stress">Destroying</span>
            <br />
            Global Agriculture
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
            Every season, farmers battle invisible enemies — pest infestations,
            crop diseases, and resource waste — with no real-time intelligence to
            guide their response.
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.label}
              variants={cardVariants}
              className={`glass rounded-2xl p-6 border ${colorMap[problem.color]} hover:scale-[1.02] transition-transform duration-300`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${iconColorMap[problem.color]}`}
              >
                <problem.icon size={20} />
              </div>
              <div
                className={`text-4xl font-black mb-1 ${colorMap[problem.color].split(" ")[0]}`}
              >
                <AnimatedCounter
                  end={problem.stat}
                  suffix={problem.suffix}
                  decimals={problem.stat % 1 !== 0 ? 1 : 0}
                  duration={2000}
                />
              </div>
              <div className="text-white font-semibold mb-3">
                {problem.label}
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Visual storytelling strip */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              emoji: "🌾",
              title: "Pest Damage",
              text: "Infestations detected weeks too late — entire sections lost.",
              bg: "from-red-950/40 to-transparent",
            },
            {
              emoji: "💧",
              title: "Manual Spraying",
              text: "Uniform chemical application wastes 60% of pesticide on healthy crops.",
              bg: "from-orange-950/40 to-transparent",
            },
            {
              emoji: "📉",
              title: "No Intelligence",
              text: "Farmers rely on guesswork without real-time crop health data.",
              bg: "from-yellow-950/30 to-transparent",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`glass rounded-2xl p-8 bg-gradient-to-br ${card.bg} border border-white/5`}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Transition text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mt-24"
        >
          <p className="text-text-muted text-sm tracking-[0.3em] uppercase">
            Until now
          </p>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent-green/50 to-transparent mx-auto mt-4" />
        </motion.div>
      </div>
    </section>
  );
}
