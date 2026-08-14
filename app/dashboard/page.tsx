"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, FileText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardShell, { DashboardNavItem } from "@/components/dashboard/DashboardShell";
import DroneStatusPanel, { DroneRow } from "@/components/dashboard/DroneStatusPanel";
import AddDroneDialog from "@/components/dashboard/AddDroneDialog";
import { useAuth } from "@/lib/auth/AuthContext";
import { createClient } from "@/lib/supabase/client";

const navItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "My Drone", icon: LayoutDashboard },
  { href: "/dashboard/logs", label: "Logs", icon: FileText },
];

function DashboardContent() {
  const { user } = useAuth();
  const [drone, setDrone] = useState<DroneRow | null | undefined>(undefined);

  const refetch = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("drones")
      .select("*")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();
    setDrone(data as DroneRow | null);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!user || drone === undefined) return null;

  const canControl = user.role === "admin" || user.role === "pilot";

  return (
    <DashboardShell navItems={navItems}>
      {drone ? (
        <DroneStatusPanel drone={drone} canControl={canControl} />
      ) : (
        <AddDroneDialog onClaimed={refetch} />
      )}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
