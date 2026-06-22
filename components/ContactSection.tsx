"use client";

import { motion } from "framer-motion";

const contacts = [
  {
    label: "anoopdeekshith.ece@gmail.com",
    href: "mailto:anoopdeekshith.ece@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    color: "#00FF88",
  },
  {
    label: "linkedin.com/in/anoopdeekshithr",
    href: "https://linkedin.com/in/anoopdeekshithr",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "#4A9EFF",
  },
  {
    label: "github.com/AnoopDeekshith",
    href: "https://github.com/AnoopDeekshith",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "#FFB347",
  },
  {
    label: "medium.com/@anoopdeekshith",
    href: "https://medium.com/@anoopdeekshith",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
    color: "#B347FF",
  },
  {
    label: "@anoopdeekshith",
    href: "https://twitter.com/anoopdeekshith",  // update when ready
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "#4A9EFF",
    note: "// link to be updated",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 relative">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="max-w-2xl">
          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-[#1E2A3A] bg-[#0D1117] p-8"
          >
            <div className="space-y-5">
              {contacts.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-8 h-8 border flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                    style={{ borderColor: `${c.color}40`, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <span
                      className="font-mono text-xs sm:text-sm transition-colors group-hover:underline underline-offset-2 break-all"
                      style={{ color: c.color }}
                    >
                      {c.label}
                    </span>
                    {"note" in c && (
                      <span className="ml-2 font-mono text-[9px] text-[#8899AA]/40">{c.note}</span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#1E2A3A]">
              <div className="font-mono text-[10px] text-[#8899AA]/40 leading-relaxed">
                <span className="text-[#00FF88]/40">{"// "}</span>
                San Francisco, CA · Available for full-time roles and research collaborations
                <br />
                <span className="text-[#00FF88]/40">{"// "}</span>
                Response time: &lt; 24h
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-[#1E2A3A]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#8899AA]/30">
            © 2025 Anoop Deekshith Ravikumar
          </span>
          <span className="font-mono text-xs text-[#00FF88]/30">
            {"// "} v2.0.0
          </span>
        </div>
      </div>
    </section>
  );
}
