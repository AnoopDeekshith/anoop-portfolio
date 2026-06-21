"use client";

import { useEffect, useRef } from "react";

interface GateProps {
  x: number;
  y: number;
  type: "AND" | "OR" | "XOR" | "NAND";
  delay: number;
}

function LogicGate({ x, y, type, delay }: GateProps) {
  const color = "#00FF88";
  const dim = "#00FF8840";

  const getPath = () => {
    switch (type) {
      case "AND":
        return (
          <g>
            <path
              d="M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z"
              fill="none"
              stroke={dim}
              strokeWidth="1.5"
            />
            <path
              d="M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className="signal-line"
              style={{ animationDelay: `${delay}s` }}
            />
            <line x1="-12" y1="9" x2="0" y2="9" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="-12" y1="21" x2="0" y2="21" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="35" y1="15" x2="47" y2="15" stroke={color} strokeWidth="1" opacity="0.5" />
            <text x="-18" y="17" fill={color} fontSize="7" fontFamily="monospace" opacity="0.6">AND</text>
          </g>
        );
      case "OR":
        return (
          <g>
            <path
              d="M0,0 Q10,0 20,15 Q10,30 0,30 Q15,30 30,15 Q15,0 0,0 Z"
              fill="none"
              stroke={dim}
              strokeWidth="1.5"
            />
            <path
              d="M0,0 Q10,0 20,15 Q10,30 0,30 Q15,30 30,15 Q15,0 0,0 Z"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className="signal-line"
              style={{ animationDelay: `${delay}s` }}
            />
            <line x1="-12" y1="9" x2="3" y2="9" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="-12" y1="21" x2="3" y2="21" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="30" y1="15" x2="42" y2="15" stroke={color} strokeWidth="1" opacity="0.5" />
            <text x="-16" y="17" fill={color} fontSize="7" fontFamily="monospace" opacity="0.6">OR</text>
          </g>
        );
      case "XOR":
        return (
          <g>
            <path
              d="M5,0 Q15,0 25,15 Q15,30 5,30 Q20,30 35,15 Q20,0 5,0 Z"
              fill="none"
              stroke={dim}
              strokeWidth="1.5"
            />
            <path
              d="M5,0 Q15,0 25,15 Q15,30 5,30 Q20,30 35,15 Q20,0 5,0 Z"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className="signal-line"
              style={{ animationDelay: `${delay}s` }}
            />
            <path d="M0,0 Q5,15 0,30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
            <line x1="-12" y1="9" x2="5" y2="9" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="-12" y1="21" x2="5" y2="21" stroke={color} strokeWidth="1" opacity="0.5" />
            <text x="-17" y="17" fill={color} fontSize="7" fontFamily="monospace" opacity="0.6">XOR</text>
          </g>
        );
      case "NAND":
        return (
          <g>
            <path
              d="M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z"
              fill="none"
              stroke={dim}
              strokeWidth="1.5"
            />
            <path
              d="M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className="signal-line"
              style={{ animationDelay: `${delay}s` }}
            />
            <circle cx="38" cy="15" r="3" fill="none" stroke={color} strokeWidth="1.5" />
            <line x1="-12" y1="9" x2="0" y2="9" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="-12" y1="21" x2="0" y2="21" stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1="41" y1="15" x2="53" y2="15" stroke={color} strokeWidth="1" opacity="0.5" />
            <text x="-19" y="17" fill={color} fontSize="7" fontFamily="monospace" opacity="0.6">NAND</text>
          </g>
        );
    }
  };

  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.35">
      {getPath()}
    </g>
  );
}

const gates: GateProps[] = [
  { x: 60, y: 80, type: "AND", delay: 0 },
  { x: 220, y: 140, type: "OR", delay: 0.5 },
  { x: 400, y: 60, type: "XOR", delay: 1 },
  { x: 600, y: 160, type: "NAND", delay: 1.5 },
  { x: 780, y: 90, type: "AND", delay: 0.8 },
  { x: 950, y: 180, type: "OR", delay: 0.3 },
  { x: 1100, y: 70, type: "XOR", delay: 1.2 },
  { x: 1280, y: 140, type: "NAND", delay: 0.6 },
  { x: 80, y: 300, type: "XOR", delay: 1.8 },
  { x: 320, y: 280, type: "NAND", delay: 0.9 },
  { x: 520, y: 340, type: "AND", delay: 0.4 },
  { x: 720, y: 290, type: "OR", delay: 1.6 },
  { x: 900, y: 350, type: "XOR", delay: 0.7 },
  { x: 1100, y: 310, type: "AND", delay: 1.1 },
  { x: 1300, y: 300, type: "OR", delay: 0.2 },
  { x: 150, y: 450, type: "NAND", delay: 1.4 },
  { x: 450, y: 480, type: "AND", delay: 0.6 },
  { x: 700, y: 430, type: "OR", delay: 1.9 },
  { x: 1000, y: 470, type: "XOR", delay: 0.1 },
  { x: 1200, y: 460, type: "NAND", delay: 1.3 },
];

export default function LogicGateBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const updateSize = () => {
      svg.setAttribute("width", String(window.innerWidth));
      svg.setAttribute("height", String(window.innerHeight));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      {/* Horizontal signal traces */}
      {[120, 220, 340, 450, 550].map((y, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={y}
          x2="100%"
          y2={y}
          stroke="#00FF88"
          strokeWidth="0.5"
          opacity="0.08"
          strokeDasharray="8 16"
        />
      ))}
      {/* Vertical signal traces */}
      {[200, 500, 800, 1100].map((x, i) => (
        <line
          key={`v-${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2="100%"
          stroke="#4A9EFF"
          strokeWidth="0.5"
          opacity="0.06"
          strokeDasharray="6 20"
        />
      ))}
      {gates.map((gate, i) => (
        <LogicGate key={i} {...gate} />
      ))}
    </svg>
  );
}
