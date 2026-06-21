"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const experiences = [
  {
    title: "Post-Silicon Validation Engineer II",
    company: "Anora Semiconductor Labs",
    duration: "4 years",
    color: "#00FF88",
    points: [
      "Silicon bring-up and functional validation of mixed-signal SoCs from first silicon to production",
      "Automated test content development on Teradyne UltraFLEX ATE for digital, analog, and mixed-signal IPs",
      "JTAG and SPI-based register-level debug; authored over 200 bench scripts in Python/C++",
      "Root-cause analysis of post-silicon failures; interfaced directly with RTL and physical design teams",
      "Yield analysis and correlation of ATE results to in-process wafer sort data",
    ],
  },
];

const skills = [
  { cat: "RTL / HDL", items: ["Verilog", "SystemVerilog", "VHDL", "UVM"], color: "#00FF88" },
  { cat: "EDA Tools", items: ["Cadence Innovus", "Xcelium", "Synopsys DC", "Genus"], color: "#4A9EFF" },
  { cat: "ATE / Validation", items: ["Teradyne UltraFLEX", "JTAG", "SPI", "Bench Debug"], color: "#FFB347" },
  { cat: "Languages", items: ["C++", "Python", "Tcl", "Bash"], color: "#FF6B9D" },
  { cat: "Simulation", items: ["Gem5", "Scarab", "ModelSim", "GTKWave"], color: "#B347FF" },
  { cat: "Platforms", items: ["FPGA (Xilinx)", "CUDA", "RISC-V", "ARM"], color: "#FF8C42" },
];

export default function WaferSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const waferRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Wafer zoom-out reveal
      gsap.fromTo(
        waferRef.current,
        { scale: 4, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
          delay: 0.4,
        }
      );

      // Skill cards stagger
      skillRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.07,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate wafer die grid
  const waferRadius = 200;
  const dieW = 18;
  const dieH = 14;
  const dies: { x: number; y: number; status: "pass" | "fail" | "edge" }[] = [];
  for (let row = -waferRadius; row <= waferRadius; row += dieH + 1) {
    for (let col = -waferRadius; col <= waferRadius; col += dieW + 1) {
      const dist = Math.sqrt(row * row + col * col);
      if (dist < waferRadius - 10) {
        const edgeDist = waferRadius - dist;
        const status = edgeDist < 25 ? "edge" : Math.random() > 0.08 ? "pass" : "fail";
        dies.push({ x: col + waferRadius + 10, y: row + waferRadius + 10, status });
      }
    }
  }

  return (
    <section id="ate-section" ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#FF6B9D]" />
          <span className="font-mono text-xs text-[#FF6B9D]/60 tracking-widest uppercase">
            ATE Validation Experience
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          From Die to Wafer
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Wafer SVG */}
          <div className="flex justify-center">
            <svg
              ref={waferRef}
              viewBox="0 0 420 420"
              width="100%"
              style={{ maxWidth: 380, opacity: 0 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Wafer background */}
              <defs>
                <radialGradient id="waferGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1A1A2E" />
                  <stop offset="60%" stopColor="#0F0F1A" />
                  <stop offset="100%" stopColor="#050508" />
                </radialGradient>
                <radialGradient id="waferSheen" cx="35%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="rgba(100,150,255,0.12)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <clipPath id="waferClip">
                  <circle cx="210" cy="210" r="198" />
                </clipPath>
              </defs>

              {/* Wafer disc */}
              <circle cx="210" cy="210" r="200" fill="url(#waferGrad)" />
              <circle cx="210" cy="210" r="200" fill="url(#waferSheen)" />

              {/* Dies */}
              <g clipPath="url(#waferClip)">
                {dies.map((die, i) => (
                  <rect
                    key={i}
                    x={die.x}
                    y={die.y}
                    width={dieW}
                    height={dieH}
                    fill={
                      die.status === "pass"
                        ? "rgba(0,255,136,0.35)"
                        : die.status === "fail"
                        ? "rgba(255,50,50,0.5)"
                        : "rgba(100,100,120,0.2)"
                    }
                    stroke={
                      die.status === "pass"
                        ? "rgba(0,255,136,0.15)"
                        : die.status === "fail"
                        ? "rgba(255,50,50,0.2)"
                        : "rgba(80,80,100,0.1)"
                    }
                    strokeWidth="0.5"
                    rx="0.5"
                  />
                ))}
              </g>

              {/* Wafer ring */}
              <circle cx="210" cy="210" r="200" fill="none" stroke="#4A9EFF" strokeWidth="1.5" opacity="0.4" />
              <circle cx="210" cy="210" r="192" fill="none" stroke="#4A9EFF" strokeWidth="0.5" opacity="0.2" />

              {/* Flat edge (orientation notch) */}
              <rect x="185" y="405" width="50" height="8" fill="#0A0A0F" />

              {/* Labels */}
              <text x="210" y="28" textAnchor="middle" fill="#4A9EFF" fontSize="9" fontFamily="monospace" opacity="0.6">
                ANORA-SEM-28N · LOT-2024-A
              </text>
              <text x="210" y="400" textAnchor="middle" fill="#4A9EFF" fontSize="7" fontFamily="monospace" opacity="0.4">
                ⌀ 300mm
              </text>

              {/* Legend */}
              <rect x="20" y="360" width="10" height="8" fill="rgba(0,255,136,0.35)" />
              <text x="34" y="368" fill="#00FF88" fontSize="8" fontFamily="monospace">PASS</text>
              <rect x="80" y="360" width="10" height="8" fill="rgba(255,50,50,0.5)" />
              <text x="94" y="368" fill="#FF4444" fontSize="8" fontFamily="monospace">FAIL</text>

              {/* Yield stat */}
              <text x="210" y="214" textAnchor="middle" fill="#00FF88" fontSize="13" fontFamily="monospace" fontWeight="bold" opacity="0.7">
                ~92% YIELD
              </text>
              <text x="210" y="228" textAnchor="middle" fill="#8899AA" fontSize="8" fontFamily="monospace" opacity="0.5">
                Wafer Sort · Teradyne UltraFLEX
              </text>
            </svg>
          </div>

          {/* Experience content */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            {experiences.map((exp) => (
              <div key={exp.title} className="border border-[#1E2A3A] bg-[#0D1117] p-6 mb-6">
                <div className="font-mono text-[10px] text-[#00FF88]/60 tracking-widest uppercase mb-2">
                  Industry Experience
                </div>
                <div className="font-bold text-white text-lg mb-1" style={{ fontFamily: "var(--font-inter)" }}>
                  {exp.title}
                </div>
                <div className="font-mono text-sm text-[#4A9EFF] mb-1">{exp.company}</div>
                <div className="font-mono text-xs text-[#8899AA]/60 mb-4">{exp.duration}</div>
                <ul className="space-y-2">
                  {exp.points.map((pt, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#00FF88] mt-0.5 flex-shrink-0">▸</span>
                      <span className="font-mono text-xs text-[#8899AA] leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#4A9EFF]" />
            <span className="font-mono text-xs text-[#4A9EFF]/60 tracking-widest uppercase">
              Technical Skills
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <div
                key={skill.cat}
                ref={(el) => { skillRefs.current[i] = el; }}
                className="border border-[#1E2A3A] bg-[#0D1117] p-4"
                style={{ opacity: 0 }}
              >
                <div
                  className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold"
                  style={{ color: skill.color }}
                >
                  {skill.cat}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[10px] px-2 py-0.5 border"
                      style={{
                        borderColor: `${skill.color}30`,
                        color: `${skill.color}90`,
                        background: `${skill.color}08`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
