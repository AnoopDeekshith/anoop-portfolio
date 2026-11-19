import type { FocusArea } from "./types";

/** Short "what I do" cards — each one backed by a fact elsewhere in this package. */
export const focusAreas: FocusArea[] = [
  {
    title: "RTL Design",
    description:
      "Synthesizable Verilog and SystemVerilog with pipelining, FSMs, and UART interfaces — including a 4,000-gate learned-logic classifier pipelined from 7.26 to 19.39 MHz.",
  },
  {
    title: "FPGA Implementation",
    description:
      "Open-source flows with Yosys, nextpnr-ice40, Verilator, and Icarus Verilog; 78.8% of an iCE40UP5K routed and checked against NumPy reference results.",
  },
  {
    title: "AI Hardware",
    description:
      "Power-aware learned logic on FPGAs using differentiable logic gate networks, PyTorch, and switching-activity analysis — manuscript targeting IEEE MCSoC 2027.",
  },
  {
    title: "Computer Architecture",
    description:
      "Best-Offset hardware prefetcher in cycle-accurate gem5 and Scarab: 10.6% average IPC speedup and 52% fewer L1 misses on SPEC CPU2017.",
  },
  {
    title: "Mixed-Signal Interfaces",
    description:
      "Defining a clockless spike-to-probability bridge that uses switched-capacitor integration to drive p-bit circuits for probabilistic computing.",
  },
  {
    title: "Post-Silicon Validation",
    description:
      "Four years bringing up mixed-signal SoCs on Teradyne UltraFLEX ATE at Anora Semiconductor Labs. Raised DFT coverage from 87% to 96% and improved yield ~4% through wafer-sort correlation.",
  },
];
