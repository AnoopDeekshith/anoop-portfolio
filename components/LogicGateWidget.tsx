"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Phase = "idle" | "encoding" | "processing" | "output" | "routing";

const suggestions = [
  { label: "projects", query: "show me his projects" },
  { label: "about", query: "who is anoop" },
  { label: "skills", query: "what are his skills" },
  { label: "resume", query: "download resume" },
  { label: "blog", query: "show writing" },
  { label: "contact", query: "how to reach him" },
];

const routeMap: Record<string, { section: string; label: string; color: string }> = {
  project:  { section: "projects",     label: "PROJECTS",    color: "#00FF88" },
  build:    { section: "projects",     label: "PROJECTS",    color: "#00FF88" },
  work:     { section: "projects",     label: "PROJECTS",    color: "#00FF88" },
  who:      { section: "about",        label: "ABOUT",       color: "#4A9EFF" },
  about:    { section: "about",        label: "ABOUT",       color: "#4A9EFF" },
  anoop:    { section: "about",        label: "ABOUT",       color: "#4A9EFF" },
  bio:      { section: "about",        label: "ABOUT",       color: "#4A9EFF" },
  skill:    { section: "ate-section",  label: "SKILLS",      color: "#FFB347" },
  tech:     { section: "ate-section",  label: "SKILLS",      color: "#FFB347" },
  tool:     { section: "ate-section",  label: "SKILLS",      color: "#FFB347" },
  resume:   { section: "resume",       label: "RESUME",      color: "#FF6B9D" },
  cv:       { section: "resume",       label: "RESUME",      color: "#FF6B9D" },
  download: { section: "resume",       label: "RESUME",      color: "#FF6B9D" },
  blog:     { section: "blog",         label: "BLOG",        color: "#B347FF" },
  writ:     { section: "blog",         label: "BLOG",        color: "#B347FF" },
  medium:   { section: "blog",         label: "BLOG",        color: "#B347FF" },
  contact:  { section: "contact-form", label: "CONTACT",     color: "#00D4FF" },
  reach:    { section: "contact-form", label: "CONTACT",     color: "#00D4FF" },
  hire:     { section: "contact-form", label: "CONTACT",     color: "#00D4FF" },
  email:    { section: "contact-form", label: "CONTACT",     color: "#00D4FF" },
};

