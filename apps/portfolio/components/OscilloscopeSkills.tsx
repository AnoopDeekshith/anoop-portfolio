"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const skills = [
  { name: "Verilog", level: 0.95, color: "#00FF88", freq: 3.2 },
  { name: "SystemVerilog", level: 0.9, color: "#4A9EFF", freq: 2.5 },
  { name: "C++", level: 0.8, color: "#FFB347", freq: 1.8 },
  { name: "Python", level: 0.65, color: "#FF6B9D", freq: 1.2 },
  { name: "Physical Design", level: 0.85, color: "#B347FF", freq: 0.7 },
];

const CHANNEL_HEIGHT = 80;
const LABEL_WIDTH = 130;
const PADDING = 12;

export default function OscilloscopeSkills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const visibleRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Trigger animation when scrolled into view
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.to(visibleRef, { current: 1, duration: 0.5 });
      },
      onLeaveBack: () => {
        gsap.to(visibleRef, { current: 0, duration: 0.3 });
      },
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const labelW = w < 480 ? 80 : LABEL_WIDTH;
      const signalW = w - labelW;
      const offset = offsetRef.current;

      skills.forEach((skill, i) => {
        const channelY = i * CHANNEL_HEIGHT + PADDING;
        const midY = channelY + CHANNEL_HEIGHT / 2;
        const amplitude = CHANNEL_HEIGHT / 2 - 12; // constant — frequency encodes proficiency

        // Channel background
        ctx.fillStyle = i % 2 === 0 ? "rgba(0,255,136,0.02)" : "rgba(0,0,0,0)";
        ctx.fillRect(labelW, channelY, signalW, CHANNEL_HEIGHT);

        // Grid lines
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(labelW, channelY);
        ctx.lineTo(w, channelY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(labelW, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();

        // Channel divider
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(labelW, channelY + CHANNEL_HEIGHT - 1);
        ctx.lineTo(w, channelY + CHANNEL_HEIGHT - 1);
        ctx.stroke();

        // Channel label panel
        ctx.fillStyle = "#060B10";
        ctx.fillRect(0, channelY, labelW - 4, CHANNEL_HEIGHT);

        // Channel number
        ctx.fillStyle = "rgba(136,153,170,0.4)";
        ctx.font = "9px JetBrains Mono, monospace";
        ctx.fillText(`CH${i + 1}`, 8, channelY + 16);

        // Skill name
        ctx.fillStyle = skill.color;
        ctx.font = `bold ${w < 480 ? "9" : "11"}px JetBrains Mono, monospace`;
        ctx.fillText(w < 480 ? skill.name.split(" ")[0] : skill.name, 6, channelY + (w < 480 ? 26 : 32));

        // Level badge (hide on very small screens)
        if (w >= 480) {
          ctx.fillStyle = `${skill.color}20`;
          ctx.fillRect(6, channelY + 38, labelW - 16, 14);
          ctx.fillStyle = skill.color;
          ctx.font = "8px JetBrains Mono, monospace";
          ctx.fillText(`${Math.round(skill.level * 100)}%`, 10, channelY + 49);
        }

        // Waveform
        ctx.shadowColor = skill.color;
        ctx.shadowBlur = 6;
        ctx.strokeStyle = skill.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();

        for (let x = 0; x <= signalW; x++) {
          const t = (x + offset * skill.freq * 40) / signalW;
          const y =
            midY +
            Math.sin(t * Math.PI * 2 * skill.freq * 4) *
              amplitude *
              Math.sin(t * Math.PI * 0.5 + i) *
              visibleRef.current;

          if (x === 0) ctx.moveTo(labelW + x, y);
          else ctx.lineTo(labelW + x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Trigger line
        ctx.strokeStyle = `${skill.color}30`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(labelW, midY - amplitude);
        ctx.lineTo(w, midY - amplitude);
        ctx.stroke();
        ctx.setLineDash([]);

        // Frequency label
        ctx.fillStyle = `${skill.color}60`;
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.fillText(`${skill.freq.toFixed(1)} MHz`, labelW + 4, midY - amplitude - 3);
      });

      // Time axis at bottom
      const bottomY = skills.length * CHANNEL_HEIGHT + PADDING;
      ctx.strokeStyle = "rgba(136,153,170,0.2)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(labelW, bottomY);
      ctx.lineTo(w, bottomY);
      ctx.stroke();

      ctx.fillStyle = "rgba(136,153,170,0.3)";
      ctx.font = "8px JetBrains Mono, monospace";
      for (let t = 0; t <= 10; t++) {
        const x = LABEL_WIDTH + (t / 10) * signalW;
        ctx.fillText(`${t * 10}μs`, x, bottomY + 12);
      }

      offsetRef.current += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#FFB347]" />
          <span className="font-mono text-xs text-[#FFB347]/60 tracking-widest uppercase">
            Technical Skill Analysis
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Skill Analysis
        </h2>
        <p className="font-mono text-sm text-[#8899AA] mb-8">
          {"// Frequency = proficiency  |  5 channels  |  Live render"}
        </p>

        {/* Oscilloscope frame */}
        <div className="border border-[#1E2A3A] bg-[#060B10] overflow-hidden">
          {/* Top toolbar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-[#1E2A3A] bg-[#0A0F14]">
            <div className="w-2 h-2 rounded-full bg-red-500/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <div className="w-2 h-2 rounded-full bg-green-500/70" />
            <span className="font-mono text-[10px] text-[#8899AA]/60 ml-2">
              Tektronix DSO — 5CH — 1GSa/s
            </span>
            <span className="ml-auto font-mono text-[10px] text-[#00FF88]/60">
              TRIG: AUTO
            </span>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: `${skills.length * CHANNEL_HEIGHT + PADDING * 2 + 20}px` }}
          />

          {/* Bottom status bar */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-[#1E2A3A] bg-[#0A0F14]">
            <span className="font-mono text-[9px] text-[#8899AA]/40">
              TIME/DIV: 10μs
            </span>
            <span className="font-mono text-[9px] text-[#8899AA]/40">
              VOLTS/DIV: 0.5V
            </span>
            <span className="font-mono text-[9px] text-[#8899AA]/40">
              SAMPLE RATE: 1GSa/s
            </span>
            <span className="ml-auto font-mono text-[9px] text-[#00FF88]/60">
              ● RUNNING
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
