import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    category: "Programming",
    items: ["Python", "C", "C++", "Verilog", "SystemVerilog", "VHDL", "Tcl (basics)"],
  },
  {
    category: "AI",
    items: [
      "PyTorch",
      "NumPy",
      "scikit-learn",
      "Differentiable logic gate networks",
      "Switching-activity analysis",
    ],
  },
  {
    category: "FPGA / RTL",
    items: ["Pipelining", "FSMs", "UART", "Verilator", "Icarus Verilog", "Yosys", "nextpnr-ice40"],
  },
  {
    category: "ATE",
    items: ["ETS300", "ETS88", "ETS364", "T2000", "93k", "Production test", "Post-silicon validation"],
  },
];
