"use client";

import { useEffect, useRef } from "react";

type GateType = "AND" | "OR" | "XOR" | "NAND";

interface Gate {
  x: number;
  y: number;
  type: GateType;
}

const gates: Gate[] = [
  { x: 60,   y: 80,  type: "AND"  },
  { x: 220,  y: 140, type: "OR"   },
  { x: 400,  y: 60,  type: "XOR"  },
  { x: 600,  y: 160, type: "NAND" },
  { x: 780,  y: 90,  type: "AND"  },
  { x: 950,  y: 180, type: "OR"   },
  { x: 1100, y: 70,  type: "XOR"  },
  { x: 1280, y: 140, type: "NAND" },
  { x: 80,   y: 300, type: "XOR"  },
  { x: 320,  y: 280, type: "NAND" },
  { x: 520,  y: 340, type: "AND"  },
  { x: 720,  y: 290, type: "OR"   },
  { x: 900,  y: 350, type: "XOR"  },
  { x: 1100, y: 310, type: "AND"  },
  { x: 1300, y: 300, type: "OR"   },
  { x: 150,  y: 450, type: "NAND" },
  { x: 450,  y: 480, type: "AND"  },
  { x: 700,  y: 430, type: "OR"   },
  { x: 1000, y: 470, type: "XOR"  },
  { x: 1200, y: 460, type: "NAND" },
];

// Gate SVG path data
const gatePaths: Record<GateType, string> = {
  AND:  "M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z",
  OR:   "M0,0 Q10,0 20,15 Q10,30 0,30 Q15,30 30,15 Q15,0 0,0 Z",
  XOR:  "M5,0 Q15,0 25,15 Q15,30 5,30 Q20,30 35,15 Q20,0 5,0 Z",
  NAND: "M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z",
};

// Input/output wire offsets per gate type
const gateWires: Record<GateType, { in1: [number,number,number,number]; in2: [number,number,number,number]; out: [number,number,number,number] }> = {
  AND:  { in1: [-12,9,0,9],   in2: [-12,21,0,21],  out: [35,15,47,15] },
  OR:   { in1: [-12,9,3,9],   in2: [-12,21,3,21],  out: [30,15,42,15] },
  XOR:  { in1: [-12,9,5,9],   in2: [-12,21,5,21],  out: [35,15,47,15] },
  NAND: { in1: [-12,9,0,9],   in2: [-12,21,0,21],  out: [41,15,53,15] },
};

const HOVER_RADIUS = 130; // px — distance at which gates start to light up

export default function LogicGateBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const signalRefs = useRef<(SVGPathElement | null)[]>([]);
  const groupRefs  = useRef<(SVGGElement   | null)[]>([]);
  const animRef    = useRef<number>(0);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  // Track per-gate animation phase (0–1) for smooth sweep
  const phaseRef   = useRef<number[]>(gates.map(() => 0));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Size SVG to window
    const resize = () => {
      svg.setAttribute("width",  String(window.innerWidth));
      svg.setAttribute("height", String(window.innerHeight));
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse globally — works even though SVG has pointer-events:none
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const RAF_SPEED = 0.04; // how fast the dash-offset sweeps per frame when active

    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;
      const svgRect = svg.getBoundingClientRect();

      gates.forEach((gate, i) => {
        // Gate center in screen space (SVG has no viewBox, 1:1 with screen)
        const gx = svgRect.left + gate.x + 18; // +18 to center on gate body
        const gy = svgRect.top  + gate.y + 15;
        const dist = Math.sqrt((mx - gx) ** 2 + (my - gy) ** 2);

        // Proximity factor: 1 when mouse is on the gate, 0 at HOVER_RADIUS
        const proximity = Math.max(0, 1 - dist / HOVER_RADIUS);

        const signalEl = signalRefs.current[i];
        const groupEl  = groupRefs.current[i];
        if (!signalEl || !groupEl) return;

        if (proximity > 0.01) {
          // Advance the sweep animation
          phaseRef.current[i] = (phaseRef.current[i] + RAF_SPEED * proximity) % 1;
          const dashLen = 200;
          const offset  = dashLen * (1 - phaseRef.current[i]);

          signalEl.style.strokeDasharray  = `${dashLen}`;
          signalEl.style.strokeDashoffset = `${offset}`;
          signalEl.style.opacity = String(proximity);
          signalEl.style.filter  = `drop-shadow(0 0 ${4 * proximity}px #00FF88)`;

          // Brighten the whole gate group proportionally
          groupEl.style.opacity = String(0.15 + proximity * 0.85);
        } else {
          // Freeze in place, fade out
          signalEl.style.opacity = "0";
          groupEl.style.opacity  = "0.15";
        }
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      {/* Subtle horizontal traces */}
      {[120, 220, 340, 450, 550].map((y, i) => (
        <line key={`h-${i}`} x1="0" y1={y} x2="100%" y2={y}
          stroke="#00FF88" strokeWidth="0.5" opacity="0.05" strokeDasharray="8 16" />
      ))}
      {/* Subtle vertical traces */}
      {[200, 500, 800, 1100].map((x, i) => (
        <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="100%"
          stroke="#4A9EFF" strokeWidth="0.5" opacity="0.04" strokeDasharray="6 20" />
      ))}

      {gates.map((gate, i) => {
        const path  = gatePaths[gate.type];
        const wires = gateWires[gate.type];
        const dim   = "#00FF8828";

        return (
          <g
            key={i}
            ref={el => { groupRefs.current[i] = el; }}
            transform={`translate(${gate.x}, ${gate.y})`}
            style={{ opacity: 0.15 }}
          >
            {/* Always-visible dim gate outline */}
            <path d={path} fill="none" stroke={dim} strokeWidth="1.5" />

            {/* Hover-driven glowing signal sweep — controlled via JS refs */}
            <path
              ref={el => { signalRefs.current[i] = el; }}
              d={path}
              fill="none"
              stroke="#00FF88"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ opacity: 0, transition: "opacity 0.15s" }}
            />

            {/* NAND bubble */}
            {gate.type === "NAND" && (
              <circle cx="38" cy="15" r="3" fill="none" stroke={dim} strokeWidth="1.5" />
            )}
            {/* XOR extra curve */}
            {gate.type === "XOR" && (
              <path d="M0,0 Q5,15 0,30" fill="none" stroke={dim} strokeWidth="1.2" />
            )}

            {/* Input / output wires (always dim) */}
            <line x1={wires.in1[0]} y1={wires.in1[1]} x2={wires.in1[2]} y2={wires.in1[3]} stroke={dim} strokeWidth="1" />
            <line x1={wires.in2[0]} y1={wires.in2[1]} x2={wires.in2[2]} y2={wires.in2[3]} stroke={dim} strokeWidth="1" />
            <line x1={wires.out[0]} y1={wires.out[1]} x2={wires.out[2]} y2={wires.out[3]} stroke={dim} strokeWidth="1" />

            {/* Gate label */}
            <text
              x={gate.type === "NAND" ? -19 : gate.type === "XOR" ? -17 : gate.type === "OR" ? -16 : -18}
              y="17"
              fill="#00FF8860"
              fontSize="7"
              fontFamily="monospace"
            >
              {gate.type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
