"use client";

import { useEffect, useRef } from "react";

/**
 * YouTube-style "ambient mode" glow under a page's cover (#top).
 *
 * Renders `children` (the cover image, or a small canvas mirroring the current
 * video frame) heavily blurred, spreading softly down into the page. It sits
 * behind the page content and fades out as the cover scrolls away.
 *
 * Place it directly after the cover section. Requires <main> to be `isolate`
 * so the negative z-index keeps it above the page background but below content.
 */
export default function AmbientGlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = document.getElementById("top");
    if (!el || !hero) return;

    let raf = 0;
    // 1 while the cover's bottom edge is at its starting position (or lower), fading to 0 as it leaves the top
    const update = () => {
      raf = 0;
      const bottom = hero.getBoundingClientRect().bottom;
      const start = Math.min(hero.offsetHeight, window.innerHeight);
      el.style.opacity = String(Math.max(0, Math.min(1, bottom / start)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div aria-hidden="true" className="no-print pointer-events-none relative h-0">
      <div
        ref={ref}
        className="absolute inset-x-0 top-0 -z-10 h-[80vh] overflow-hidden transition-opacity duration-150"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 40%, transparent 100%)",
        }}
      >
        {/* Oversized so the blur's soft edges fall outside the visible area */}
        <div
          className="absolute -inset-x-[10%] -top-[30%] bottom-0 blur-[90px] saturate-[1.6]"
          style={{ opacity: "var(--glow-strength)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
