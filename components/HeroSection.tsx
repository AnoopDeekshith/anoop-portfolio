"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const LogicGateBackground = dynamic(
  () => import("./LogicGateBackground"),
  { ssr: false }
);

const ClockWaveform = dynamic(
  () => import("./ClockWaveform"),
  { ssr: false }
);

const badges = ["Verilog", "SystemVerilog", "C++"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HeroSection() {
  const scrollDown = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dot-grid"
    >
      {/* Logic gate background */}
      <div className="absolute inset-0 overflow-hidden">
        <LogicGateBackground />
      </div>

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #0A0A0F 80%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
      >
        {/* Chip ID tag */}
        <motion.div variants={item} className="mb-6">
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase text-[#00FF88]/60 border border-[#00FF88]/20 px-3 py-1"
          >
            {"// CHIP_ID: AD-2024-PSV-RTL"}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4 text-[#00FF88]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Anoop Deekshith Ravikumar
        </motion.h1>

        {/* Clock waveform */}
        <motion.div variants={item} className="w-full max-w-xl my-4">
          <ClockWaveform />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="font-mono text-base md:text-lg text-[#8899AA] tracking-widest mb-8"
        >
          RTL Design{"  ·  "}Physical Design{"  ·  "}Post-Silicon Validation
        </motion.p>

        {/* Badge pills */}
        <motion.div variants={item} className="flex gap-3 flex-wrap justify-center mb-12">
          {badges.map((badge) => (
            <span
              key={badge}
              className="font-mono text-xs px-4 py-1.5 border border-[#00FF88]/40 text-[#00FF88] bg-[#00FF88]/5 tracking-wider"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Status line */}
        <motion.div
          variants={item}
          className="font-mono text-xs text-[#4A9EFF]/60 tracking-wider mb-8"
        >
          <span className="text-[#00FF88]">●</span> READY{"  "}|{"  "}
          M.S. ECE @ UC Santa Cruz{"  "}|{"  "}San Francisco, CA
        </motion.div>
      </motion.div>

      {/* Scroll caret */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 group"
        aria-label="Scroll down"
        style={{ animation: "caret-bounce 1.8s ease-in-out infinite" }}
      >
        <span className="font-mono text-[10px] text-[#00FF88]/40 tracking-widest uppercase">
          scroll
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#00FF88]/60 group-hover:text-[#00FF88] transition-colors"
        >
          <path
            d="M4 7L10 13L16 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
