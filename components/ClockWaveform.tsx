"use client";

import { useEffect, useRef } from "react";

export default function ClockWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const period = 80; // px per clock cycle
    const amplitude = 16;
    const baseline = canvas.offsetHeight / window.devicePixelRatio / 2;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(0,255,136,0.08)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y <= h; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Shadow/glow
      ctx.shadowColor = "#00FF88";
      ctx.shadowBlur = 8;
      ctx.strokeStyle = "#00FF88";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      const offset = offsetRef.current % period;

      ctx.beginPath();
      let x = -offset;
      let high = true;

      while (x < w + period) {
        const y = high ? baseline - amplitude : baseline + amplitude;
        ctx.moveTo(x, high ? baseline + amplitude : baseline - amplitude);
        ctx.lineTo(x, y);
        ctx.lineTo(x + period / 2, y);
        high = !high;
        x += period / 2;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // CLK label
      ctx.fillStyle = "rgba(0,255,136,0.5)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("CLK", 8, baseline - amplitude - 6);

      // Tick marks
      ctx.strokeStyle = "rgba(0,255,136,0.2)";
      ctx.lineWidth = 0.5;
      for (let xm = 0; xm < w; xm += period) {
        ctx.beginPath();
        ctx.moveTo(xm - (offset % period), baseline + amplitude + 6);
        ctx.lineTo(xm - (offset % period), baseline + amplitude + 12);
        ctx.stroke();
      }

      offsetRef.current += 0.6;
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
      className="w-full h-12 opacity-70"
      style={{ display: "block" }}
    />
  );
}
