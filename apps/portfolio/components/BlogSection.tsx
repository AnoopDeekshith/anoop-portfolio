"use client";

import { motion } from "framer-motion";

// Placeholder blog posts — update with real Medium links later
const posts = [
  {
    title: "Neuromorphic Computing: When Silicon Learns to Think Like a Brain",
    excerpt: "Exploring the architecture of spiking neural networks and why they might be the future of edge AI inference — from biology to CMOS implementation.",
    tag: "Neuromorphic",
    color: "#00FF88",
    date: "Coming soon",
    readTime: "8 min",
    href: "https://medium.com/@anoopdeekshith", // update with real link
  },
  {
    title: "Post-Silicon Validation: What Happens When RTL Meets Real Silicon",
    excerpt: "A practitioner's guide to silicon bring-up — from JTAG access to root-cause analysis. Four years of lessons in one article.",
    tag: "Post-Silicon",
    color: "#4A9EFF",
    date: "Coming soon",
    readTime: "12 min",
    href: "https://medium.com/@anoopdeekshith",
  },
  {
    title: "RISC-V from RTL to GDS: A Hands-On Walkthrough",
    excerpt: "Step by step — designing a 5-stage RV32I pipeline in SystemVerilog, verifying with UVM, and taking it through Cadence Innovus for a 28nm tapeout.",
    tag: "RTL Design",
    color: "#FFB347",
    date: "Coming soon",
    readTime: "15 min",
    href: "https://medium.com/@anoopdeekshith",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#4A9EFF]" />
          <span className="font-mono text-xs text-[#4A9EFF]/60 tracking-widest uppercase">
            Blog
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Writing on Silicon
          </h2>
          <a
            href="https://medium.com/@anoopdeekshith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#4A9EFF]/70 hover:text-[#4A9EFF] transition-colors flex items-center gap-2 border border-[#4A9EFF]/20 px-4 py-2 hover:border-[#4A9EFF]/50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
            All posts on Medium →
          </a>
        </div>
        <p className="font-mono text-sm text-[#8899AA] mb-10">
          {"// Writing on chip design, verification, and neuromorphic systems"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="block border border-[#1E2A3A] bg-[#0D1117] p-6 hover:border-opacity-60 transition-all duration-300 group"
              style={{ borderColor: `${post.color}20` }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-mono text-[9px] px-2 py-0.5 border tracking-widest uppercase"
                  style={{
                    borderColor: `${post.color}40`,
                    color: post.color,
                    background: `${post.color}08`,
                  }}
                >
                  {post.tag}
                </span>
                <span className="font-mono text-[9px] text-[#8899AA]/40">{post.readTime}</span>
              </div>

              {/* Title */}
              <h3
                className="font-bold text-white text-sm leading-snug mb-3 group-hover:text-opacity-90 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="font-mono text-[11px] text-[#8899AA] leading-relaxed mb-4">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1E2A3A]">
                <span className="font-mono text-[9px] text-[#8899AA]/40">{post.date}</span>
                <span
                  className="font-mono text-[10px] group-hover:gap-2 transition-all flex items-center gap-1"
                  style={{ color: post.color }}
                >
                  Read →
                </span>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-4 h-4 opacity-60"
                style={{
                  background: post.color,
                  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                }}
              />
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 font-mono text-xs text-[#8899AA]/30 text-center"
        >
          {"// Articles coming soon — follow on Medium for updates"}
        </motion.p>
      </div>
    </section>
  );
}
