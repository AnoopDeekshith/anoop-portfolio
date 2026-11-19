import type { Article } from "./types";

// Set `published: true` and a real `href` once an article is live —
// the resume site only lists published articles.
export const articles: Article[] = [
  {
    title: "Neuromorphic Computing: When Silicon Learns to Think Like a Brain",
    excerpt:
      "Exploring the architecture of spiking neural networks and why they might be the future of edge AI inference — from biology to CMOS implementation.",
    tag: "Neuromorphic",
    date: "Coming soon",
    readTime: "8 min",
    href: "https://medium.com/@anoopdeekshith",
    published: false,
  },
  {
    title: "Post-Silicon Validation: What Happens When RTL Meets Real Silicon",
    excerpt:
      "A practitioner's guide to silicon bring-up — from JTAG access to root-cause analysis. Four years of lessons in one article.",
    tag: "Post-Silicon",
    date: "Coming soon",
    readTime: "12 min",
    href: "https://medium.com/@anoopdeekshith",
    published: false,
  },
  {
    title: "RISC-V from RTL to GDS: A Hands-On Walkthrough",
    excerpt:
      "Step by step — designing a 5-stage RV32I pipeline in SystemVerilog, verifying with UVM, and taking it through Cadence Innovus for a 28nm tapeout.",
    tag: "RTL Design",
    date: "Coming soon",
    readTime: "15 min",
    href: "https://medium.com/@anoopdeekshith",
    published: false,
  },
];

export const publishedArticles = articles.filter((a) => a.published);
