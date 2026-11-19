"use client";

import { useEffect, useRef } from "react";

/**
 * Soft entrance for everything on a page: as each text block scrolls into
 * view, its words fade in one after another out of a light blur, and the block
 * drifts up slightly. Images, figures and buttons fade/rise as a whole.
 *
 * - Targets are hidden by CSS from first paint (html.js-reveal, set by the
 *   <head> script), so nothing flashes before animating.
 * - Words are wrapped in spans only while animating, then the original text
 *   nodes are put back — the DOM React rendered is left exactly as it was.
 * - Rendered by app/template.tsx, so it re-runs on every page navigation.
 * - Skips the page cover (#top, which has its own animation) and forms.
 */

// Keep in sync with the hide rule in globals.css
const TARGETS = "h1, h2, h3, h4, p, li, dt, dd, figcaption, figure, blockquote, [data-reveal]";
const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "P", "LI", "DT", "DD", "FIGCAPTION", "A"]);
const EXCLUDE = "#top, form, [data-no-reveal]";

const WORD_MS = 650; // duration of one word's fade (matches .rv-word in globals.css)
const BLOCK_WORDS_MS = 450; // all words in a block start within this window
const BATCH_STAGGER_MS = 70; // delay between blocks revealed together
const BATCH_MAX_MS = 420;

function splitWords(block: Element) {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.nodeValue && node.nodeValue.trim()) textNodes.push(node);
  }

  const words: HTMLSpanElement[] = [];
  const swaps: { original: Text; created: Node[] }[] = [];
  for (const original of textNodes) {
    const created: Node[] = [];
    for (const part of original.nodeValue!.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        created.push(document.createTextNode(part));
      } else {
        const span = document.createElement("span");
        span.className = "rv-word";
        span.textContent = part;
        words.push(span);
        created.push(span);
      }
    }
    original.replaceWith(...created);
    swaps.push({ original, created });
  }

  const restore = () => {
    for (const { original, created } of swaps) {
      if (!created[0]?.parentNode) continue;
      created[0].parentNode.insertBefore(original, created[0]);
      created.forEach((n) => (n as ChildNode).remove());
    }
  };
  return { words, restore };
}

export default function RevealScope({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = ref.current;
    const root = document.documentElement;
    if (!scope) return;
    // The <head> script's safety timer is no longer needed once we're running
    window.clearTimeout((window as unknown as { __revealFallback?: number }).__revealFallback);

    // Fallback already fired (very slow load): content is visible, so don't re-hide it to animate
    if (root.classList.contains("reveal-fallback")) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      root.classList.add("reveal-fallback");
      return;
    }

    const all = Array.from(scope.querySelectorAll<HTMLElement>(TARGETS)).filter((el) => !el.closest(EXCLUDE));
    // Containers (e.g. a <blockquote> holding <dt>/<dd>) just un-hide; their inner targets animate
    const leaves: HTMLElement[] = [];
    for (const el of all) {
      if (el.querySelector(TARGETS)) el.dataset.revealed = "";
      else leaves.push(el);
    }

    const timers: number[] = [];
    const restores: (() => void)[] = [];

    const reveal = (el: HTMLElement, blockDelay: number) => {
      const isText = TEXT_TAGS.has(el.tagName) && !el.querySelector("img, canvas, svg:not([aria-hidden])");
      el.style.setProperty("--bd", `${blockDelay}ms`);
      if (isText) {
        const { words, restore } = splitWords(el);
        const step = words.length ? Math.max(6, Math.min(40, BLOCK_WORDS_MS / words.length)) : 0;
        words.forEach((w, i) => w.style.setProperty("--wd", `${blockDelay + i * step}ms`));
        el.classList.add("rv-rise");
        el.dataset.revealed = "";
        restores.push(restore);
        timers.push(window.setTimeout(restore, blockDelay + words.length * step + WORD_MS + 100));
      } else {
        el.classList.add("rv-fade");
        el.dataset.revealed = "";
      }
    };

    const pending = new Set(leaves);
    const revealBatch = (els: HTMLElement[]) => {
      els
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, k) => {
          pending.delete(el);
          io.unobserve(el);
          reveal(el, Math.min(k * BATCH_STAGGER_MS, BATCH_MAX_MS));
        });
    };

    const io = new IntersectionObserver(
      (entries) => revealBatch(entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)),
      { threshold: 0.01 }
    );
    leaves.forEach((el) => io.observe(el));

    // Catch-up for fast scrolling: a short block can jump from below the
    // viewport to above it between two observer checks and never "intersect".
    // Anything pending that is now in view or above it gets revealed.
    let raf = 0;
    const catchUp = () => {
      raf = 0;
      const due = [...pending].filter((el) => el.getBoundingClientRect().top < window.innerHeight);
      if (due.length) revealBatch(due);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(catchUp);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
      timers.forEach(clearTimeout);
      restores.forEach((r) => r());
    };
  }, []);

  return (
    <div ref={ref} data-reveal-scope="" className="page-enter">
      {children}
    </div>
  );
}
