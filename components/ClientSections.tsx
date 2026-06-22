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
    <div className="max-w-6xl mx-auto px-6 py-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1E2A3A]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#1E2A3A]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1E2A3A]" />
      </div>
    </div>
  );
}

export default function ClientSections() {
  return (
    <>
      {/* Gate Nav — Navi-Gate? click to jump to any section */}
      <GateNavSection />

      <Divider />

      {/* About + Chip Zoom Scroll Experience */}
      <ScrollChipExperience />

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
