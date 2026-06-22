import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anoop Deekshith Ravikumar — RTL & Physical Design Engineer",
  description:
    "Portfolio of Anoop Deekshith Ravikumar — RTL Design, Physical Design, and Post-Silicon Validation Engineer. RISC-V, Verilog, SystemVerilog, Cadence Innovus.",
  keywords: [
    "RTL Design",
    "Physical Design",
    "Post-Silicon Validation",
    "RISC-V",
    "Verilog",
    "SystemVerilog",
    "FPGA",
    "Chip Design",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#0A0A0F] text-white antialiased overflow-x-hidden">
        {/* EDA crosshair cursor */}
        <svg
          id="eda-cursor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <line x1="12" y1="0" x2="12" y2="10" stroke="#00FF88" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="12" y2="24" stroke="#00FF88" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="10" y2="12" stroke="#00FF88" strokeWidth="1.5" />
          <line x1="14" y1="12" x2="24" y2="12" stroke="#00FF88" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" stroke="#00FF88" strokeWidth="1.2" fill="none" />
        </svg>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var cursor = document.getElementById('eda-cursor');
                if (!cursor) return;
                document.addEventListener('mousemove', function(e) {
                  cursor.style.left = e.clientX + 'px';
                  cursor.style.top = e.clientY + 'px';
                });
                document.addEventListener('mouseenter', function() {
                  cursor.style.opacity = '1';
                });
                document.addEventListener('mouseleave', function() {
                  cursor.style.opacity = '0';
                });
              })();
            `,
          }}
        />
        {children}

        {/* Vercel Analytics */}
        <Analytics />

        {/* Google Analytics 4 */}
        {GA_ID && <GoogleAnalytics id={GA_ID} />}
      </body>
    </html>
  );
}
