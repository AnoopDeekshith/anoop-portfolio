"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const blocks = [
  {
    id: "alu",
    label: "ALU",
    x: 20,
    y: 20,
    w: 180,
    h: 140,
    color: "#00FF88",
    stat: "10.6% IPC gain",
    desc: "32-bit arithmetic logic unit with carry lookahead",
  },
  {
    id: "regfile",
    label: "Register File",
    x: 220,
    y: 20,
    w: 160,
    h: 140,
    color: "#4A9EFF",
    stat: "32×32-bit regs",
    desc: "Dual-read, single-write register file",
  },
  {
    id: "l1cache",
    label: "L1 Cache",
    x: 400,
    y: 20,
    w: 200,
    h: 140,
    color: "#FFB347",
    stat: "52% miss reduction",
    desc: "8KB direct-mapped instruction + data cache",
  },
  {
    id: "clktree",
    label: "Clock Tree",
    x: 20,
    y: 180,
    w: 140,
    h: 120,
    color: "#FF6B9D",
    stat: "±15ps skew",
    desc: "H-tree clock distribution network",
  },
  {
    id: "powergrid",
    label: "Power Grid",
    x: 180,
    y: 180,
    w: 200,
    h: 120,
    color: "#B347FF",
    stat: "IR drop <5mV",
    desc: "Ring + mesh VDD/GND strapping",
  },
  {
    id: "iopads",
    label: "I/O Pads",
    x: 400,
    y: 180,
    w: 200,
    h: 120,
    color: "#FF4444",
    stat: "48 pads total",
    desc: "JTAG, UART, GPIO, power domains",
  },
];

interface Tooltip {
  x: number;
  y: number;
  block: (typeof blocks)[0];
}

export default function ChipFloorplan() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const blockRefs = useRef<(SVGGElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.7, transformOrigin: "center center" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.12,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#4A9EFF]" />
          <span className="font-mono text-xs text-[#4A9EFF]/60 tracking-widest uppercase">
            Zone B — Chip Floorplan
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          RTL → GDS Floorplan
        </h2>
        <p className="font-mono text-sm text-[#8899AA] mb-10">
          {"// Tool: Cadence Innovus  |  28nm PDK  |  Hover blocks for stats"}
        </p>

        {/* Floorplan SVG */}
        <div className="relative border border-[#1E2A3A] bg-[#060B10] p-4">
          {/* Toolbar mock */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#1E2A3A]">
            <span className="font-mono text-[10px] text-[#00FF88]/60">Innovus™ Implementation System</span>
            <span className="ml-auto font-mono text-[10px] text-[#4A9EFF]/40">28nm | PVT: SS/0.9V/125°C</span>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 620 320"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background grid */}
            <defs>
              <pattern id="fpgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E2A3A" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="620" height="320" fill="url(#fpgrid)" />

            {/* Die outline */}
            <rect
              x="10"
              y="10"
              width="600"
              height="300"
              fill="none"
              stroke="#00FF88"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="4 2"
            />

            {/* Blocks */}
            {blocks.map((block, i) => (
              <g
                key={block.id}
                ref={(el) => { blockRefs.current[i] = el; }}
                style={{ opacity: 0, cursor: "crosshair" }}
                onMouseEnter={() => {
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const scaleX = rect.width / 620;
                  const scaleY = rect.height / 320;
                  setTooltip({
                    x: (block.x + block.w / 2) * scaleX + rect.left,
                    y: (block.y) * scaleY + rect.top - 10,
                    block,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Block fill */}
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.w}
                  height={block.h}
                  fill={`${block.color}12`}
                  stroke={block.color}
                  strokeWidth="1"
                  rx="2"
                />
                {/* Block hatching */}
                <rect
                  x={block.x + 1}
                  y={block.y + 1}
                  width={block.w - 2}
                  height={block.h - 2}
                  fill="none"
                  stroke={block.color}
                  strokeWidth="0.3"
                  strokeDasharray="3 6"
                  opacity="0.3"
                />
                {/* Label background */}
                <rect
                  x={block.x + 8}
                  y={block.y + 8}
                  width={block.label.length * 7 + 8}
                  height={16}
                  fill="#060B10"
                  rx="2"
                />
                {/* Label */}
                <text
                  x={block.x + 12}
                  y={block.y + 20}
                  fill={block.color}
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  {block.label}
                </text>
                {/* Corner notch */}
                <line
                  x1={block.x + block.w - 12}
                  y1={block.y}
                  x2={block.x + block.w}
                  y2={block.y + 12}
                  stroke={block.color}
                  strokeWidth="1"
                  opacity="0.6"
                />
                {/* Stat text */}
                <text
                  x={block.x + block.w / 2}
                  y={block.y + block.h / 2 + 16}
                  fill={block.color}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  opacity="0.5"
                >
                  {block.stat}
                </text>
              </g>
            ))}

            {/* Power ring */}
            <rect
              x="615"
              y="5"
              width="0"
              height="310"
              fill="none"
              stroke="#FFB347"
              strokeWidth="3"
              opacity="0.3"
            />

            {/* Coordinate labels */}
            <text x="12" y="318" fill="#4A9EFF" fontSize="7" fontFamily="monospace" opacity="0.4">
              (0,0)
            </text>
            <text x="560" y="318" fill="#4A9EFF" fontSize="7" fontFamily="monospace" opacity="0.4">
              (62μm,32μm)
            </text>
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-[#1E2A3A]">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 border" style={{ borderColor: b.color, background: `${b.color}20` }} />
                <span className="font-mono text-[10px]" style={{ color: b.color }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none border border-[#1E2A3A] bg-[#060B10]/95 backdrop-blur p-3 min-w-44"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
            borderColor: tooltip.block.color,
          }}
        >
          <div className="font-mono text-xs font-bold mb-1" style={{ color: tooltip.block.color }}>
            {tooltip.block.label}
          </div>
          <div className="font-mono text-[11px] text-[#00FF88] mb-1">
            ◆ {tooltip.block.stat}
          </div>
          <div className="font-mono text-[10px] text-[#8899AA] leading-tight">
            {tooltip.block.desc}
          </div>
        </div>
      )}
    </section>
  );
}
