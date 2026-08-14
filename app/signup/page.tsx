import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account — DronAI",
  description: "Create a DronAI account to access mission control, drone telemetry, and farm intelligence.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      eyebrow="Get Started"
      title="Create your account"
      subtitle="Join DronAI to plan missions, monitor drones, and unlock AI-driven farm insights."
    >
      <SignupForm />
    </AuthLayout>
  );
}
