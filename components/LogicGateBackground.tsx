"use client";

import { useEffect, useRef } from "react";

// ─── DRAM circuit layout ──────────────────────────────────────────────────────
// Coordinates in SVG viewBox space (0 0 960 520)
//
//  A0 ─┬─[NOT]─── A0b ─┐
//      │                ├─[AND]─ WL0 ──[CELL]─┐
//  A1 ─┼─[NOT]─── A1b ─┤                      │ BL
//      │                ├─[AND]─ WL1 ──[CELL]─┤────[SA NAND]─┐
//      │                ├─[AND]─ WL2 ──[CELL]─┤              ├─[ColSel AND]─▶ DATA
//      │                └─[AND]─ WL3 ──[CELL]─┘              │
//      └───────────────────────────────────────────[SA NAND]─┘
//
// ─────────────────────────────────────────────────────────────────────────────

const BASE_OPACITY = 0.38;      // always-visible resting state
const HOVER_RADIUS = 110;       // SVG-space proximity radius for glow
const HOVER_FULL   = 0.95;      // max opacity at cursor center
const SWEEP_SPEED  = 0.032;     // dashoffset advance per frame at full proximity

// ─── Gate & element descriptors ──────────────────────────────────────────────

type ElType = "NOT" | "AND" | "NAND" | "OR" | "CELL" | "LABEL";

interface CircuitEl {
  id: string;
  type: ElType;
  cx: number;   // center x in SVG space (for proximity calc)
  cy: number;
  color: string;
}

// All interactive elements (gates + cells) — positions in 960×520 viewBox
const elements: CircuitEl[] = [
  // Inverters
  { id: "not_a0",  type: "NOT",  cx: 130, cy: 135, color: "#00FF88" },
  { id: "not_a1",  type: "NOT",  cx: 130, cy: 380, color: "#00FF88" },
  // Row decoder AND gates (WL0–WL3)
  { id: "and_wl0", type: "AND",  cx: 255, cy: 100, color: "#4A9EFF" },
  { id: "and_wl1", type: "AND",  cx: 255, cy: 195, color: "#4A9EFF" },
  { id: "and_wl2", type: "AND",  cx: 255, cy: 320, color: "#4A9EFF" },
  { id: "and_wl3", type: "AND",  cx: 255, cy: 415, color: "#4A9EFF" },
  // DRAM cells
  { id: "cell0",   type: "CELL", cx: 430, cy: 100, color: "#FFB347" },
  { id: "cell1",   type: "CELL", cx: 430, cy: 195, color: "#FFB347" },
  { id: "cell2",   type: "CELL", cx: 430, cy: 320, color: "#FFB347" },
  { id: "cell3",   type: "CELL", cx: 430, cy: 415, color: "#FFB347" },
  // EQ / precharge OR gate
  { id: "eq_gate", type: "OR",   cx: 590, cy: 258, color: "#B347FF" },
  // Sense amplifier NAND pair
  { id: "sa_nand0",type: "NAND", cx: 720, cy: 195, color: "#FF6B9D" },
  { id: "sa_nand1",type: "NAND", cx: 720, cy: 320, color: "#FF6B9D" },
  // Column select AND
  { id: "col_sel", type: "AND",  cx: 850, cy: 258, color: "#00FF88" },
];

// ─── SVG drawing helpers ──────────────────────────────────────────────────────

// Each helper returns { path, extraPaths } — the main glow path + static decorations

function andGatePath(cx: number, cy: number): string {
  const x = cx - 22; const y = cy - 16;
  return `M${x},${y} L${x},${y+32} L${x+18},${y+32} Q${x+36},${y+32} ${x+36},${y+16} Q${x+36},${y} ${x+18},${y} Z`;
}

function notGatePath(cx: number, cy: number): string {
  const x = cx - 14; const y = cy;
  return `M${x},${y-14} L${x+22},${y} L${x},${y+14} Z`;
}

function orGatePath(cx: number, cy: number): string {
  const x = cx - 18; const y = cy - 15;
  return `M${x},${y} Q${x+10},${y} ${x+22},${y+15} Q${x+10},${y+30} ${x},${y+30} Q${x+16},${y+30} ${x+32},${y+15} Q${x+16},${y} ${x},${y} Z`;
}

