"use client";

import dynamic from "next/dynamic";

const PipelineReveal = dynamic(() => import("@/components/PipelineReveal"), {
  ssr: false,
  loading: () => (
    <div className="py-24 flex items-center justify-center">
      <span className="font-mono text-xs text-[#00FF88]/40 animate-pulse">
        {"// Loading pipeline..."}
      </span>
    </div>
  ),
});

const ChipFloorplan = dynamic(() => import("@/components/ChipFloorplan"), {
  ssr: false,
  loading: () => (
    <div className="py-24 flex items-center justify-center">
      <span className="font-mono text-xs text-[#4A9EFF]/40 animate-pulse">
        {"// Loading floorplan..."}
      </span>
    </div>
  ),
});

const OscilloscopeSkills = dynamic(
  () => import("@/components/OscilloscopeSkills"),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 flex items-center justify-center">
        <span className="font-mono text-xs text-[#FFB347]/40 animate-pulse">
          {"// Loading oscilloscope..."}
        </span>
      </div>
    ),
  }
);

const ProjectCards = dynamic(() => import("@/components/ProjectCards"), {
  ssr: false,
});

const VRAMResume = dynamic(() => import("@/components/VRAMResume"), {
  ssr: false,
});

export default function ClientSections() {
  return (
    <>
      {/* Scroll experience zones */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
            <span className="font-mono text-[9px] text-[#8899AA]/30 tracking-widest">
              SCROLL_EXPERIENCE
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
          </div>
        </div>

        <PipelineReveal />

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
        </div>

        <ChipFloorplan />

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
        </div>

        <OscilloscopeSkills />
      </div>

      {/* Projects */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
      </div>
      <ProjectCards />

      {/* Resume */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1E2A3A] to-transparent" />
      </div>
      <VRAMResume />
    </>
  );
}
