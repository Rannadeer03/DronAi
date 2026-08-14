"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:8000";

export interface DroneTelemetry {
  connected?: boolean;
  armed?: boolean;
  battery_voltage?: number;
  battery_pct?: number;
  lat?: number;
  lon?: number;
  alt_m?: number;
  ground_speed_ms?: number;
  gps_fix?: number;
  satellites?: number;
  heading_deg?: number;
  roll_deg?: number;
  pitch_deg?: number;
  yaw_deg?: number;
}

export interface DroneLiveState {
  status: "online" | "offline";
  armed: boolean;
  telemetry: DroneTelemetry;
  lastSeen: string | null;
  armPending: boolean;
  armError: string | null;
}

export function useDroneSocket(
  droneId: string | null,
  initial?: Partial<Pick<DroneLiveState, "status" | "armed" | "telemetry" | "lastSeen">>
) {
  const [state, setState] = useState<DroneLiveState>({
    status: initial?.status ?? "offline",
    armed: initial?.armed ?? false,
    telemetry: initial?.telemetry ?? {},
    lastSeen: initial?.lastSeen ?? null,
    armPending: false,
    armError: null,
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!droneId) return;
    let cancelled = false;
    let socket: WebSocket | null = null;

    async function connect() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || cancelled) return;

      socket = new WebSocket(
        `${BACKEND_WS_URL}/ws/drones/${droneId}?token=${session.access_token}`
      );
      wsRef.current = socket;

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "STATE") {
          setState((prev) => ({
            ...prev,
            status: message.status ?? prev.status,
            armed: message.armed ?? prev.armed,
            telemetry: message.telemetry ?? prev.telemetry,
            lastSeen: message.last_seen ?? prev.lastSeen,
          }));
        } else if (message.type === "ARM_PENDING") {
          setState((prev) => ({ ...prev, armPending: true, armError: null }));
        } else if (message.type === "ARM_RESULT") {
          setState((prev) => ({
            ...prev,
            armPending: false,
            armError: message.success ? null : message.reason || "Command failed",
          }));
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      socket?.close();
    };
  }, [droneId]);

  return state;
}
