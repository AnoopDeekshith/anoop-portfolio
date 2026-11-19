"use client";

import { useEffect, useRef } from "react";
import AmbientGlow from "@/components/AmbientGlow";

/**
 * Full-screen hero whose background is a short clip "played" by scrolling.
 *
 * The clip is a sequence of still frames (public/images/hero-frames) drawn to a
 * canvas — scrubbing stills is smooth on every browser, unlike seeking a <video>.
 * The section is taller than the viewport; its contents stay pinned while you
 * scroll through it, and scroll progress picks the frame.
 */
/**
 * Frames come in two sizes: `${frameDir}/lg/f000.webp…` for tablets and
 * desktops, and a smaller `${frameDir}/sm/…` set for phones.
 */
type FrameSet = "lg" | "sm";
const LG_MIN_WIDTH = 768; // px — matches the <source media> below
const frameUrl = (dir: string, set: FrameSet, i: number) =>
  `${dir}/${set}/f${String(i).padStart(3, "0")}.webp`;

/** Load order: first frame, then every 8th, 4th, 2nd, then the rest — so scrubbing works early. */
function loadOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of [count, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export default function ScrollVideoHero({
  frameCount,
  frameDir,
  focusY = 0.45,
  children,
}: {
  frameCount: number;
  /** Public folder holding the lg/ and sm/ frame sets, e.g. "/images/hero-frames" */
  frameDir: string;
  /** Vertical focal point (0 top – 1 bottom) kept in view when cropping */
  focusY?: number;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Tiny canvas mirroring the current frame; blurred by <AmbientGlow> into the page below
  const glowRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    const glowCtx = glowRef.current?.getContext("2d");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const set: FrameSet = window.innerWidth >= LG_MIN_WIDTH ? "lg" : "sm";
    const frames: HTMLImageElement[] = new Array(frameCount);
    const loaded: boolean[] = new Array(frameCount).fill(false);
    let current = -1;
    let raf = 0;

    // Draw an image so it covers the canvas, like CSS object-fit: cover
    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) * focusY, w, h);
    };

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      return scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    };

    const render = () => {
      raf = 0;
      const target = Math.round(progress() * (frameCount - 1));
      // Use the nearest frame that has finished loading
      let i = target;
      while (i > 0 && !loaded[i]) i--;
      if (!loaded[i] || i === current) return;
      current = i;
      drawCover(frames[i]);
      canvas.dataset.ready = "true";
      // Update the ambient glow with the same frame (64×64 is plenty once blurred)
      glowCtx?.drawImage(frames[i], 0, 0, 64, 64);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      current = -1;
      schedule();
    };

    for (const i of loadOrder(frameCount)) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        schedule();
      };
      img.src = frameUrl(frameDir, set, i);
      frames[i] = img;
    }

    resize();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      frames.forEach((img) => img && (img.onload = null));
    };
  }, [frameCount, frameDir, focusY]);

  return (
    <>
    {/* 240svh tall = ~1.4 screens of scrolling to play the clip; no extra height when motion is reduced */}
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[240svh] bg-black text-white motion-reduce:h-[100svh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden">
        {/* First frame as a plain image: visible before JS runs, and the reduced-motion view */}
        <picture>
          <source media={`(min-width: ${LG_MIN_WIDTH}px)`} srcSet={frameUrl(frameDir, "lg", 0)} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameUrl(frameDir, "sm", 0)}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `50% ${focusY * 100}%` }}
          />
        </picture>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 data-[ready=true]:opacity-100"
        />
        {children}
      </div>
    </section>
    {/* Ambient glow: the current frame's colours spread softly into the page below */}
    <AmbientGlow>
      <canvas ref={glowRef} width={64} height={64} className="absolute inset-0 h-full w-full" />
    </AmbientGlow>
    </>
  );
}
