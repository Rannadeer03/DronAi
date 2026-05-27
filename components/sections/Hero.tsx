"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, ChevronDown } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { label: "Farms Monitored", value: "2,400+" },
  { label: "Crop Accuracy", value: "99.2%" },
  { label: "Pesticide Reduction", value: "70%" },
  { label: "Countries Active", value: "12" },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic parallax on the video
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          y: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Overlay darkens as you scroll
      gsap.to(overlayRef.current, {
        opacity: 0.95,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      <section
        id="hero"
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* ── Video ── */}
        <video
          ref={videoRef}
          className="video-bg scale-110"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 2.5s ease",
            willChange: "transform",
          }}
        >
          {/* Drone over Indian farmland — sunrise */}
          <source
            src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          {/* Fallback aerial farm */}
          <source
            src="https://videos.pexels.com/video-files/4812205/4812205-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* ── Gradient stack (cinematic) ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 80%, rgba(5,5,5,1) 100%),
              linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)
            `,
          }}
        />

        {/* ── Noise texture ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* ── Particles ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <ParticleField count={45} />
        </div>

        {/* ── Green ambient vignette bottom ── */}
        <div className="absolute bottom-0 inset-x-0 h-40 z-10 pointer-events-none bg-gradient-to-t from-accent-green/6 to-transparent" />

        {/* ── Horizontal light beam ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent-green/20 to-transparent z-10 pointer-events-none"
        />

        {/* ── Content ── */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-20">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 glass px-4 py-2 rounded-full mb-12 border border-white/8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
            </span>
            <span className="text-xs font-semibold text-text-secondary tracking-[0.18em] uppercase">
              Autonomous Precision Farming · Est. 2023
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-hero font-black text-white leading-[1.02] tracking-tight mb-6 max-w-5xl mx-auto">
                Engineering{" "}
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    backgroundImage:
                      "linear-gradient(135deg, #22c55e 0%, #86efac 50%, #22c55e 100%)",
                    backgroundSize: "200% 200%",
                    animation: "gradient-shift 4s ease infinite",
                  }}
                >
                  Autonomous
                </span>
                <br />
                Farming Intelligence
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12 font-light"
            >
              AI-driven drone ecosystem for crop monitoring, stress detection,
              and precision pest control — engineered for the next era of
              agriculture.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <button
                id="btn-watch-demo"
                onClick={() => setShowDemo(true)}
                className="group relative btn-primary overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Play size={15} className="fill-current relative" />
                <span className="relative">Watch Demo</span>
              </button>
              <a href="#product" className="btn-ghost group">
                Explore Technology
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-white mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-text-muted text-xs uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-text-muted tracking-[0.3em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-accent-green/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Gradient add-on CSS ── */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ── Demo Modal ── */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10"
            >
              {/* Demo placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center">
                  <Play size={32} className="text-accent-green fill-current ml-1" />
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-xl mb-2">DronAI — Product Demo</div>
                  <div className="text-text-muted text-sm">Demo video coming soon</div>
                </div>
              </div>
              {/* Close */}
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 glass w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-accent-green transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
