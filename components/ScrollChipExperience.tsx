"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ChipCanvas = dynamic(() => import("./ChipCanvas"), { ssr: false });

// Zoom targets for each section (normalized 0-1 within 900x600 chip space)
const sections = [
  {
    id: "about",
    zoom: { x: 0.21, y: 0.31, scale: 2.2 },
    chipBlock: "cpu",
    title: "About Me",
    accent: "#00FF88",
    content: (
      <div className="space-y-4">
        <p className="font-mono text-sm text-[#E8EAF0]/90 leading-relaxed">
          I&apos;m a <span className="text-[#00FF88] font-bold">Master&apos;s student in Electrical Engineering</span> at
          UC Santa Cruz, currently deep in the world of{" "}
          <span className="text-[#00FF88] font-bold">neuromorphic chip design</span> — building
          hardware that mimics how biological neurons compute, targeting ultra-low-power
          edge inference at the silicon level. (Yes, I&apos;m trying to make chips think. No pressure.)
        </p>
        <p className="font-mono text-sm text-[#E8EAF0]/80 leading-relaxed">
          Before grad school, I spent{" "}
          <span className="text-[#4A9EFF] font-bold">4 years as a Post-Silicon Validation Engineer II</span>{" "}
          at <span className="text-[#4A9EFF]">Anora Semiconductor Labs</span>, where I owned
          silicon bring-up and functional validation of mixed-signal SoCs — bridging the gap between
          RTL intent and real silicon behavior. Translation: I poked chips with probes until they
          confessed what was wrong.
        </p>
        <p className="font-mono text-sm text-[#8899AA] leading-relaxed">
          My work spans the full stack: RTL design in Verilog/SystemVerilog, physical implementation
          in Cadence Innovus, and post-silicon debug. I care about the intersection of
          <span className="text-[#FFB347]"> emerging compute paradigms</span> and
          <span className="text-[#FFB347]"> physical implementation constraints</span>.
          Basically, I want fast chips that don&apos;t melt.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {["Neuromorphic", "RISC-V", "RTL Design", "Physical Design", "Post-Si Validation"].map(t => (
            <span key={t} className="font-mono text-[10px] px-2 py-1 border border-[#00FF88]/30 text-[#00FF88]/80 bg-[#00FF88]/5">
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "neuro-project",
    zoom: { x: 0.71, y: 0.78, scale: 3.2 },
    chipBlock: "neuro",
    title: "Neuromorphic Design",
    accent: "#00FF88",
    content: (
      <div className="space-y-4">
        <div className="border border-[#00FF88]/30 bg-[#00FF88]/5 p-3">
          <div className="font-mono text-[10px] text-[#00FF88]/60 tracking-widest mb-1">CURRENT RESEARCH</div>
          <div className="font-mono text-sm text-[#00FF88] font-bold">Spiking Neural Network Accelerator</div>
        </div>
        <p className="font-mono text-sm text-[#E8EAF0]/80 leading-relaxed">
          Designing a <span className="text-[#00FF88]">Leaky Integrate-and-Fire (LIF) neuron array</span> in
          SystemVerilog, targeting ultra-low-power inference on edge devices. The architecture
          uses time-multiplexed synaptic weight memory and asynchronous spike routing to minimize
          switching activity.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Neurons", v: "256 LIF array" },
            { l: "Precision", v: "8-bit fixed" },
            { l: "Target", v: "28nm CMOS" },
            { l: "Goal", v: "<1mW inference" },
          ].map(s => (
            <div key={s.l} className="border border-[#1E2A3A] bg-[#0D1117] p-2">
              <div className="font-mono text-[9px] text-[#8899AA]/60">{s.l}</div>
              <div className="font-mono text-xs text-[#00FF88]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "riscv-project",
    zoom: { x: 0.22, y: 0.22, scale: 3.0 },
    chipBlock: "cpu",
    title: "RISC-V RV32I Core",
    accent: "#4A9EFF",
    content: (
      <div className="space-y-4">
        <div className="border border-[#4A9EFF]/30 bg-[#4A9EFF]/5 p-3">
          <div className="font-mono text-[10px] text-[#4A9EFF]/60 tracking-widest mb-1">RTL PROJECT</div>
          <div className="font-mono text-sm text-[#4A9EFF] font-bold">5-Stage Pipeline · In Progress</div>
        </div>
        <p className="font-mono text-sm text-[#E8EAF0]/80 leading-relaxed">
          Full RTL implementation of the <span className="text-[#4A9EFF]">RV32I ISA</span> with a
          5-stage in-order pipeline (IF → ID → EX → MEM → WB). Includes full hazard detection unit,
          data forwarding paths, and a branch predictor. Verified with a UVM environment in Xcelium.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "ISA", v: "RV32I" },
            { l: "Pipeline", v: "5-stage" },
            { l: "Hazard", v: "Full forward" },
            { l: "Verify", v: "UVM + SV" },
          ].map(s => (
            <div key={s.l} className="border border-[#1E2A3A] bg-[#0D1117] p-2">
              <div className="font-mono text-[9px] text-[#8899AA]/60">{s.l}</div>
              <div className="font-mono text-xs text-[#4A9EFF]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "prefetcher-project",
    zoom: { x: 0.60, y: 0.22, scale: 3.2 },
    chipBlock: "icache",
    title: "Best-Offset Prefetcher",
    accent: "#FFB347",
    content: (
      <div className="space-y-4">
        <div className="border border-[#FFB347]/30 bg-[#FFB347]/5 p-3">
          <div className="font-mono text-[10px] text-[#FFB347]/60 tracking-widest mb-1">COMPLETED PROJECT</div>
          <div className="font-mono text-sm text-[#FFB347] font-bold">+10.6% IPC · 52% L1 Miss Reduction</div>
        </div>
        <p className="font-mono text-sm text-[#E8EAF0]/80 leading-relaxed">
          Implemented and evaluated a <span className="text-[#FFB347]">Best-Offset hardware prefetcher</span> for
          RISC-V memory hierarchy using Gem5 and Scarab simulators. Benchmarked across 20 SPEC2017
          workloads, achieving 10.6% average IPC uplift and 52% reduction in L1 cache misses.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "IPC Gain", v: "+10.6%" },
            { l: "L1 Miss ↓", v: "52%" },
            { l: "Simulator", v: "Gem5/Scarab" },
            { l: "Benchmarks", v: "SPEC2017 ×20" },
          ].map(s => (
            <div key={s.l} className="border border-[#1E2A3A] bg-[#0D1117] p-2">
              <div className="font-mono text-[9px] text-[#8899AA]/60">{s.l}</div>
              <div className="font-mono text-xs text-[#FFB347]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "droop-project",
    zoom: { x: 0.37, y: 0.75, scale: 3.0 },
    chipBlock: "pwrmgmt",
    title: "Voltage Droop Prediction",
    accent: "#FFD700",
    content: (
      <div className="space-y-4">
        <div className="border border-[#FFD700]/30 bg-[#FFD700]/5 p-3">
          <div className="font-mono text-[10px] text-[#FFD700]/60 tracking-widest mb-1">ML + PHYSICAL DESIGN</div>
          <div className="font-mono text-sm text-[#FFD700] font-bold">CNN-Driven IR Drop Analysis</div>
        </div>
        <p className="font-mono text-sm text-[#E8EAF0]/80 leading-relaxed">
          Building a <span className="text-[#FFD700]">CNN-based model</span> trained on Cadence Innovus
          IR-drop maps to predict supply voltage droop during physical implementation — enabling
          proactive power grid insertion before sign-off, reducing IR violations and runtime.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { l: "Model", v: "CNN" },
            { l: "Tool", v: "Cadence Innovus" },
            { l: "Target", v: "IR drop <5mV" },
            { l: "Node", v: "28nm" },
          ].map(s => (
            <div key={s.l} className="border border-[#1E2A3A] bg-[#0D1117] p-2">
              <div className="font-mono text-[9px] text-[#8899AA]/60">{s.l}</div>
              <div className="font-mono text-xs text-[#FFD700]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function ScrollChipExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<{ setZoom: (t: { x: number; y: number; scale: number }) => void }>(null);
  const activeRef = useRef(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `${(i / sections.length) * 100}% top`,
          end: `${((i + 1) / sections.length) * 100}% top`,
          onEnter: () => updateSection(i),
          onEnterBack: () => updateSection(i),
        });
      });
    });

    const updateSection = (i: number) => {
      if (activeRef.current === i) return;
      activeRef.current = i;

      // Update chip zoom
      chipRef.current?.setZoom(sections[i].zoom);

      // Animate panels
      panelRefs.current.forEach((panel, pi) => {
        if (!panel) return;
        if (pi === i) {
          gsap.to(panel, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
        } else {
          gsap.to(panel, { opacity: 0, x: -20, duration: 0.3 });
        }
      });
    };

    // Init
    updateSection(0);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="about"
      ref={containerRef}
      className="relative"
      style={{ height: `${sections.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex"
      >
        {/* Left: content panels */}
        <div className="relative w-full md:w-[42%] flex flex-col justify-center px-8 md:px-12 z-10">
          {sections.map((section, i) => (
            <div
              key={section.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center px-8 md:px-12"
              style={{ opacity: 0 }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: section.accent }} />
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: `${section.accent}80` }}
                >
                  {section.id.replace("-", " ")}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {section.title}
              </h2>

              {/* Content */}
              <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 220px)" }}>
                {section.content}
              </div>

              {/* Scroll hint */}
              <div className="mt-6 font-mono text-[9px] text-[#8899AA]/30 flex items-center gap-2">
                <span>{i + 1}/{sections.length}</span>
                <div className="flex-1 h-px bg-[#1E2A3A]" />
                <span>scroll ↓</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Chip canvas */}
        <div className="hidden md:block flex-1 relative">
          {/* Gradient overlay on left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0A0A0F, transparent)" }}
          />
          <ChipCanvas
            ref={chipRef}
            className="w-full h-full"
          />

          {/* Active block label */}
          <div className="absolute bottom-6 left-6 font-mono text-[10px] text-[#00FF88]/40">
            {"// Chip view · Zoom: interactive"}
          </div>
        </div>

        {/* Mobile chip (top, small) */}
        <div className="md:hidden absolute top-0 right-0 w-1/2 h-40 opacity-40">
          <ChipCanvas className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
