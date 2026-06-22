"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const LogicGateBackground = dynamic(() => import("./LogicGateBackground"), { ssr: false });
const LogicGateWidget = dynamic(() => import("./LogicGateWidget"), { ssr: false });


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/anoopdeekshithr",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "#4A9EFF",
  },
  {
    label: "Email",
    href: "mailto:anoopdeekshith.ece@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    color: "#00FF88",
  },
  {
    label: "Medium",
    href: "https://medium.com/@anoopdeekshith",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
    color: "#B347FF",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/anoopdeekshith",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "#4A9EFF",
  },
];

export default function HeroSection() {
  const scrollDown = () => {
    const el = document.getElementById("about");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden dot-grid"
    >
      {/* Logic gate background */}
      <div className="absolute inset-0 overflow-hidden">
        <LogicGateBackground />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 60% 50%, transparent 20%, #0A0A0F 80%)",
        }}
      />

      {/* Left social sidebar */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px flex-1 max-h-16 bg-gradient-to-b from-transparent to-[#1E2A3A]" />
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="w-8 h-8 border flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            style={{ borderColor: `${s.color}50`, color: s.color }}
          >
            <span className="transition-colors" style={{ color: s.color }}>
              {s.icon}
            </span>
          </a>
        ))}
        <div className="w-px flex-1 max-h-16 bg-gradient-to-t from-transparent to-[#1E2A3A]" />
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full"
      >
        {/* Name — all green */}
        <motion.h1
          variants={item}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-5 text-[#00FF88]"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Anoop Deekshith Ravikumar
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="font-mono text-sm md:text-base text-[#8899AA] tracking-widest mb-3"
        >
          RTL Design{"  ·  "}Physical Design{"  ·  "}Post-Silicon Validation
        </motion.p>

        {/* Tech stack — terminal style */}
        <motion.p
          variants={item}
          className="font-mono text-xs md:text-sm tracking-wider mb-8"
          style={{ color: "#00FF88B0" }}
        >
          <span className="text-[#00FF88]/50 mr-2">{">"}</span>
          Verilog · SystemVerilog · C++ · Neuromorphic
        </motion.p>

        {/* Logic gate widget */}
        <motion.div variants={item} className="w-full max-w-lg mb-8">
          <LogicGateWidget />
        </motion.div>

        {/* Status line */}
        <motion.div
          variants={item}
          className="font-mono text-xs text-white/70 tracking-wider mb-4"
        >
          <span className="text-[#00FF88]">●</span> READY{"  "}|{"  "}
          M.S. ECE @ UC Santa Cruz{"  "}|{"  "}San Francisco, CA
        </motion.div>

        {/* Mobile social links */}
        <motion.div variants={item} className="flex gap-4 lg:hidden">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-8 h-8 border border-[#1E2A3A] flex items-center justify-center transition-all hover:scale-110"
              style={{ color: `${s.color}60` }}
            >
              {s.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll caret */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 group"
        aria-label="Scroll down"
        style={{ animation: "caret-bounce 1.8s ease-in-out infinite" }}
      >
        <span className="font-mono text-[10px] text-[#00FF88]/40 tracking-widest uppercase">scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 7L10 13L16 7" stroke="#00FF88" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
