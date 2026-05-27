"use client";

import { useEffect, useRef } from "react";

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "healthy" | "stressed" | "warning";
  label: string;
}

const ZONES: Zone[] = [
  { x: 0.05, y: 0.05, w: 0.25, h: 0.3, type: "healthy", label: "Healthy Zone" },
  { x: 0.32, y: 0.05, w: 0.2, h: 0.25, type: "stressed", label: "Pest Infection" },
  { x: 0.55, y: 0.05, w: 0.4, h: 0.2, type: "healthy", label: "Optimal Growth" },
  { x: 0.05, y: 0.42, w: 0.35, h: 0.25, type: "warning", label: "Water Stress" },
  { x: 0.45, y: 0.3, w: 0.3, h: 0.35, type: "stressed", label: "Nitrogen Deficiency" },
  { x: 0.78, y: 0.28, w: 0.17, h: 0.4, type: "warning", label: "Moderate Stress" },
  { x: 0.05, y: 0.72, w: 0.45, h: 0.23, type: "healthy", label: "Healthy Crops" },
  { x: 0.55, y: 0.72, w: 0.4, h: 0.23, type: "stressed", label: "Critical Zone" },
];

const COLORS = {
  healthy: { fill: "rgba(34,197,94,0.5)", border: "rgba(34,197,94,0.9)" },
  stressed: { fill: "rgba(239,68,68,0.5)", border: "rgba(239,68,68,0.9)" },
  warning: { fill: "rgba(249,115,22,0.45)", border: "rgba(249,115,22,0.85)" },
};

export default function HeatmapCanvas({ progress = 1 }: { progress?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;

      // Background
      ctx.fillStyle = "#060a06";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(34,197,94,0.06)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Zones
      const zonesToShow = Math.ceil(ZONES.length * progress);
      ZONES.slice(0, zonesToShow).forEach((zone, i) => {
        const alpha = i < zonesToShow - 1 ? 1 : (progress * ZONES.length) % 1 || 1;
        const colors = COLORS[zone.type];

        const x = zone.x * W;
        const y = zone.y * H;
        const w = zone.w * W;
        const h = zone.h * H;

        // Fill
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colors.fill;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();

        // Border
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        if (alpha > 0.5) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.font = `bold 11px Inter, sans-serif`;
          ctx.fillText(zone.label, x + 8, y + 20);
        }

        ctx.globalAlpha = 1;
      });

      // Scan line overlay
      const scanY = (progress * H * 1.2) - H * 0.1;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "rgba(34,197,94,0.3)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, W, 60);
    };

    draw();
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ display: "block" }}
    />
  );
}
