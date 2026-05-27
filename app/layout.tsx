import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DronAI — Autonomous Precision Farming Intelligence",
  description:
    "AI-driven drone ecosystem for crop monitoring, stress detection, and precision pest control. Engineering the future of autonomous agriculture.",
  keywords: [
    "autonomous farming",
    "precision agriculture",
    "drone technology",
    "AI farming",
    "crop monitoring",
    "pest control drone",
    "DronAI",
  ],
  authors: [{ name: "DronAI Technologies" }],
  creator: "DronAI",
  openGraph: {
    title: "DronAI — Autonomous Precision Farming Intelligence",
    description:
      "AI-driven drone ecosystem for crop monitoring, stress detection, and precision pest control.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DronAI — Autonomous Precision Farming Intelligence",
    description: "Engineering autonomous farming intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-white antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
