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

const gatePaths: Record<GateType, string> = {
  AND:  "M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z",
  OR:   "M0,0 Q10,0 20,15 Q10,30 0,30 Q15,30 30,15 Q15,0 0,0 Z",
  XOR:  "M5,0 Q15,0 25,15 Q15,30 5,30 Q20,30 35,15 Q20,0 5,0 Z",
  NAND: "M0,0 L0,30 L15,30 Q35,30 35,15 Q35,0 15,0 Z",
};

const BASE_OPACITY  = 0.42;   // always-visible resting state
const HOVER_RADIUS  = 120;    // SVG-px proximity radius
const SWEEP_SPEED   = 0.035;

export default function LogicGateBackground() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const signalRefs = useRef<(SVGPathElement | null)[]>([]);
  const groupRefs  = useRef<(SVGGElement   | null)[]>([]);
  const phaseRef   = useRef<number[]>(gates.map(() => Math.random()));
  const animRef    = useRef<number>(0);
  const mouseRef   = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const resize = () => {
      svg.setAttribute("width",  String(window.innerWidth));
      svg.setAttribute("height", String(window.innerHeight));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = null; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const svgCTM = svg.getScreenCTM();

      gates.forEach((gate, i) => {
        const glowEl  = signalRefs.current[i];
        const groupEl = groupRefs.current[i];
        if (!glowEl || !groupEl) return;

        let proximity = 0;
        if (mouseRef.current && svgCTM) {
          const inv = svgCTM.inverse();
          // Convert screen → SVG coords
          const sx = mouseRef.current.x * inv.a + mouseRef.current.y * inv.c + inv.e;
          const sy = mouseRef.current.x * inv.b + mouseRef.current.y * inv.d + inv.f;
          const cx = gate.x + 17;
          const cy = gate.y + 15;
          const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
          proximity = Math.max(0, 1 - dist / HOVER_RADIUS);
        }

        // Fade group between BASE and full
        groupEl.style.opacity = String(BASE_OPACITY + proximity * (1 - BASE_OPACITY));

        if (proximity > 0.02) {
          phaseRef.current[i] = (phaseRef.current[i] + SWEEP_SPEED * proximity) % 1;
          const dashLen = 200;
          glowEl.style.strokeDasharray  = `${dashLen}`;
          glowEl.style.strokeDashoffset = `${dashLen * (1 - phaseRef.current[i])}`;
          glowEl.style.opacity = String(proximity * 0.95);
          glowEl.style.filter  = `drop-shadow(0 0 ${5 * proximity}px #00FF88)`;
        } else {
          glowEl.style.opacity = "0";
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
      {[120, 220, 340, 450, 550].map((y, i) => (
        <line key={`h-${i}`} x1="0" y1={y} x2="100%" y2={y}
          stroke="#00FF88" strokeWidth="0.5" opacity="0.07" strokeDasharray="8 16" />
      ))}
      {[200, 500, 800, 1100].map((x, i) => (
        <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="100%"
          stroke="#4A9EFF" strokeWidth="0.5" opacity="0.05" strokeDasharray="6 20" />
      ))}

      {gates.map((gate, i) => {
        const path = gatePaths[gate.type];
        const dim  = "#00FF8838";

        return (
          <g
            key={i}
            ref={el => { groupRefs.current[i] = el; }}
            transform={`translate(${gate.x}, ${gate.y})`}
            style={{ opacity: BASE_OPACITY }}
          >
            {/* Static dim outline — always visible */}
            <path d={path} fill="none" stroke={dim} strokeWidth="1.5" />

            {/* NAND bubble */}
            {gate.type === "NAND" && (
              <circle cx="38" cy="15" r="3" fill="none" stroke={dim} strokeWidth="1.5" />
            )}
            {/* XOR extra curve */}
            {gate.type === "XOR" && (
              <path d="M0,0 Q5,15 0,30" fill="none" stroke={dim} strokeWidth="1.2" />
            )}

            {/* Input / output wires */}
            <line x1="-12" y1="9"  x2="0"  y2="9"  stroke={dim} strokeWidth="1" />
            <line x1="-12" y1="21" x2="0"  y2="21" stroke={dim} strokeWidth="1" />
            <line x1={gate.type === "OR" ? "30" : gate.type === "XOR" ? "35" : gate.type === "NAND" ? "41" : "35"}
                  y1="15"
                  x2={gate.type === "OR" ? "42" : gate.type === "XOR" ? "47" : gate.type === "NAND" ? "53" : "47"}
                  y2="15"
                  stroke={dim} strokeWidth="1" />

            {/* Hover-driven glow sweep */}
            <path
              ref={el => { signalRefs.current[i] = el; }}
              d={path}
              fill="none"
              stroke="#00FF88"
              strokeWidth="2"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{ opacity: 0 }}
            />

            {/* Gate label */}
            <text
              x={gate.type === "NAND" ? -19 : gate.type === "XOR" ? -17 : gate.type === "OR" ? -14 : -18}
              y="17"
              fill="#00FF8855"
              fontSize="7"
              fontFamily="JetBrains Mono, monospace"
            >
              {gate.type}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