function nandGatePath(cx: number, cy: number): string {
  // same as AND but shorter body (bubble adds on right)
  const x = cx - 22; const y = cy - 16;
  return `M${x},${y} L${x},${y+32} L${x+16},${y+32} Q${x+30},${y+32} ${x+30},${y+16} Q${x+30},${y} ${x+16},${y} Z`;
}

// DRAM 1T-1C cell symbol: MOSFET gate + storage cap
function cellPath(cx: number, cy: number): string {
  // Transistor gate line (horizontal bar)
  const paths = [
    `M${cx-18},${cy} L${cx+18},${cy}`,           // gate horizontal
    `M${cx},${cy-18} L${cx},${cy+18}`,            // body vertical
    `M${cx+6},${cy-14} L${cx+6},${cy-4}`,         // cap plate 1
    `M${cx+6},${cy+4} L${cx+6},${cy+14}`,         // cap plate 2
  ];
  return paths.join(" ");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LogicGateBackground() {
  const svgRef      = useRef<SVGSVGElement>(null);
  const glowRefs    = useRef<(SVGElement | null)[]>([]);
  const groupRefs   = useRef<(SVGGElement | null)[]>([]);
  const phaseRef    = useRef<number[]>(elements.map(() => Math.random()));
  const animRef     = useRef<number>(0);
  const mouseRef    = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Global mouse → convert to SVG coordinate space each frame
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouseRef.current = null; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const svgCTM = svg.getScreenCTM();

      elements.forEach((el, i) => {
        const glowEl  = glowRefs.current[i];
        const groupEl = groupRefs.current[i];
        if (!glowEl || !groupEl) return;

        let proximity = 0;

        if (mouseRef.current && svgCTM) {
          // Convert screen px → SVG viewBox coords
          const inv = svgCTM.inverse();
          const sx = mouseRef.current.x * inv.a + mouseRef.current.y * inv.c + inv.e;
          const sy = mouseRef.current.x * inv.b + mouseRef.current.y * inv.d + inv.f;
          const dist = Math.sqrt((sx - el.cx) ** 2 + (sy - el.cy) ** 2);
          proximity = Math.max(0, 1 - dist / HOVER_RADIUS);
        }

        const targetOpacity = BASE_OPACITY + proximity * (HOVER_FULL - BASE_OPACITY);
        groupEl.style.opacity = String(targetOpacity);

        // Advance sweep only when near
        if (proximity > 0.02) {
          phaseRef.current[i] = (phaseRef.current[i] + SWEEP_SPEED * proximity) % 1;
          const dashLen = 160;
          const offset  = dashLen * (1 - phaseRef.current[i]);
          (glowEl as SVGPathElement).style.strokeDasharray  = `${dashLen}`;
          (glowEl as SVGPathElement).style.strokeDashoffset = `${offset}`;
          (glowEl as SVGPathElement).style.opacity = String(proximity * 0.9);
          (glowEl as SVGPathElement).style.filter  = `drop-shadow(0 0 ${5 * proximity}px ${el.color})`;
        } else {
          (glowEl as SVGPathElement).style.opacity = "0";
        }
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── wire colour helpers
  const W  = "#00FF8840";   // dim wire
  const WB = "#4A9EFF30";   // dim blue wire

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 960 520"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      {/* ── background grid ──────────────────────────────────── */}
      <defs>
        <pattern id="cktgrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#00FF8812" strokeWidth="0.4"/>
        </pattern>
      </defs>
      <rect width="960" height="520" fill="url(#cktgrid)" />

      {/* ── signal / address labels ───────────────────────────── */}
      {[
        { x: 28,  y: 138, t: "A[0]", c: "#00FF8870" },
        { x: 28,  y: 383, t: "A[1]", c: "#00FF8870" },
        { x: 300, y:  85, t: "WL0",  c: "#4A9EFF60" },
        { x: 300, y: 180, t: "WL1",  c: "#4A9EFF60" },
        { x: 300, y: 305, t: "WL2",  c: "#4A9EFF60" },
        { x: 300, y: 400, t: "WL3",  c: "#4A9EFF60" },
        { x: 487, y:  50, t: "BL",   c: "#FFB34770" },
        { x: 545, y:  50, t: "BL\u0305", c: "#FFB34770" },
        { x: 590, y: 240, t: "EQ",   c: "#B347FF60" },
        { x: 910, y: 262, t: "DATA", c: "#00FF8870" },
        { x: 760, y: 178, t: "Q",    c: "#FF6B9D60" },
        { x: 760, y: 310, t: "Q\u0305", c: "#FF6B9D60" },
      ].map((l, i) => (
        <text key={i} x={l.x} y={l.y} fill={l.c} fontSize="11" fontFamily="JetBrains Mono, monospace">{l.t}</text>
      ))}

      {/* ── wires ─────────────────────────────────────────────── */}
      {/* A0 input wire */}
      <line x1="60" y1="135" x2="108" y2="135" stroke={W} strokeWidth="1.2"/>
      {/* A1 input wire */}
      <line x1="60" y1="380" x2="108" y2="380" stroke={W} strokeWidth="1.2"/>

      {/* A0 → AND gates (WL0, WL1) and A0b → AND gates (WL2, WL3) */}
      <line x1="60"  y1="135" x2="60"  y2="60"  stroke={W} strokeWidth="1"/>
      <line x1="60"  y1="60"  x2="160" y2="60"  stroke={W} strokeWidth="1"/>
      <line x1="160" y1="60"  x2="160" y2="90"  stroke={W} strokeWidth="1"/>
      <line x1="160" y1="90"  x2="225" y2="90"  stroke={W} strokeWidth="1"/>  {/* → WL0 and_in1 */}

      {/* A0 line drops to WL1 also */}
      <line x1="160" y1="60"  x2="160" y2="185" stroke={W} strokeWidth="1"/>
      <line x1="160" y1="185" x2="225" y2="185" stroke={W} strokeWidth="1"/>  {/* → WL1 and_in1 (via NOT = A0b, skip for readability) */}

      {/* A1 → AND gates */}
      <line x1="60"  y1="380" x2="60"  y2="460" stroke={W} strokeWidth="1"/>
      <line x1="60"  y1="460" x2="160" y2="460" stroke={W} strokeWidth="1"/>
      <line x1="160" y1="460" x2="160" y2="425" stroke={W} strokeWidth="1"/>
      <line x1="160" y1="425" x2="225" y2="425" stroke={W} strokeWidth="1"/>  {/* → WL3 and_in2 */}
      <line x1="160" y1="380" x2="225" y2="310" stroke={W} strokeWidth="1"/>  {/* A1 → WL2 and_in1 (diagonal shortcut for readability) */}

      {/* A1 up to WL0 and WL1 area */}
      <line x1="80"  y1="380" x2="80"  y2="108" stroke={WB} strokeWidth="1"/>
      <line x1="80"  y1="108" x2="225" y2="108" stroke={WB} strokeWidth="1"/>  {/* → WL0 in2 */}
      <line x1="80"  y1="205" x2="225" y2="205" stroke={WB} strokeWidth="1"/>  {/* → WL1 in2 */}
      <circle cx="80" cy="205" r="2.5" fill="#4A9EFF50"/>
      <circle cx="80" cy="108" r="2.5" fill="#4A9EFF50"/>

      {/* NOT gate output wires (A0b, A1b) to decoder */}
      <line x1="152" y1="135" x2="200" y2="135" stroke={W} strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="152" y1="380" x2="200" y2="380" stroke={W} strokeWidth="1" strokeDasharray="3 3"/>

      {/* AND gate outputs → WL lines horizontal */}
      {[100, 195, 320, 415].map((y, i) => (
        <line key={`wl${i}`} x1="288" y1={y} x2="395" y2={y} stroke={W} strokeWidth="1.2"/>
      ))}

      {/* WL lines connect into cells */}
      {[100, 195, 320, 415].map((y, i) => (
        <line key={`wlc${i}`} x1="395" y1={y} x2="415" y2={y} stroke={W} strokeWidth="1.2"/>
      ))}

      {/* BL vertical line (x=487) */}
      <line x1="487" y1="60" x2="487" y2="455" stroke={W} strokeWidth="1.2"/>
      {/* BLB vertical line (x=547) */}
      <line x1="547" y1="60" x2="547" y2="455" stroke={W} strokeWidth="1.2"/>

      {/* Cell outputs to BL */}
      {[100, 195, 320, 415].map((y, i) => (
        <line key={`bl${i}`} x1="447" y1={y} x2="487" y2={y} stroke={W} strokeWidth="1"/>
      ))}

      {/* BL + BLB → EQ gate inputs */}
      <line x1="487" y1="258" x2="562" y2="258" stroke={W} strokeWidth="1"/>
      <line x1="547" y1="258" x2="562" y2="275" stroke={W} strokeWidth="1"/>

      {/* EQ gate output */}
      <line x1="620" y1="258" x2="650" y2="258" stroke={W} strokeWidth="1"/>

      {/* BL/BLB to sense amp */}
      <line x1="487" y1="195" x2="690" y2="195" stroke={WB} strokeWidth="1.2"/>
      <line x1="547" y1="320" x2="690" y2="320" stroke={WB} strokeWidth="1.2"/>

      {/* SA cross-coupled feedback */}
      <path d="M754,185 Q800,185 800,258 Q800,320 754,320" fill="none" stroke={W} strokeWidth="1" strokeDasharray="4 3"/>

      {/* SA NAND outputs → col select AND */}
      <line x1="754" y1="195" x2="820" y2="240" stroke={W} strokeWidth="1.2"/>
      <line x1="754" y1="320" x2="820" y2="275" stroke={W} strokeWidth="1.2"/>

      {/* Col select output → DATA */}
      <line x1="884" y1="258" x2="930" y2="258" stroke={W} strokeWidth="1.2"/>
      <circle cx="930" cy="258" r="4" fill="none" stroke="#00FF8850" strokeWidth="1.5"/>

      {/* ── junction dots ─────────────────────────────────────── */}
      {[
        [60,  135], [60,  380], [80, 380],
        [487, 195], [487, 258], [547, 258], [547, 320],
      ].map(([x,y], i) => (
        <circle key={`junc${i}`} cx={x} cy={y} r="3" fill="#00FF8840"/>
      ))}

      {/* ── CIRCUIT ELEMENTS (gates + cells) ─────────────────── */}
      {elements.map((el, i) => {
        const dim = `${el.color}45`;

        // Build the dim (always-visible) body + the glow sweep path
        let dimBody: React.ReactNode = null;
        let glowPath = "";
        let extra:    React.ReactNode = null;

        if (el.type === "AND") {
          const p = andGatePath(el.cx, el.cy);
          dimBody  = <path d={p} fill="none" stroke={dim} strokeWidth="1.4"/>;
          glowPath = p;
          // input wires
          extra = <>
            <line x1={el.cx-22} y1={el.cy-8}  x2={el.cx-30} y2={el.cy-8}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx-22} y1={el.cy+8}  x2={el.cx-30} y2={el.cy+8}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx+14} y1={el.cy}    x2={el.cx+22} y2={el.cy}    stroke={dim} strokeWidth="1"/>
          </>;
        } else if (el.type === "NAND") {
          const p = nandGatePath(el.cx, el.cy);
          dimBody  = <path d={p} fill="none" stroke={dim} strokeWidth="1.4"/>;
          glowPath = p;
          extra = <>
            <circle cx={el.cx+14} cy={el.cy} r="4" fill="none" stroke={dim} strokeWidth="1.2"/>
            <line x1={el.cx-22} y1={el.cy-8}  x2={el.cx-30} y2={el.cy-8}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx-22} y1={el.cy+8}  x2={el.cx-30} y2={el.cy+8}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx+18} y1={el.cy}    x2={el.cx+26} y2={el.cy}    stroke={dim} strokeWidth="1"/>
          </>;
        } else if (el.type === "NOT") {
          const p = notGatePath(el.cx, el.cy);
          dimBody  = <path d={p} fill="none" stroke={dim} strokeWidth="1.4"/>;
          glowPath = p;
          extra = <>
            <circle cx={el.cx+12} cy={el.cy} r="3.5" fill="none" stroke={dim} strokeWidth="1.2"/>
            <line x1={el.cx-14}  y1={el.cy} x2={el.cx-22} y2={el.cy}   stroke={dim} strokeWidth="1"/>
            <line x1={el.cx+15}  y1={el.cy} x2={el.cx+22} y2={el.cy}   stroke={dim} strokeWidth="1"/>
          </>;
        } else if (el.type === "OR") {
          const p = orGatePath(el.cx, el.cy);
          dimBody  = <path d={p} fill="none" stroke={dim} strokeWidth="1.4"/>;
          glowPath = p;
          extra = <>
            <line x1={el.cx-18} y1={el.cy-7}  x2={el.cx-28} y2={el.cy-7}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx-18} y1={el.cy+7}  x2={el.cx-28} y2={el.cy+7}  stroke={dim} strokeWidth="1"/>
            <line x1={el.cx+14} y1={el.cy}    x2={el.cx+22} y2={el.cy}    stroke={dim} strokeWidth="1"/>
          </>;
        } else if (el.type === "CELL") {
          // 1T-1C cell: box outline + transistor + cap symbols
          dimBody = <>
            <rect x={el.cx-20} y={el.cy-20} width="40" height="40" fill="none" stroke={dim} strokeWidth="1.2" rx="2"/>
            {/* MOSFET symbol inside */}
            <line x1={el.cx-10} y1={el.cy}    x2={el.cx+2}  y2={el.cy}    stroke={dim} strokeWidth="1.2"/>
            <line x1={el.cx+2}  y1={el.cy-10} x2={el.cx+2}  y2={el.cy+10} stroke={dim} strokeWidth="1.5"/>
            {/* Capacitor plates */}
            <line x1={el.cx+8}  y1={el.cy-5}  x2={el.cx+16} y2={el.cy-5}  stroke={dim} strokeWidth="2"/>
            <line x1={el.cx+8}  y1={el.cy+5}  x2={el.cx+16} y2={el.cy+5}  stroke={dim} strokeWidth="2"/>
            <line x1={el.cx+12} y1={el.cy+5}  x2={el.cx+12} y2={el.cy+14} stroke={dim} strokeWidth="1"/>
            {/* Cs label */}
            <text x={el.cx+10} y={el.cy-8} fill={dim} fontSize="7" fontFamily="monospace">Cs</text>
          </>;
          glowPath = `M${el.cx-20},${el.cy-20} h40 v40 h-40 Z`;
        }

        return (
          <g
            key={el.id}
            ref={el2 => { groupRefs.current[i] = el2; }}
            style={{ opacity: BASE_OPACITY }}
          >
            {/* Dim static body */}
            {dimBody}
            {extra}

            {/* Glow overlay — driven by rAF */}
            <path
              ref={el2 => { glowRefs.current[i] = el2; }}
              d={glowPath}
              fill="none"
              stroke={el.color}
              strokeWidth="2"
              strokeDasharray="160"
              strokeDashoffset="160"
              style={{ opacity: 0 }}
            />

            {/* Gate type label */}
            <text
              x={el.cx}
              y={el.cy + (el.type === "CELL" ? 30 : 28)}
              textAnchor="middle"
              fill={`${el.color}70`}
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {el.type === "CELL" ? "1T-1C" : el.id === "eq_gate" ? "EQ" : el.id.startsWith("sa") ? "SA" : el.type}
            </text>
          </g>
        );
      })}

      {/* ── circuit title ─────────────────────────────────────── */}
      <text x="12" y="510" fill="#00FF8825" fontSize="10" fontFamily="JetBrains Mono, monospace">
        DRAM // 2-bit addr · 4-word · 1T-1C cells · sense amp
      </text>
    </svg>
  );
}
