"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface ChipCanvasHandle {
  setZoom: (target: ZoomTarget) => void;
}

export interface ZoomTarget {
  x: number;   // 0-1 normalized center x
  y: number;   // 0-1 normalized center y
  scale: number;
  duration?: number;
}

// Chip block definitions (in 900x600 logical space)
export const chipBlocks = [
  { id: "cpu",      label: "CPU Core",       x: 90,  y: 80,  w: 200, h: 160, color: "#00FF88", desc: "Neuromorphic Processing" },
  { id: "regfile",  label: "Reg File",        x: 310, y: 80,  w: 120, h: 160, color: "#4A9EFF", desc: "32×32b Registers" },
  { id: "icache",   label: "L1 I-Cache",      x: 450, y: 80,  w: 150, h: 160, color: "#FFB347", desc: "8KB Instruction" },
  { id: "dcache",   label: "L1 D-Cache",      x: 620, y: 80,  w: 170, h: 160, color: "#FF6B9D", desc: "8KB Data" },
  { id: "l2cache",  label: "L2 Cache",        x: 90,  y: 260, w: 240, h: 130, color: "#B347FF", desc: "256KB Unified" },
  { id: "ramc",     label: "RAM Ctrl",        x: 350, y: 260, w: 200, h: 130, color: "#00D4FF", desc: "DDR4 Controller" },
  { id: "ioctrl",   label: "I/O Ctrl",        x: 570, y: 260, w: 220, h: 130, color: "#FF8C42", desc: "JTAG / UART / GPIO" },
  { id: "clktree",  label: "Clock Tree",      x: 90,  y: 410, w: 180, h: 110, color: "#FF4444", desc: "H-Tree CTS" },
  { id: "pwrmgmt",  label: "Power Mgmt",      x: 290, y: 410, w: 180, h: 110, color: "#FFD700", desc: "DVFS + IR Drop" },
  { id: "neuro",    label: "Neuromorphic",    x: 490, y: 410, w: 300, h: 110, color: "#00FF88", desc: "Spiking NN Array" },
];

// Trace routes (from-to block IDs, with waypoints)
const traces = [
  { from: "cpu",     to: "regfile",  color: "#00FF88" },
  { from: "regfile", to: "icache",   color: "#4A9EFF" },
  { from: "icache",  to: "dcache",   color: "#FFB347" },
  { from: "cpu",     to: "l2cache",  color: "#00FF88" },
  { from: "l2cache", to: "ramc",     color: "#B347FF" },
  { from: "ramc",    to: "ioctrl",   color: "#00D4FF" },
  { from: "cpu",     to: "clktree",  color: "#FF4444" },
  { from: "clktree", to: "pwrmgmt",  color: "#FFD700" },
  { from: "pwrmgmt", to: "neuro",    color: "#00FF88" },
  { from: "neuro",   to: "ioctrl",   color: "#00FF88" },
  { from: "l2cache", to: "clktree",  color: "#B347FF" },
];

function getCenterXY(block: typeof chipBlocks[0]) {
  return { x: block.x + block.w / 2, y: block.y + block.h / 2 };
}

interface Particle {
  traceIdx: number;
  t: number;        // 0-1 progress along trace
  speed: number;
  symbol: string;   // "0" or "1"
  color: string;
}

