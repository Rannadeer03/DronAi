"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DroneLogRow {
  id: string;
  ts: string;
  level: "debug" | "info" | "warning" | "error" | "critical";
  event_type: string;
  message: string | null;
}

const levelTone: Record<DroneLogRow["level"], string> = {
  debug: "text-text-muted",
  info: "text-accent-green",
  warning: "text-orange-400",
  error: "text-red-400",
  critical: "text-red-400",
};

export default function LogsTable({ logs }: { logs: DroneLogRow[] }) {
  if (logs.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-white/5">
        <p className="text-text-muted text-sm">No events yet. Logs appear here once your drone connects.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-text-muted text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3 text-text-muted font-mono text-xs whitespace-nowrap">
                  {new Date(log.ts).toLocaleString()}
                </td>
                <td className={cn("px-5 py-3 font-mono text-xs uppercase whitespace-nowrap", levelTone[log.level])}>
                  {log.level}
                </td>
                <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{log.event_type}</td>
                <td className="px-5 py-3 text-text-secondary">{log.message || "—"}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
