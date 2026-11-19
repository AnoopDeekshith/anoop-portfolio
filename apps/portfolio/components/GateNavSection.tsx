"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type GateType = "AND" | "OR" | "XOR" | "NAND" | "NOR";

const navGates: {
  type: GateType;
  label: string;
  section: string;
  color: string;
  desc: string;
}[] = [
  { type: "AND",  label: "ABOUT",    section: "about",        color: "#00FF88", desc: "who I am" },
  { type: "OR",   label: "PROJECTS", section: "projects",     color: "#4A9EFF", desc: "what I've built" },
  { type: "XOR",  label: "BLOG",     section: "blog",         color: "#FFB347", desc: "what I write" },
  { type: "NAND", label: "RESUME",   section: "resume",       color: "#FF6B9D", desc: "my experience" },
  { type: "NOR",  label: "CONTACT",  section: "contact-form", color: "#B347FF", desc: "let's connect" },
];

// Gate SVG paths in a 80×52 viewBox
const paths: Record<GateType, string> = {
  AND:  "M8,4 L8,48 L28,48 Q58,48 58,26 Q58,4 28,4 Z",
  OR:   "M8,4 Q20,4 38,26 Q20,48 8,48 Q26,48 52,26 Q26,4 8,4 Z",
  XOR:  "M13,4 Q25,4 43,26 Q25,48 13,48 Q31,48 57,26 Q31,4 13,4 Z",
  NAND: "M8,4 L8,48 L26,48 Q50,48 50,26 Q50,4 26,4 Z",
  NOR:  "M8,4 Q20,4 38,26 Q20,48 8,48 Q26,48 52,26 Q26,4 8,4 Z",
};

// Input/output wire endpoints per gate type
const wires: Record<GateType, { x1: number; y1: number; x2: number; y2: number }[]> = {
  AND:  [{ x1:0, y1:15, x2:8,  y2:15 }, { x1:0, y1:37, x2:8,  y2:37 }, { x1:58, y1:26, x2:72, y2:26 }],
  OR:   [{ x1:0, y1:15, x2:8,  y2:15 }, { x1:0, y1:37, x2:8,  y2:37 }, { x1:52, y1:26, x2:66, y2:26 }],
  XOR:  [{ x1:0, y1:15, x2:13, y2:15 }, { x1:0, y1:37, x2:13, y2:37 }, { x1:57, y1:26, x2:71, y2:26 }],
  NAND: [{ x1:0, y1:15, x2:8,  y2:15 }, { x1:0, y1:37, x2:8,  y2:37 }, { x1:60, y1:26, x2:74, y2:26 }],
  NOR:  [{ x1:0, y1:15, x2:8,  y2:15 }, { x1:0, y1:37, x2:8,  y2:37 }, { x1:61, y1:26, x2:75, y2:26 }],
};

function GateSVG({
  type, color, hovered,
}: {
  type: GateType; color: string; hovered: boolean;
}) {
  const path   = paths[type];
  const ws     = wires[type];
  const dim    = `${color}90`;
  const bright = color;

  return (
    <svg viewBox="0 0 80 52" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow when hovered */}
      {hovered && (
        <path
          d={path}
          fill="none"
          stroke={bright}
          strokeWidth="4"
          opacity="0.18"
          filter={`drop-shadow(0 0 10px ${bright})`}
        />
      )}

      {/* Main gate body */}
      <path
        d={path}
        fill={hovered ? `${color}18` : `${color}10`}
        stroke={hovered ? bright : dim}
        strokeWidth={hovered ? 2 : 1.5}
        style={{ transition: "all 0.2s" }}
      />

      {/* XOR extra curve */}
      {type === "XOR" && (
        <path d="M5,4 Q11,26 5,48" fill="none"
          stroke={hovered ? bright : dim} strokeWidth={hovered ? 1.8 : 1.2}
          style={{ transition: "all 0.2s" }} />
      )}

      {/* NAND bubble */}
      {type === "NAND" && (
        <circle cx="58" cy="26" r="7" fill={hovered ? `${color}12` : "none"}
          stroke={hovered ? bright : dim} strokeWidth={hovered ? 2 : 1.5}
          style={{ transition: "all 0.2s" }} />
      )}

      {/* NOR bubble */}
      {type === "NOR" && (
        <circle cx="60" cy="26" r="7" fill={hovered ? `${color}12` : "none"}
          stroke={hovered ? bright : dim} strokeWidth={hovered ? 2 : 1.5}
          style={{ transition: "all 0.2s" }} />
      )}

      {/* Wires */}
      {ws.map((w, i) => (
        <line key={i} {...w}
          stroke={hovered ? bright : dim}
          strokeWidth={hovered ? 1.8 : 1.2}
          style={{ transition: "all 0.2s" }} />
      ))}

      {/* Traveling signal dot on output wire when hovered */}
      {hovered && (
        <circle r="3" fill={bright} style={{ filter: `drop-shadow(0 0 4px ${bright})` }}>
          <animateMotion
            dur="0.6s"
            repeatCount="indefinite"
            path={`M${ws[2].x1},${ws[2].y1} L${ws[2].x2},${ws[2].y2}`}
          />
        </circle>
      )}

      {/* Input signal dots */}
      {hovered && [0, 1].map(j => (
        <circle key={j} r="2.5" fill={bright} opacity="0.7">
          <animateMotion
            dur="0.5s"
            repeatCount="indefinite"
            begin={`${j * 0.25}s`}
            path={`M${ws[j].x1},${ws[j].y1} L${ws[j].x2},${ws[j].y2}`}
          />
        </circle>
      ))}

      {/* Gate type label inside */}
      <text
        x="40" y={type === "NAND" || type === "NOR" ? "58" : "56"}
        textAnchor="middle"
        fill={hovered ? bright : `${color}50`}
        fontSize="8"
        fontFamily="JetBrains Mono, monospace"
        style={{ transition: "fill 0.2s" }}
      >
        {type}
      </text>
    </svg>
  );
}

