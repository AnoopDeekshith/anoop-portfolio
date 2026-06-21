"use client";

import dynamic from "next/dynamic";
import GateNavSection from "@/components/GateNavSection";

const ScrollChipExperience = dynamic(
  () => import("@/components/ScrollChipExperience"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <span className="font-mono text-xs text-[#00FF88]/40 animate-pulse">
          {"// Initializing chip renderer..."}
        </span>
      </div>
    ),
  }
);

const WaferSection = dynamic(() => import("@/components/WaferSection"), {
  ssr: false,
});

const OscilloscopeSkills = dynamic(
  () => import("@/components/OscilloscopeSkills"),
  { ssr: false }
);

const ProjectCards = dynamic(() => import("@/components/ProjectCards"), {
  ssr: false,
});

const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  ssr: false,
});

const VRAMResume = dynamic(() => import("@/components/VRAMResume"), {
  ssr: false,
});

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
    </div>
  );
}

export default function ClientSections() {
  return (
    <>
      {/* About + Chip Zoom Scroll Experience */}
      <ScrollChipExperience />

      <Divider />

      {/* Gate Nav — clickable logic gates linking to sections */}
      <GateNavSection />

      <Divider />

      {/* ATE Validation / Wafer + Skills */}
      <WaferSection />

      <Divider />

      {/* Oscilloscope Skills */}
      <OscilloscopeSkills />

      <Divider />

      {/* Projects */}
      <ProjectCards />

      <Divider />

      {/* Blog */}
      <BlogSection />

      <Divider />

      {/* Resume VRAM */}
      <VRAMResume />
    </>
  );
}
