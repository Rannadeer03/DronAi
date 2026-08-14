import type { Metadata } from "next";
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — DronAI",
  description: "Sign in to the DronAI platform to access mission control, drone telemetry, and farm intelligence.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to DronAI"
      subtitle="Access your mission control, telemetry, and farm intelligence dashboard."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
