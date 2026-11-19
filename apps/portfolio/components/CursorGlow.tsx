"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let heroVisible = true;

    const onMove = (e: MouseEvent) => {
      if (heroVisible) return;
      el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(0,180,80,0.07) 0%, rgba(0,100,40,0.03) 40%, transparent 70%)`;
    };

    const hero = document.getElementById("hero");
    const obs = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        el.style.opacity = entry.isIntersecting ? "0" : "1";
      },
      { threshold: 0.2 }
    );
    if (hero) obs.observe(hero);

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0, transition: "opacity 0.6s ease" }}
    />
  );
}
