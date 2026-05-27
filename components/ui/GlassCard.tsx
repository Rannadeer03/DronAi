"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  greenBorder?: boolean;
}

export default function GlassCard({
  children,
  className,
  hoverGlow = false,
  greenBorder = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverGlow ? { scale: 1.02 } : {}}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        greenBorder && "border border-accent-green/20 hover:border-accent-green/40",
        hoverGlow && "hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
