"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { claimDrone, BackendApiError } from "@/lib/api/backend-client";

export default function AddDroneDialog({ onClaimed }: { onClaimed: () => void }) {
  const [deviceUid, setDeviceUid] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!deviceUid.trim()) {
      setError("Enter your drone's device UID.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await claimDrone(deviceUid.trim(), name.trim() || undefined);
      onClaimed();
    } catch (err) {
      setError(err instanceof BackendApiError ? err.message : "Could not pair this drone.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-8 border border-white/5 max-w-md"
    >
      <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center mb-4">
        <Plane size={18} className="text-accent-green" />
      </div>
      <h2 className="text-white font-bold text-lg mb-2">Add your drone</h2>
      <p className="text-text-secondary text-sm mb-6">
        Enter the device UID printed on your DronAI Pi (e.g. <span className="font-mono">DRA-000001</span>). It
        must have connected to DronAI at least once before it can be paired.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl px-4 py-3">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="device_uid" className="block text-xs text-text-secondary mb-1.5">
            Device UID
          </label>
          <input
            id="device_uid"
            value={deviceUid}
            onChange={(e) => setDeviceUid(e.target.value)}
            placeholder="DRA-000001"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-1 focus:border-accent-green/50 focus:ring-accent-green/30 font-mono"
          />
        </div>

        <div>
          <label htmlFor="drone_name" className="block text-xs text-text-secondary mb-1.5">
            Name (optional)
          </label>
          <input
            id="drone_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Drone"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-1 focus:border-accent-green/50 focus:ring-accent-green/30"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Pairing…
            </>
          ) : (
            <>
              Pair Drone
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
