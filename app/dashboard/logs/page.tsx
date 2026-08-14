"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, FileText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell, { DashboardNavItem } from "@/components/dashboard/DashboardShell";
import LogsTable, { DroneLogRow } from "@/components/dashboard/LogsTable";
import { useAuth } from "@/lib/auth/AuthContext";
import { createClient } from "@/lib/supabase/client";

const navItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "My Drone", icon: LayoutDashboard },
  { href: "/dashboard/logs", label: "Logs", icon: FileText },
];

function LogsContent() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DroneLogRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("drone_logs")
      .select("id, ts, level, event_type, message")
      .order("ts", { ascending: false })
      .limit(100)
      .then(({ data }) => setLogs((data as DroneLogRow[]) ?? []));
  }, [user]);

  return (
    <DashboardShell navItems={navItems}>
      <div className="mb-8">
        <h1 className="text-title font-bold text-white mb-2">Drone Logs</h1>
        <p className="text-text-secondary text-sm">Structured events reported by your drone.</p>
      </div>
      {logs === null ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <p className="text-text-muted text-sm">Loading…</p>
        </div>
      ) : (
        <LogsTable logs={logs} />
      )}
    </DashboardShell>
  );
}

export default function LogsPage() {
  return (
    <ProtectedRoute>
      <LogsContent />
    </ProtectedRoute>
  );
}
