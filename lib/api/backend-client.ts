import { createClient } from "@/lib/supabase/client";

const BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_BACKEND_HTTP_URL || "http://localhost:8000";

export class BackendApiError extends Error {}

async function authorizedFetch(path: string, init: RequestInit = {}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new BackendApiError("Not signed in.");
  }

  const res = await fetch(`${BACKEND_HTTP_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackendApiError(body.detail || `Request failed (${res.status})`);
  }
  return body;
}

export function claimDrone(deviceUid: string, name?: string) {
  return authorizedFetch("/api/drones/claim", {
    method: "POST",
    body: JSON.stringify({ device_uid: deviceUid, name }),
  });
}

export function armDrone(droneId: string) {
  return authorizedFetch(`/api/drones/${droneId}/arm`, { method: "POST" });
}

export function disarmDrone(droneId: string) {
  return authorizedFetch(`/api/drones/${droneId}/disarm`, { method: "POST" });
}
