"use client";

import { useState } from "react";

export default function TopBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const scrollToContact = () => {
    const el = document.getElementById("contact-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#00FF88] flex items-center justify-center h-9 px-4">
      <button
        onClick={scrollToContact}
        className="flex-1 text-center font-mono text-xs font-bold text-[#0A0A0F] tracking-widest uppercase hover:opacity-80 transition-opacity"
      >
        ✦ Open for full-time roles &amp; collaborations — reach out ✦
      </button>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-[#0A0A0F]/60 hover:text-[#0A0A0F] font-mono text-xs"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