function toBinary(str: string): string {
  return str
    .slice(0, 4)
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function resolveRoute(query: string) {
  const lower = query.toLowerCase();
  for (const [key, val] of Object.entries(routeMap)) {
    if (lower.includes(key)) return val;
  }
  return { section: "about", label: "ABOUT", color: "#4A9EFF" };
}

// Animated binary string that slowly reveals itself
function BinaryReveal({ text, color }: { text: string; color: string }) {
  const [revealed, setRevealed] = useState("");
  useEffect(() => {
    let i = 0;
    setRevealed("");
    const id = setInterval(() => {
      i++;
      setRevealed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span className="font-mono text-[10px] break-all leading-relaxed" style={{ color }}>
      {revealed}
      <span className="animate-pulse opacity-70">█</span>
    </span>
  );
}

// SVG logic gate with signal animation
function GateSVG({
  type,
  active,
  color,
  delay,
}: {
  type: "AND" | "XOR" | "OR";
  active: boolean;
  color: string;
  delay: number;
}) {
  const dim = `${color}30`;
  const paths: Record<string, string> = {
    AND: "M2,2 L2,22 L12,22 Q24,22 24,12 Q24,2 12,2 Z",
    OR:  "M2,2 Q10,2 18,12 Q10,22 2,22 Q12,22 22,12 Q12,2 2,2 Z",
    XOR: "M5,2 Q13,2 21,12 Q13,22 5,22 Q15,22 25,12 Q15,2 5,2 Z",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="36" height="28" viewBox="0 0 30 26">
        {/* Dim static gate */}
        <path d={paths[type]} fill="none" stroke={dim} strokeWidth="1.2" />
        {/* Animated active gate */}
        {active && (
          <path
            d={paths[type]}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="80"
            strokeDashoffset="80"
            style={{
              animation: `trace-draw 0.6s ease-out ${delay}s forwards`,
              filter: `drop-shadow(0 0 3px ${color})`,
            }}
          />
        )}
        {/* Input wires */}
        <line x1="-6" y1="8" x2="2" y2="8" stroke={active ? color : dim} strokeWidth="1" />
        <line x1="-6" y1="18" x2="2" y2="18" stroke={active ? color : dim} strokeWidth="1" />
        {/* Output wire */}
        <line
          x1={type === "XOR" ? "25" : type === "OR" ? "22" : "24"}
          y1="13"
          x2="32"
          y2="13"
          stroke={active ? color : dim}
          strokeWidth="1"
        />
      </svg>
      <span className="font-mono text-[8px]" style={{ color: active ? color : `${color}40` }}>
        {type}
      </span>
    </div>
  );
}

export default function LogicGateWidget() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [inputBinary, setInputBinary] = useState("");
  const [outputBinary, setOutputBinary] = useState("");
  const [route, setRoute] = useState<{ section: string; label: string; color: string } | null>(null);
  const [activeGate, setActiveGate] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const addTimer = (fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  };

  const runQuery = useCallback((q: string) => {
    if (!q.trim()) return;
    clearTimers();

    const resolved = resolveRoute(q);
    const binIn = toBinary(q);
    const binOut = resolved.label
      .split("")
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");

    setRoute(resolved);
    setInputBinary(binIn);
    setOutputBinary("");
    setActiveGate(0);
    setPhase("encoding");

    // Gate sequence
    addTimer(() => { setPhase("processing"); setActiveGate(1); }, 900);
    addTimer(() => setActiveGate(2), 1400);
    addTimer(() => setActiveGate(3), 1900);

    // Output
    addTimer(() => {
      setPhase("output");
      setOutputBinary(binOut);
    }, 2400);

    // Navigate
    addTimer(() => {
      setPhase("routing");
      addTimer(() => {
        const el = document.getElementById(resolved.section);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        setPhase("idle");
        setQuery("");
        setActiveGate(0);
      }, 700);
    }, 3400);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(query);
  };

  useEffect(() => () => clearTimers(), []);

  const color = route?.color ?? "#00FF88";

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Terminal header */}
      <div className="border border-[#1E2A3A] bg-[#060B10]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1E2A3A]">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="font-mono text-[9px] text-[#8899AA] ml-1">chip_query_engine v1.0</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="font-mono text-[#00FF88] text-sm flex-shrink-0">{">"}</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ask about projects, skills, resume..."
              disabled={phase !== "idle"}
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder-[#8899AA] outline-none border-b border-[#00FF88]/20 focus:border-[#00FF88]/60 pb-0.5 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={phase !== "idle" || !query.trim()}
              className="font-mono text-[9px] px-2 py-1 border border-[#00FF88]/30 text-[#00FF88]/70 hover:border-[#00FF88] hover:text-[#00FF88] transition-all disabled:opacity-30 flex-shrink-0"
            >
              RUN
            </button>
          </form>

          {/* Suggestions — only when idle */}
          {phase === "idle" && (
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setQuery(s.query); runQuery(s.query); }}
                  className="font-mono text-[9px] px-2 py-0.5 border border-[#1E2A3A] text-[#8899AA] hover:border-[#00FF88]/60 hover:text-[#00FF88] transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Processing display */}
          {phase !== "idle" && (
            <div className="space-y-3">
              {/* Input binary */}
              <div>
                <div className="font-mono text-[8px] text-[#8899AA] mb-1 tracking-widest">INPUT → BINARY ENCODE</div>
                <BinaryReveal text={inputBinary} color="#00FF88" />
              </div>

              {/* Logic gates */}
              <div>
                <div className="font-mono text-[8px] text-[#8899AA] mb-2 tracking-widest">GATE ARRAY</div>
                <div className="flex items-center gap-2">
                  {/* Signal in */}
                  <div className="flex flex-col gap-1">
                    <div className="w-6 h-px" style={{ background: activeGate >= 1 ? "#00FF88" : "#1E2A3A" }} />
                    <div className="w-6 h-px" style={{ background: activeGate >= 1 ? "#00FF88" : "#1E2A3A" }} />
                  </div>
                  <GateSVG type="AND" active={activeGate >= 1} color={color} delay={0} />
                  <div className="w-4 h-px" style={{ background: activeGate >= 2 ? color : "#1E2A3A" }} />
                  <GateSVG type="XOR" active={activeGate >= 2} color={color} delay={0.1} />
                  <div className="w-4 h-px" style={{ background: activeGate >= 3 ? color : "#1E2A3A" }} />
                  <GateSVG type="OR" active={activeGate >= 3} color={color} delay={0.2} />
                  {/* Signal out */}
                  <div
                    className="w-4 h-px transition-all duration-300"
                    style={{ background: activeGate >= 3 ? color : "#1E2A3A", boxShadow: activeGate >= 3 ? `0 0 6px ${color}` : "none" }}
                  />
                </div>
              </div>

              {/* Output binary */}
              {(phase === "output" || phase === "routing") && outputBinary && (
                <div>
                  <div className="font-mono text-[8px] text-[#8899AA] mb-1 tracking-widest">OUTPUT → DECODE</div>
                  <BinaryReveal text={outputBinary} color={color} />
                </div>
              )}

              {/* Routing status */}
              {(phase === "output" || phase === "routing") && route && (
                <div
                  className="flex items-center gap-2 border px-3 py-2"
                  style={{ borderColor: `${color}40`, background: `${color}08` }}
                >
                  <span className="font-mono text-[9px]" style={{ color }}>
                    {phase === "routing" ? "⚡ ROUTING →" : "◆ RESOLVED →"}
                  </span>
                  <span className="font-mono text-xs font-bold" style={{ color }}>
                    {route.label}
                  </span>
                  {phase === "routing" && (
                    <span className="ml-auto font-mono text-[8px] text-[#8899AA] animate-pulse">
                      scrolling...
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
