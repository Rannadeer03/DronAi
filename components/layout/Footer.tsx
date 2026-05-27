"use client";

import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";

const links = {
  Product: ["Technology", "Platform", "Analytics", "API"],
  Company: ["About", "Careers", "Press", "Contact"],
  Resources: ["Documentation", "Case Studies", "Blog", "Partners"],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-surface">
      {/* Green ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-accent-green/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" fill="currentColor" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Dron<span className="text-accent-green">AI</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Engineering autonomous farming intelligence. The future operating
              system for precision agriculture.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, color: "#22c55e" }}
                  className="w-10 h-10 glass rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-green transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">
                {category}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-text-secondary text-sm hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {item}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © 2025 DronAI Technologies. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Engineering Autonomous Farming Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
