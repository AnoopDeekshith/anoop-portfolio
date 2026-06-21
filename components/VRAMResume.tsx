"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const memoryEntries = [
  {
    addr: "0x0000",
    key: "FILE",
    value: "Anoop_Deekshith_R_Resume.pdf",
    type: "PDF",
    color: "#00FF88",
  },
  {
    addr: "0x0001",
    key: "EDU",
    value: "UCSC M.S. ECE · Expected June 2027",
    type: "STR",
    color: "#4A9EFF",
  },
  {
    addr: "0x0002",
    key: "EXP",
    value: "Anora Semiconductor · PSV Engineer II · 4 yrs",
    type: "STR",
    color: "#FFB347",
  },
  {
    addr: "0x0003",
    key: "SKILL",
    value: "Verilog · SystemVerilog · C++ · Cadence Innovus · Teradyne ATE",
    type: "ARR",
    color: "#FF6B9D",
  },
  {
    addr: "0x0004",
    key: "LOC",
    value: "San Francisco, CA · Open to Relocation",
    type: "STR",
    color: "#B347FF",
  },
  {
    addr: "0x0005",
    key: "CERTS",
    value: "Post-Silicon Validation · RTL Design · Physical Implementation",
    type: "ARR",
    color: "#00FF88",
  },
];

export default function VRAMResume() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.08,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="resume" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#FFB347]" />
          <span className="font-mono text-xs text-[#FFB347]/60 tracking-widest uppercase">
            Resume — VRAM Dump
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Memory Layout
        </h2>
        <p className="font-mono text-sm text-[#8899AA] mb-10">
          {"// GPU VRAM  |  Base addr: 0x0000  |  Segment: .resume"}
        </p>

        {/* VRAM panel */}
        <div className="border border-[#1E2A3A] bg-[#060B10] scanlines overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E2A3A] bg-[#0A0F14]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="font-mono text-[10px] text-[#8899AA]/60 ml-2">
              NVIDIA VRAM Inspector — Segment: .career_data
            </span>
            <span className="ml-auto font-mono text-[10px] text-[#00FF88]/60">
              RW | ALLOC: 6 entries | 0x0000–0x0005
            </span>
          </div>

          {/* Column headers */}
          <div className="flex items-center px-4 py-2 border-b border-[#1E2A3A] bg-[#0A0F14]/50">
            <span className="font-mono text-[9px] text-[#8899AA]/40 w-20">ADDR</span>
            <span className="font-mono text-[9px] text-[#8899AA]/40 w-16">KEY</span>
            <span className="font-mono text-[9px] text-[#8899AA]/40 w-12">TYPE</span>
            <span className="font-mono text-[9px] text-[#8899AA]/40">VALUE</span>
          </div>

          {/* Memory rows */}
          <div className="divide-y divide-[#1E2A3A]/50">
            {memoryEntries.map((entry, i) => (
              <div
                key={entry.addr}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="flex items-start px-4 py-3 hover:bg-[#00FF88]/3 transition-colors group"
                style={{ opacity: 0 }}
              >
                {/* Address */}
                <span className="font-mono text-xs text-[#8899AA]/50 w-20 shrink-0 group-hover:text-[#8899AA] transition-colors">
                  {entry.addr}
                </span>
                {/* Key */}
                <span
                  className="font-mono text-xs w-16 shrink-0 font-bold"
                  style={{ color: entry.color }}
                >
                  {entry.key}
                </span>
                {/* Type */}
                <span className="font-mono text-[9px] w-12 shrink-0 text-[#8899AA]/40 mt-0.5">
                  [{entry.type}]
                </span>
                {/* Value */}
                <span className="font-mono text-xs text-[#E8EAF0]/80 group-hover:text-white transition-colors">
                  &ldquo;{entry.value}&rdquo;
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#1E2A3A] bg-[#0A0F14]/50 flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#8899AA]/30">
              Heap fragmentation: 0.0% | GC: disabled
            </span>
            <span className="font-mono text-[9px] text-[#00FF88]/40">
              ● SEGMENT LOADED
            </span>
          </div>
        </div>

        {/* Download CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 border border-[#00FF88] bg-[#00FF88]/5 px-8 py-4 font-mono text-sm text-[#00FF88] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#00FF88]/10"
            style={{
              animation: "btn-glow 2.5s ease-in-out infinite",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-y-0.5 transition-transform"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download .PDF
          </a>
          <span className="font-mono text-xs text-[#8899AA]/50">
            {"// Last updated: 2025"}
          </span>
        </div>

        {/* Experience timeline */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <div className="border border-[#1E2A3A] bg-[#0D1117] p-6">
            <div className="font-mono text-[10px] text-[#00FF88]/60 tracking-widest uppercase mb-3">
              Education
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-mono text-sm text-white font-bold">UC Santa Cruz</div>
                <div className="font-mono text-xs text-[#4A9EFF]">M.S. Electrical & Computer Engineering</div>
                <div className="font-mono text-[10px] text-[#8899AA]/60 mt-1">Expected June 2027 · Santa Cruz, CA</div>
              </div>
              <div className="border-t border-[#1E2A3A] pt-4">
                <div className="font-mono text-sm text-white font-bold">VTU</div>
                <div className="font-mono text-xs text-[#4A9EFF]">B.E. Electronics & Communication</div>
                <div className="font-mono text-[10px] text-[#8899AA]/60 mt-1">Graduated 2021</div>
              </div>
            </div>
          </div>

          <div className="border border-[#1E2A3A] bg-[#0D1117] p-6">
            <div className="font-mono text-[10px] text-[#FFB347]/60 tracking-widest uppercase mb-3">
              Experience
            </div>
            <div>
              <div className="font-mono text-sm text-white font-bold">Anora Semiconductor Labs</div>
              <div className="font-mono text-xs text-[#FFB347]">Post-Silicon Validation Engineer II</div>
              <div className="font-mono text-[10px] text-[#8899AA]/60 mt-1">4 years · Teradyne ATE · Bench debug</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Teradyne ATE", "JTAG", "SPI", "Post-Si Debug", "Yield Analysis"].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] px-2 py-0.5 border border-[#FFB347]/30 text-[#FFB347]/70 bg-[#FFB347]/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
