"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Satellite,
  BatteryFull,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { useDroneSocket } from "@/hooks/useDroneSocket";
import { armDrone, disarmDrone, BackendApiError } from "@/lib/api/backend-client";
import { cn } from "@/lib/utils";

export interface DroneRow {
  id: string;
  drone_uid: string;
  name: string;
  status: "online" | "offline";
  armed: boolean;
  last_telemetry: Record<string, unknown>;
  last_seen: string | null;
}

export default function DroneStatusPanel({
  drone,
  canControl,
}: {
  drone: DroneRow;
  canControl: boolean;
}) {
  const live = useDroneSocket(drone.id, {
    status: drone.status,
    armed: drone.armed,
    telemetry: drone.last_telemetry as Record<string, number | boolean | undefined>,
    lastSeen: drone.last_seen,
  });

  const [actionState, setActionState] = useState<"idle" | "arming" | "disarming">("idle");
  const [actionError, setActionError] = useState<string | null>(null);

  const online = live.status === "online";
  const telemetry = live.telemetry;
  const gpsFix = typeof telemetry.gps_fix === "number" ? telemetry.gps_fix : undefined;
  const gpsOk = gpsFix !== undefined && gpsFix >= 3;

  async function handleArm() {
    setActionState("arming");
    setActionError(null);
    try {
      await armDrone(drone.id);
    } catch (err) {
      setActionError(err instanceof BackendApiError ? err.message : "Arm failed.");
    } finally {
      setActionState("idle");
    }
  }

  async function handleDisarm() {
    setActionState("disarming");
    setActionError(null);
    try {
      await disarmDrone(drone.id);
    } catch (err) {
      setActionError(err instanceof BackendApiError ? err.message : "Disarm failed.");
    } finally {
      setActionState("idle");
    }
  }

  const busy = actionState !== "idle" || live.armPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 lg:p-8 border border-white/5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="text-text-muted text-xs font-mono uppercase tracking-wide mb-1">
            {drone.drone_uid}
          </div>
          <h2 className="text-white text-xl font-bold">{drone.name}</h2>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-xs font-mono font-semibold uppercase tracking-wide border",
            online
              ? "bg-accent-green/10 text-accent-green border-accent-green/20"
              : "bg-white/5 text-text-muted border-white/10"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", online ? "bg-accent-green animate-pulse" : "bg-text-muted")} />
          {online ? "Online" : "Offline"}
        </div>
      </div>

      {!online && (
        <div className="mb-6 rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-xs text-text-muted">
          Last seen: {live.lastSeen ? new Date(live.lastSeen).toLocaleString() : "never connected"}. Telemetry
          and armed state below are the last known values, not live.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusTile
          icon={online ? Wifi : WifiOff}
          label="Raspberry Pi"
          value={online ? "Connected" : "Disconnected"}
          tone={online ? "green" : "neutral"}
        />
        <StatusTile
          icon={Cpu}
          label="Pixhawk"
          value={telemetry.connected ? "Connected" : "Disconnected"}
          tone={telemetry.connected ? "green" : "neutral"}
        />
        <StatusTile
          icon={Satellite}
          label="GPS"
          value={gpsFix !== undefined ? `Fix ${gpsFix} · ${telemetry.satellites ?? 0} sats` : "Unknown"}
          tone={gpsOk ? "green" : "orange"}
        />
        <StatusTile
          icon={BatteryFull}
          label="Battery"
          value={
            typeof telemetry.battery_pct === "number"
              ? `${telemetry.battery_pct}%`
              : typeof telemetry.battery_voltage === "number"
                ? `${telemetry.battery_voltage.toFixed(1)}V`
                : "Unknown"
          }
          tone="neutral"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-white/[0.02] border border-white/5 p-5">
        <div className="flex items-center gap-3">
          {live.armed ? (
            <ShieldAlert className="text-red-400" size={20} />
          ) : (
            <ShieldCheck className="text-accent-green" size={20} />
          )}
          <div>
            <div className={cn("text-sm font-semibold", live.armed ? "text-red-400" : "text-accent-green")}>
              {busy ? (actionState === "disarming" ? "DISARMING…" : "ARMING…") : live.armed ? "ARMED" : "DISARMED"}
            </div>
            {actionError && <div className="text-xs text-red-400 mt-0.5">{actionError}</div>}
            {!canControl && (
              <div className="text-xs text-text-muted mt-0.5">Your role can view telemetry only.</div>
            )}
          </div>
        </div>

        {canControl && (
          <div className="flex gap-3">
            <button
              onClick={handleArm}
              disabled={!online || busy || live.armed}
              className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {busy && actionState === "arming" ? <Loader2 size={15} className="animate-spin" /> : null}
              Arm
            </button>
            <button
              onClick={handleDisarm}
              disabled={!online || busy || !live.armed}
              className="btn-ghost text-sm py-2.5 px-6 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {busy && actionState === "disarming" ? <Loader2 size={15} className="animate-spin" /> : null}
              Disarm
            </button>
          </div>
        )}
      </div>

      {!online && canControl && (
        <div className="flex items-center gap-2 mt-4 text-xs text-text-muted">
          <AlertCircle size={13} />
          Drone must be online to arm or disarm.
        </div>
      )}
    </motion.div>
  );
}

function StatusTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "green" | "orange" | "neutral";
}) {
  const toneText = tone === "green" ? "text-accent-green" : tone === "orange" ? "text-orange-400" : "text-white";
  const toneBg = tone === "green" ? "bg-accent-green/10" : tone === "orange" ? "bg-orange-500/10" : "bg-white/5";

  return (
    <div className="stat-card !gap-1">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-1", toneBg)}>
        <Icon size={14} className={toneText} />
      </div>
      <span className="text-text-muted text-[11px] uppercase tracking-wide">{label}</span>
      <span className={cn("text-sm font-semibold", toneText)}>{value}</span>
    </div>
  );
}
