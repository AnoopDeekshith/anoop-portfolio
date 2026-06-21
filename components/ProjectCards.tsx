"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    id: 1,
    title: "Best-Offset Prefetcher",
    subtitle: "Memory Hierarchy Optimization",
    stack: ["RISC-V", "Gem5", "Scarab", "C++"],
    status: 100,
    statusLabel: "Complete",
    color: "#00FF88",
    metrics: [
      { label: "IPC Gain", value: "+10.6%" },
      { label: "L1 Miss Reduction", value: "52%" },
      { label: "Sim Platform", value: "Gem5 / Scarab" },
    ],
    desc: "Implemented Best-Offset (BO) hardware prefetcher for RISC-V memory hierarchy. Evaluated across 20 SPEC2017 benchmarks achieving 10.6% average IPC uplift and 52% L1 cache miss reduction.",
    github: "https://github.com/AnoopDeekshith",
    icon: "⬡",
  },
  {
    id: 2,
    title: "RISC-V RV32I Core",
    subtitle: "5-Stage Pipelined Processor",
    stack: ["Verilog", "SystemVerilog", "UVM", "Xcelium"],
    status: 65,
    statusLabel: "In Progress",
    color: "#4A9EFF",
    metrics: [
      { label: "Pipeline Stages", value: "5" },
      { label: "ISA", value: "RV32I" },
      { label: "Verification", value: "UVM" },
    ],
    desc: "Full RTL implementation of RV32I ISA with 5-stage in-order pipeline. Includes hazard detection, data forwarding, and UVM-based constrained-random verification environment in Xcelium.",
    github: "https://github.com/AnoopDeekshith",
    icon: "⬢",
  },
  {
    id: 3,
    title: "FPGA Counter & Memory",
    subtitle: "RTL Modules on Xilinx",
    stack: ["Verilog", "Xilinx", "FPGA", "RTL"],
    status: 50,
    statusLabel: "In Progress",
    color: "#FFB347",
    metrics: [
      { label: "Target FPGA", value: "Artix-7" },
      { label: "Fmax", value: "250 MHz" },
      { label: "LUT Usage", value: "<8%" },
    ],
    desc: "Parameterizable counter and synchronous SRAM modules synthesized on Xilinx Artix-7. Includes timing closure scripts and post-synthesis simulation with testbenches.",
    github: "https://github.com/AnoopDeekshith",
    icon: "◈",
  },
  {
    id: 4,
    title: "Voltage Droop Prediction",
    subtitle: "ML-Driven Power Analysis",
    stack: ["SystemVerilog", "Innovus", "CNN", "Python"],
    status: 40,
    statusLabel: "In Progress",
    color: "#FF6B9D",
    metrics: [
      { label: "Tool", value: "Cadence Innovus" },
      { label: "Model", value: "CNN" },
      { label: "IR Drop Target", value: "<5mV" },
    ],
    desc: "CNN-based model to predict supply voltage droop during physical implementation. Trained on Innovus IR-drop maps to proactively guide power grid insertion and reduce IR violations.",
    github: "https://github.com/AnoopDeekshith",
    icon: "⬟",
  },
  {
    id: 5,
    title: "GPU Matrix Multiplier",
    subtitle: "VHDL + CUDA Accelerator",
    stack: ["VHDL", "CUDA", "FPGA", "HLS"],
    status: 30,
    statusLabel: "In Progress",
    color: "#B347FF",
    metrics: [
      { label: "Throughput", value: "12 GOPS" },
      { label: "Backend", value: "VHDL + CUDA" },
      { label: "Precision", value: "FP32" },
    ],
    desc: "Hybrid FPGA+GPU matrix multiplication accelerator. VHDL handles data movement and tiling logic while CUDA kernels execute the multiply-accumulate using shared memory tiling for FP32 matrices.",
    github: "https://github.com/AnoopDeekshith",
    icon: "◇",
  },
];

interface CardProps {
  project: (typeof projects)[0];
  index: number;
}

function ProjectCard({ project, index }: CardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative"
      style={{ perspective: "1000px", height: "320px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 border bg-[#0D1117] p-5 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderColor: `${project.color}30`,
          }}
        >
          {/* Corner notch */}
          <div
            className="absolute top-0 right-0 w-6 h-6"
            style={{
              background: project.color,
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              opacity: 0.8,
            }}
          />

          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div
              className="text-2xl leading-none mt-0.5"
              style={{ color: project.color }}
            >
              {project.icon}
            </div>
            <div>
              <h3
                className="font-mono font-bold text-sm text-white leading-tight"
              >
                {project.title}
              </h3>
              <p className="font-mono text-[10px] text-[#8899AA] mt-0.5">
                {project.subtitle}
              </p>
            </div>
          </div>

          {/* Stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] px-2 py-0.5 border"
                style={{
                  borderColor: `${project.color}40`,
                  color: project.color,
                  background: `${project.color}08`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Status bar */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] text-[#8899AA]/60 tracking-wider uppercase">
                {project.statusLabel}
              </span>
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: project.color }}
              >
                {project.status}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#1E2A3A] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: project.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${project.status}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Hover hint */}
          <div className="absolute bottom-3 right-3 font-mono text-[8px] text-[#8899AA]/30">
            hover →
          </div>

          {/* Circuit trace decoration */}
          <svg
            className="absolute bottom-0 left-0 right-0 opacity-10"
            height="40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={`M0 35 L20 35 L25 20 L45 20 L50 35 L${String(project.id * 70)} 35`}
              stroke={project.color}
              fill="none"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 border bg-[#0D1117] p-5 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: `${project.color}60`,
            boxShadow: `0 0 30px ${project.color}15`,
          }}
        >
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="border bg-[#060B10] p-2"
                style={{ borderColor: `${project.color}20` }}
              >
                <div className="font-mono text-[8px] text-[#8899AA]/60 mb-1 truncate">
                  {m.label}
                </div>
                <div
                  className="font-mono text-xs font-bold"
                  style={{ color: project.color }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="font-mono text-[10px] text-[#8899AA] leading-relaxed flex-1 overflow-hidden">
            {project.desc}
          </p>

          {/* GitHub link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 border py-2 font-mono text-xs transition-all duration-200 hover:scale-105"
            style={{
              borderColor: project.color,
              color: project.color,
              background: `${project.color}10`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectCards() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#B347FF]" />
          <span className="font-mono text-xs text-[#B347FF]/60 tracking-widest uppercase">
            Projects
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Projects
        </h2>
        <p className="font-mono text-sm text-[#8899AA] mb-10">
          {"// Hover cards to view metrics  |  5 projects  |  RTL · Physical · ML"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
