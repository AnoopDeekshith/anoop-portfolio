"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error();

      // If no Resend key, fall back to mailto
      if (data.mailto) {
        window.location.href = data.mailto;
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact-form" className="py-24 px-6 relative">
      {/* Green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[#00FF88]" />
          <span className="font-mono text-xs text-[#00FF88]/60 tracking-widest uppercase">
            Get in Touch
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Open for Roles &<br />
              <span className="text-[#00FF88]">Collaborations</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-mono text-sm text-[#8899AA] leading-relaxed mb-8"
            >
              Whether you&apos;re looking for an RTL engineer, a physical design collaborator, or
              someone who has lived in the post-silicon debug trenches — I&apos;d love to hear from you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {[
                { label: "Full-time RTL / PD roles", icon: "⬡" },
                { label: "Research collaborations", icon: "⬢" },
                { label: "Neuromorphic / edge AI projects", icon: "◈" },
                { label: "Post-silicon consulting", icon: "◇" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[#00FF88] text-sm">{item.icon}</span>
                  <span className="font-mono text-sm text-[#8899AA]">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {status === "sent" ? (
              <div className="border border-[#00FF88]/40 bg-[#00FF88]/5 p-8 text-center">
                <div className="text-4xl mb-4">⬡</div>
                <div className="font-mono text-[#00FF88] font-bold mb-2">Message received.</div>
                <div className="font-mono text-xs text-[#8899AA]">
                  I&apos;ll get back to you within 24 hours.
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 font-mono text-xs text-[#00FF88]/60 hover:text-[#00FF88] transition-colors"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-[#1E2A3A] bg-[#0D1117] p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="font-mono text-[10px] text-[#8899AA]/60 tracking-widest uppercase block mb-1.5">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-[#060B10] border border-[#1E2A3A] font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-[#00FF88]/50 transition-colors placeholder-[#8899AA]/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-mono text-[10px] text-[#8899AA]/60 tracking-widest uppercase block mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[#060B10] border border-[#1E2A3A] font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-[#00FF88]/50 transition-colors placeholder-[#8899AA]/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="font-mono text-[10px] text-[#8899AA]/60 tracking-widest uppercase block mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="What's on your mind?"
                    className="w-full bg-[#060B10] border border-[#1E2A3A] font-mono text-sm text-white px-3 py-2.5 outline-none focus:border-[#00FF88]/50 transition-colors placeholder-[#8899AA]/30 resize-none"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="font-mono text-xs text-red-400">
                    Something went wrong. Try emailing directly at anoopdeekshith.ece@gmail.com
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full border border-[#00FF88] bg-[#00FF88]/5 font-mono text-sm text-[#00FF88] font-bold py-3 tracking-widest uppercase hover:bg-[#00FF88]/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ animation: "btn-glow 2.5s ease-in-out infinite" }}
                >
                  {status === "sending" ? (
                    <>
                      <span className="animate-pulse">◆</span> Sending...
                    </>
                  ) : (
                    "Send Message →"
                  )}
                </button>

                <p className="font-mono text-[9px] text-[#8899AA]/30 text-center">
                  Goes directly to anoopdeekshith.ece@gmail.com
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
