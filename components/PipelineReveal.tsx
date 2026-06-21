"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stages = [
  { id: "IF", label: "Instruction\nFetch", color: "#00FF88" },
  { id: "ID", label: "Instruction\nDecode", color: "#4A9EFF" },
  { id: "EX", label: "Execute", color: "#FFB347" },
  { id: "MEM", label: "Memory\nAccess", color: "#FF6B9D" },
  { id: "WB", label: "Write\nBack", color: "#B347FF" },
];

export default function PipelineReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate each stage box sequentially
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.7, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.15,
            onComplete: () => {
              // Add glow after appearing
              gsap.to(el, {
                boxShadow: `0 0 20px ${stages[i].color}60, 0 0 40px ${stages[i].color}30`,
                borderColor: stages[i].color,
                duration: 0.3,
              });
            },
          }
        );
      });

      // Animate wires
      wireRefs.current.forEach((path, i) => {
        if (!path) return;
        const length = path.getTotalLength?.() || 100;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15 + 0.3,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#00FF88]" />
          <span className="font-mono text-xs text-[#00FF88]/60 tracking-widest uppercase">
            Zone A — Pipeline Architecture
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          5-Stage RISC-V RV32I Pipeline
        </h2>
        <p className="font-mono text-sm text-[#8899AA] mt-2">
          {"// ISA: RV32I  |  Hazard detection + data forwarding  |  Branch prediction"}
        </p>
      </div>

      {/* Pipeline stages */}
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* SVG wires between stages */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {stages.slice(0, -1).map((stage, i) => (
              <path
                key={`wire-${i}`}
                ref={(el) => { wireRefs.current[i] = el; }}
                d={`M ${20 * (i + 1)}% 50% L ${20 * (i + 1) + 0.5}% 50%`}
                stroke={stage.color}
                strokeWidth="2"
                fill="none"
                opacity="0.8"
                style={{
                  filter: `drop-shadow(0 0 4px ${stage.color})`,
                }}
              />
            ))}
          </svg>

          <div className="grid grid-cols-5 gap-3 md:gap-6 relative z-10">
            {stages.map((stage, i) => (
              <div
                key={stage.id}
                ref={(el) => { stageRefs.current[i] = el; }}
                className="relative flex flex-col items-center"
                style={{ opacity: 0 }}
              >
                {/* Stage box */}
                <div
                  className="w-full border bg-[#0D1117] p-4 md:p-6 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "#1E2A3A" }}
                >
                  {/* Stage ID */}
                  <div
                    className="font-mono text-2xl md:text-3xl font-bold"
                    style={{ color: stage.color }}
                  >
                    {stage.id}
                  </div>
                  {/* Stage label */}
                  <div className="font-mono text-[10px] text-[#8899AA] text-center leading-tight tracking-wider whitespace-pre-line">
                    {stage.label}
                  </div>
                  {/* Signal indicator */}
                  <div className="w-full h-px mt-2" style={{ background: `${stage.color}40` }} />
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: stage.color,
                      boxShadow: `0 0 8px ${stage.color}`,
                      animation: `pipeline-glow 1.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                </div>

                {/* Arrow between stages */}
                {i < stages.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <svg width="20" height="12" viewBox="0 0 20 12">
                      <path
                        d="M0 6 L14 6 M10 2 L18 6 L10 10"
                        stroke={stage.color}
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "ISA", value: "RV32I" },
            { label: "Stages", value: "5" },
            { label: "Hazard Unit", value: "Enabled" },
            { label: "Forwarding", value: "Full" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-[#1E2A3A] bg-[#0D1117] p-4"
            >
              <div className="font-mono text-[10px] text-[#8899AA]/60 tracking-widest uppercase mb-1">
                {stat.label}
              </div>
              <div className="font-mono text-sm text-[#00FF88]">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
