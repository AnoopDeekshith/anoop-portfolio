"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "home", href: "#hero" },
  { label: "about", href: "#pipeline" },
  { label: "projects", href: "#projects" },
  { label: "resume", href: "#resume" },
  { label: "contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["hero", "pipeline", "projects", "resume", "contact"];
      const current = sections.findLast((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= 120;
      });

      const labelMap: Record<string, string> = {
        hero: "home",
        pipeline: "about",
        projects: "projects",
        resume: "resume",
        contact: "contact",
      };
      if (current) setActive(labelMap[current] ?? "home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0F]/90 backdrop-blur-md border-b border-[#1E2A3A]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="relative flex items-center justify-center w-10 h-10 border border-[#00FF88]/60 text-[#00FF88] font-mono font-bold text-sm tracking-wider"
            style={{
              clipPath:
                "polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)",
            }}
          >
            AD
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label} className="relative">
                <button
                  onClick={() => scrollTo(item.href)}
                  className={`font-mono text-sm tracking-widest uppercase transition-colors duration-200 ${
                    active === item.label
                      ? "text-[#00FF88]"
                      : "text-[#8899AA] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
                {active === item.label && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#00FF88]"
                    style={{
                      boxShadow: "0 0 8px #00FF88",
                    }}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#00FF88] transition-all duration-200 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#00FF88] transition-all duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#00FF88] transition-all duration-200 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0D1117]/95 backdrop-blur-md border-b border-[#1E2A3A] md:hidden"
          >
            <ul className="flex flex-col py-4">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className={`w-full text-left px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors ${
                      active === item.label
                        ? "text-[#00FF88]"
                        : "text-[#8899AA]"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
