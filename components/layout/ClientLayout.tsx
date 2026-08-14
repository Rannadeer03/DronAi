"use client";

import { useLenis } from "@/hooks/useLenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/lib/auth/AuthContext";

const LoadingScreen = dynamic(() => import("@/components/ui/LoadingScreen"), {
  ssr: false,
});
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), {
  ssr: false,
});
const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <AuthProvider>
      <LoadingScreen />
      <ScrollProgress />
      <CursorGlow />
      {children}
    </AuthProvider>
  );
}