export default function GateNavSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gate-nav-item",
        { opacity: 0, y: 40, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5,
          ease: "back.out(1.4)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="min-h-screen px-6 relative flex flex-col items-center justify-center">
      {/* Heading */}
      <div className="w-full max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#00FF88]" />
          <span className="font-mono text-xs text-[#00FF88]/60 tracking-widest uppercase">
            {"// Navi-Gate?"}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Navigate</h2>
        <p className="font-mono text-sm text-[#8899AA]">
          Click a gate to jump to any section
        </p>
      </div>

      {/* Gate row */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Connecting bus line */}
        <div className="relative flex items-center justify-between gap-1 sm:gap-3 md:gap-6">
          {/* Horizontal trace behind gates */}
          <div
            className="absolute top-[44%] left-0 right-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(to right, transparent, #00FF8820 10%, #00FF8820 90%, transparent)",
            }}
          />

          {navGates.map((gate, i) => (
            <motion.button
              key={gate.label}
              className="gate-nav-item relative flex flex-col items-center gap-3 group flex-1 min-w-0"
              style={{ opacity: 0 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => scrollTo(gate.section)}
              whileTap={{ scale: 0.95 }}
            >
              {/* Section name above */}
              <span
                className="font-mono text-[8px] sm:text-[10px] md:text-xs tracking-widest font-bold transition-all duration-200"
                style={{
                  color: hoveredIdx === i ? gate.color : `${gate.color}60`,
                  textShadow: hoveredIdx === i ? `0 0 12px ${gate.color}` : "none",
                }}
              >
                {gate.label}
              </span>

              {/* Gate SVG */}
              <div
                className="w-full transition-all duration-200"
                style={{
                  height: "clamp(56px, 12vw, 100px)",
                  filter: hoveredIdx === i
                    ? `drop-shadow(0 0 12px ${gate.color}) drop-shadow(0 0 24px ${gate.color}80)`
                    : "none",
                }}
              >
                <GateSVG type={gate.type} color={gate.color} hovered={hoveredIdx === i} />
              </div>

              {/* Desc below */}
              <span
                className="font-mono text-[8px] sm:text-[9px] transition-all duration-200"
                style={{
                  color: hoveredIdx === i ? `${gate.color}90` : "#8899AA50",
                }}
              >
                {gate.desc}
              </span>

              {/* Click arrow */}
              <motion.div
                animate={{ y: hoveredIdx === i ? [0, 4, 0] : 0 }}
                transition={{ repeat: hoveredIdx === i ? Infinity : 0, duration: 0.7 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M2 4L6 8L10 4"
                    stroke={hoveredIdx === i ? gate.color : "#8899AA30"}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Bottom hint */}
        <p className="font-mono text-[9px] text-center text-[#8899AA]/25 mt-6 tracking-widest">
          {"// each gate routes to a section of the site"}
        </p>
      </div>
    </section>
  );
}
