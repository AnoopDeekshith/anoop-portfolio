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
      "Led silicon bring-up and functional validation of mixed-signal SoCs across 3 product generations — from first-silicon power-on through production release",
      "Developed and maintained automated test programs on Teradyne UltraFLEX ATE covering digital IO, PLL lock, ADC/DAC linearity, and power domain sequencing",
      "Owned JTAG and SPI-based register-level debug flows; authored 200+ bench scripts in Python and C++ for automated fault isolation and margining sweeps",
      "Performed root-cause analysis on post-silicon failures by correlating ATE vectors, JTAG traces, and IR-drop simulations — interfacing daily with RTL and physical design teams",
      "Drove wafer sort to final test correlation studies; identified systematic process-induced failure modes that improved yield by ~4% across two lots",
      "Designed pattern-based fault coverage analysis flows for stuck-at and transition faults; improved overall DFT coverage from 87% to 96% across mixed-signal blocks",
      "Classified post-silicon test escapes and authored failure mode libraries used across three product lines for accelerated debug on future tapeouts",
      "Collaborated with the DFT team on BIST architecture review and scan chain debug during bring-up, reducing first-silicon debug time by 30%",
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
  const packageRef = useRef<SVGSVGElement>(null);
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

      // Package zoom-in reveal (opposite of wafer zoom-out)
      gsap.fromTo(
        packageRef.current,
        { scale: 0.6, opacity: 0, transformOrigin: "center center" },
        {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: packageRef.current,
            start: "top 80%",
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
          {/* Wafer SVG + Packaged device stacked */}
          <div className="flex flex-col items-center gap-8">
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

            {/* ── Packaged Device ── */}
            <svg
              ref={packageRef}
              viewBox="0 0 280 280"
              width="100%"
              style={{ maxWidth: 340, opacity: 0 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="pkgBodyGrad" cx="38%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#1a2535" />
                  <stop offset="100%" stopColor="#07090f" />
                </radialGradient>
                <radialGradient id="dieAreaGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#111825" />
                  <stop offset="100%" stopColor="#060a10" />
                </radialGradient>
                <filter id="pkgPinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Package label */}
              <text x="140" y="22" textAnchor="middle" fill="#4A9EFF" fontSize="8" fontFamily="monospace" opacity="0.65">
                QFP-32 · PACKAGED DIE · POST-SORT
              </text>

              {/* Package shadow glow */}
              <rect x="87" y="87" width="106" height="106" rx="3" fill="rgba(74,158,255,0.06)" />

              {/* Package body */}
              <rect x="88" y="88" width="104" height="104" rx="2" fill="url(#pkgBodyGrad)" stroke="#4A9EFF" strokeWidth="1.2" />

              {/* Body surface marks */}
              <line x1="88" y1="108" x2="192" y2="108" stroke="#4A9EFF" strokeWidth="0.3" opacity="0.15" />
              <line x1="88" y1="172" x2="192" y2="172" stroke="#4A9EFF" strokeWidth="0.3" opacity="0.15" />
              <line x1="108" y1="88" x2="108" y2="192" stroke="#4A9EFF" strokeWidth="0.3" opacity="0.15" />
              <line x1="172" y1="88" x2="172" y2="192" stroke="#4A9EFF" strokeWidth="0.3" opacity="0.15" />

              {/* Die window */}
              <rect x="108" y="108" width="64" height="64" rx="1.5" fill="url(#dieAreaGrad)" stroke="#00FF88" strokeWidth="0.8" strokeDasharray="4 2" />

              {/* Die interconnect grid */}
              {[116,124,132,140,148,156,164].map(v => (
                <line key={`dg-h-${v}`} x1="108" y1={v} x2="172" y2={v} stroke="#00FF88" strokeWidth="0.25" opacity="0.18" />
              ))}
              {[116,124,132,140,148,156,164].map(v => (
                <line key={`dg-v-${v}`} x1={v} y1="108" x2={v} y2="172" stroke="#00FF88" strokeWidth="0.25" opacity="0.18" />
              ))}

              {/* Die labels */}
              <text x="140" y="134" textAnchor="middle" fill="#00FF88" fontSize="7" fontFamily="monospace" fontWeight="bold" opacity="0.9">ANORA</text>
              <text x="140" y="144" textAnchor="middle" fill="#00FF88" fontSize="5.5" fontFamily="monospace" opacity="0.65">SEM-28N-2024A</text>
              <text x="140" y="154" textAnchor="middle" fill="#4A9EFF" fontSize="5" fontFamily="monospace" opacity="0.5">RTL: ADR · PASS</text>

              {/* Pin 1 marker */}
              <circle cx="93" cy="93" r="3.5" fill="#FFB347" opacity="0.85" filter="url(#pkgPinGlow)" />

              {/* ── Left pins (8) ── */}
              {[104,115,126,137,148,159,170,181].map((y, i) => (
                <g key={`lp-${i}`}>
                  <rect x="70" y={y - 3} width="18" height="6" rx="0.8" fill="#1a2535" stroke="#4A9EFF" strokeWidth="0.9" />
                  <rect x="70" y={y - 1} width="18" height="2" rx="0.5" fill="#4A9EFF" opacity="0.12" />
                </g>
              ))}
              {/* ── Right pins (8) ── */}
              {[104,115,126,137,148,159,170,181].map((y, i) => (
                <g key={`rp-${i}`}>
                  <rect x="192" y={y - 3} width="18" height="6" rx="0.8" fill="#1a2535" stroke="#4A9EFF" strokeWidth="0.9" />
                  <rect x="192" y={y - 1} width="18" height="2" rx="0.5" fill="#4A9EFF" opacity="0.12" />
                </g>
              ))}
              {/* ── Top pins (8) ── */}
              {[104,115,126,137,148,159,170,181].map((x, i) => (
                <g key={`tp-${i}`}>
                  <rect x={x - 3} y="70" width="6" height="18" rx="0.8" fill="#1a2535" stroke="#4A9EFF" strokeWidth="0.9" />
                  <rect x={x - 1} y="70" width="2" height="18" rx="0.5" fill="#4A9EFF" opacity="0.12" />
                </g>
              ))}
              {/* ── Bottom pins (8) ── */}
              {[104,115,126,137,148,159,170,181].map((x, i) => (
                <g key={`bp-${i}`}>
                  <rect x={x - 3} y="192" width="6" height="18" rx="0.8" fill="#1a2535" stroke="#4A9EFF" strokeWidth="0.9" />
                  <rect x={x - 1} y="192" width="2" height="18" rx="0.5" fill="#4A9EFF" opacity="0.12" />
                </g>
              ))}

              {/* Bond wires — arcing from die edge to package inner pad */}
              {/* Left side */}
              {[104,115,126,137,148,159,170,181].map((y, i) => (
                <path key={`bwl-${i}`} d={`M 108,${y} Q 97,${y - 8} 88,${y}`} fill="none" stroke="#FFB347" strokeWidth="0.65" opacity="0.55" />
              ))}
              {/* Right side */}
              {[104,115,126,137,148,159,170,181].map((y, i) => (
                <path key={`bwr-${i}`} d={`M 172,${y} Q 183,${y - 8} 192,${y}`} fill="none" stroke="#FFB347" strokeWidth="0.65" opacity="0.55" />
              ))}
              {/* Top side */}
              {[104,115,126,137,148,159,170,181].map((x, i) => (
                <path key={`bwt-${i}`} d={`M ${x},108 Q ${x - 8},97 ${x},88`} fill="none" stroke="#FFB347" strokeWidth="0.65" opacity="0.55" />
              ))}
              {/* Bottom side */}
              {[104,115,126,137,148,159,170,181].map((x, i) => (
                <path key={`bwb-${i}`} d={`M ${x},172 Q ${x - 8},183 ${x},192`} fill="none" stroke="#FFB347" strokeWidth="0.65" opacity="0.55" />
              ))}

              {/* Animated signal dots along bond wires */}
              {/* Left side signals */}
              <circle r="1.8" fill="#00FF88" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.1s" repeatCount="indefinite" begin="0s"    path="M 108,104 Q 97,96 88,104" />
              </circle>
              <circle r="1.8" fill="#4A9EFF" filter="url(#pkgPinGlow)">
                <animateMotion dur="0.9s" repeatCount="indefinite" begin="0.4s"  path="M 108,137 Q 97,129 88,137" />
              </circle>
              <circle r="1.8" fill="#00FF88" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.3s" repeatCount="indefinite" begin="0.7s"  path="M 108,170 Q 97,162 88,170" />
              </circle>
              {/* Right side signals */}
              <circle r="1.8" fill="#FFB347" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.0s" repeatCount="indefinite" begin="0.2s"  path="M 172,115 Q 183,107 192,115" />
              </circle>
              <circle r="1.8" fill="#4A9EFF" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.2s" repeatCount="indefinite" begin="0.55s" path="M 172,148 Q 183,140 192,148" />
              </circle>
              {/* Top side signals */}
              <circle r="1.8" fill="#00FF88" filter="url(#pkgPinGlow)">
                <animateMotion dur="0.85s" repeatCount="indefinite" begin="0.1s" path="M 126,108 Q 118,97 126,88" />
              </circle>
              <circle r="1.8" fill="#FF6B9D" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.15s" repeatCount="indefinite" begin="0.5s" path="M 159,108 Q 151,97 159,88" />
              </circle>
              {/* Bottom side signals */}
              <circle r="1.8" fill="#4A9EFF" filter="url(#pkgPinGlow)">
                <animateMotion dur="1.05s" repeatCount="indefinite" begin="0.3s" path="M 137,172 Q 129,183 137,192" />
              </circle>
              <circle r="1.8" fill="#B347FF" filter="url(#pkgPinGlow)">
                <animateMotion dur="0.95s" repeatCount="indefinite" begin="0.65s" path="M 170,172 Q 162,183 170,192" />
              </circle>

              {/* Bottom annotations */}
              <text x="20" y="255" fill="#FFB347" fontSize="7" fontFamily="monospace" opacity="0.6">─── Bond wire</text>
              <rect x="115" y="251" width="10" height="5" fill="#1a2535" stroke="#4A9EFF" strokeWidth="0.8" />
              <text x="129" y="256" fill="#4A9EFF" fontSize="7" fontFamily="monospace" opacity="0.6">I/O pin</text>
              <text x="185" y="255" fill="#4A9EFF" fontSize="7" fontFamily="monospace" opacity="0.4">14×14mm</text>

              {/* Pin numbers (corners only for readability) */}
              <text x="63" y="107" fill="#4A9EFF" fontSize="5.5" fontFamily="monospace" opacity="0.45" textAnchor="end">1</text>
              <text x="63" y="184" fill="#4A9EFF" fontSize="5.5" fontFamily="monospace" opacity="0.35" textAnchor="end">8</text>
              <text x="217" y="107" fill="#4A9EFF" fontSize="5.5" fontFamily="monospace" opacity="0.35">9</text>
              <text x="210" y="184" fill="#4A9EFF" fontSize="5.5" fontFamily="monospace" opacity="0.35">16</text>
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