const ChipCanvas = forwardRef<ChipCanvasHandle, { className?: string }>(
  function ChipCanvas({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const zoomRef = useRef<ZoomTarget>({ x: 0.5, y: 0.5, scale: 1 });
    const zoomTargetRef = useRef<ZoomTarget>({ x: 0.5, y: 0.5, scale: 1 });
    const particlesRef = useRef<Particle[]>([]);
    const timeRef = useRef(0);

    useImperativeHandle(ref, () => ({
      setZoom(target: ZoomTarget) {
        zoomTargetRef.current = target;
      },
    }));

    useEffect(() => {
      // Initialize particles
      particlesRef.current = traces.flatMap((_, i) =>
        Array.from({ length: 3 }, (__, j) => ({
          traceIdx: i,
          t: (j / 3 + Math.random() * 0.2) % 1,
          speed: 0.003 + Math.random() * 0.003,
          symbol: Math.random() > 0.5 ? "1" : "0",
          color: traces[i].color,
        }))
      );

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const CHIP_W = 900;
      const CHIP_H = 600;
      const PAD_SIZES = [12, 8];

      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
      };
      resize();
      window.addEventListener("resize", resize);

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const draw = () => {
        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        timeRef.current += 0.016;

        // Lerp zoom
        const z = zoomRef.current;
        const zt = zoomTargetRef.current;
        const lerpSpeed = 0.05;
        z.x = lerp(z.x, zt.x, lerpSpeed);
        z.y = lerp(z.y, zt.y, lerpSpeed);
        z.scale = lerp(z.scale, zt.scale, lerpSpeed);

        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = "#060B10";
        ctx.fillRect(0, 0, W, H);

        // Compute transform: chip fits inside canvas, then zoom applied
        const fitScale = Math.min(W / CHIP_W, H / CHIP_H) * 0.88;
        const chipOffX = (W - CHIP_W * fitScale) / 2;
        const chipOffY = (H - CHIP_H * fitScale) / 2;

        ctx.save();

        // Apply zoom
        const cx = chipOffX + z.x * CHIP_W * fitScale;
        const cy = chipOffY + z.y * CHIP_H * fitScale;
        ctx.translate(cx, cy);
        ctx.scale(z.scale * fitScale, z.scale * fitScale);
        ctx.translate(-z.x * CHIP_W, -z.y * CHIP_H);
        ctx.translate(-chipOffX / (z.scale * fitScale), -chipOffY / (z.scale * fitScale));

        // ---- Die substrate ----
        const grad = ctx.createLinearGradient(0, 0, CHIP_W, CHIP_H);
        grad.addColorStop(0, "#0A1520");
        grad.addColorStop(0.5, "#060B10");
        grad.addColorStop(1, "#0A1520");
        ctx.fillStyle = grad;
        ctx.fillRect(30, 30, CHIP_W - 60, CHIP_H - 60);

        // Fine background grid
        ctx.strokeStyle = "rgba(0,255,136,0.06)";
        ctx.lineWidth = 0.5;
        for (let gx = 30; gx < CHIP_W - 30; gx += 20) {
          ctx.beginPath(); ctx.moveTo(gx, 30); ctx.lineTo(gx, CHIP_H - 30); ctx.stroke();
        }
        for (let gy = 30; gy < CHIP_H - 30; gy += 20) {
          ctx.beginPath(); ctx.moveTo(30, gy); ctx.lineTo(CHIP_W - 30, gy); ctx.stroke();
        }

        // Die outline
        ctx.strokeStyle = "#00FF88";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, CHIP_W - 60, CHIP_H - 60);

        // Bond pads
        const padColor = "#FFB347";
        const sides = [
          // top
          ...Array.from({ length: 18 }, (_, i) => ({ x: 60 + i * 46, y: 18, w: PAD_SIZES[0], h: PAD_SIZES[1] })),
          // bottom
          ...Array.from({ length: 18 }, (_, i) => ({ x: 60 + i * 46, y: CHIP_H - 26, w: PAD_SIZES[0], h: PAD_SIZES[1] })),
          // left
          ...Array.from({ length: 10 }, (_, i) => ({ x: 8, y: 60 + i * 50, w: PAD_SIZES[1], h: PAD_SIZES[0] })),
          // right
          ...Array.from({ length: 10 }, (_, i) => ({ x: CHIP_W - 20, y: 60 + i * 50, w: PAD_SIZES[1], h: PAD_SIZES[0] })),
        ];
        ctx.fillStyle = padColor;
        sides.forEach(p => {
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = "#FFD700";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(p.x, p.y, p.w, p.h);
        });

        // Power ring
        ctx.strokeStyle = "rgba(255,215,0,0.2)";
        ctx.lineWidth = 4;
        ctx.strokeRect(38, 38, CHIP_W - 76, CHIP_H - 76);
        ctx.strokeStyle = "rgba(255,215,0,0.1)";
        ctx.lineWidth = 2;
        ctx.strokeRect(44, 44, CHIP_W - 88, CHIP_H - 88);

        // ---- Traces ----
        traces.forEach((trace) => {
          const fromBlock = chipBlocks.find(b => b.id === trace.from)!;
          const toBlock = chipBlocks.find(b => b.id === trace.to)!;
          const from = getCenterXY(fromBlock);
          const to = getCenterXY(toBlock);

          ctx.strokeStyle = `${trace.color}30`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          // L-shaped routes
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(from.x, to.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // ---- Chip blocks ----
        chipBlocks.forEach((block) => {
          // Hatching pattern
          ctx.save();
          ctx.beginPath();
          ctx.rect(block.x, block.y, block.w, block.h);
          ctx.clip();

          // Fill
          const bg = ctx.createLinearGradient(block.x, block.y, block.x + block.w, block.y + block.h);
          bg.addColorStop(0, `${block.color}18`);
          bg.addColorStop(1, `${block.color}08`);
          ctx.fillStyle = bg;
          ctx.fillRect(block.x, block.y, block.w, block.h);

          // Subtle hatch lines
          ctx.strokeStyle = `${block.color}15`;
          ctx.lineWidth = 0.5;
          for (let hx = block.x; hx < block.x + block.w; hx += 8) {
            ctx.beginPath(); ctx.moveTo(hx, block.y); ctx.lineTo(hx, block.y + block.h); ctx.stroke();
          }
          ctx.restore();

          // Block border
          ctx.strokeStyle = block.color;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = block.color;
          ctx.shadowBlur = 6;
          ctx.strokeRect(block.x, block.y, block.w, block.h);
          ctx.shadowBlur = 0;

          // Corner notch
          ctx.fillStyle = block.color;
          ctx.beginPath();
          ctx.moveTo(block.x + block.w - 12, block.y);
          ctx.lineTo(block.x + block.w, block.y);
          ctx.lineTo(block.x + block.w, block.y + 12);
          ctx.closePath();
          ctx.fill();

          // Label background
          ctx.fillStyle = "rgba(6,11,16,0.85)";
          ctx.fillRect(block.x + 4, block.y + 4, block.label.length * 7 + 8, 16);

          // Label
          ctx.fillStyle = block.color;
          ctx.font = `bold ${Math.max(9, Math.min(12, block.w / 12))}px JetBrains Mono, monospace`;
          ctx.fillText(block.label, block.x + 8, block.y + 16);

          // Desc
          ctx.fillStyle = `${block.color}60`;
          ctx.font = `8px JetBrains Mono, monospace`;
          ctx.fillText(block.desc, block.x + 8, block.y + block.h - 10);

          // Internal micro-detail: small transistor-like rectangles
          ctx.fillStyle = `${block.color}20`;
          for (let mx = block.x + 8; mx < block.x + block.w - 8; mx += 14) {
            for (let my = block.y + 26; my < block.y + block.h - 20; my += 10) {
              ctx.fillRect(mx, my, 8, 4);
            }
          }
        });

        // ---- Particles (0s and 1s moving along traces) ----
        particlesRef.current.forEach((p) => {
          p.t = (p.t + p.speed) % 1;

          const trace = traces[p.traceIdx];
          const fromBlock = chipBlocks.find(b => b.id === trace.from)!;
          const toBlock = chipBlocks.find(b => b.id === trace.to)!;
          const from = getCenterXY(fromBlock);
          const to = getCenterXY(toBlock);

          // L-shaped path interpolation
          let px, py;
          if (p.t < 0.5) {
            px = from.x;
            py = from.y + (to.y - from.y) * (p.t * 2);
          } else {
            px = from.x + (to.x - from.x) * ((p.t - 0.5) * 2);
            py = to.y;
          }

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.font = "bold 9px JetBrains Mono, monospace";
          ctx.fillText(p.symbol, px - 4, py + 3);
          ctx.shadowBlur = 0;
        });

        // ---- Pulse dots at block centers ----
        const pulseScale = 0.5 + Math.sin(timeRef.current * 2) * 0.5;
        chipBlocks.forEach((block, i) => {
          const cx = block.x + block.w / 2;
          const cy = block.y + block.h - 24;
          const r = 3 + pulseScale * 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = block.color;
          ctx.shadowColor = block.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        ctx.restore();

        animRef.current = requestAnimationFrame(draw);
      };

      animRef.current = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(animRef.current);
        window.removeEventListener("resize", resize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    );
  }
);

export default ChipCanvas;
