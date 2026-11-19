"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { heroRoutes, nav } from "@/site";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Fixed header. Transparent over a page's hero image, solid once you scroll
 * past it (and always solid on pages without a hero). The menu button opens
 * a drawer from the right with links to each page.
 */
export default function SiteHeader({
  name,
  resumePath,
  social,
}: {
  name: string;
  resumePath: string;
  social: React.ReactNode;
}) {
  const pathname = usePathname();
  const overHero = heroRoutes.includes(pathname);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [open, setOpen] = useState(false);

  // Track whether we've scrolled past this page's hero
  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => {
      const hero = document.getElementById("top");
      setScrolledPast(window.scrollY > (hero ? hero.offsetHeight - 72 : 80));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [overHero, pathname]);

  // Escape closes the drawer; lock page scroll while it's open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !overHero || scrolledPast;

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
          solid ? "border-rule bg-bg/95 backdrop-blur" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className={`text-sm font-bold tracking-tight transition-opacity duration-300 ${
              solid ? "text-fg opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {name}
          </Link>
          <div className="-mr-2 flex items-center gap-1">
          <ThemeToggle className={solid ? "text-fg" : "text-white"} />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
            className={`flex h-10 w-10 items-center justify-center transition-colors ${
              solid ? "text-fg" : "text-white"
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`no-print fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        id="site-menu"
        aria-label="Site menu"
        inert={!open}
        className={`no-print fixed inset-y-0 right-0 z-50 flex w-[min(22rem,86vw)] flex-col bg-bg shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-end px-5 sm:px-8">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="-mr-2 flex h-10 w-10 items-center justify-center text-fg"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-8 pt-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = item.href === pathname;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 py-2 font-display text-3xl font-bold tracking-tight transition-colors hover:text-accent ${
                      active ? "text-accent" : "text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-rule px-8 py-8">
          <a
            href={resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-fg px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg hover:text-bg"
          >
            Download Resume (PDF)
          </a>
          <div className="mt-6 flex items-center justify-between text-muted">
            <div className="flex gap-4">{social}</div>
            <ThemeToggle className="-mr-2 text-fg" />
          </div>
        </div>
      </aside>
    </>
  );
}
