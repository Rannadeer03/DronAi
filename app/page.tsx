import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SolutionBridge from "@/components/sections/SolutionBridge";
import ScanningDrone from "@/components/sections/ScanningDrone";
import FarmScanning from "@/components/sections/FarmScanning";
import StressMap from "@/components/sections/StressMap";
import DroneTransform from "@/components/sections/DroneTransform";
import PrecisionSpray from "@/components/sections/PrecisionSpray";
import Dashboard from "@/components/sections/Dashboard";
import TechArch from "@/components/sections/TechArch";
import Vision from "@/components/sections/Vision";

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Problem />
      <SolutionBridge />
      <ScanningDrone />
      <FarmScanning />
      <StressMap />
      <DroneTransform />
      <PrecisionSpray />
      <Dashboard />
      <TechArch />
      <Vision />
      <Footer />
    </main>
  );
}
