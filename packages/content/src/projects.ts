import type { Project } from "./types";

const GITHUB = "https://github.com/AnoopDeekshith";

export const projects: Project[] = [
  {
    slug: "learned-logic-classifier",
    title: "RTL Design of a Learned Logic Classifier",
    subtitle: "Synthesizable learned-logic inference on an iCE40 FPGA",
    period: "Fall 2026 – Present",
    status: "in-progress",
    summary:
      "Synthesizable Verilog for a 4-layer, 4,000-gate, 10-class learned-logic classifier, pipelined and verified end to end over UART on an iCE40UP5K FPGA.",
    highlights: [
      "Generated synthesizable Verilog for a 4-layer, 4,000-gate, 10-class learned-logic classifier.",
      "Pipelined score/argmax logic; raised estimated routed Fmax from 7.26 to 19.39 MHz, meeting the 12 MHz target.",
      "Implemented a 3-register-stage core; verified 2-cycle output latency and 1-cycle initiation interval in simulation.",
      "Integrated 115,200-baud UART RX/TX, packet FSMs, input/reset synchronizers, and atomic image commits.",
      "Passed 450/450 UART image checks against NumPy scores/classes; tested malformed-packet and reset recovery.",
      "Mapped to 3,449 LUT4s and 911 flip-flops; routed using 4,160/5,280 iCE40UP5K logic cells (78.8%).",
    ],
    stack: ["Verilog", "SystemVerilog", "Python", "Icarus Verilog", "Verilator", "Yosys", "nextpnr-ice40"],
    metrics: [
      { label: "Routed Fmax", value: "7.26 → 19.39 MHz" },
      { label: "UART image checks", value: "450 / 450" },
      { label: "Latency / II", value: "2 cycles / 1" },
      { label: "iCE40UP5K cells", value: "78.8%" },
    ],
    featured: true,
    links: [{ label: "GitHub", href: "https://github.com/AnoopDeekshith/h02-difflogic-fpga" }],
  },
  {
    slug: "best-offset-prefetcher",
    title: "Best-Offset Hardware Prefetcher",
    subtitle: "Cycle-accurate memory-hierarchy study",
    period: "September 2025",
    status: "complete",
    progress: 100,
    summary:
      "Best-Offset prefetching implemented in cycle-accurate Scarab and gem5 simulations, evaluated across SPEC CPU2017 workloads.",
    highlights: [
      "Implemented Best-Offset prefetching in cycle-accurate Scarab and gem5 simulations across SPEC CPU2017 workloads.",
      "Achieved 10.6% average IPC speedup across SPEC CPU2017 workloads, outperforming Sandbox prefetching.",
      "Used a Recent Requests table to prioritize prefetch timeliness; reduced L1 cache misses by 52% on average.",
    ],
    stack: ["RISC-V", "Scarab", "gem5", "Verilog", "SPEC CPU2017"],
    metrics: [
      { label: "Avg. IPC speedup", value: "+10.6%" },
      { label: "L1 miss reduction", value: "52%" },
      { label: "Workloads", value: "SPEC CPU2017" },
    ],
    featured: true,
    links: [{ label: "GitHub", href: GITHUB }],
  },
  {
    slug: "spike-to-probability-bridge",
    title: "Direct Analog Spike-to-Probability Charge-Domain Bridge",
    subtitle: "Asynchronous mixed-signal interface IP",
    period: "Summer 2026 – Present",
    status: "in-progress",
    summary:
      "A clockless interface that converts neuron spikes into p-bit bias using switched-capacitor integration, bridging spiking and probabilistic computing.",
    highlights: [
      "Defining clockless spike-to-p-bit interface IP using a switched-capacitor integrator (architecture in progress).",
      "Developing a chip model for spike-to-bias conversion and exploring bias-controlled noise injection.",
      "Planning SystemVerilog RNM or Cadence Spectre AMS Designer simulation of spikes and analog voltage dynamics.",
    ],
    stack: ["Switched-capacitor integration", "p-bit interfacing", "SystemVerilog RNM", "Spectre AMS Designer"],
    metrics: [],
    featured: true,
  },
  {
    slug: "fpga-counter-memory",
    title: "FPGA-Based Counter & Memory Modules",
    subtitle: "RTL modules for Xilinx/Intel FPGAs",
    period: "December 2025",
    status: "in-progress",
    summary:
      "Digital counter and memory modules synthesized for FPGA implementation, tuned for area, clock timing, and low-latency memory access.",
    highlights: [
      "Synthesizing digital modules for Xilinx/Intel FPGA implementation; evaluating resource utilization and timing.",
      "Optimizing RTL for area, clock timing, and low-latency memory access to improve FPGA resource efficiency (in progress).",
    ],
    stack: ["Verilog", "RTL", "Xilinx"],
    metrics: [],
    featured: true,
    links: [{ label: "GitHub", href: GITHUB }],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
